"""Author one deterministic Tiled blockout plus geometry and review plate.

Run from any working directory: python tools/author_shooter_level.py
Requires Pillow for the review PNG and tiny editor blockout tileset.
This is level authoring, not the game engine or a gameplay test.
"""
from pathlib import Path
from collections import deque, Counter
import base64, zlib, struct, json, math, html
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs/level-design/shooter-v0.1'
OUT.mkdir(parents=True, exist_ok=True)
W, H, TILE = 6400, 640, 16
layers = {n: [] for n in ['Solids', 'OneWay', 'Ladders', 'Water', 'Enemies', 'Hazards', 'Pickups', 'Checkpoints', 'Gates', 'Annotations', 'PendingDesign']}
next_id = 1

def obj(layer, name, kind, x, y, w=0, h=0, **props):
    global next_id
    a = dict(id=next_id, name=name, type=kind, x=x, y=y, width=w, height=h, rotation=0, visible=True)
    next_id += 1
    if not w and not h: a['point'] = True
    a['properties'] = [dict(name=k, type='bool' if isinstance(v,bool) else 'int' if isinstance(v,int) else 'float' if isinstance(v,float) else 'string', value=v) for k,v in props.items()]
    layers[layer].append(a)
    return a

def props(o): return {p['name']: p['value'] for p in o['properties']}

def deck(name, x1, x2, y, solid=False):
    return obj('Solids' if solid else 'OneWay', name, 'solid' if solid else 'one_way', x1,y,x2-x1,16, supports_player=True)

# Exact collision geometry. One-way decks permit ladder passage and deliberate drops.
deck('A-start',0,256,336,True)
deck('A-middle',256,800,336)
for name,x1,x2,y in [
 ('A-upper-1',256,576,192),('A-upper-2',640,800,192),
 ('B-upper-1',800,1056,192),('B-upper-2',1120,1456,192),('B-upper-3',1536,1840,192),('B-upper-4',1904,2208,192),
 ('B-middle-1',800,1152,336),('B-middle-2',1216,1600,336),('B-middle-3',1680,2208,336),
 ('B-bank-west',576,800,496),('B-bank-east',2176,2208,496),('B-cache-alcove',1760,1904,448),
 ('D-upper-1',2704,3040,192),('D-upper-2',3104,3408,192),('D-upper-3',3488,3808,192),('D-upper-4',3872,4208,192),
 ('D-middle-1',2704,2912,336),('D-middle-2',2976,3328,336),('D-middle-3',3392,3712,336),('D-middle-4',3792,4208,336),
 ('D-bank-west',2704,2736,496),('D-bank-east',4176,4240,496),('D-cache-island',3664,3792,448),
 ('E-upper-1',4208,4464,192),('E-upper-2',4528,4752,224),('E-upper-3',4816,5088,176),('E-upper-4',5152,5376,224),
 ('E-middle',4208,5376,336),('E-bank-east',5312,5376,496),('BOSS-low-platform',5680,5776,288),
]: deck(name,x1,x2,y)
deck('C-floor',2208,2704,336,True)
deck('BOSS-floor',5376,6400,336,True)
# Full-height convergence bulkheads force upper and water routes into a readable central opening.
for label,x in [('MID-entry',2208),('BOSS-entry',5376)]:
    obj('Solids',label+'-lintel','solid',x,0,16,272,supports_player=False)
    obj('Solids',label+'-base','solid',x,352,16,288,supports_player=False)
# Small cover in the midpoint fight: baseline jump easily clears it.
obj('Solids','C-cover','solid',2304,304,32,32,supports_player=True)

