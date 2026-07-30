/* about-ticker.jsx — derlenmiş. Kaynağı kök dizinde düzenle, sonra yeniden derle. */
(function(){
// about-ticker.jsx — About section (editorial hierarchy) + Clients vision/octopus tracker
const {
  useState,
  useEffect,
  useRef
} = React;
function About() {
  const [lang] = useLang();
  const t = k => rbT(k, lang);
  return /*#__PURE__*/React.createElement("section", {
    id: "about",
    className: "gutter shell about-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "01")), /*#__PURE__*/React.createElement(Reveal, {
    variant: "mask",
    delay: 0.1,
    className: "about-titlewrap",
    style: {
      marginTop: '14px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "display-l",
    style: {
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement(KineticText, {
    text: t('about.title')
  }))), /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade",
    delay: 0.5,
    className: "about-stats",
    style: {
      marginTop: '48px'
    }
  }, [{
    num: 'IST',
    label: t('about.basedIn')
  }].map(s =>
  /*#__PURE__*/
  // Bu blok iki dilde de İngilizce — lang="en" olmadan Türkçe sayfada
  // büyük harf kuralı "BASED İN ISTANBUL" üretiyor.
  React.createElement("div", {
    key: s.label,
    lang: "en"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Syne'",
      fontWeight: 800,
      fontSize: 'clamp(24px, 2.2vw, 32px)',
      color: 'var(--orange)',
      letterSpacing: '-0.02em'
    }
  }, s.num), /*#__PURE__*/React.createElement("div", {
    className: "meta",
    style: {
      color: '#444',
      marginTop: '6px',
      fontSize: '10px'
    }
  }, s.label)))), /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade",
    delay: 0.6,
    style: {
      marginTop: '28px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    lang: "tr"
  }, /*#__PURE__*/React.createElement("div", {
    className: "about-founders",
    style: {
      fontFamily: 'var(--f-display)',
      fontSize: '19px',
      fontWeight: 700,
      color: 'var(--orange)',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flexWrap: 'wrap',
      rowGap: '6px'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://www.instagram.com/snnakpnr/?hl=tr",
    target: "_blank",
    rel: "noopener noreferrer",
    className: "founder-link",
    style: {
      whiteSpace: 'nowrap',
      flex: 'none',
      color: 'inherit',
      textDecoration: 'none'
    }
  }, "Sinan Akp\u0131nar"), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: '1px',
      height: '16px',
      background: 'var(--orange)',
      opacity: 0.4,
      flex: 'none'
    }
  }), /*#__PURE__*/React.createElement("a", {
    href: "https://www.instagram.com/teomankucukeren/?hl=tr",
    target: "_blank",
    rel: "noopener noreferrer",
    className: "founder-link",
    style: {
      whiteSpace: 'nowrap',
      flex: 'none',
      color: 'inherit',
      textDecoration: 'none'
    }
  }, "Teoman K\xFC\xE7\xFCkeren")), /*#__PURE__*/React.createElement("div", {
    className: "meta",
    style: {
      color: '#444',
      fontSize: '10px',
      marginTop: '8px'
    }
  }, t('about.foundedBy'))))), /*#__PURE__*/React.createElement("div", {
    className: "about-desc"
  }, /*#__PURE__*/React.createElement(Reveal, {
    delay: 0.1
  }, /*#__PURE__*/React.createElement("p", {
    className: "about-lead"
  }, t('about.leadPre'), /*#__PURE__*/React.createElement("span", {
    className: "accent"
  }, "Robust"), t('about.leadPost'))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 0.22
  }, /*#__PURE__*/React.createElement("p", {
    className: "body-text",
    style: {
      marginBottom: '24px',
      maxWidth: '64ch'
    }
  }, t('about.body'))), t('about.body2') && /*#__PURE__*/React.createElement(Reveal, {
    delay: 0.4
  }, /*#__PURE__*/React.createElement("p", {
    className: "body-text body-dim",
    style: {
      maxWidth: '64ch',
      marginTop: '24px'
    }
  }, t('about.body2')))));
}

/* ── Clients — names matched to real films open in the player;
   clients with no matching film in the catalogue are not clickable. ── */
