// works-archive.jsx — Full-screen works archive page
const { useState, useEffect, useRef, useCallback } = React;

// Single source of truth — the same canonical list as the Selected Works funnel,
// defined in works-vitrin.jsx (loaded before this file) and shared via window.
const ALL_WORKS = window.FEATURED_WORKS;

// ── Archive-only ordering ───────────────────────────────────────────────────
// The archive presents a curated order independent of the canonical upload order
// used by the homepage. Two goals:
//   • DESIGN filter reads top→bottom: Pepsi, Paradiso, Işık, İtalyan.
//   • ALL tab surfaces Pepsi × Tokyo and Paradiso Palms inside the first ten rows.
// Both are satisfied by one reordered list (the DESIGN filter preserves this order).
const ARCHIVE_WORKS = (() => {
  const byId = (id) => ALL_WORKS.find((w) => w.id === id);
  // 32 = Pepsi × Tokyo, 29 = Paradiso, 31 = Işık, 30 = İtalyan
  // Pinned to the very bottom (user request): 28 = SGIA New Terminal,
  // 26 = Haf Stone, 24 = Çankaya Healthy Streets.
  const BOTTOM = [28, 26];
  const pulled = [32, 29, 31, 30, ...BOTTOM];
  const core = ALL_WORKS.filter((w) => !pulled.includes(w.id));
  const out = [...core];
  out.splice(4, 0, byId(32)); // Pepsi → into the first ten
  out.splice(8, 0, byId(29)); // Paradiso → into the first ten
  const mi = out.findIndex((w) => w && w.id === 19); // 19 = Maurer
  out.splice(mi, 0, byId(31), byId(30)); // Işık, then İtalyan → directly above Maurer
  out.push(...BOTTOM.map(byId)); // pinned to the very bottom
  return out.filter(Boolean);
})();

// Explicit category taxonomy — single deliberate order, independent of which
// categories currently have works assigned (so DESIGN shows even when empty).
const TAXONOMY = ['PRODUCTION', 'ANIMATION', 'POST-PRODUCTION', 'DESIGN'];
const CATS = ['ALL', ...TAXONOMY];

const CARD_COLORS = {
  'PRODUCTION': '#110400',
  'POST-PRODUCTION': '#0f0600',
  'ANIMATION': '#00050f',
  'DESIGN': '#0d0d00',
  'CAMPAIGN & BRAND CONTENT': '#0d0010',
  'AI FILMMAKING': '#001008',
  'VISUAL DESIGN / ART DIRECTION': '#0d0d00',
};

