"""Embed approved raster story assets without rebuilding/changing action engines.

Run from repository root. Re-running refreshes the marked embedded art payload.
The baseline replacement assertions prevent a future bundle rename failing silently.
"""
from pathlib import Path
import base64, json, re
alts={
 'ironbreak':{'cover':'Mara prepares a remote maintenance machine beside the flooded foundry','radio':'Mara checks the radio and pump circuits from the sheltered control room','market':'Engineers prepare a spread emitter, armor and powered boots for a maintenance machine','ending':'Workers consider the factory controls as dawn breaks over the pump district'},
 'blackline':{'cover':'Mara and the interceptor wait beneath railway arches above the darkened district','radio':'Mara considers two data cartridges in an abandoned dispatch office','market':'Mara prepares the interceptor in a workshop with three upgrade kits','ending':'Mara and the interceptor pause at the outer checkpoint at dawn'}
}
for game,file in [('ironbreak','Ironbreak-v0.1.0.html'),('blackline','BLACKLINE-v0.2.0.html')]:
 p=Path('public/reviews')/file;s=p.read_text()
 assets={k:{'src':'data:image/webp;base64,'+base64.b64encode((Path('public/assets')/game/(k+'.webp')).read_bytes()).decode(),'alt':v} for k,v in alts[game].items()}
 payload='<script id="mq-painted-story-art">const MQ_STORY_ART='+json.dumps(assets,separators=(',',':'))+';function mqStoryArt(stage){return MQ_STORY_ART[stage==="market"?"market":["finale","victory"].includes(stage)?"ending":["gate","decision"].includes(stage)?"radio":"cover"]}</script>'
 if 'id="mq-painted-story-art"' in s:
  s=re.sub(r'<script id="mq-painted-story-art">.*?</script>',lambda m:payload,s,flags=re.S)
 else:
  s=s.replace('</head>',payload+'</head>')
  if game=='ironbreak':
   s,n=re.subn(r"var jr='data:image/svg\+xml,.*?</svg>';",'var jr=MQ_STORY_ART.cover.src;',s);assert n==1
   old='${t.stage==="briefing"?`<img class="review-cover" src="${J(jr)}" alt="${J(C.presentation.coverAlt)}">`:""}'
   assert old in s
   s=s.replace(old,'<img class="review-cover" src="${mqStoryArt(t.stage).src}" alt="${J(mqStoryArt(t.stage).alt)}">')
  else:
   old='src="${Q.image}"';assert old in s;s=s.replace(old,'src="${mqStoryArt(G.stage).src}"')
   s,n=re.subn(r'alt="\$\{G.stage===.*?\}"><section>', 'alt="${V(mqStoryArt(G.stage).alt)}"><section>',s,count=1);assert n==1
   labels={'LAST CIVILIAN EXIT':'cover','CARGO TERMINAL':'radio','UNDERGROUND GARAGE':'market','BEYOND THE CORDON':'ending'}
   def replace_svg(m):
    svg=base64.b64decode(m.group(1)).decode();label=re.search(r'aria-label="([^"]+)"',svg).group(1)
    return 'MQ_STORY_ART.'+labels[label]+'.src'
   s,n=re.subn(r'"data:image/svg\+xml;base64,([A-Za-z0-9+/=]+)"',replace_svg,s);assert n>=4
  s=s.replace('</head>','<style>.review-cover,.scene-grid img{aspect-ratio:16/9;object-fit:contain} .review-cover{height:auto}</style></head>')
  s=s.replace('Review presentation 2026-10-08','Illustrated story art 2026-10-08')
 p.write_text(s)
 print(file,p.stat().st_size)