for name,x,y1,y2 in [
 ('LA1',272,192,336),('LA2',752,192,336),('LA3',768,336,496),
 ('LB1',1248,192,336),('LB2',1264,336,496),('LB3',1792,192,336),
 ('LB4',1776,448,496),('LB5',2144,336,496),('LB6',2160,192,336),
 ('LD1',2800,192,336),('LD2',2816,336,496),('LD3',3152,192,336),
 ('LD4',3168,336,496),('LD5',3712,448,496),('LD6',3936,192,336),('LD7',3952,336,496),
 ('LE1',4320,192,336),('LE2',4336,336,496),('LE3',4896,176,336),
 ('LE4',5328,336,496),('LE5',5344,224,336),
]: obj('Ladders',name,'ladder',x-8,y1,16,y2-y1,climb_ignores_one_way=True)
obj('Water','WB','surface_water',800,496,1376,112,surface_y=496,diving=False)
obj('Water','WD','surface_water',2736,496,1440,112,surface_y=496,diving=False)
obj('Water','WE','surface_water',4240,496,1072,112,surface_y=496,diving=False)

ENEMIES = [
 ('P01','patrol',416,336,'A'),('P02','patrol',688,336,'A'),('T01','turret',656,128,'A'),('D01','drone',688,112,'A'),
 ('P03','patrol',1408,336,'B'),('T02','turret',1536,272,'B'),('D02','drone',1776,112,'B'),('S01','skimmer',1648,496,'B'),('L01','lobber',1984,336,'B'),
 ('H01','heavy',2432,336,'C'),
 ('P04','patrol',2864,336,'D'),('P05','patrol',3232,336,'D'),('P06','patrol',4000,336,'D'),('T03','turret',3248,128,'D'),('T04','turret',3600,272,'D'),('D03','drone',3648,112,'D'),('L02','lobber',4112,192,'D'),('S02','skimmer',3760,496,'D'),
 ('P07','patrol',4352,336,'E'),('P08','patrol',5136,336,'E'),('T05','turret',5008,112,'E'),('D04','drone',4608,144,'E'),('H02','heavy',4720,336,'E'),('H03','heavy',5008,336,'E')]
hp={'patrol':2,'turret':4,'drone':2,'heavy':8,'lobber':3,'skimmer':3}
for name,kind,x,y,sector in ENEMIES:
    ow,oh = (40,48) if kind=='heavy' else (32,20) if kind=='skimmer' else (24,24) if kind in ['turret','drone'] else (24,32)
    obj('Enemies',name,kind,x-ow/2,y-oh,ow,oh,hp=hp[kind],sector=sector,feet_x=x,feet_y=y,mandatory=name=='H01',reset_section='START' if sector in 'ABC' else 'MID',patrol_radius=32 if kind in ['patrol','heavy','skimmer'] else 0,requires_visible_warning=True)
obj('Enemies','BOSS01','boss',6112,176,128,160,hp=80,sector='F',mandatory=True,reset_section='BOSS',palette='violet-silver-lime',attack_sequence='high_volley,floor_sweep,overhead_strike')

for name,kind,x,y,w,h,warn,section in [
 ('HZ01','water_pulse',1376,480,64,32,1.0,'START'),
 ('HZ02','falling_load',3072,48,64,144,.9,'MID'),
 ('HZ03','falling_load',3728,48,64,144,.9,'MID'),
 ('HZ04','press',3520,240,64,96,.9,'MID'),
 ('HZ05','water_pulse',3488,480,80,32,1.0,'MID'),
 ('HZ06','falling_load',4896,32,64,144,.9,'MID'),
]: obj('Hazards',name,kind,x,y,w,h,warning_seconds=warn,damage=1,reset_section=section,period_seconds=5.0,active_seconds=.65)

for name,x,y,section,note in [('R01',512,192,'START','upper ledge'),('R02',1872,448,'START','open side alcove; crawl roof not active'),('R03',3760,448,'MID','water island detour'),('R04',5040,176,'MID','upper ledge beyond falling-load zone')]:
    obj('Pickups',name,'repair',x-8,y-16,16,16,heal=1,reset_section=section,note=note)
