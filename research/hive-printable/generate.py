#!/usr/bin/env python3
"""Generate original Hive-inspired relief tiles. Python 3 standard library only.
Run: python3 research/hive-printable/generate.py
All dimensions in millimetres. STL has no unit metadata: import as mm.
"""
from pathlib import Path
import math, struct, json, zipfile
from collections import Counter

ROOT = Path(__file__).resolve().parent
INSECTS = ['queen', 'ant', 'beetle', 'grasshopper', 'spider']
STYLES = ['rounded', 'faceted', 'terraced']


def segment(x, y, a, b):
    dx, dy = b[0]-a[0], b[1]-a[1]
    t = max(0, min(1, ((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)))
    return math.hypot(x-a[0]-t*dx, y-a[1]-t*dy)


def relief(x, y, insect, style):
    """Connected, deck-backed anatomy; no floating appendages or undercuts."""
    features = []
    def oval(cx, cy, rx, ry, height):
        q = math.hypot((x-cx)/rx, (y-cy)/ry)
        if style == 'faceted':
            q = max(abs((x-cx)/rx), abs((y-cy)/ry), (abs((x-cx)/rx)+abs((y-cy)/ry))*.72)
        features.append(height * (min(1, max(0, (1-q)/.7)) if style == 'faceted' else max(0, 1-q*q)**.55))
    def limb(points, width=.65, height=1.1):
        d = min(segment(x,y,a,b) for a,b in zip(points,points[1:]))
        features.append(height*max(0, 1-(d/width)**2)**.5)
    # Centre thorax reaches exactly 5 mm, preserving 15 mm overall height.
    oval(0,0,1.7,1.8,5)
    if insect == 'queen':
        oval(0,3,1.6,1.5,2.5); oval(0,-2.9,2.2,2.8,3.2)
        for s in [-1,1]:
            oval(s*3,-.4,2,2.8,1.6)
            for yy in [-2,0,2]: limb([(s*1,yy),(s*3.6,yy+.5),(s*5.5,yy-1)])
            limb([(s*.7,3.5),(s*1.8,5.4)],.5,.9)
        # Crown-shaped head and abdominal bands visible in monochrome.
        for xx in [-1,0,1]: limb([(xx,3.5),(xx*1.4,5.1-abs(xx)*.5)],.5,1.5)
    elif insect == 'ant':
        oval(0,3.2,1.7,1.7,2.8); oval(0,-3.4,2,2.4,3)
        limb([(0,-1),(0,-3)],.9,1.8)
        for s in [-1,1]:
            for yy in [-1.4,0,1.4]: limb([(s*1,yy),(s*3.6,yy+1),(s*5.6,yy-.7)])
            limb([(s*.8,4),(s*2.8,5.8)],.5,.9)
    elif insect == 'beetle':
        oval(0,-1.5,3.5,4.1,3.7); oval(0,3.3,2,1.5,2.2)
        for s in [-1,1]:
            for yy in [-2.5,0,2]: limb([(s*2,yy),(s*4.7,yy+.9),(s*5.6,yy-.8)],.75,1.3)
            limb([(s*1,3.8),(s*2.5,5)],.5,.9)
    elif insect == 'grasshopper':
        oval(0,-1.7,1.7,4,3.5); oval(0,3.3,1.8,1.7,2.6)
        for s in [-1,1]:
            limb([(s*1,-2),(s*4,2),(s*5.8,-3.6),(s*3.4,-5.8)],.85,1.9)
            limb([(s*1,1.3),(s*3.4,3),(s*4.5,1.5)],.55,1.1)
            limb([(s*1,0),(s*3,-.5),(s*4.5,-2)],.55,1.1)
            limb([(s*.7,4),(s*2,6)],.5,.9)
    else:
        oval(0,-2.9,2.6,2.7,3.5); oval(0,2.3,1.5,1.5,2.5)
        for s in [-1,1]:
            for yy,end in [(-1.5,-5.4),(-.5,-2.6),(.5,2.6),(1.5,5.4)]:
                limb([(s*1,yy),(s*4,yy*1.5),(s*5.6,end)],.65,1.3)
    h = max(features)
    # Details are shallow recessed grooves in bodies, never free-standing hairs.
    if insect in ['queen','grasshopper'] and y < -1 and abs(x)<1.5:
        if abs((y+1.5)%1.5-.75)<.22: h=max(0,h-.45)
    if insect == 'beetle' and y < -1 and abs(x)<.25: h=max(0,h-.5)
    if style == 'terraced' and h>0: h=math.ceil(h/.6)*.6
    # Universal rotational envelope: socket has 0.8 mm radial clearance.
    return max(0, min(5, h, 8-math.hypot(x,y)))


def mesh(insect, style, angles=120, rings=100):
    vertices=[]
    def ztop(x,y,r,limit):
        return 10-min(.6,max(0,r-(limit-.6)))+relief(x,y,insect,style)
    def zbottom(x,y,r,limit): return max(0,min(8,8.8-r),r-(limit-.3))
    for surface in [ztop,zbottom]:
        vertices.append((0.,0.,surface(0,0,0,25)))
        for j in range(1,rings+1):
            for i in range(angles):
                t=2*math.pi*i/angles
                # Vertices at 0,60,.. degrees; exact circumdiameter 50 mm.
                limit=25*math.cos(math.pi/6)/math.cos((t%(math.pi/3))-math.pi/6)
                r=limit*j/rings
                x,y=r*math.cos(t),r*math.sin(t)
                vertices.append((x,y,surface(x,y,r,limit)))
    n=1+angles*rings
    faces=[]
    for offset,reverse in [(0,False),(n,True)]:
        local=[]
        for i in range(angles): local.append((offset,offset+1+i,offset+1+(i+1)%angles))
        for j in range(rings-1):
            for i in range(angles):
                a=offset+1+j*angles+i; b=offset+1+j*angles+(i+1)%angles
                c=a+angles; d=b+angles
                local.extend([(a,c,d),(a,d,b)])
        faces.extend([(a,c,b) if reverse else (a,b,c) for a,b,c in local])
    for i in range(angles):
        a=1+(rings-1)*angles+i; b=1+(rings-1)*angles+(i+1)%angles
        faces.extend([(a,a+n,b+n),(a,b+n,b)])
    return vertices,faces


def validate(vertices, faces):
    edges=Counter(); directed=Counter(); volume=0
    for a,b,c in faces:
        va,vb,vc=vertices[a],vertices[b],vertices[c]
        cross=((vb[1]-va[1])*(vc[2]-va[2])-(vb[2]-va[2])*(vc[1]-va[1]),
               (vb[2]-va[2])*(vc[0]-va[0])-(vb[0]-va[0])*(vc[2]-va[2]),
               (vb[0]-va[0])*(vc[1]-va[1])-(vb[1]-va[1])*(vc[0]-va[0]))
        assert sum(v*v for v in cross)>1e-15, 'Degenerate triangle'
        volume+=sum(va[k]*cross[k] for k in range(3))/6
        for u,v in [(a,b),(b,c),(c,a)]: edges[tuple(sorted((u,v)))]+=1; directed[(u,v)]+=1
    assert all(n==2 for n in edges.values()), 'Non-manifold edge'
    assert all(directed[(v,u)]==n for (u,v),n in directed.items()), 'Inconsistent winding'
    assert len(vertices)-len(edges)+len(faces)==2
    assert volume>0
    assert min(v[2] for v in vertices)==0 and max(v[2] for v in vertices)==15
    # Linear interpolation cannot escape convex cone envelope if vertices fit.
    for x,y,z in vertices[:len(vertices)//2]:
        if z>10: assert math.hypot(x,y)+(z-10)<=8+1e-8
    return {'vertices':len(vertices),'triangles':len(faces),'volume_mm3':round(volume,2),
            'manifold':True,'consistent_winding':True,'height_mm':15,'corner_diameter_mm':50,
            'minimum_faceted_socket_radial_clearance_mm':round(8.8*math.cos(math.pi/120)-8,4)}


def write_stl(path,vertices,faces):
    with path.open('wb') as f:
        f.write(b'Mini Research original insect relief; units mm'.ljust(80,b'\0')); f.write(struct.pack('<I',len(faces)))
        for a,b,c in faces:
            va,vb,vc=vertices[a],vertices[b],vertices[c]
            u=[vb[k]-va[k] for k in range(3)]; v=[vc[k]-va[k] for k in range(3)]
            normal=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]]
            length=math.sqrt(sum(x*x for x in normal))
            f.write(struct.pack('<12fH',*[x/length for x in normal],*va,*vb,*vc,0))


