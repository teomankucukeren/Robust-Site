// warp-bg.js — Isobar Ribbons (exact look, scrolls with page)
// The pattern is computed EXACTLY as the original viewport version, then the
// whole thing is shifted by scrollY and tiled (period = viewport height) so it
// follows the page seamlessly. Look + cursor interaction are identical to the
// fixed version — only the vertical offset tracks the scroll.
(function () {
  'use strict';

  const canvas = document.getElementById('rb-warp');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = 0, H = 0;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  let tx = 0, ty = 0, mx = 0, my = 0, active = false;

  // Octopus clearing: eases 0→1 while the clients-section octopus is active,
  // opening a soft circle in the ribbons around it so it reads clearly.
  let octo = 0;
  const OCTO_R = 230;   // clearing radius (px)

  const N_LINES  = 42;
  const N_PTS    = 38;
  const MIN_GAP  = 6;
  const CURSOR_R = 240;
  const CURSOR_A = 70;

  const WAVES = [
    [0.48, 0.0065, 0.20, 0.00],
    [0.28, 0.0172, 0.38, 2.10],
    [0.14, 0.0360, 0.63, 4.20],
    [0.07, 0.0750, 0.98, 1.55],
    [0.03, 0.1580, 1.60, 3.30],
  ];

  // ── EXACT original wave (line-index phase) ────────────────────
  function idle(xi, li, t) {
    const x = xi * W;
    const p = li * 0.41;
    let y = 0;
    for (const [a, fx, ft, po] of WAVES) {
      y += Math.sin(x * fx + t * ft + p + po) * 40 * a;
    }
    return y;
  }

  // ── Cursor: uses ON-SCREEN (viewport) Y of the line ───────────
  function dimple(x, viewY) {
    if (!active) return 0;
    const dx = x - mx, dy = viewY - my;
    const d  = Math.sqrt(dx * dx + dy * dy);
    if (d >= CURSOR_R) return 0;
    const fa   = Math.pow(1 - d / CURSOR_R, 2.5);
    const sign = dy >= 0 ? 1 : -1;
    return sign * fa * CURSOR_A;
  }

  function proximity(x, viewY) {
    if (!active) return 0;
    const dx = x - mx, dy = viewY - my;
    return Math.max(0, 1 - Math.sqrt(dx*dx+dy*dy) / CURSOR_R);
  }

  // ── EXACT original non-uniform baselines (viewport space) ─────
  function baselineYs(t) {
    const attY = H * (0.38 + 0.22 * Math.sin(t * 0.11));
    const ys   = [];
    for (let i = 0; i < N_LINES; i++) {
      const u      = (i + 0.5) / N_LINES;
      const pull   = 0.52 * Math.exp(-Math.pow(u - attY / H, 2) / (2 * 0.18 * 0.18));
      const warped = u + pull * (attY / H - u) * 0.7;
      ys.push(Math.max(0.02, Math.min(0.98, warped)) * H);
    }
    ys.sort((a, b) => a - b);
    for (let pass = 0; pass < 3; pass++) {
      for (let i = 1; i < ys.length; i++) {
        if (ys[i] - ys[i-1] < MIN_GAP) {
          const mid = (ys[i] + ys[i-1]) / 2;
          ys[i-1] = mid - MIN_GAP / 2;
          ys[i]   = mid + MIN_GAP / 2;
        }
      }
    }
    return ys;
  }

  function drawRibbon(pts, maxF, density) {
    if (pts.length < 2) return;
    const db = density * 0.022;
    const a  = (0.048 + maxF * 0.27 + db) * 0.8 * 0.85;
    const r  = Math.round(76  + maxF * 179);
    const g  = Math.round(78  + maxF *  -8);
    const b  = Math.round(92  + maxF * -92);
    ctx.strokeStyle = `rgba(${r},${g},${b},${a.toFixed(3)})`;
    ctx.lineWidth   = 0.55 + maxF * 1.25 + db;
    ctx.lineJoin    = 'round';
    ctx.lineCap     = 'round';
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 0; i < pts.length - 2; i++) {
      const xc = (pts[i].x + pts[i+1].x) * 0.5;
      const yc = (pts[i].y + pts[i+1].y) * 0.5;
      ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
    }
    ctx.lineTo(pts[pts.length-1].x, pts[pts.length-1].y);
    ctx.stroke();
  }

  function hidden() {
    return document.body.dataset.view    === 'works' ||
           document.body.dataset.booted !== 'true';
  }

  // ── Draw one tile of lines, offset by `shift` (viewport px) ───
  function drawTile(ys, shift, t) {
    for (let li = 0; li < N_LINES; li++) {
      const viewY = ys[li] + shift;            // on-screen Y
      if (viewY < -80 || viewY > H + 80) continue;

      const gapAbove = li > 0           ? ys[li] - ys[li-1] : H;
      const gapBelow = li < N_LINES - 1 ? ys[li+1] - ys[li] : H;
      const density  = Math.max(0, 1 - Math.min(gapAbove, gapBelow) / 60);

      const pts  = [];
      let   maxF = 0;
      for (let pi = 0; pi <= N_PTS; pi++) {
        const xi = pi / N_PTS;
        const x  = xi * W;
        const dy = idle(xi, li, t) + dimple(x, viewY);
        const y  = viewY + dy;
        const f  = proximity(x, viewY);
        if (f > maxF) maxF = f;
        pts.push({ x, y });
      }
      drawRibbon(pts, maxF, density);
    }
  }

  function render() {
    requestAnimationFrame(render);
    if (hidden()) return;

    const t       = Date.now() * 0.001;
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const tileH   = H;
    // positive modulo
    const scrollMod = ((scrollY % tileH) + tileH) % tileH;

    const reel = document.getElementById('rb-bg-reel');
    let videoBtm = 0;
    if (reel) videoBtm = Math.max(0, Math.min(H, reel.getBoundingClientRect().bottom));
    const gridStart = Math.max(0, videoBtm - 300);
    const footerEl  = document.querySelector('.rb-footer');
    // Ribbons flow down THROUGH the footer on every screen size; a CSS gradient
    // on the footer fades them to solid black toward the bottom bar.
    const flowIntoFooter = true;
    let footerTop   = H;
    if (footerEl && !flowIntoFooter) footerTop = Math.max(0, Math.min(H, footerEl.getBoundingClientRect().top));

    ctx.clearRect(0, 0, W, H);
    ctx.save();
    if (gridStart > 0 || footerTop < H) {
      ctx.beginPath();
      ctx.rect(0, gridStart, W, footerTop - gridStart);
      ctx.clip();
    }

    const ys = baselineYs(t);

    // Two tiles cover the viewport for any scrollMod ∈ [0, H)
    drawTile(ys, -scrollMod,          t);   // current tile (shifted up)
    drawTile(ys, -scrollMod + tileH,  t);   // next tile below

    // ── Dim ribbons behind the clients section so the octopus reads clearly ──
    const clientsEl = document.querySelector('#clients');
    if (clientsEl) {
      const cr  = clientsEl.getBoundingClientRect();
      const top = cr.top, bot = cr.bottom;
      if (bot > 0 && top < H) {
        const feather = 80;
        const span    = (bot - top) + feather * 2;
        const dim     = 0.62;   // 0 = unchanged, 1 = fully cleared
        const cg = ctx.createLinearGradient(0, top - feather, 0, bot + feather);
        cg.addColorStop(0,                  'rgba(0,0,0,0)');
        cg.addColorStop(feather / span,     `rgba(0,0,0,${dim})`);
        cg.addColorStop(1 - feather / span, `rgba(0,0,0,${dim})`);
        cg.addColorStop(1,                  'rgba(0,0,0,0)');
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = cg;
        ctx.fillRect(0, top - feather, W, span);
        ctx.globalCompositeOperation = 'source-over';
      }
    }

    // ── Octopus clearing — soft circular erase around the octopus head ──
    const octoActive = document.body.classList.contains('cursor-octopus');
    octo += ((octoActive ? 1 : 0) - octo) * 0.08;   // ease in/out
    if (octo > 0.01) {
      const r = OCTO_R * octo;
      const cg = ctx.createRadialGradient(mx, my, 0, mx, my, r);
      cg.addColorStop(0,    `rgba(0,0,0,${(0.92 * octo).toFixed(3)})`);
      cg.addColorStop(0.55, `rgba(0,0,0,${(0.62 * octo).toFixed(3)})`);
      cg.addColorStop(1,    'rgba(0,0,0,0)');
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.arc(mx, my, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }

    if (videoBtm > gridStart) {
      const fade = ctx.createLinearGradient(0, gridStart, 0, videoBtm);
      fade.addColorStop(0, 'rgba(0,0,0,1)');
      fade.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = fade;
      ctx.fillRect(0, gridStart, W, videoBtm - gridStart);
      ctx.globalCompositeOperation = 'source-over';
    }

    ctx.restore();
  }

  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width  = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    tx = W/2; ty = H/2; mx = tx; my = ty;
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => { tx=e.clientX; ty=e.clientY; active=true; });
  window.addEventListener('mouseleave', () => { active=false; });
  window.addEventListener('touchmove', e => {
    if (e.touches[0]) { tx=e.touches[0].clientX; ty=e.touches[0].clientY; active=true; }
  }, { passive: true });

  resize();
  (function ease() { mx+=(tx-mx)*0.09; my+=(ty-my)*0.09; requestAnimationFrame(ease); })();
  render();
})();