for name,x,y,pre in [('START',96,336,''),('MID',2640,336,'H01'),('BOSS',5456,336,'')]:
    obj('Checkpoints',name,'checkpoint',x-16,y-40,32,40,spawn_x=x,spawn_feet_y=y,requires_enemy_defeated=pre,activation='cross_x',heal_on_first_entry=False,first_entry_heal_policy='proposed')
obj('Gates','MID-GUARD-GATE','enemy_gate',2528,0,16,640,opens_when='H01 defeated',blocks_all_routes=True)
obj('Gates','BOSS-ARENA-TRIGGER','boss_trigger',5552,0,32,640,starts='BOSS01',locks_entrance_after_crossing=True)
obj('PendingDesign','CRAWL-ROOF','disabled_proposal',1808,416,96,16,enabled=False,note='Would leave 16 px prone clearance. Owner has not approved crawling; open alcove works without it.')
obj('PendingDesign','MID-BACKTRACK-DOOR','disabled_proposal',2592,0,16,640,enabled=False,note='Proposed checkpoint anti-backtracking policy remains for review.')
obj('Annotations','PRONE-USE','stance_encounter',1952,288,80,48,note='L01 attack should allow a stationary prone response; does not require crawling.')
obj('Annotations','HEAVY-BYPASS','route_choice',4624,272,432,64,note='H02/H03 central pressure; upper platforms and water are safe bypass routes.')
obj('Annotations','DROP-PRACTICE','drop_through',352,160,64,32,note='Drop from thin upper deck onto middle deck.')

SECTORS=[('A','Loading apron',0,800),('B','Coolant works',800,2208),('C','Transfer lock',2208,2704),('D','Foundry crossing',2704,4208),('E','Security approach',4208,5408),('F','Security chamber',5408,6400)]
geometry={'revision':'industrial-level-blockout-0.1','world':{'width':W,'height':H,'tile':TILE},'status':'authored blockout; not integrated gameplay','sectors':[dict(id=a,title=b,x0=c,x1=d) for a,b,c,d in SECTORS], 'layers':layers,'physics':dict(body_width=20,body_height=28,run_speed=180,jump_velocity=-380,gravity=1000), 'pending':['crawl roof disabled','checkpoint backtrack door disabled','dynamic hazard and combat fairness untested']}
(OUT/'level.geometry.json').write_text(json.dumps(geometry,indent=2)+'\n')

# Standard finite orthogonal Tiled JSON with zlib-compressed tile data and explicit semantic objects.
tile_colors=['#526a80','#dc842f','#e5bc68','#209aaa']
tiles=Image.new('RGBA',(64,16),(0,0,0,0)); td=ImageDraw.Draw(tiles)
for i,c in enumerate(tile_colors):
    td.rectangle((i*16,0,i*16+15,15),fill=c,outline='#11273b')
    if i==1: td.rectangle((i*16,4,i*16+15,15),fill='#10253a'); td.line((i*16,0,i*16+15,0),fill='#ffe4aa',width=2)
    if i==2:
        td.rectangle((i*16+4,0,i*16+11,15),fill='#122b3c')
        for yy in [2,7,12]: td.line((i*16,yy,i*16+15,yy),fill='#fff1ce',width=2)
    if i==3: td.line((i*16,2,i*16+15,2),fill='#72f5ef',width=2)