const CLIENTS = [{
  name: 'KALE',
  project: 'Stone Horizons Vegas',
  type: '3D Product Film',
  year: '2026',
  vimeoId: '1193087002'
}, {
  name: 'TURKİSHBANK'
}, {
  name: 'T-ONE',
  project: '23 Nisan Bayram Filmi',
  type: 'Commercial Film',
  year: '2026',
  vimeoId: '1193081066'
}, {
  name: 'İGA',
  project: 'Digital Journey',
  type: 'Brand Film',
  year: '2023',
  vimeoId: '1193312374'
}, {
  name: 'İTALYA BÜYÜKELÇİLİĞİ',
  project: 'Çağdaş Sanata Yeni Bakış Açıları',
  type: 'Panel Film',
  year: '2024',
  vimeoId: '1193292941'
}, {
  name: 'ARUP',
  project: 'SGIA: New Terminal Competition',
  type: 'Competition Film',
  year: '2019',
  vimeoId: '374188204'
}, {
  name: 'DOĞANAY',
  project: 'Doğanay Kvass',
  type: 'Digital Billboard Film',
  year: '2026',
  vimeoId: '1193325072'
}, {
  name: 'MAURER',
  project: 'Maurer: 1915 Çanakkale Bridge',
  type: 'Corporate Film',
  year: '2021',
  vimeoId: '1193286757'
}, {
  name: 'SIGMA',
  project: 'Sigma DAF',
  type: 'Corporate Film',
  year: '2021',
  vimeoId: '1193297807'
}, {
  name: 'HASSA'
}, {
  name: 'LOGOSKY'
}, {
  name: 'beIN'
}, {
  name: 'BRİSA',
  project: 'Altın Yaka',
  type: 'Corporate Film',
  year: '2025',
  vimeoId: '1195418367'
}, {
  name: 'TEKNOPARK İSTANBUL'
}];

/* ── Clients — AI vision / object-tracking marquee ──────────────
   Each brand is a "tracked object": JS drives the marquee so we can
   read every glyph's screen position each frame and paint a HUD layer
   (bounding boxes, corner brackets, measurement readouts, vector
   points, scan lines). The cursor is a sensor: nearby objects lock on,
   connection lines + live distance values are drawn, and the dot grid
   is gently displaced. Restrained, cinematic — not gaming/cyberpunk. */
