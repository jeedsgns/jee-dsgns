/* JEE.DSGNS — interactive dot-matrix world map (plain SVG, no libraries). Data lives in mapData.js */
(function () {
  const box = document.getElementById("worldmap"), D = window.MAP_DATA; if (!box || !D) return;
  const NS = "http://www.w3.org/2000/svg", K = 1000 / 360, MW = 1000, MH = 144 * K, TOP = 84;
  const X = lon => (lon + 180) * K, Y = lat => (TOP - lat) * K;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mk = (n, a = {}, p) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); p && p.appendChild(e); return e; };
  const inside = (x, y, p) => { let c = false; for (let i = 0, j = p.length - 1; i < p.length; j = i++) { const a = p[i], b = p[j]; if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; };

  const svg = mk("svg", { role: "group", "aria-label": "Interactive world map. Drag to pan; use the buttons to zoom." }, box);
  const defs = mk("defs", {}, svg), gr = mk("radialGradient", { id: "mglow" }, defs);
  mk("stop", { offset: "0", "stop-color": "#fff", "stop-opacity": ".55" }, gr); mk("stop", { offset: "1", "stop-color": "#fff", "stop-opacity": "0" }, gr);
  const mg = mk("linearGradient", { id: "mdot", x1: 0, y1: 0, x2: 1, y2: 1 }, defs);
  [["0", "#f4f6f8"], [".5", "#8b9199"], ["1", "#d9dde2"]].forEach(s => mk("stop", { offset: s[0], "stop-color": s[1] }, mg));
  const world = mk("g", {}, svg);

  /* graticule */
  const grat = mk("path", { fill: "none", stroke: "#85898D", "stroke-width": .4, opacity: .35 }, world); let gd = "";
  for (let lo = -180; lo <= 180; lo += 30) gd += `M${X(lo)} 0V${MH}`; for (let la = -60; la <= 80; la += 20) gd += `M0 ${Y(la)}H${MW}`; grat.setAttribute("d", gd);

  /* land as dots */
  let d = ""; const st = D.dotStep || 2;
  for (let lat = TOP - st / 2; lat > TOP - 144; lat -= st) for (let lon = -180 + st / 2; lon < 180; lon += st) {
    if (D.land.some(p => inside(lon, lat, p)) && !(D.water || []).some(p => inside(lon, lat, p))) d += `M${X(lon).toFixed(1)} ${Y(lat).toFixed(1)}h0`;
  }
  mk("path", { d, stroke: "url(#mdot)", "stroke-width": st * K * .42, "stroke-linecap": "round", fill: "none", opacity: .85 }, world);

  /* arcs from the home location (shortest way round the globe) */
  const home = D.locations.find(l => l.home) || D.locations[0], arcs = {}, ag = mk("g", {}, world);
  D.locations.filter(l => l !== home).forEach(l => {
    let dx = l.lon - home.lon; const wrap = dx > 180 ? -1 : dx < -180 ? 1 : 0; if (wrap) dx += wrap * 360;
    const x1 = X(home.lon), y1 = Y(home.lat), x2 = x1 + dx * K, y2 = Y(l.lat), cx = (x1 + x2) / 2, cy = Math.min(y1, y2) - Math.abs(x2 - x1) * .28;
    const path = `M${x1} ${y1}Q${cx} ${cy} ${x2} ${y2}`; arcs[l.id] = [];
    [0, -wrap * MW].forEach((off, i) => { if (i && !wrap) return;
      const g = mk("g", { transform: `translate(${off} 0)` }, ag);
      const p = mk("path", { d: path, class: "arc", fill: "none" }, g); arcs[l.id].push(p);
      if (!reduced) { const c = mk("circle", { r: 2.2, fill: "#fff", class: "pulse" }, g); mk("animateMotion", { dur: "6s", repeatCount: "indefinite", path }, c); }
    });
  });

  /* markers */
  const panel = document.getElementById("mapPanel"), mEls = {}; let sel = null;
  D.locations.forEach(l => {
    const g = mk("g", { class: "mk", tabindex: 0, role: "button", "aria-label": l.name + ": show details" }, world); g.dataset.x = X(l.lon); g.dataset.y = Y(l.lat);
    mk("circle", { r: 20, fill: "url(#mglow)", class: "halo" }, g); mk("circle", { r: 9, class: "ring", fill: "none" }, g);
    mk("circle", { r: 4, class: "core" }, g); mk("text", { y: -15, "text-anchor": "middle", class: "lbl" }, g).textContent = l.name;
    const pick = () => select(l.id); g.addEventListener("mouseenter", pick); g.addEventListener("focus", pick);
    g.addEventListener("click", () => { if (!moved) pick(); }); g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
    mEls[l.id] = g;
  });
  function select(id) {
    sel = id; const l = D.locations.find(x => x.id === id);
    Object.keys(mEls).forEach(k => mEls[k].classList.toggle("on", k === id));
    Object.keys(arcs).forEach(k => arcs[k].forEach(p => p.classList.toggle("hot", k === id || (l && l.home))));
    panel.innerHTML = `<b>${l.name}</b><p>${l.text}</p>`; panel.classList.add("show");
  }
  select(home.id);

  /* pan + zoom */
  let s = 1, s0 = 1, tx = 0, ty = 0, moved = false; const pts = new Map(); let pinch = 0;
  function apply() {
    world.setAttribute("transform", `translate(${tx} ${ty}) scale(${s})`);
    svg.style.touchAction = s > s0 * 1.05 ? "none" : "pan-y";
    box.querySelectorAll(".mk").forEach(g => g.setAttribute("transform", `translate(${g.dataset.x} ${g.dataset.y}) scale(${1 / s})`));
    ag.setAttribute("stroke-width", 1.2 / s);
  }
  function clamp() { const w = box.clientWidth, h = box.clientHeight; tx = Math.min(w * .6, Math.max(w * .4 - MW * s, tx)); ty = Math.min(h * .6, Math.max(h * .4 - MH * s, ty)); }
  function fit() { const w = box.clientWidth, h = box.clientHeight; s0 = Math.max(w / MW, 0.01); s = s0; tx = 0; ty = (h - MH * s) / 2; apply(); }
  function zoomAt(f, cx, cy) { const n = Math.min(s0 * 10, Math.max(s0, s * f)); f = n / s; tx = cx - (cx - tx) * f; ty = cy - (cy - ty) * f; s = n; clamp(); apply(); }
  const ctr = () => [box.clientWidth / 2, box.clientHeight / 2];
  svg.addEventListener("pointerdown", e => { pts.set(e.pointerId, [e.clientX, e.clientY]); moved = false; if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = Math.hypot(a[0] - b[0], a[1] - b[1]); } });
  addEventListener("pointermove", e => {
    if (!pts.has(e.pointerId)) return; const p = pts.get(e.pointerId), dx = e.clientX - p[0], dy = e.clientY - p[1]; pts.set(e.pointerId, [e.clientX, e.clientY]);
    if (pts.size === 2) { const [a, b] = [...pts.values()], dd = Math.hypot(a[0] - b[0], a[1] - b[1]), r = box.getBoundingClientRect(); if (pinch) zoomAt(dd / pinch, (a[0] + b[0]) / 2 - r.left, (a[1] + b[1]) / 2 - r.top); pinch = dd; moved = true; return; }
    if (s <= s0 * 1.02 && e.pointerType === "touch") return;
    if (Math.abs(dx) + Math.abs(dy) > 0) { if (!moved && Math.abs(dx) + Math.abs(dy) < 3) return; moved = true; box.classList.add("drag"); tx += dx; ty += dy; clamp(); apply(); }
  });
  const up = e => { pts.delete(e.pointerId); pinch = 0; box.classList.remove("drag"); setTimeout(() => moved = false, 0); };
  addEventListener("pointerup", up); addEventListener("pointercancel", up);
  box.addEventListener("wheel", e => { if (!(e.ctrlKey || e.metaKey)) return; e.preventDefault(); const r = box.getBoundingClientRect(); zoomAt(e.deltaY < 0 ? 1.25 : .8, e.clientX - r.left, e.clientY - r.top); }, { passive: false });
  document.getElementById("mapIn").onclick = () => zoomAt(1.5, ...ctr());
  document.getElementById("mapOut").onclick = () => zoomAt(1 / 1.5, ...ctr());
  document.getElementById("mapReset").onclick = fit;
  new ResizeObserver(fit).observe(box);
})();
