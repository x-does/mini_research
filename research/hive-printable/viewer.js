/* Small orthographic mesh inspector; no external libraries or continuous animation. */
(() => {
  const canvas = document.querySelector('#model-view');
  const context = canvas.getContext('2d');
  const status = document.querySelector('#viewer-status');
  const insect = document.querySelector('#insect');
  const style = document.querySelector('#style');
  const view = document.querySelector('#view');
  let meshes, yaw = -.45, pitch = .85;
  const project = ([x,y,z], shift=0) => {
    z += shift;
    const a = x*Math.cos(yaw)-y*Math.sin(yaw);
    const b = x*Math.sin(yaw)+y*Math.cos(yaw);
    return [a, b*Math.cos(pitch)-z*Math.sin(pitch), b*Math.sin(pitch)+z*Math.cos(pitch)];
  };
  function draw() {
    if (!meshes) return;
    const width = canvas.clientWidth, height = 360;
    const ratio = Math.min(devicePixelRatio || 1,2);
    canvas.width = width*ratio; canvas.height = height*ratio;
    context.scale(ratio,ratio); context.clearRect(0,0,width,height);
    const color = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#292534';
    const scale = Math.min(width/65,height/60);
    const centerY = view.value === 'top' ? height/2 : height*.64;
    const objects = [{key:`${style.value}-${insect.value}`,shift:0}];
    if (view.value === 'stack') objects.push({key:`${style.value}-beetle`,shift:10});
    const triangles = [];
    for (const obj of objects) {
      const mesh = meshes[obj.key];
      const points = mesh.vertices.map(v=>project(v,obj.shift));
      for (const face of mesh.faces) {
        const p=face.map(i=>points[i]);
        const nx=(p[1][1]-p[0][1])*(p[2][2]-p[0][2])-(p[1][2]-p[0][2])*(p[2][1]-p[0][1]);
        const ny=(p[1][2]-p[0][2])*(p[2][0]-p[0][0])-(p[1][0]-p[0][0])*(p[2][2]-p[0][2]);
        const nz=(p[1][0]-p[0][0])*(p[2][1]-p[0][1])-(p[1][1]-p[0][1])*(p[2][0]-p[0][0]);
        if(nz<=0) continue;
        const length=Math.hypot(nx,ny,nz);
        triangles.push({p,depth:p.reduce((sum,v)=>sum+v[2],0),light:Math.max(.18,(nx*-.35+ny*-.4+nz*.85)/length)});
      }
    }
    triangles.sort((a,b)=>a.depth-b.depth);
    for (const {p,light} of triangles) {
      context.beginPath();
      p.forEach((v,i)=>context[i?'lineTo':'moveTo'](width/2+v[0]*scale,centerY+v[1]*scale));
      context.closePath();
      context.fillStyle=`rgb(${Math.round(95+135*light)},${Math.round(85+126*light)},${Math.round(70+105*light)})`;
      context.fill(); context.strokeStyle=context.fillStyle;context.lineWidth=.4;context.stroke();
    }
    context.fillStyle=color;context.font='13px sans-serif';
    context.fillText(view.value==='stack'?'Two pieces · 25 mm assembled height':'50 mm across corners · 15 mm high',16,25);
  }
  function update() {
    pitch = view.value==='under' ? 2.15 : view.value==='top' ? 0 : .85;
    const name=`${style.value}-${insect.value}`;
    const link=document.querySelector('#selected-download');
    link.href=`models/${name}.stl`;link.download=`${name}.stl`;
    link.textContent=`Download ${style.options[style.selectedIndex].text} ${insect.options[insect.selectedIndex].text} STL`;
    status.textContent=`${style.options[style.selectedIndex].text} ${insect.options[insect.selectedIndex].text}. ${view.options[view.selectedIndex].text}. Preview is simplified; downloads contain the full mesh.`;
    draw();
  }
  [insect,style,view].forEach(el=>el.addEventListener('change',update));
  document.querySelector('#rotate-left').addEventListener('click',()=>{yaw-=Math.PI/6;draw();});
  document.querySelector('#rotate-right').addEventListener('click',()=>{yaw+=Math.PI/6;draw();});
  canvas.addEventListener('keydown',event=>{
    if (['ArrowLeft','ArrowRight'].includes(event.key)) {event.preventDefault();yaw+=event.key==='ArrowLeft'?-.15:.15;draw();}
  });
  new ResizeObserver(draw).observe(canvas);
  new MutationObserver(draw).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  fetch('preview-meshes.json').then(r=>{if(!r.ok)throw new Error(r.status);return r.json();}).then(data=>{meshes=data;update();}).catch(()=>{
    status.textContent='The 3D preview could not load. All STL downloads and the dimension diagram remain available below.';
  });
})();
