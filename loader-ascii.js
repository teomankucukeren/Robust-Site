/* loader-ascii.jsx — derlenmiş. Kaynağı kök dizinde düzenle, sonra yeniden derle. */
(function(){
// loader-ascii.jsx — minimal typographic boot sequence.
// A centred row of monospace glyphs ( - = + ) on black. A bright pulse scans
// across the row, fast, in sequence — each cell morphs -→=→+ as the wave peaks
// over it, glowing in brand orange. At 100% the whole row flares and reveals home.
const {
  useEffect: axUseEffect,
  useRef: axUseRef,
  useState: axUseState
} = React;
const AX_N = 13; // number of glyph cells
const AX_SPEED = 8.5; // cells per second the pulse travels
const AX_SIGMA = 1.7; // pulse width
const AX_FRAME = 1 / 24; // seconds per frame at 24fps
const AX_FLASH_HOLD = AX_FRAME * 2; // orange flash holds for exactly 2 frames
function axLerpPt(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
function axEdgePts(p0, p1, n) { const pts = []; for (let k = 0; k < n; k++) pts.push(axLerpPt(p0, p1, k / n)); return pts; }
const AX_TRI = [].concat(axEdgePts([50, 2], [96, 96], 4), axEdgePts([96, 96], [4, 96], 4), axEdgePts([4, 96], [50, 2], 4));
const AX_SQR = [].concat(axEdgePts([6, 6], [94, 6], 3), axEdgePts([94, 6], [94, 94], 3), axEdgePts([94, 94], [6, 94], 3), axEdgePts([6, 94], [6, 6], 3));
const AX_CIRC = (() => { const pts = []; for (let k = 0; k < 12; k++) { const ang = -Math.PI / 2 + k * (Math.PI * 2 / 12); pts.push([50 + 48 * Math.cos(ang), 50 + 48 * Math.sin(ang)]); } return pts; })();
const AX_SHAPES = [AX_TRI, AX_SQR, AX_CIRC];
function axPathAt(s) {
  const seg = Math.floor(s) % 3, next = (seg + 1) % 3;
  let lt = s - Math.floor(s);
  lt = 0.5 - 0.5 * Math.cos(lt * Math.PI);
  const a = AX_SHAPES[seg], b = AX_SHAPES[next], pts = [];
  for (let i = 0; i < 12; i++) pts.push(axLerpPt(a[i], b[i], lt));
  return { d: 'M ' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L ') + ' Z', lt };
}

function AsciiLoader({
  onReveal
}) {
  const cellRefs = axUseRef([]);
  const barRef = axUseRef(null);
  const pctRef = axUseRef(null);
  const flashRef = axUseRef(null);
  // 'done' from the very first render if the sequence already played in this tab —
  // the overlay is then never painted, not even for a frame.
  const [phase, setPhase] = axUseState(() => {
    try {
      return sessionStorage.getItem('rb-boot') === '1' ? 'done' : 'load';
    } catch (e) {
      return 'load';
    }
  });
  axUseEffect(() => {
    // Already booted in this tab (e.g. arrived here from the language switch):
    // reveal immediately, run none of the animation.
    if (phase === 'done') {
      onReveal();
      return;
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let dead = false,
      raf = null;

    // load milestones drive the percentage
    let fontsIn = false,
      pageIn = false;
    const fontsP = document.fonts && document.fonts.ready || Promise.resolve();
    fontsP.then(() => {
      fontsIn = true;
    }).catch(() => {
      fontsIn = true;
    });
    if (document.readyState === 'complete') pageIn = true;else window.addEventListener('load', () => {
      pageIn = true;
    }, {
      once: true
    });
    setTimeout(() => {
      fontsIn = true;
    }, 2000);
    setTimeout(() => {
      pageIn = true;
    }, 4500);
    const t0 = performance.now();
    let prog = reduce ? 1 : 0,
      fired = false,
      fullAt = null,
      flare = 0;
    const MIN_TIME = reduce ? 0 : 2.4;
    if (!reduce) document.body.style.overflow = 'hidden';
    document.body.classList.add('rb-loading');
    const fire = () => {
      if (fired) return;
      fired = true;
      try {
        sessionStorage.setItem('rb-boot', '1');
      } catch (e) {}
      document.body.style.overflow = '';
      document.body.classList.remove('rb-loading');
      setPhase('out');
      const g = window.gsap;
      let ok = false;
      if (g && flashRef.current) {
        try {
          const tl = g.timeline({
            onComplete: () => setPhase('done')
          });
          /* orange FLASH: snap on, hold exactly 2 frames @24fps (~0.083s), snap off —
             the whole loader (black bg + glyphs + flash) disappears in that same
             instant so home is never left showing through a bare loading frame */
          tl.set(flashRef.current, {
            opacity: 1
          }, 0);
          tl.add(() => onReveal(), AX_FRAME); // mount home behind the flash
          tl.set(flashRef.current, {
            opacity: 0
          }, AX_FLASH_HOLD);
          ok = true;
        } catch (e) {
          ok = false;
        }
      }
      if (!ok) {
        onReveal();
        setTimeout(() => setPhase('done'), AX_FLASH_HOLD * 1000);
      }
      setTimeout(() => {
        if (!dead) setPhase('done');
      }, 1200);
    };

    // circular distance on the row so the scan wraps cleanly
    const circDist = (a, b) => {
      let d = Math.abs(a - b);
      return Math.min(d, AX_N - d);
    };
    const loop = () => {
      if (dead) return;
      const t = (performance.now() - t0) / 1000;
      if (!fired) {
        let tgt = Math.min(t / 2.2, fontsIn && pageIn ? 1 : 0.92);
        if (fontsIn) tgt = Math.max(tgt, Math.min(0.5 + t / 5, 1));
        prog += (tgt - prog) * 0.06;
        if (tgt >= 1 && prog > 0.997) prog = 1;
        const pc = Math.min(100, Math.floor(prog * 100 + 0.5));
        if (pctRef.current) pctRef.current.textContent = String(pc).padStart(3, '0');
        if (barRef.current) barRef.current.style.transform = `scaleX(${prog})`;
        if (prog >= 0.999 && t >= MIN_TIME) {
          if (fullAt === null) fullAt = t;else if (t - fullAt > 0.35) fire();
        }
      }
      if (fired) flare = Math.min(1, flare + 0.06);
      const pos = t * AX_SPEED % AX_N;
      for (let i = 0; i < AX_N; i++) {
        const el = cellRefs.current[i];
        if (!el) continue;
        const d = circDist(i, pos);
        const pulse = Math.exp(-(d * d) / (2 * AX_SIGMA * AX_SIGMA));
        // everything streams to the right: pattern is sampled at (i - flow)
        const flow = t * 5.0;
        const phase = i - flow;
        // travelling brightness wave — every cell glows, peaks ride rightward
        let inten = 0.4 + 0.45 * (0.5 + 0.5 * Math.sin(phase * 0.85));
        inten = Math.max(inten, pulse, flare);
        // shape morphs right too, cycling triangle → square → circle
        const cyclePos = ((phase * 0.85 + 0.6) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        const sh = axPathAt(cyclePos / (Math.PI * 2) * 3);
        el.setAttribute('d', sh.d);
        const a = (0.32 + inten * 0.68).toFixed(3);
        el.setAttribute('fill', `rgba(255, 69, 0, ${a})`); // brand orange, brightness via alpha
        const glow = (inten * 9).toFixed(1);
        el.style.filter = `drop-shadow(0 0 ${glow}px rgba(255, 69, 0, ${(0.2 + inten * 0.4).toFixed(2)}))`;
        const rot = (sh.lt * 24 - 12).toFixed(1);
        el.style.transformOrigin = '50% 50%';
        el.style.transform = `translateY(${(-inten * 3).toFixed(2)}px) scale(${(0.82 + inten * 0.4).toFixed(3)}) rotate(${rot}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const safety = setTimeout(() => {
      if (!dead && !fired) {
        prog = 1;
        fire();
      }
    }, 8000);
    return () => {
      dead = true;
      clearTimeout(safety);
      if (raf) cancelAnimationFrame(raf);
      document.body.style.overflow = '';
      document.body.classList.remove('rb-loading');
    };
  }, []);
  if (phase === 'done') return null;
  const loading = phase === 'load';
  return /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 9500,
      pointerEvents: 'none',
      background: '#000',
      opacity: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: flashRef,
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 9503,
      pointerEvents: 'none',
      opacity: 0,
      willChange: 'opacity',
      background: 'var(--orange)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "rb-ax-row",
    style: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 'clamp(15px, 2.2vw, 28px)',
      lineHeight: 1
    }
  }, Array.from({
    length: AX_N
  }).map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      display: 'inline-block',
      width: '0.62em',
      height: '0.62em',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 100 100",
    style: {
      width: '55%',
      height: '55%',
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      overflow: 'visible',
      willChange: 'transform'
    }
  }, /*#__PURE__*/React.createElement("path", {
    ref: el => { cellRefs.current[i] = el; },
    fill: "rgba(255,69,0,0.18)"
  }))))), /*#__PURE__*/React.createElement("span", {
    ref: pctRef,
    style: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, 26px)',
      fontFamily: "'Space Mono', monospace",
      fontSize: '11px',
      letterSpacing: '0.3em',
      color: 'rgba(255,69,0,0.75)',
      textShadow: '0 0 8px rgba(255,69,0,.65), 0 0 16px rgba(255,69,0,.35)'
    }
  }, "000"));
}
Object.assign(window, {
  AsciiLoader
});
})();
