"""Refresh exact authored-world export and package the no-dependency review HTML."""
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
source = json.loads((ROOT / 'docs/level-design/shooter-v0.1/level.geometry.json').read_text())
world = {k: source[k] for k in ['revision', 'world', 'sectors']}
world['layers'] = {
    k: [dict(id=o['name'], type=o['type'], x=o['x'], y=o['y'], w=o['width'], h=o['height'],
             **{p['name']: p['value'] for p in o.get('properties', [])}) for o in v]
    for k, v in source['layers'].items() if k not in ['Annotations', 'PendingDesign']
}
game = ROOT / 'public/games/shooter'
(game / 'world.js').write_text('// Generated from the authored level; use tools/build_shooter_practice.py to refresh.\nexport const WORLD = ' + json.dumps(world, separators=(',', ':')) + ';\n')
parts = []
for name in ['config', 'world', 'simulation', 'renderer', 'input', 'audio']:
    text = (game / f'{name}.js').read_text()
    text = re.sub(r'^import .*?;\n', '', text, flags=re.M)
    text = re.sub(r'\bexport (?=const |function |class )', '', text)
    parts.append(text)
    if name == 'config':
        parts.append('const C = CONFIG;\n')
text = (ROOT / 'public/practice-shooter.js').read_text()
parts.append(re.sub(r'^import .*?;\n', '', text, flags=re.M))
html = (ROOT / 'public/practice-shooter.html').read_text()
html = html.replace('<link rel="stylesheet" href="practice-shooter.css">', '<style>' + (ROOT / 'public/practice-shooter.css').read_text() + '</style>')
html = html.replace('<script type="module" src="practice-shooter.js"></script>', '<script>\n(()=>{\n' + '\n'.join(parts) + '\n})();\n</script>')
target = ROOT / 'public/practice-shooter-standalone.html'
target.write_text(html)
print(f'Packaged {target.name}: {target.stat().st_size:,} bytes; no external assets or requests.')