def illustration(vertices, faces, style):
    """Static, no-JavaScript specimen rendered from the same preview mesh."""
    yaw, pitch = -.4, .95
    def project(v):
        x,y,z=v
        a=x*math.cos(yaw)-y*math.sin(yaw)
        b=x*math.sin(yaw)+y*math.cos(yaw)
        return a,b*math.cos(pitch)-z*math.sin(pitch),b*math.sin(pitch)+z*math.cos(pitch)
    points=list(map(project,vertices)); polygons=[]
    for face in faces:
        a,b,c=[points[i] for i in face]
        u=[b[k]-a[k] for k in range(3)]; v=[c[k]-a[k] for k in range(3)]
        n=(u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0])
        if n[2]<=0: continue
        length=math.sqrt(sum(t*t for t in n))
        light=max(.18,(-n[0]*.35-n[1]*.4+n[2]*.85)/length)
        color=f'rgb({round(95+135*light)},{round(85+126*light)},{round(70+105*light)})'
        pts=' '.join(f'{180+q[0]*6:.1f},{180+q[1]*6:.1f}' for q in [a,b,c])
        polygons.append((a[2]+b[2]+c[2],f'<polygon points="{pts}" fill="{color}" stroke="{color}" stroke-width=".7"/>'))
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 300" role="img"><title>'+style+' queen bee tile</title>'+''.join(p[1] for p in sorted(polygons))+'</svg>'


def main():
    (ROOT/'models').mkdir(exist_ok=True)
    manifest={}; previews={}
    for style in STYLES:
        for insect in INSECTS:
            key=f'{style}-{insect}'
            vertices,faces=mesh(insect,style)
            manifest[key]=validate(vertices,faces)
            write_stl(ROOT/'models'/f'{key}.stl',vertices,faces)
            vs,fs=mesh(insect,style,60,42)
            if insect=='queen': (ROOT/f'{style}-queen.svg').write_text(illustration(vs,fs,style))
            previews[key]={'vertices':[[round(c,4) for c in v] for v in vs],'faces':fs}
            print(key,manifest[key]['triangles'],'triangles: passed')
    (ROOT/'validation.json').write_text(json.dumps(manifest,indent=2)+'\n')
    (ROOT/'preview-meshes.json').write_text(json.dumps(previews,separators=(',',':')))
    with zipfile.ZipFile(ROOT/'hive-relief-models.zip','w',zipfile.ZIP_DEFLATED) as z:
        for path in sorted((ROOT/'models').glob('*.stl')): z.write(path,'models/'+path.name)
        for name in ['generate.py','PRINTING.md','validation.json']: z.write(ROOT/name,name)
    print('15 manifold STL models and download archive generated.')

if __name__=='__main__': main()