tiles.save(OUT/'blockout-tiles.png')
tiled_layers=[]; lid=1
for lname,gid in [('Solids',1),('OneWay',2),('Ladders',3),('Water',4)]:
    data=[0]*(400*40)
    for o in layers[lname]:
        for yy in range(int(o['y']//16),math.ceil((o['y']+o['height'])/16)):
            for xx in range(int(o['x']//16),math.ceil((o['x']+o['width'])/16)):
                if 0<=xx<400 and 0<=yy<40:data[yy*400+xx]=gid
    packed=base64.b64encode(zlib.compress(struct.pack('<'+'I'*len(data),*data),9)).decode()
    tiled_layers.append(dict(id=lid,name=lname+' tiles',type='tilelayer',width=400,height=40,x=0,y=0,opacity=.8,visible=True,encoding='base64',compression='zlib',data=packed));lid+=1
for name,objects in layers.items():
    tiled_layers.append(dict(id=lid,name=name,type='objectgroup',x=0,y=0,opacity=1,visible=name not in ['Solids','OneWay','Ladders','Water','PendingDesign'],draworder='index',objects=objects));lid+=1
tiled=dict(type='map',version='1.10',orientation='orthogonal',renderorder='right-down',infinite=False,width=400,height=40,tilewidth=16,tileheight=16,nextlayerid=lid,nextobjectid=next_id,backgroundcolor='#0b2035',layers=tiled_layers,tilesets=[dict(firstgid=1,name='blockout',tilewidth=16,tileheight=16,tilecount=4,columns=4,image='blockout-tiles.png',imagewidth=64,imageheight=16,margin=0,spacing=0)],properties=[dict(name='levelRevision',type='string',value=geometry['revision']),dict(name='runtime_ready',type='bool',value=False)])
(OUT/'industrial-level.tmj').write_text(json.dumps(tiled,separators=(',',':'))+'\n')

# Static movement reachability using the actual authored geometry and baseline player dimensions.
# Assumes hazards inactive and the required guard defeated. Does not establish combat fairness.
solids=layers['Solids']; surfaces=layers['Solids']+layers['OneWay']
surfaces=[s for s in surfaces if props(s).get('supports_player')]
water=layers['Water']; bw,bh=20,28
def intersects(x,y,w,h,o): return x<o['x']+o['width']-1e-5 and x+w>o['x']+1e-5 and y<o['y']+o['height']-1e-5 and y+h>o['y']+1e-5
def clear(x,feet,closed_gate=False):
    if x-bw/2<0 or x+bw/2>W or feet-bh<0 or feet>H:return False
    return not any(intersects(x-bw/2,feet-bh,bw,bh,o) for o in solids+([layers['Gates'][0]] if closed_gate else []))
supports=surfaces+[dict(x=o['x'],y=o['y'],width=o['width'],name=o['name']) for o in water]
# A body may stand across two touching decks. Merge only contiguous same-height support;
# retain the unmerged rectangles above for actual solid collision.
merged=[]
for yy in sorted({s['y'] for s in supports}):
    intervals=sorted((s['x'],s['x']+s['width']) for s in supports if s['y']==yy)
    for xa,xb in intervals:
        if merged and merged[-1]['y']==yy and xa<=merged[-1]['x']+merged[-1]['width']:
            merged[-1]['width']=max(merged[-1]['x']+merged[-1]['width'],xb)-merged[-1]['x']
        else:merged.append(dict(x=xa,y=yy,width=xb-xa))
supports=merged
nodes=set()
for s in supports:
    for x in range(math.ceil((s['x']+10)/16)*16,int(s['x']+s['width']-10)+1,16):
        if clear(x,s['y']):nodes.add((x,s['y']))
nodes=sorted(nodes); index={p:i for i,p in enumerate(nodes)}; graph=[set() for _ in nodes]
def nearest(x,y,tol=18):
    ns=[(abs(xx-x),i) for i,(xx,yy) in enumerate(nodes) if abs(yy-y)<.01 and abs(xx-x)<=tol]
    return min(ns)[1] if ns else None
def supported(x,y):return any(abs(s['y']-y)<.01 and s['x']<=x-10 and s['x']+s['width']>=x+10 for s in supports)
for i,(x,y) in enumerate(nodes):
    for dx in [-16,16]:
        j=index.get((x+dx,y))
        if j is not None and clear(x+dx/2,y) and supported(x+dx/2,y):graph[i].add(j)
    # Full baseline jumps; side/head collision with solids, land on first descending support.
    for vx in [-180,0,180]:
        px,py=float(x),float(y);vy=-380.
        for n in range(120):
            old_y=py; nx=px+vx*.01; vy+=1000*.01; ny=py+vy*.01
            lands=[s for s in supports if vy>0 and old_y<=s['y']<=ny and s['x']+10<=nx<=s['x']+s['width']-10]
            if lands:
                yy=min(s['y'] for s in lands)
                j=nearest(nx,yy)
                if j is not None and clear(nx,yy):graph[i].add(j)
                break
            if not clear(nx,ny):break
            px,py=nx,ny
    # Deliberate drop from a thin deck to a lower deck/water; solid geometry blocks descent.
    is_thin=any(s['x']+10<=x<=s['x']+s['width']-10 and s['y']==y for s in layers['OneWay'])
    if is_thin:
        below=sorted(s['y'] for s in supports if s['y']>y and s['x']+10<=x<=s['x']+s['width']-10)
        for yy in below:
            if all(clear(x,q) for q in range(int(y),int(yy)+1,4)):
                j=nearest(x,yy)
                if j is not None:graph[i].add(j)
            break
for ladder in layers['Ladders']:
    x=ladder['x']+8;y0=ladder['y'];y1=y0+ladder['height']
    levels=[(i,p[1]) for i,p in enumerate(nodes) if p[0]==x and y0<=p[1]<=y1]
    for i,yy in levels:
        for j,zz in levels:
            if all(clear(x,q) for q in range(int(min(yy,zz)),int(max(yy,zz))+1,4)):graph[i].add(j)
def path(a,b,closed=False):
    if a is None or b is None:return None
    q=deque([a]); prev={a:None}
    while q:
        i=q.popleft()
        if i==b:
            route=[]
            while i is not None:route.append(list(nodes[i]));i=prev[i]
            return route[::-1]
        for j in graph[i]:
            # Closed mandatory gate cannot be crossed, even by a jump edge.
            if closed and min(nodes[i][0],nodes[j][0])-10<2544 and max(nodes[i][0],nodes[j][0])+10>2528:continue
            if j not in prev:prev[j]=i;q.append(j)
    return None
start=nearest(96,336);mid=nearest(2640,336);boss=nearest(5456,336)
probes={
 'upper':[(96,336),(960,192),(1280,192),(1696,192),(2048,192),(2640,336),(2896,192),(3232,192),(3616,192),(4048,192),(4368,192),(4624,224),(4944,176),(5248,224),(5456,336),(5808,336)],
 'middle':[(96,336),(960,336),(1360,336),(1920,336),(2640,336),(2848,336),(3200,336),(3520,336),(4000,336),(4480,336),(4832,336),(5232,336),(5456,336),(5808,336)],
 'water':[(96,336),(1024,496),(1536,496),(2112,496),(2640,336),(2912,496),(3520,496),(4128,496),(4480,496),(5184,496),(5456,336),(5808,336)]}
results={}; route_paths={}
for name,waypoints in probes.items():
    collected=[];ok=True;missing=[]
    for a,b in zip(waypoints,waypoints[1:]):
        p=path(nearest(*a),nearest(*b))
        if p is None:ok=False;missing.append([a,b])
        else:collected+=p
    results[name]=dict(passed=ok,failed_segments=missing);route_paths[name]=collected
ids=[o['name'] for o in layers['Enemies'] if o['type']!='boss']
checks={
 'unique_object_ids':len({o['id'] for group in layers.values() for o in group})==next_id-1,
 'ordinary_roster_24':len(ids)==24 and len(set(ids))==24,
 'four_caches':len(layers['Pickups'])==4,
 'three_checkpoint_spawns':len(layers['Checkpoints'])==3,
 'guard_gate_blocks_all_routes':path(start,mid,True) is None,
 'spawns_clear_and_supported':all(clear(props(o)['spawn_x'],props(o)['spawn_feet_y']) and supported(props(o)['spawn_x'],props(o)['spawn_feet_y']) for o in layers['Checkpoints']),
 'grounded_enemy_support':all(supported(props(o)['feet_x'],props(o)['feet_y']) for o in layers['Enemies'] if o['type'] in ['patrol','heavy','lobber']),
 'all_objects_in_bounds':all(0<=o['x'] and 0<=o['y'] and o['x']+o['width']<=W and o['y']+o['height']<=H for group in layers.values() for o in group),
 'tile_payloads_decode':all(len(zlib.decompress(base64.b64decode(l['data'])))==400*40*4 for l in tiled_layers if l['type']=='tilelayer'),
 'upper_baseline_reachable':results['upper']['passed'],'middle_baseline_reachable':results['middle']['passed'],'water_baseline_reachable':results['water']['passed'],
}
for o in layers['Pickups']:
    xx=o['x']+8; yy=o['y']+16; checks['cache_'+o['name']+'_reachable']=path(start,nearest(xx,yy)) is not None
report={'status':'static authoring checks only','checks':checks,'route_results':results,'navigation_nodes':len(nodes),'navigation_edges':sum(map(len,graph)),'enemy_counts':dict(Counter(o['type'] for o in layers['Enemies'])),'not_run':['Tiled application import (not installed)','production physics','combat and dynamic hazard avoidance','2–3-minute playthrough','real iPhone/iPad controls and audio'],'assumptions':['guard gate opened after defeating H01','hazards inactive for geometry checks','one-way platforms traversable on engaged ladder','pending crawl roof and backtracking door disabled','baseline 180 px/s, 380 px/s jump, gravity 1000; sampled 10 ms arcs']}
(OUT/'static-checks.json').write_text(json.dumps(report,indent=2)+'\n')
(OUT/'baseline-route-traces.json').write_text(json.dumps(route_paths,separators=(',',':'))+'\n')

# Engineering review plate: identical world scale in three consecutive strips, not game art.
IW,IH=1680,1540
im=Image.new('RGB',(IW,IH),'#091726');d=ImageDraw.Draw(im)
font_path='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
bold_path='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
def f(n,bold=False):return ImageFont.truetype(bold_path if bold else font_path,n)
d.text((36,22),'MATHQUEST / INDUSTRIAL SHOOTER',font=f(30,True),fill='#edf7ff')
d.text((36,65),'Authored level blockout v0.1  •  6,400 × 640 world units  •  16-unit tiles',font=f(19),fill='#91afc6')
d.text((36,96),'Exact placement for review. Geometry checks are not a gameplay or difficulty test.',font=f(17),fill='#c5d7e6')
spans=[(0,2208,'01  LOADING APRON → COOLANT WORKS'),(2208,4352,'02  TRANSFER LOCK → FOUNDRY'),(4352,6400,'03  SECURITY APPROACH → BOSS')]
scale=.7; ox=58
colors={'patrol':'#ee9942','turret':'#f4bc73','drone':'#de8edc','heavy':'#f58264','lobber':'#e8c55c','skimmer':'#62d8db','boss':'#a35af0'}
for row,(x0,x1,label) in enumerate(spans):
    oy=177+row*435
    # Slight vertical compression is explicitly indicated below; coordinates remain authoritative in TMJ.
    sy=.53
    def xy(x,y):return (ox+(x-x0)*scale,oy+y*sy)
    def rect(o,fill,outline=None,width=1):
        xa=max(o['x'],x0);xb=min(o['x']+o['width'],x1)
        if xa>=xb:return
        a=xy(xa,o['y']);b=xy(xb,o['y']+o['height']);d.rectangle((*a,*b),fill=fill,outline=outline,width=width)
    d.text((36,oy-40),label,font=f(20,True),fill='#f0f7fd')
    d.rectangle((ox,oy,ox+(x1-x0)*scale,oy+H*sy),fill='#10263a',outline='#344e65')
    for gx in range(math.ceil(x0/320)*320,x1+1,320):
        xx=xy(gx,0)[0];d.line((xx,oy,xx,oy+H*sy),fill='#203950');d.text((xx+3,oy+H*sy+4),str(gx),font=f(12),fill='#84a2b9')
    for yy in [192,336,496]:
        py=xy(x0,yy)[1];d.line((ox,py,ox+(x1-x0)*scale,py),fill='#28445a')
    for o in layers['Water']:rect(o,'#124f66','#35c6d0')
    for o in layers['Solids']:rect(o,'#54697b','#8093a0')
    for o in layers['OneWay']:rect(o,'#c4782d','#ffcf89')
    for o in layers['Ladders']:
        rect(o,None,'#e7c16a',2)
        if x0<=o['x']<=x1:
            for yy in range(int(o['y']),int(o['y']+o['height']),16):
                a=xy(o['x'],yy);b=xy(o['x']+16,yy);d.line((*a,*b),fill='#e7c16a',width=1)
    for o in layers['Hazards']:
        rect(o,None,'#ee6e79',2)
        if x0<=o['x']<=x1:
            a=xy(o['x'],o['y']);d.text((a[0]-4,a[1]-16),o['name'],font=f(13,True),fill='#ff99a0')
    for o in layers['Enemies']:
        rect(o,colors[o['type']],'#101926')
        if x0<=o['x']<=x1:
            a=xy(o['x'],o['y']);offset=-34 if o['type']=='drone' else 18 if o['type']=='skimmer' else -18
            d.text((a[0]-3,a[1]+offset),o['name'],font=f(13,True),fill='#fff4db')
    for o in layers['Pickups']:
        if x0<=o['x']<=x1:
            a=xy(o['x']+8,o['y']+8);d.rectangle((a[0]-8,a[1]-8,a[0]+8,a[1]+8),fill='#2abf87');d.text((a[0]-5,a[1]-11),'+',font=f(17,True),fill='white');d.text((a[0]-12,a[1]-29),o['name'],font=f(13,True),fill='#86ffca')
    for o in layers['Checkpoints']:
        if x0<=o['x']<=x1:
            a=xy(o['x']+16,o['y']);d.line((a[0],a[1]-14,a[0],a[1]+22),fill='#73f4ed',width=3);d.text((a[0]-18,a[1]-37),o['name'],font=f(15,True),fill='#82fff3')
    for o in layers['Gates']:
        rect(o,None,'#bb8efa',2)
        if x0<=o['x']<=x1:
            a=xy(o['x'],440 if o['name'].startswith('MID') else 416);d.text((a[0]+5,a[1]),'DEFEAT H01' if o['name'].startswith('MID') else 'BOSS TRIGGER',font=f(12,True),fill='#d6b0ff')
    for o in layers['PendingDesign']:
        if o['name']=='CRAWL-ROOF':
            rect(o,None,'#f5a6d6',1)
            if x0<=o['x']<=x1:
                a=xy(o['x'],o['y']);d.text((a[0]-48,a[1]-21),'ROOF: PENDING',font=f(12),fill='#f7b7df')
    if row==0: note='Upper: jump gaps  •  Middle: bursts + drop-through gaps  •  Water: pulse + skimmer  •  R02 alcove remains open'
    elif row==1: note='Full-height entry forces convergence  •  H01 opens guard gate  •  MID respawn  •  Crane loads / press / electric pulse'
    else: note='Upper and water bypass H02/H03  •  R04 rewards the upper route  •  BOSS checkpoint before arena activation'
    d.text((36,oy+H*sy+26),note,font=f(16),fill='#b9cfe0')
d.text((36,1490),'P patrol   T turret   D drone   H heavy   L lobber   S skimmer   R repair   HZ hazard',font=f(17),fill='#f2d6ae')
d.text((36,1515),'Review plate compresses vertical scale. Open the TMJ for exact 1:1 geometry. No production sprites or audio are included.',font=f(14),fill='#90aabf')
im.save(OUT/'level-review.png',optimize=True)
print(json.dumps(report,indent=2))
if not all(checks.values()):raise SystemExit('Static authoring checks failed; inspect report before committing.')