function Ticker() {
  const route = window.RBRouter.useRoute();
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const canvasRef = useRef(null);
  const statusRef = useRef(null);
  const pausedRef = useRef(false);
  const items = [...CLIENTS, ...CLIENTS, ...CLIENTS];

  // Resolve a client's film to the canonical catalogue entry (matching credits),
  // then open it as a route-driven overlay. Opened from Home, no prev/next.
  const openClientFilm = client => {
    const catalogue = window.FEATURED_WORKS || [];
    const full = catalogue.find(w => String(w.vimeoId) === String(client.vimeoId));
    const work = full || {
      title: client.project,
      client: client.name,
      type: client.type,
      year: client.year,
      vimeoId: client.vimeoId
    };
    window.RBRouter.openProject(work, {
      base: 'home',
      noNav: true
    });
  };

  // While a film overlay is open the section gets no mouseleave (the overlay
  // mounts under a stationary cursor), so pause tracking and let the loop clear
  // any frozen highlight off the clicked brand.
  useEffect(() => {
    pausedRef.current = route.name === 'project' || route.name === 'showreel';
  }, [route]);
  useEffect(() => {
    const wrap = wrapRef.current,
      track = trackRef.current,
      canvas = canvasRef.current,
      status = statusRef.current;
    if (!wrap || !track || !canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ORANGE = [255, 69, 0];
    const CURSOR_R = 360; // px — cursor grab radius
    const BODY_REACH = 520; // px — idle reach of the two nearest tentacles
    // Touch devices (phones) have no hovering cursor, so the octopus would sit
    // idle forever. On touch we keep its nearest arms extended by default and
    // let a finger take over tracking.
    const touchMode = window.matchMedia('(hover: none) and (pointer: coarse)').matches || window.matchMedia('(max-width: 760px)').matches;
    const GRID = 46; // dot grid spacing
    const GR = 130; // grid displacement radius

    let W = 0,
      H = 0;
    function resize() {
      const r = section.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      oneSet = track.scrollWidth / 3;
    }
    const nodes = Array.from(track.querySelectorAll('.ticker-brand'));
    const section = wrap.closest('#clients');
    const eyebrowEl = section ? section.querySelector('.eyebrow') : null;

    // Anchor for parking the octopus next to the About paragraph's closing
    // phrase "serve the story" (used on mobile, where the status readout — the
    // normal anchor — is hidden). Recomputed on resize/reflow, not per frame.
    let storyAnchor = null;
    function computeStory() {
      storyAnchor = null;
      try {
        if (!section) return;
        const secR = section.getBoundingClientRect();
        let p = null;
        document.querySelectorAll('#about p').forEach(function (el) {
          if (!p && /serve the story/.test(el.textContent)) p = el;
        });
        if (!p) return;
        const gi = p.textContent.lastIndexOf('serve the story');
        if (gi < 0) return;
        const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, null);
        let n,
          acc = 0,
          node = null,
          local = 0;
        while (n = walker.nextNode()) {
          if (gi < acc + n.textContent.length) {
            node = n;
            local = gi - acc;
            break;
          }
          acc += n.textContent.length;
        }
        if (!node) return;
        const range = document.createRange();
        range.setStart(node, local);
        range.setEnd(node, Math.min(node.textContent.length, local + 15));
        const rects = range.getClientRects();
        if (!rects.length) return;
        const b = rects[rects.length - 1];
        // just to the RIGHT of the phrase's end ("…story"), vertically centred
        storyAnchor = {
          x: b.right - secR.left + 16,
          y: b.top - secR.top + b.height / 2
        };
      } catch (e) {
        storyAnchor = null;
      }
    }

    // ── mouse sensor (with velocity for the whip) ──
    const mouse = {
      x: -9999,
      y: -9999,
      in: false,
      infl: 0,
      vx: 0,
      vy: 0
    };
    // idle-reach strength on touch devices (eases 0→1 when no finger is down)
    let idleRamp = 0;
    // smoothed octopus head position (parked when idle, released to cursor when in)
    const body = {
      x: 0,
      y: 0,
      init: false
    };
    // Vertical reach of the tracker. The section box already stretches far ABOVE
    // the TRACKING readout (its paddingTop overlaps the About text) — that is why
    // the octopus wakes up well before the readout. Below the names the box ends
    // almost immediately, so it used to die the instant the cursor headed toward
    // Highlights. We listen on the document instead and test a symmetric band:
    // the same pixel distance below the names as there is above the readout.
    // The reach ABOVE the names band is the whole distance from the section's
    // top edge (which sits ~140px up, over the About text) down to the band —
    // TRACKING readout and all. Mirror exactly that much BELOW the band.
    function reachPad(sr, br) {
      return Math.max(120, br.top - sr.top);
    }
    function onMove(e) {
      const r = section.getBoundingClientRect();
      const br = wrap.getBoundingClientRect();
      const bottom = Math.max(r.bottom, br.bottom + reachPad(r, br));
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > bottom) {
        if (mouse.in) onLeave();
        return;
      }
      const nx = e.clientX - r.left,
        ny = e.clientY - r.top;
      if (mouse.in) {
        mouse.vx = nx - mouse.x;
        mouse.vy = ny - mouse.y;
      }
      mouse.x = nx;
      mouse.y = ny;
      mouse.in = true;
      document.body.classList.add('cursor-octopus'); // the octopus becomes the cursor
    }
    function onLeave() {
      mouse.in = false;
      document.body.classList.remove('cursor-octopus');
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);

    // ── touch sensor — a finger becomes the octopus, mirroring the mouse ──
    function onTouch(e) {
      const t = e.touches[0];
      if (!t) return;
      const r = section.getBoundingClientRect();
      const nx = t.clientX - r.left,
        ny = t.clientY - r.top;
      if (mouse.in) {
        mouse.vx = nx - mouse.x;
        mouse.vy = ny - mouse.y;
      }
      mouse.x = nx;
      mouse.y = ny;
      mouse.in = true;
      document.body.classList.add('cursor-octopus');
    }
    function onTouchEnd() {
      mouse.in = false;
      document.body.classList.remove('cursor-octopus');
    }
    (section || wrap).addEventListener('touchstart', onTouch, {
      passive: true
    });
    (section || wrap).addEventListener('touchmove', onTouch, {
      passive: true
    });
    (section || wrap).addEventListener('touchend', onTouchEnd);
    (section || wrap).addEventListener('touchcancel', onTouchEnd);

    // ── mobile swipe — drag the client names horizontally ──
    function onDragStart(e) {
      if (!touchMode) return;
      const t = e.touches[0];
      if (!t) return;
      dragging = true;
      dragAxis = null;
      userVel = 0;
      dragStartX = dragLastX = t.clientX;
      dragStartY = t.clientY;
    }
    function onDragMove(e) {
      if (!touchMode || !dragging) return;
      const t = e.touches[0];
      if (!t) return;
      const dx = t.clientX - dragStartX,
        dy = t.clientY - dragStartY;
      if (dragAxis === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
        dragAxis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      }
      if (dragAxis === 'x') {
        e.preventDefault();
        const step = t.clientX - dragLastX;
        offset += step;
        userVel = step;
        dragLastX = t.clientX;
        if (oneSet > 0) {
          while (-offset >= oneSet) offset += oneSet;
          while (offset > 0) offset -= oneSet;
        }
      }
    }
    function onDragEnd() {
      dragging = false;
      dragAxis = null;
    }
    if (touchMode) {
      wrap.addEventListener('touchstart', onDragStart, {
        passive: true
      });
      wrap.addEventListener('touchmove', onDragMove, {
        passive: false
      });
      wrap.addEventListener('touchend', onDragEnd);
      wrap.addEventListener('touchcancel', onDragEnd);
    }

    // ── marquee state ──
    let offset = 0,
      oneSet = 0;
    // Ambient marquee speed: fast by default, easing down while the pointer is
    // over the band (hover) or a finger is held on it. mouse.infl ramps 0→1.
    const SPEED_FAST = 72; // px/s — default
    const SPEED_SLOW = 18; // px/s — at the closest tentacle grip
    // Proximity-driven speed: the marquee eases between FAST and SLOW as a
    // function of how near the octopus' arms are to the client names — not as a
    // step when the cursor enters. proxTarget is recomputed per frame in draw()
    // from the two strongest grips; proxEase adds inertia so it glides.
    let proxTarget = 0, proxEase = 0;
    // Mobile: a horizontal finger-drag scrubs the marquee; a flick keeps it
    // gliding (userVel) before the ambient auto-scroll resumes.
    let dragging = false,
      dragAxis = null,
      dragStartX = 0,
      dragStartY = 0,
      dragLastX = 0,
      userVel = 0;
    let last = performance.now();
    let raf = 0;
    let frameCount = 0;
    const ro = new ResizeObserver(function () {
      resize();
      computeStory();
    });
    ro.observe(section || wrap);
    resize();
    computeStory();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () {
      resize();
      computeStory();
    });
    const lerp = (a, b, t) => a + (b - a) * t;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const mixCol = p => `rgb(255,${Math.round(255 - (255 - ORANGE[1]) * p)},${Math.round(255 - 255 * p)})`;
    function bracket(x, y, w, h, len, col, lw) {
      ctx.strokeStyle = col;
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.moveTo(x, y + len);
      ctx.lineTo(x, y);
      ctx.lineTo(x + len, y);
      ctx.moveTo(x + w - len, y);
      ctx.lineTo(x + w, y);
      ctx.lineTo(x + w, y + len);
      ctx.moveTo(x + w, y + h - len);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x + w - len, y + h);
      ctx.moveTo(x + len, y + h);
      ctx.lineTo(x, y + h);
      ctx.lineTo(x, y + h - len);
      ctx.stroke();
    }
    function label(text, x, y, color, align) {
      ctx.font = '9px "Space Mono", monospace';
      ctx.textAlign = align || 'left';
      ctx.textBaseline = 'alphabetic';
      if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '0.14em';
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
      if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '0px';
      ctx.textAlign = 'left';
    }
    function drawGrid() {
      const cols = Math.ceil(W / GRID) + 1,
        rows = Math.ceil(H / GRID) + 1;
      const off = (H - (rows - 1) * GRID) / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let gx = c * GRID,
            gy = off + r * GRID;
          let a = 0.05;
          if (mouse.in) {
            const dx = gx - mouse.x,
              dy = gy - mouse.y;
            const d = Math.hypot(dx, dy);
            if (d < GR && d > 0.001) {
              const f = (1 - d / GR) * mouse.infl;
              gx += dx / d * f * 7;
              gy += dy / d * f * 7;
              a = lerp(0.05, 0.22, f);
            }
          }
          ctx.fillStyle = `rgba(255,255,255,${a})`;
          ctx.fillRect(gx - 0.6, gy - 0.6, 1.2, 1.2);
        }
      }
    }
    function draw(now) {
      const sr = section.getBoundingClientRect();
      ctx.clearRect(0, 0, W, H);

      // velocity decay
      mouse.vx *= 0.86;
      mouse.vy *= 0.86;

      // octopus origin: PARKED over the marquee text (aligned to the ROBUST logo
      // gutter on the LEFT) when idle; RELEASED toward the cursor when it enters.
      const gutterPx = Math.max(20, Math.min(72, window.innerWidth * 0.05));
      let ax0 = gutterPx,
        ay0 = H / 2;
      const tr = status ? status.getBoundingClientRect() : null;
      if (tr && tr.width > 1) {
        ax0 = tr.left - sr.left + 4; // nudged left so the head clears the TRACKING label
        ay0 = tr.top - sr.top + tr.height / 2;
      } else {
        // mobile / no status readout: the octopus would otherwise anchor to a
        // hidden element and vanish off-screen. Park it just left of the About
        // closing phrase "serve the story" when we can locate it; otherwise fall
        // back to the gap above the client marquee.
        if (storyAnchor) {
          ax0 = storyAnchor.x;
          ay0 = storyAnchor.y;
        } else {
          const bb = wrap.getBoundingClientRect();
          ax0 = gutterPx + 14;
          ay0 = bb.top - sr.top - 12;
        }
      }
      let tx = ax0,
        ty = ay0;
      if (mouse.in) {
        tx = mouse.x;
        ty = clamp(mouse.y, 18, H - 18);
      }
      if (!body.init) {
        body.x = ax0;
        body.y = ay0;
        body.init = true;
      }
      const fk = mouse.in ? 0.24 : 0.08; // tracks the pointer tightly when it IS the cursor
      body.x += (tx - body.x) * fk;
      body.y += (ty - body.y) * fk;
      const ax = body.x,
        ay = body.y;

      // stable selection reference (decoupled from the jiggling head) — the
      // cursor when present, otherwise a fixed point on the right of the band.
      const br = wrap.getBoundingClientRect();
      const bandCY = br.top - sr.top + br.height / 2;
      const selX = mouse.in ? mouse.x : W - 270;
      const selY = mouse.in ? mouse.y : bandCY;

      // collect visible logos (positions relative to the whole section)
      const arr = [];
      for (const el of nodes) {
        const name = el.querySelector('.tb-name');
        const r = (name || el).getBoundingClientRect();
        const cx = r.left - sr.left + r.width / 2;
        const cy = r.top - sr.top + r.height / 2;
        if (cx < -60 || cx > W + 60) {
          if (el.style.color) {
            el.style.color = '';
            el.style.textShadow = '';
          }
          continue;
        }
        const distRef = Math.hypot(cx - selX, cy - selY);
        const distCur = mouse.in ? Math.hypot(cx - mouse.x, cy - mouse.y) : 1e9;
        const M = 13;
        arr.push({
          el,
          cx,
          cy,
          distRef,
          distCur,
          bx: r.left - sr.left - M,
          by: r.top - sr.top - M,
          bw: r.width + M * 2,
          bh: r.height + M * 2,
          brand: name ? name.textContent : '',
          seed: el.__seed || (el.__seed = Math.random() * 100)
        });
      }
      const visible = arr.length;
      let lock = 0;
      let g1 = 0, g2 = 0; // strongest / second-strongest cursor grip

      // Only the single name the cursor is actually over gets the tracking box
      // (not every name within the grab radius).
      let hovered = null;
      if (mouse.in) {
        let md = 1e9;
        for (const o of arr) {
          if (o.distCur < md) {
            md = o.distCur;
            hovered = o;
          }
        }
      }

      // the THREE logos nearest the reference are always grabbed (no cursor needed)
      const sorted = [...arr].sort((a, b) => a.distRef - b.distRef);
      const nearest = sorted[0];

      // On touch devices the octopus keeps its 3 nearest arms extended with no
      // finger down, so mobile users see it "alive" and already gripping logos.
      let idleSet = null;
      if (idleRamp > 0.01) {
        idleSet = new Set([...arr].sort((a, b) => Math.hypot(a.cx - ax0, a.cy - ay0) - Math.hypot(b.cx - ax0, b.cy - ay0)).slice(0, 3));
      }
      for (const o of arr) {
        const cursorProx = clamp(1 - o.distCur / CURSOR_R, 0, 1) * mouse.infl;
        if (cursorProx > g1) { g2 = g1; g1 = cursorProx; } else if (cursorProx > g2) { g2 = cursorProx; }
        let idleWa = 0;
        if (idleSet && idleSet.has(o)) {
          const distBody = Math.hypot(o.cx - ax0, o.cy - ay0);
          idleWa = clamp(1 - distBody / BODY_REACH, 0, 1) * idleRamp * 0.85;
        }
        const wa = Math.max(cursorProx, idleWa); // cursor OR idle reach on touch
        if (wa > 0.01) {
          lock = Math.max(lock, wa);
          tentacle(ax, ay, o.cx, o.cy, wa, now, o.seed);
          const g = Math.round(lerp(0x5a, 0xec, wa));
          o.el.style.color = `rgb(${g},${g},${g})`;
          o.el.style.textShadow = `0 0 ${20 * wa}px rgba(255,69,0,${0.32 * wa})`;
        } else if (o.el.style.color) {
          o.el.style.color = '';
          o.el.style.textShadow = '';
        }
        // tracking box around the brand — only on the name under the cursor
        if (o === hovered && cursorProx > 0.04) {
          const a = cursorProx;
          ctx.strokeStyle = `rgba(255,69,0,${0.1 + 0.4 * a})`;
          ctx.lineWidth = 1;
          ctx.strokeRect(o.bx, o.by, o.bw, o.bh);
          const tk = 7;
          ctx.strokeStyle = `rgba(255,150,90,${0.75 * a})`;
          ctx.beginPath();
          ctx.moveTo(o.bx, o.by + tk);
          ctx.lineTo(o.bx, o.by);
          ctx.lineTo(o.bx + tk, o.by);
          ctx.moveTo(o.bx + o.bw - tk, o.by + o.bh);
          ctx.lineTo(o.bx + o.bw, o.by + o.bh);
          ctx.lineTo(o.bx + o.bw, o.by + o.bh - tk);
          ctx.stroke();
        }
      }

      // marquee brake: dominated by the nearest name, with the second name
      // adding pull when the octopus hovers between two of them. Smoothstepped
      // so the slowdown creeps in far out and saturates only at the grip.
      const grip = clamp(g1 + 0.32 * g2, 0, 1);
      proxTarget = grip * grip * (3 - 2 * grip);

      // octopus body (always alive) at the TRACKING dot / released head
      octopusBody(ax, ay, now);
      if (status && frameCount % 8 === 0) {
        const nm = nearest ? nearest.brand : '—';
        status.textContent = 'TRACKING · ' + nm + ' · LOCK ' + (lock > 0.02 ? lock.toFixed(2) : '—·—');
      }
    }

    // one undulating, tapered octopus arm from the body to a logo
    function tentacle(ax, ay, cx, cy, wa, now, seed) {
      seed = seed || 0;
      const dx = cx - ax,
        dy = cy - ay;
      const L = Math.max(Math.hypot(dx, dy), 1);
      const ux = dx / L,
        uy = dy / L;
      const nx = -uy,
        ny = ux;
      const t0 = now / 1000;
      const flick = (mouse.vx * nx + mouse.vy * ny) * 0.6;
      const amp = 14 + 16 * wa;
      const SEG = 30;
      let prev = [ax, ay];
      let midPt = [ax, ay];
      ctx.lineCap = 'round';
      for (let k = 1; k <= SEG; k++) {
        const s = k / SEG;
        const env = Math.sin(Math.PI * s);
        const wave = Math.sin(s * 6.5 - t0 * 4.0 + seed) * 0.7 + Math.sin(s * 12.0 - t0 * 2.4 + seed * 1.7) * 0.3;
        const off = wave * env * amp + flick * env;
        const bxp = ax + dx * s + nx * off;
        const byp = ay + dy * s + ny * off;
        if (k === 18) midPt = [bxp, byp];
        ctx.strokeStyle = `rgba(255,${Math.round(96 - 40 * s)},${Math.round(48 - 40 * s)},${(0.8 - 0.5 * s) * wa})`;
        ctx.lineWidth = 2.6 * (1 - s) + 0.5;
        ctx.beginPath();
        ctx.moveTo(prev[0], prev[1]);
        ctx.lineTo(bxp, byp);
        ctx.stroke();
        prev = [bxp, byp];
      }
      ctx.lineCap = 'butt';
      ctx.fillStyle = `rgba(255,92,26,${0.92 * wa})`;
      ctx.beginPath();
      ctx.arc(prev[0], prev[1], 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(255,140,80,${0.5 * wa})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(prev[0], prev[1], 5, 0, Math.PI * 2);
      ctx.stroke();
      // pixel distance octopus → logo, written on the arm
      const dtxt = Math.round(L) + ' PX';
      ctx.font = '9px "Space Mono", monospace';
      if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '0.12em';
      const tw = ctx.measureText(dtxt).width;
      if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '0px';
      ctx.fillStyle = `rgba(5,5,5,${0.62 * wa})`;
      ctx.fillRect(midPt[0] - tw / 2 - 4, midPt[1] - 7, tw + 8, 13);
      label(dtxt, midPt[0], midPt[1] + 2.5, `rgba(255,160,100,${0.95 * wa})`, 'center');
    }

    // the octopus head + its idle drifting stubs at the origin
    function octopusBody(ax, ay, now) {
      const t0 = now / 1000;
      const baseA = 0.5 + 0.5 * mouse.infl;
      ctx.lineCap = 'round';
      for (let aI = 0; aI < 3; aI++) {
        const ang = 1.7 + aI * 0.5 + Math.sin(t0 * 0.8 + aI) * 0.22; // fan down-left toward the band
        const len = 34 + 10 * Math.sin(t0 * 1.5 + aI * 2);
        let prev = [ax, ay];
        for (let k = 1; k <= 12; k++) {
          const s = k / 12;
          const bend = Math.sin(s * 6 - t0 * 3 + aI) * 7 * Math.sin(Math.PI * s);
          const bxp = ax + Math.cos(ang) * len * s - Math.sin(ang) * bend;
          const byp = ay + Math.sin(ang) * len * s + Math.cos(ang) * bend;
          ctx.strokeStyle = `rgba(255,90,30,${(0.36 - 0.26 * s) * baseA})`;
          ctx.lineWidth = 1.8 * (1 - s) + 0.35;
          ctx.beginPath();
          ctx.moveTo(prev[0], prev[1]);
          ctx.lineTo(bxp, byp);
          ctx.stroke();
          prev = [bxp, byp];
        }
      }
      ctx.lineCap = 'butt';
      const rg = ctx.createRadialGradient(ax, ay, 0, ax, ay, 12);
      rg.addColorStop(0, `rgba(255,92,26,${0.5 * baseA})`);
      rg.addColorStop(1, 'rgba(255,69,0,0)');
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.arc(ax, ay, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(255,130,75,${0.95 * baseA})`;
      ctx.beginPath();
      ctx.arc(ax, ay, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    function frame(now) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (pausedRef.current) {
        mouse.in = false;
        document.body.classList.remove('cursor-octopus');
      }
      if (!reduce) {
        if (dragging) {
          // finger is scrubbing — offset already set by onDragMove
        } else if (Math.abs(userVel) > 0.2) {
          // flick inertia glides, then decays back to ambient auto-scroll
          offset += userVel;
          userVel *= 0.94;
        } else {
          offset -= (SPEED_FAST - (SPEED_FAST - SPEED_SLOW) * proxEase) * dt;
        }
        if (oneSet > 0) {
          while (-offset >= oneSet) offset += oneSet;
          while (offset > 0) offset -= oneSet;
        }
      }
      track.style.transform = `translateX(${offset}px)`;
      mouse.infl += ((mouse.in ? 1 : 0) - mouse.infl) * 0.1;
      proxEase += (proxTarget - proxEase) * 0.08; // glide toward the proximity brake
      idleRamp += ((touchMode && !mouse.in ? 1 : 0) - idleRamp) * 0.05;
      frameCount++;
      draw(now);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.body.classList.remove('cursor-octopus');
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      (section || wrap).removeEventListener('touchstart', onTouch);
      (section || wrap).removeEventListener('touchmove', onTouch);
      (section || wrap).removeEventListener('touchend', onTouchEnd);
      (section || wrap).removeEventListener('touchcancel', onTouchEnd);
      wrap.removeEventListener('touchstart', onDragStart);
      wrap.removeEventListener('touchmove', onDragMove);
      wrap.removeEventListener('touchend', onDragEnd);
      wrap.removeEventListener('touchcancel', onDragEnd);
    };
  }, []);
  return /*#__PURE__*/React.createElement("section", {
    id: "clients",
    style: {
      position: 'relative',
      marginTop: '-140px',
      paddingTop: 'clamp(70px, 11vh, 150px)',
      paddingBottom: 'clamp(12px, 2vh, 28px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gutter shell",
    style: {
      paddingBottom: 'clamp(26px, 3.4vh, 40px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "clients-head",
    style: {
      paddingBottom: 0,
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: '24px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    ref: statusRef,
    className: "track-status",
    style: {
      opacity: 1
    }
  }))), /*#__PURE__*/React.createElement("div", {
    ref: wrapRef,
    className: "vt-wrap",
    style: {
      position: 'relative',
      overflow: 'hidden',
      padding: 'clamp(46px, 6.4vh, 74px) 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    className: "vt-track",
    style: {
      display: 'flex',
      alignItems: 'center',
      whiteSpace: 'nowrap',
      width: 'max-content',
      position: 'relative',
      zIndex: 1
    }
  }, items.map((client, i) => {
    const oid = String(i % CLIENTS.length + 1).padStart(2, '0');
    const conf = (0.9 + i * 37 % 9 / 100).toFixed(2);
    const hasFilm = !!client.vimeoId;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: i
    }, /*#__PURE__*/React.createElement("button", {
      className: hasFilm ? 'ticker-brand' : 'ticker-brand is-static',
      "data-oid": oid,
      "data-conf": conf,
      onClick: hasFilm ? () => openClientFilm(client) : undefined,
      disabled: !hasFilm,
      title: hasFilm ? `${client.project} — ${client.type}` : client.name,
      style: {
        cursor: 'none',
        pointerEvents: hasFilm ? 'auto' : 'none'
      }
    }, hasFilm && /*#__PURE__*/React.createElement("span", {
      className: "tb-play",
      "aria-hidden": "true"
    }, "\u25B6"), /*#__PURE__*/React.createElement("span", {
      className: "tb-name"
    }, client.name)), /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        color: 'var(--orange)',
        fontFamily: "'Space Mono', monospace",
        fontWeight: 700,
        fontSize: '15px',
        lineHeight: 1,
        flexShrink: 0,
        opacity: 0.7
      }
    }, "-"));
  })), ['left', 'right'].map(side => /*#__PURE__*/React.createElement("div", {
    key: side,
    className: 'vt-fade vt-fade-' + side,
    style: {
      position: 'absolute',
      [side]: 0,
      top: 0,
      bottom: 0,
      width: 'clamp(60px, 10vw, 150px)',
      background: `linear-gradient(to ${side === 'left' ? 'right' : 'left'}, #050505, transparent)`,
      zIndex: 3,
      pointerEvents: 'none'
    }
  }))), /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef,
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 6,
      pointerEvents: 'none'
    }
  }));
}
Object.assign(window, {
  About,
  Ticker,
  CLIENTS
});
})();
