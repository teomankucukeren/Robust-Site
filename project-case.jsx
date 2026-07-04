// project-case.jsx — full-screen editorial case-study page for DESIGN works
// Opens in place of the video overlay when a work carries a `gallery` array.
const { useState, useEffect, useRef } = React;

function ProjectCase({ work, onClose, onNav }) {
  const [vis, setVis] = useState(false);
  const scrollerRef = useRef(null);

  const bg = work.caseBg || 'var(--orange)';
  const fg = work.caseFg || '#050505';
  const bgStyle = work.caseTexture
    ? { backgroundColor: bg, backgroundImage: `url(${work.caseTexture})`, backgroundSize: '380px auto', backgroundRepeat: 'repeat' }
    : { background: bg };
  // Pick a cursor that reads against the background: light bg → dark cursor.
  const lightText = fg.toLowerCase() === '#ffffff' || fg.toLowerCase() === '#fff' || fg.toLowerCase() === 'white';

  const close = () => { setVis(false); setTimeout(onClose, 400); };

  useEffect(() => {
    const id = setTimeout(() => setVis(true), 12);
    document.body.style.overflow = 'hidden';
    const cursorClass = lightText ? 'cursor-light' : 'cursor-dark';
    document.body.classList.add(cursorClass);
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(id);
      document.body.style.overflow = '';
      document.body.classList.remove(cursorClass);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const KT = window.KineticText;
  const gallery = work.gallery || [];
  const hero = gallery[0] || work.cover;
  const rest = gallery.slice(1);

  const meta = [
    { l: 'Client',     v: work.client },
    { l: 'Designer',   v: work.designer },
    { l: 'Year',       v: work.year },
    { l: 'Role',       v: work.role },
  ].filter(m => m.v);

  return (
    <div ref={scrollerRef} className={`pcase${[29, 30].includes(work.id) ? ' pcase--tight' : ''}`} style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      ...bgStyle, color: fg,
      '--pc-fg': fg,
      overflowY: 'auto', overflowX: 'hidden',
      opacity: vis ? 1 : 0,
      transition: 'opacity 0.4s ease',
    }}>
      {/* Prev / next arrows — same funnel navigation as the video overlay, but
         tinted with THIS case page's foreground colour so they read against
         whatever background/artwork the project uses. */}
      {onNav && <PCaseNav side="left"  glyph="↼" color={fg} onClick={() => onNav(-1)} />}
      {onNav && <PCaseNav side="right" glyph="⇀" color={fg} onClick={() => onNav(1)} />}
      {/* ── Sticky header ── */}
      <div className="gutter" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: '26px', paddingBottom: '26px',
        position: 'sticky', top: 0, zIndex: 50,
        background: `color-mix(in oklab, ${bg} 88%, transparent)`,
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid color-mix(in oklab, var(--pc-fg) 16%, transparent)',
      }}>
        <button onClick={close} style={{
          background: 'none', border: 'none', padding: 0,
          fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: '13px',
          letterSpacing: '0.16em', textTransform: 'uppercase', color: fg,
          cursor: 'none',
        }}>Robust</button>
        <PCaseClose onClick={close} color={fg} />
      </div>

      {/* ── Title + meta ── */}
      <div className="gutter" style={{ paddingTop: 'clamp(48px, 9vh, 104px)', paddingBottom: 'clamp(28px, 4vh, 48px)' }}>
        <span className="eyebrow" style={{ color: fg }}>{work.type}</span>
        <h1 className="display-xl" style={{ marginTop: '16px', maxWidth: '18ch', color: fg }}>
          {work.title}
        </h1>

        <div className="pcase-meta">
          {meta.map(m => (
            <div key={m.l} className="pcase-meta-item">
              <div className="pcase-meta-label">{m.l}</div>
              <div className="pcase-meta-value">{m.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Stacked block ── one continuous image sliced into pieces:
           render every gallery frame edge-to-edge with zero gap so they read
           as a single uninterrupted block. */}
      {work.stacked ? (
        <>
          {work.about && (
            <div className="gutter pcase-about">
              <div className="pcase-about-kicker">Overview</div>
              <p className="pcase-about-body">{work.about}</p>
            </div>
          )}
          <div style={{ padding: '0 var(--gutter)', marginTop: 'clamp(12px, 3vh, 40px)', paddingBottom: 'clamp(60px, 10vh, 140px)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, lineHeight: 0, maxWidth: 'min(1120px, 94vw)', margin: '0 auto' }}>
              {gallery.map((src, i) => (
                <PCaseImg key={i} src={src} priority={i === 0} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* ── Hero image ── */}
          {hero && (
            <div style={{ padding: '0 var(--gutter)', marginTop: 'clamp(12px, 3vh, 40px)' }}>
              <PCaseImg src={hero} priority />
            </div>
          )}

          {/* ── About ── */}
          {work.about && (
            <div className="gutter pcase-about">
              <div className="pcase-about-kicker">Overview</div>
              <p className="pcase-about-body">{work.about}</p>
            </div>
          )}

          {/* ── Collage ── */}
          {rest.length > 0 && (
            <div className="gutter" style={{ paddingBottom: 'clamp(60px, 10vh, 140px)' }}>
              <div className="pcase-collage">
                {rest.map((src, i) => (
                  <div key={i} className="pcase-collage-item">
                    <PCaseImg src={src} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Footer ── */}
      <div className="gutter pcase-footer">
        <PCaseClose onClick={close} label="← Back to Archive" color={fg} />
      </div>
    </div>
  );
}

/* Route an image through the wsrv.nl CDN — resizes + converts to WebP on the
   fly and caches it, so the heavy source PNGs never hit the browser directly.
   Exposed globally as window.rbImg so every cover/thumbnail can reuse it. */
function rbImg(src, w) {
  if (!src) return src;
  if (src.indexOf('wsrv.nl') !== -1) return src;
  const clean = src.replace(/^https?:\/\//, '');
  return `https://wsrv.nl/?url=${encodeURIComponent(clean)}&w=${w || 1200}&output=webp&q=82&we`;
}
function optimize(src, w) { return rbImg(src, w); }

/* Images load straight from jsDelivr — a real CDN that handles concurrent
   requests reliably. A cached image can fire `load` before React attaches the
   handler, leaving it stuck invisible — so we also check `complete` on mount. */
function PCaseImg({ src, priority }) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth > 0) setLoaded(true);
  }, [src]);

  return (
    <div style={{
      position: 'relative', width: '100%', overflow: 'hidden',
      background: 'rgba(5,5,5,0.07)',
      minHeight: loaded ? 0 : '30vh',
    }}>
      <img
        ref={imgRef}
        src={src}
        alt=""
        loading="eager"
        decoding="async"
        fetchpriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        style={{
          display: 'block', width: '100%', height: 'auto',
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'scale(1)' : 'scale(1.015)',
          transition: 'opacity 0.7s ease, transform 0.9s cubic-bezier(0.16,1,0.3,1)',
        }}
      />
    </div>
  );
}

/* Prev / next funnel arrows for a case page. Fixed to the viewport edges and
   coloured with the page's own foreground so they always contrast the artwork. */
function PCaseNav({ side, glyph, color, onClick }) {
  const [hov, setHov] = useState(false);
  const out = side === 'left' ? -1 : 1;
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      aria-label={side === 'left' ? 'Previous project' : 'Next project'}
      style={{
        position: 'fixed', top: '50%', [side]: 'clamp(14px, 2.4vw, 40px)',
        transform: `translateY(-50%) translateX(${hov ? out * 4 : 0}px)`,
        width: 'clamp(52px, 4.4vw, 68px)', height: 'clamp(52px, 4.4vw, 68px)',
        borderRadius: '50%', zIndex: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 0, cursor: 'none', userSelect: 'none',
        background: hov ? color : `color-mix(in oklab, ${color} 10%, transparent)`,
        border: `1.5px solid color-mix(in oklab, ${color} ${hov ? 100 : 42}%, transparent)`,
        color: hov ? `color-mix(in oklab, ${color} 12%, #ffffff)` : color,
        fontSize: 'clamp(24px, 2.2vw, 32px)', lineHeight: 1,
        boxShadow: hov ? `0 8px 30px color-mix(in oklab, ${color} 30%, transparent)` : 'none',
        transition: 'color 0.22s ease, background 0.22s ease, border-color 0.22s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.22s ease',
      }}>
      {glyph}
    </button>);
}

function PCaseClose({ onClick, label = 'ESC — Close', color = '#050505' }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'none', border: 'none',
        color: hov ? color : `color-mix(in oklab, ${color} 60%, transparent)`,
        fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: '12px',
        letterSpacing: '0.14em', textTransform: 'uppercase',
        cursor: 'none', display: 'inline-flex', alignItems: 'center',
        gap: hov ? '13px' : '9px',
        transition: 'gap 0.32s cubic-bezier(0.16,1,0.3,1), color 0.24s',
      }}>
      {label}
    </button>
  );
}

Object.assign(window, { ProjectCase, rbImg });
