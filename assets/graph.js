// Perspective-project a small 3D scene into SVG. Navigation stays in stable HTML.
(() => {
  const svg = document.querySelector('#knowledge-graph');
  if (!svg) return;
  const ns = 'http://www.w3.org/2000/svg';
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const button = document.querySelector('#graph-pause');
  const tiltButton = document.querySelector('#graph-tilt');
  const hint = document.querySelector('#graph-hint');
  const panel = document.querySelector('.graph-panel');
  const palette = ['#b69aff', '#83dbc1', '#edb58b', '#94bfff'];
  const nodes = [
    {label: 'Mini Research', x: 0, y: 0, z: 0, color: 0, root: true},
    {label: 'Design decisions', x: -165, y: -86, z: 40, color: 0},
    {label: 'Accessibility', x: 145, y: -108, z: -38, color: 1},
    {label: 'Static publishing', x: 130, y: 113, z: 50, color: 2},
    {label: 'The source', x: -140, y: 104, z: -55, color: 3},
    {label: 'Field note 001', x: 40, y: -15, z: 125, color: 0},
    {label: 'GPU credits', x: -65, y: 145, z: 80, color: 1},
    {label: 'Beyond the Hive', x: 65, y: 110, z: -140, color: 1},
    {label: 'Hive in relief', x: 175, y: 30, z: -100, color: 2}
  ];
  for (let i = 0; i < 30; i++) {
    const cluster = i % 4 + 1, parent = nodes[cluster], angle = i * 2.39996;
    nodes.push({x: parent.x + Math.cos(angle) * (35 + i % 4 * 13), y: parent.y + Math.sin(angle) * (30 + i % 3 * 14), z: Math.sin(i * 1.7) * 100, color: parent.color, parent: cluster});
  }
  const links = [[0,8],[1,8],[0,7],[1,7],[0,6],[5,6],[0,1],[0,2],[0,3],[0,4],[0,5],[1,5],[2,5],[3,5],[3,4]];
  nodes.forEach((node, i) => { if (node.parent) { links.push([node.parent, i]); if (i > 9) links.push([i, i - 4]); } });
  function element(tag, attributes, parent) {
    const el = document.createElementNS(ns, tag);
    Object.entries(attributes).forEach(([key, value]) => el.setAttribute(key, value));
    parent.append(el);
    return el;
  }
  const edges = links.map(([a,b]) => ({a,b, el: element('line', {stroke: palette[nodes[b].color], 'stroke-width': a === 0 ? 1.1 : .65, 'stroke-opacity': .25}, document.querySelector('#graph-edges'))}));
  nodes.forEach(node => {
    const g = element('g', {}, document.querySelector('#graph-nodes'));
    if (node.label) element('circle', {r: node.root ? 48 : 24, fill: 'url(#node-glow)'}, g);
    element('circle', {r: node.root ? 8 : node.label ? 4.5 : 2, fill: palette[node.color]}, g);
    if (node.root) element('circle', {r: 17, fill: 'none', stroke: palette[0], 'stroke-opacity': .5}, g);
    if (node.label) {
      const text = element('text', {y: node.root ? 35 : 22, 'text-anchor': 'middle', class: node.root ? 'graph-label graph-root-label' : 'graph-label'}, g);
      text.textContent = node.label;
    }
    node.el = g;
  });
  let angle = -.18, pitch = .2, elapsed = 0, frame = null, last = null, paused = false, visible = true;
  const target = {x: 0, y: 0};
  const input = {x: 0, y: 0};
  const clamp = value => Math.max(-1, Math.min(1, value));
  // Mouse influence is page-wide, without taking over touch scrolling.
  window.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse') return;
    target.x = clamp(event.clientX / innerWidth * 2 - 1);
    target.y = clamp(event.clientY / innerHeight * 2 - 1);
  }, {passive: true});
  document.documentElement.addEventListener('pointerleave', () => { target.x = target.y = 0; });
  window.addEventListener('blur', () => { target.x = target.y = 0; });

  let baseline = null, listening = false;
  function orientation(event) {
    if (!Number.isFinite(event.beta) || !Number.isFinite(event.gamma)) return;
    if (!baseline) baseline = {beta: event.beta, gamma: event.gamma};
    const x = clamp((event.gamma - baseline.gamma) / 30);
    const y = clamp((event.beta - baseline.beta) / 30);
    const rotation = (screen.orientation?.angle ?? window.orientation ?? 0) * Math.PI / 180;
    target.x = clamp(x * Math.cos(rotation) + y * Math.sin(rotation));
    target.y = clamp(y * Math.cos(rotation) - x * Math.sin(rotation));
    hint.textContent = 'Tilt your phone to move the constellation';
    tiltButton.hidden = true;
  }
  function listenForTilt() {
    if (listening) return;
    listening = true;
    window.addEventListener('deviceorientation', orientation, {passive: true});
  }
  const sensor = window.DeviceOrientationEvent;
  if (matchMedia('(pointer: coarse)').matches) hint.textContent = 'Automatic orbit · a constellation of connected ideas';
  if (sensor && matchMedia('(pointer: coarse)').matches && window.isSecureContext) {
    if (typeof sensor.requestPermission === 'function') {
      tiltButton.hidden = false;
      tiltButton.addEventListener('click', async () => {
        try {
          if (await sensor.requestPermission() === 'granted') {
            listenForTilt();
            hint.textContent = 'Tilt your phone to move the constellation';
            tiltButton.hidden = true;
          } else {
            hint.textContent = 'Automatic orbit · tilt access was not enabled';
          }
        } catch {
          hint.textContent = 'Automatic orbit · tilt is unavailable in this browser';
        }
      });
    } else listenForTilt();
  }
  window.addEventListener('orientationchange', () => { baseline = null; target.x = target.y = 0; });
  function draw() {
    nodes.forEach(node => {
      const x = node.x * Math.cos(angle) + node.z * Math.sin(angle);
      const z = -node.x * Math.sin(angle) + node.z * Math.cos(angle);
      const y = node.y * Math.cos(pitch) - z * Math.sin(pitch);
      const depth = node.y * Math.sin(pitch) + z * Math.cos(pitch);
      const scale = 650 / (650 + depth);
      node.px = 320 + x * scale; node.py = 225 + y * scale;
      node.el.setAttribute('transform', `translate(${node.px.toFixed(2)} ${node.py.toFixed(2)})`);
      node.el.style.opacity = node.label ? 1 : Math.max(.3, Math.min(1, scale - .2));
    });
    edges.forEach(({a,b,el}) => {
      el.setAttribute('x1', nodes[a].px); el.setAttribute('y1', nodes[a].py);
      el.setAttribute('x2', nodes[b].px); el.setAttribute('y2', nodes[b].py);
    });
  }
  function tick(time) {
    frame = null;
    const delta = last === null ? 0 : Math.min(time - last, 50);
    elapsed += delta;
    const easing = 1 - Math.exp(-delta / 180);
    input.x += (target.x - input.x) * easing;
    input.y += (target.y - input.y) * easing;
    // Always orbit by default; reduced-motion settings soften speed and input travel.
    const strength = motion.matches ? .2 : 1;
    angle = -.18 + Math.sin(elapsed * .00022 * strength) * .48 + input.x * .42 * strength;
    pitch = .2 + Math.sin(elapsed * .00017 * strength) * .12 + input.y * .3 * strength;
    last = time; draw(); frame = requestAnimationFrame(tick);
  }
  function sync() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null; last = null;
    button.textContent = paused ? 'Play motion' : 'Pause motion';
    button.setAttribute('aria-pressed', String(paused));
    if (!paused && visible && !document.hidden) frame = requestAnimationFrame(tick);
  }
  button.hidden = false;
  button.addEventListener('click', () => { paused = !paused; sync(); });
  document.addEventListener('visibilitychange', sync);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }).observe(panel);
  draw(); panel.classList.add('graph-ready'); sync();
})();