function WorksArchive({ setView }) {
  const [activeCat, setActiveCat] = useState('ALL');
  const [filterKey, setFilterKey] = useState(0); // bump to retrigger entrance + rebuild focus refs
  const canHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

  // Archive projects open over the Work page → Back returns here.
  const openWork = (w) => window.RBRouter.openProject(w, { base: 'works' });

  const rowsRef  = useRef([]);   // live row elements, in render order
  const focusRef = useRef([]);   // eased focus value per row (0→1)
  const hoverRef = useRef([]);   // eased hover amount per row (0→1)
  const hovRef   = useRef(null); // currently-hovered row element (read inside RAF)

  const filtered = activeCat === 'ALL'
    ? ARCHIVE_WORKS
    : ARCHIVE_WORKS.filter(w => w.cat === activeCat);

  // Publish the current (filtered) list so the route-driven overlay can offer
  // prev/next navigation scoped to whatever the visitor is browsing.
  useEffect(() => { window.__rbArchiveList = filtered; }, [filtered]);

  const handleCat = (cat) => {
    if (cat === activeCat) return;
    rowsRef.current = [];
    focusRef.current = [];
    hoverRef.current = [];
    hovRef.current = null;
    setActiveCat(cat);
    setFilterKey(k => k + 1);
  };

  // Scroll / cursor focus. The row nearest the viewport centre eases up to full
  // Hover-only. No scroll-position movement. Every row sits still; its cover
  // rests at 50%. The row under the cursor physically EXPANDS — it eases taller
  // by adding vertical padding, pushing the rows above/below away (real reflow,
  // so borders stay perfectly aligned and nothing overlaps). Grows to ~1.8× its
  // resting height. Cover reveals further left-to-right and up to 70%. Eased per
  // row with a lerp so the grow/shrink stays buttery.
  useEffect(() => {
    let raf;
    const hov = hoverRef.current;

    // ── Mobile: there's no cursor, so drive the focus from scroll position.
    // The row whose centre sits nearest the viewport centre eases up to full
    // size while rows further away shrink slightly — the touch analogue of the
    // desktop hover-expand, so the list feels alive as you scroll instead of
    // sitting flat. ──
    if (window.matchMedia('(max-width: 760px)').matches) {
      const mloop = () => {
        const rows = rowsRef.current;
        const vh = window.innerHeight || 1;
        const mid = vh / 2;

        // Whichever row is physically LAST in the list — found by DOM position, so
        // it always tracks the real last project even after some are removed. At
        // the end of the page that row can never reach the viewport centre, so we
        // ease it to full presence as the scroll bottoms out.
        let lastIdx = -1;
        for (let i = rows.length - 1; i >= 0; i--) { if (rows[i]) { lastIdx = i; break; } }
        const maxScroll = document.documentElement.scrollHeight - vh;
        const endZone = vh * 0.6;
        const bottomBlend = maxScroll <= 0 ? 1
          : Math.max(0, Math.min(1, (window.scrollY - (maxScroll - endZone)) / endZone));

        for (let i = 0; i < rows.length; i++) {
          const el = rows[i];
          if (!el) continue;
          const r = el.getBoundingClientRect();

          // Continuous focus: a smooth bump that peaks (1) exactly when the row's
          // centre crosses the viewport centre and fades over ~half a viewport on
          // either side. Because growth is a proportional function of scroll
          // position — not a single "nearest" pick that snaps between rows — every
          // row rises and falls smoothly as it passes and nothing is ever skipped,
          // even on a fast flick.
          let hovTarget = 0;
          if (r.bottom > 0 && r.top < vh) {
            const off = (r.top + r.height / 2) - mid;
            const near = Math.max(0, 1 - Math.abs(off) / (vh * 0.55));
            hovTarget = near * near * (3 - 2 * near);
          }
          // Bottom of the list: bring the true last row up to full presence.
          if (i === lastIdx) hovTarget = Math.max(hovTarget, bottomBlend);

          const ch = (hov[i] == null ? 0 : hov[i]) + (hovTarget - (hov[i] || 0)) * 0.1;
          hov[i] = ch;

          if (ch < 0.001) {
            if (el.__grown) { el.__grown = false; el.style.paddingTop = ''; el.style.paddingBottom = ''; }
          } else {
            el.__grown = true;
            const grow = (80 * ch).toFixed(2) + 'px';
            el.style.paddingTop = `calc(var(--vpad) + ${grow})`;
            el.style.paddingBottom = `calc(var(--vpad) + ${grow})`;
          }

          const thumb = el.__thumb || (el.__thumb = el.querySelector('.arch-thumb'));
          if (thumb) {
            thumb.style.opacity = (0.3 + 0.4 * ch).toFixed(4);
            thumb.style.width = (60 + 18 * ch).toFixed(2) + '%';
          }

          const wantFocus = ch > 0.5;
          if (wantFocus !== el.__foc) { el.__foc = wantFocus; el.classList.toggle('is-focus', wantFocus); }
        }
        raf = requestAnimationFrame(mloop);
      };
      raf = requestAnimationFrame(mloop);
      return () => cancelAnimationFrame(raf);
    }

    const loop = () => {
      const rows = rowsRef.current;
      for (let i = 0; i < rows.length; i++) {
        const el = rows[i];
        if (!el) continue;
        const hovTarget = hovRef.current === el ? 1 : 0;
        const ch = (hov[i] == null ? 0 : hov[i]) + (hovTarget - (hov[i] || 0)) * 0.12;
        hov[i] = ch;

        if (ch < 0.001) {
          if (el.__grown) { el.__grown = false; el.style.paddingTop = ''; el.style.paddingBottom = ''; }
        } else {
          el.__grown = true;
          const grow = (80 * ch).toFixed(2) + 'px';   // up to +160px total → ~1.8× resting height
          el.style.paddingTop = `calc(var(--vpad) + ${grow})`;
          el.style.paddingBottom = `calc(var(--vpad) + ${grow})`;
        }

        const thumb = el.__thumb || (el.__thumb = el.querySelector('.arch-thumb'));
        if (thumb) {
          thumb.style.opacity = (0.3 + 0.4 * ch).toFixed(4);    // 30% at rest → 70% hovered
          thumb.style.width = (60 + 18 * ch).toFixed(2) + '%';  // reveals further left-to-right
        }

        const wantFocus = ch > 0.5;
        if (wantFocus !== el.__foc) { el.__foc = wantFocus; el.classList.toggle('is-focus', wantFocus); }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [filterKey]);

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#ffffff', position: 'relative' }}>

      {/* ── Sticky header ── */}
      <div className="gutter arch-header" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: '31px', paddingBottom: '31px',
        position: 'sticky', top: 0, zIndex: 200,
        background: 'rgba(5,5,5,0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <span onClick={() => window.RBRouter.back()} style={{ display: 'inline-flex', cursor: 'none' }} aria-label="Home">
          <LogoMark size={17} color="#ffffff" />
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px, 2.4vw, 34px)' }}>
          <CloseBtn onClick={() => window.RBRouter.back()} />
        </div>
      </div>

      {/* ── Page title ── */}
      <div className="gutter" style={{ paddingTop: 'clamp(24px, 4vh, 44px)', paddingBottom: 'clamp(28px, 4vh, 44px)' }}>
        {/* Works marker — a line + label sitting above the archive title */}
        <Reveal variant="fade" style={{ marginTop: '0', marginBottom: 'clamp(18px, 2.6vh, 32px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px, 2vw, 28px)' }}>
            <span className="eyebrow" style={{ color: 'var(--orange)', whiteSpace: 'nowrap' }}>Archive</span>
            <span style={{ flex: 1 }}></span>
            <span className="mono-note" style={{ whiteSpace: 'nowrap' }}>{ALL_WORKS.length} Projects</span>
          </div>
        </Reveal>
        <Reveal variant="mask" style={{ marginTop: '0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'clamp(16px, 2vw, 30px)', flexWrap: 'wrap' }}>
            <h1 className="display-xl" style={{ fontSize: 'clamp(34px, 5.4vw, 86px)' }}>
              <KineticText text="Work" />
            </h1>
          </div>
        </Reveal>
      </div>

      {/* ── Filter nav ── */}
      <div className="gutter arch-filters" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {CATS.map(cat => (
          <FilterBtn
            key={cat}
            label={cat}
            active={activeCat === cat}
            count={cat === 'ALL' ? ALL_WORKS.length : ALL_WORKS.filter(w => w.cat === cat).length}
            onClick={() => handleCat(cat)}
          />
        ))}
      </div>

      {/* ── Works list — DESIGN filter shows a staggered masonry; others use rows ── */}
      {activeCat === 'DESIGN' ? (
        <DesignMasonry key={filterKey} works={filtered} onOpen={openWork} />
      ) : (
        <div key={filterKey} className="arch-list">
          {filtered.map((work, i) => (
            <WorkRow
              key={work.id}
              work={work}
              index={i}
              innerRef={(el) => { rowsRef.current[i] = el; }}
              onEnter={(el) => { if (canHover) hovRef.current = el; }}
              onLeave={() => { if (canHover) hovRef.current = null; }}
              onClick={() => openWork(work)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Filter button ── */
function FilterBtn({ label, active, count, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={`arch-filter-btn${active ? ' is-active' : ''}`}
      style={{
        background: 'transparent',
        border: 'none',
        color: active ? 'var(--orange)' : (hov ? '#bbb' : '#555'),
        fontFamily: "'Space Grotesk'",
        fontWeight: active ? 600 : 400,
        fontSize: 'clamp(11px, 0.85vw, 13px)',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        padding: 'clamp(14px, 1.3vw, 18px) clamp(10px, 1vw, 16px)',
        cursor: 'none',
        transition: 'color 0.3s cubic-bezier(0.16,1,0.3,1)',
        display: 'inline-flex', alignItems: 'center', gap: '9px',
        textShadow: active ? '0 0 22px rgba(var(--orange-rgb), 0.4)' : 'none',
      }}>
      {label}
      <span style={{ opacity: 0.5, fontSize: 'clamp(11px, 0.9vw, 13px)' }}>{count}</span>
    </button>
  );
}

/* ── Work row ── */
function WorkRow({ work, index, innerRef, onEnter, onLeave, onClick }) {
  const ref = useRef(null);
  const tintCol = CARD_COLORS[work.cat] || '#0a0a0a';
  return (
    <div
      ref={(el) => { ref.current = el; if (innerRef) innerRef(el); }}
      onClick={onClick}
      onMouseEnter={() => onEnter && onEnter(ref.current)}
      onMouseLeave={onLeave}
      className="arch-row spring-in"
      style={{ '--spring-delay': `${index * 0.045}s`, cursor: 'none' }}
    >
      {/* cover bleeds in behind the title — see .arch-thumb in robust.css */}
      <div className="arch-thumb" style={{
        backgroundImage: (work.thumb || work.cover)
          ? `url(${work.thumb || work.cover})`
          : `linear-gradient(135deg, ${tintCol} 0%, #0a0a0a 100%)`,
        backgroundPosition: work.thumbPos || 'center',
      }}></div>

      {/* category chip laid over the thumbnail (mobile only — see robust.css) */}
      <span className="arch-cat">{work.cat}</span>

      <div className="arch-titlewrap" style={{ position: 'relative', zIndex: 1 }}>
        <h3 className="display-m arch-title" style={{
          fontSize: 'clamp(20px, 2.4vw, 38px)',
          lineHeight: 1.05,
          letterSpacing: '-0.01em',
        }}>{work.title}</h3>
        <span className="arch-client" style={{
          fontFamily: "'Space Grotesk'",
          fontSize: 'clamp(13px, 1vw, 15px)',
          fontWeight: 500,
          letterSpacing: '0.02em',
          marginTop: 'clamp(10px, 1vw, 16px)',
          display: 'block',
        }}>{work.client}</span>
      </div>

      <div className="arch-meta" style={{
        position: 'relative', zIndex: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'flex-end',
        gap: 'clamp(16px, 1.8vw, 30px)',
        paddingTop: 'clamp(10px, 1.1vw, 20px)',
        textAlign: 'right',
      }}>
        <span className="arch-type" style={{
          fontFamily: "'Space Grotesk'",
          fontSize: 'clamp(12px, 0.95vw, 13px)',
          fontWeight: 500,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>{work.type}</span>
        <span className="arch-year" style={{
          fontFamily: "'Space Mono'",
          fontSize: 'clamp(14px, 1.05vw, 16px)',
          letterSpacing: '0.04em',
          fontVariantNumeric: 'tabular-nums',
        }}>{work.year}</span>
      </div>
    </div>
  );
}

/* ── Floating thumbnail ── */
function FloatingThumb({ work, x, y }) {
  if (!work) return null;
  const col = CARD_COLORS[work.cat] || '#0a0a0a';
  return (
    <div style={{
      position: 'fixed',
      left: 0, top: 0,
      transform: `translate(${x + 22}px, ${y - 88}px)`,
      width: '228px',
      height: '144px',
      pointerEvents: 'none',
      zIndex: 8000,
      overflow: 'hidden',
      border: '1px solid rgba(var(--orange-rgb), 0.28)',
      boxShadow: '0 18px 54px rgba(0,0,0,0.7), 0 0 28px rgba(var(--orange-rgb), 0.09)',
      transition: 'transform 0.07s linear',
    }}>
      <div style={{
        width: '100%', height: '100%',
        background: `linear-gradient(135deg, ${col} 0%, #0a0a0a 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        {work.cover &&
        <div style={{
          position: 'absolute', inset: 0,
          background: `url(${work.cover}) center / cover no-repeat`,
          filter: 'grayscale(1) sepia(1) hue-rotate(-28deg) saturate(5.5) brightness(0.62) contrast(1.05)',
        }}></div>
        }
        <svg width="52" height="52" viewBox="0 0 120 120" fill="none" style={{ position: 'relative', opacity: work.cover ? 0.65 : 1 }}>
          <circle cx="60" cy="60" r="54" stroke="rgba(var(--orange-rgb), 0.3)" strokeWidth="1"></circle>
          <path d="M50 42l32 18-32 18V42z" fill="var(--orange)" opacity="0.8"></path>
        </svg>
        <div style={{
          position: 'absolute', bottom: '10px', left: '12px',
          fontFamily: "'Space Grotesk'",
          fontSize: '9px', letterSpacing: '0.12em',
          color: work.cover ? 'rgba(255,255,255,0.78)' : '#444',
          textShadow: work.cover ? '0 1px 8px rgba(0,0,0,0.8)' : 'none',
          textTransform: 'uppercase',
        }}>{work.title} — {work.year}</div>
      </div>
    </div>
  );
}

/* ── Close button ── */
function CloseBtn({ onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'none', border: 'none',
        color: hov ? '#ff7a3d' : 'var(--orange)',
        fontFamily: "'Space Grotesk'",
        fontWeight: 500, fontSize: '12px',
        letterSpacing: '0.12em',
        cursor: 'none',
        display: 'flex', alignItems: 'center',
        gap: hov ? '14px' : '9px',
        transition: 'gap 0.32s cubic-bezier(0.16,1,0.3,1), color 0.24s',
        textShadow: hov ? '0 0 14px rgba(var(--orange-rgb), 0.5)' : 'none',
      }}>
      ← Back to Home
    </button>
  );
}

/* ── Design masonry — Staggered Masonry treatment for the DESIGN filter ──
   Uneven 3-column column-flow with varied crops; each tile reveals with a
   shutter wipe + counter-scaling cover, meta rises after. Clicking a tile
   opens the same editorial case study as the row list. */
function DesignMasonry({ works, onOpen }) {
  const rootRef = useRef(null);
  // Varied aspect ratios drive the staggered column flow — a more dynamic mix
  // so column bottoms fall at clearly different heights.
  const RATIOS = ['3/4', '16/10', '1', '4/5', '3/4', '1', '16/9', '4/5'];

  // Swap Paradiso (29) and İtalyan Kültür Merkezi (30) so they trade places.
  const items = [...works];
  const i29 = items.findIndex((w) => w.id === 29);
  const i30 = items.findIndex((w) => w.id === 30);
  if (i29 > -1 && i30 > -1) { const t = items[i29]; items[i29] = items[i30]; items[i30] = t; }

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const items = [...root.querySelectorAll('.arch-mason-item')];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach((it) => io.observe(it));
    return () => io.disconnect();
  }, [works]);

  return (
    <div className="arch-mason gutter" ref={rootRef}>
      {items.map((work, i) => (
        <article
          key={work.id}
          className="arch-mason-item"
          style={{ '--md': `${(i % 3) * 0.08 + 0.05}s` }}
          onClick={() => onOpen(work)}
        >
          <div className="arch-mason-frame" style={{ aspectRatio: RATIOS[i % RATIOS.length] }}>
            {work.cover
              ? <img className="arch-mason-img" src={work.thumb || work.cover} alt={work.title} loading="lazy" style={{ objectPosition: 'center' }} />
              : <div className="arch-mason-img" style={{ background: 'repeating-linear-gradient(135deg,#0f0f08 0 12px,#0b0b06 12px 24px)', transform: 'none' }}></div>}
            <span className="arch-mason-grad"></span>
            <span className="arch-mason-shutter"></span>
          </div>
          <div className="arch-mason-meta">
            <span className="arch-mason-cat">{work.type || work.cat}</span>
            <h3 className="arch-mason-title">{work.title}</h3>
            <span className="arch-mason-sub">{work.client} · {work.year}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

Object.assign(window, { WorksArchive, ARCHIVE_WORKS });
