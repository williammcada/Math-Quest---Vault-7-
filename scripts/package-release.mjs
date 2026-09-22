import {readdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const hashes={};
async function walk(dir='.'){
  for(const e of await readdir(dir,{withFileTypes:true})){
    if(['node_modules','.git','.wrangler','RELEASE_SHA256.json'].includes(e.name))continue;
    const p=`${dir}/${e.name}`;
    if(e.isDirectory())await walk(p);
    else if(e.isFile()&&(!p.endsWith('.wav')||p.endsWith('/effects.wav')))hashes[p.slice(2)]=createHash('sha256').update(await readFile(p)).digest('hex');
  }
}
await walk();
await writeFile('RELEASE_SHA256.json',JSON.stringify(hashes,null,2)+'\n');
const folder=process.cwd().split('/').at(-1);
execFileSync('zip',['-q','-r',`${folder}.zip`,folder,'-x','*/node_modules/*','*/node_modules','*/.wrangler/*','*/.git/*','*/ambient.wav','*/danger.wav','*/ending.wav'],{cwd:'..'});
console.log(`Packaged ${Object.keys(hashes).length} files plus release manifest.`);
