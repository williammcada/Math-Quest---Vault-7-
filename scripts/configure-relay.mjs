import { readFile, writeFile } from 'node:fs/promises';
import { createInterface } from 'node:readline/promises';
import { HOSTING } from '../public/hosting-config.js';
const prompt = createInterface({ input: process.stdin, output: process.stdout });
try {
  console.log('Only use this if your existing Netlify site has a different address.');
  console.log(`Current relay: ${new URL(HOSTING.relayApiBase).origin}`);
  const input = (await prompt.question('Paste the Netlify site address, or press Enter to keep it: ')).trim();
  if (!input) { console.log('No changes made.'); }
  else {
    const relay = new URL(input);
    if (relay.protocol !== 'https:' || !/^[a-z0-9-]+\.netlify\.app$/.test(relay.hostname) ||
        relay.username || relay.password || relay.port || relay.search || relay.hash || !['/', '/api', '/api/'].includes(relay.pathname)) {
      throw new Error('Use the main HTTPS Netlify site address ending in .netlify.app, without a session link.');
    }
    const config = { ...HOSTING, relayApiBase: `${relay.origin}/api/` };
    const wranglerPath = new URL('../wrangler.jsonc', import.meta.url);
    const wrangler = JSON.parse(await readFile(wranglerPath, 'utf8'));
    const origins = (wrangler.vars.CORS_ALLOWED_ORIGINS || '').split(',').filter(x => x && x !== new URL(HOSTING.relayApiBase).origin);
    wrangler.vars.CORS_ALLOWED_ORIGINS = [...new Set([...origins, new URL(HOSTING.githubPagesUrl).origin, relay.origin])].join(',');
    await writeFile(new URL('../public/hosting-config.js', import.meta.url), '// Public hosting addresses; no credentials belong here.\nexport const HOSTING = Object.freeze(' + JSON.stringify(config, null, 2) + ');\n');
    await writeFile(wranglerPath, JSON.stringify(wrangler, null, 2) + '\n');
    console.log('Relay address saved. Run Deploy_Backend_Windows.bat, then upload the updated public contents to GitHub.');
    console.log('This changes local configuration; it does not publish or create a Netlify site.');
  }
} catch (error) { console.error(error.message); process.exitCode = 1; }
finally { prompt.close(); }
