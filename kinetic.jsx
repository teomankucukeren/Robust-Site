// kinetic.jsx — shared motion primitives: KineticText, Reveal, useMagnetic, SideNav, ScrollProgress
const { useState, useEffect, useRef, useCallback, useMemo } = React;

/* ── KineticText ──────────────────────────────────────────────
   Cursor-proximity light effect — reserved for main headings
   (H1 / H2). Clean and glow-free by default; characters lift
   and catch a subtle warm light only while the cursor is near. */
function KineticText({ text }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (!window.matchMedia('(hover: hover)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const chars = Array.from(el.querySelectorAll('.kchar'));
    if (chars.length === 0) return;
    let raf = null;
    let pointer = null;

    const clear = () => {
      for (const c of chars) {
        c.style.transform = '';
        c.style.textShadow = '';
        c.style.color = '';
      }
    };

    const apply = () => {
      raf = null;
      if (!pointer) return;
      for (const c of chars) {
        const r = c.getBoundingClientRect();
        const dx = pointer.x - (r.left + r.width / 2);
        const dy = pointer.y - (r.top + r.height / 2);
        const dist = Math.hypot(dx, dy);
        const radius = Math.max(110, r.height * 1.5);
        let t = Math.max(0, 1 - dist / radius);
        t = t * t * (3 - 2 * t); // smoothstep falloff
        if (t > 0.02) {
          c.style.transform = `translateY(${(-0.045 * t).toFixed(3)}em)`;
          c.style.textShadow = `0 0 ${Math.round(20 * t)}px rgba(255, 110, 64, ${(0.22 * t).toFixed(3)})`;
        } else {
          c.style.transform = '';
          c.style.textShadow = '';
          c.style.color = '';
        }
      }
    };

    const onMove = (e) => {
      pointer = { x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      pointer = null;
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      clear();
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [text]);

  const words = String(text).split(' ');
  return (
    <span ref={rootRef} className="ktext">
      {words.map((word, wi) =>
        <React.Fragment key={wi}>
          <span className="kword">
            {[...word].map((ch, ci) =>
              <span key={ci} className="kchar">{ch}</span>
            )}
          </span>
          {wi < words.length - 1 ? ' ' : null}
        </React.Fragment>
      )}
    </span>
  );
}

/* ── useMagnetic ──────────────────────────────────────────────
   GSAP-driven magnetic pull for buttons / CTAs. No-op on touch
   or when GSAP is unavailable.                                 */
function useMagnetic(strength = 0.2) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.gsap) return;
    if (!window.matchMedia('(hover: hover)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const xTo = window.gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3' });
    const yTo = window.gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3' });

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const onLeave = () => { xTo(0); yTo(0); };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);
  return ref;
}

/* ── useInView ────────────────────────────────────────────── */
function useInView(threshold = 0.16) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {if (e.isIntersecting) {setInView(true);obs.disconnect();}},
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ── Reveal ───────────────────────────────────────────────────
   variant: 'up' | 'fade' | 'mask' | 'wire'
   'mask' slides content up from a clipped line — for headlines */
function Reveal({ children, variant = 'up', delay = 0, className = '', style = {}, as = 'div', threshold = 0.16 }) {
  const [ref, inView] = useInView(threshold);
  const Tag = as;
  const base =
  variant === 'fade' ? 'rv-fade' :
  variant === 'mask' ? 'rv-mask' :
  variant === 'wire' ? 'rb-wire' : 'rv';
  const cls = `${base}${inView ? ' is-in' : ''}${className ? ' ' + className : ''}`;
  const st = { ...style, '--rv-delay': `${delay}s` };

  if (variant === 'mask') {
    return (
      <Tag ref={ref} className={cls} style={st}>
        <span className="rv-mask-inner">{children}</span>
      </Tag>);

  }
  return <Tag ref={ref} className={cls} style={st}>{children}</Tag>;
}

/* ── ScrollProgress — thin orange wire across the very top ── */
function ScrollProgress() {
  const barRef = useRef(null);
  useEffect(() => {
    let raf = null;
    const update = () => {
      raf = null;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {if (!raf) raf = requestAnimationFrame(update);};
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div id="rb-progress" aria-hidden="true">
      <div className="bar" ref={barRef}></div>
    </div>);

}

/* ── SideNav — fixed right rail, always present ───────────── */
const HOME_SECTIONS = [
{ id: 'hero', label: 'Home' },
{ id: 'about', label: 'Studio' },
{ id: 'works-vitrin', label: 'Selected Works' },
{ id: 'services', label: 'Services' },
{ id: 'contact', label: 'Connect' }];


function SideNav({ view, setView }) {
  const [active, setActive] = useState('hero');

  useEffect(() => {
    if (view !== 'home') return;
    let raf = null;
    const compute = () => {
      raf = null;
      const probe = window.scrollY + window.innerHeight * 0.42;
      let current = HOME_SECTIONS[0].id;
      for (const s of HOME_SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= probe) current = s.id;
      }
      setActive(current);
    };
    const onScroll = () => {if (!raf) raf = requestAnimationFrame(compute);};
    window.addEventListener('scroll', onScroll, { passive: true });
    compute();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [view]);

  const go = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = id === 'hero' ? 0 : el.getBoundingClientRect().top + window.scrollY - 72;
    // Instant jump + funnel snap: a smooth scroll past the Works section spins
    // every card through a full rotation. Pass through it as a static section.
    window.scrollTo({ top, behavior: 'instant' });
    window.__rbFunnelSnapUntil = performance.now() + 300;
  };

  const items = view === 'home' ?
  HOME_SECTIONS.map((s) => ({ key: s.id, label: s.label, active: active === s.id, onClick: () => go(s.id) })) :
  [
  { key: 'archive', label: 'Archive', active: true, onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
  { key: 'home', label: 'Home', active: false, onClick: () => window.RBRouter.back() }];

  // Every cell shows one of the boot loader's glyphs ( - = + ), scattered at
  // random. The mix is fixed per view so it doesn't reshuffle on every scroll;
  // the active section just lights its glyph up in bright orange.
  const GLYPHS = ['-', '=', '+'];
  const glyphMix = useMemo(() => {
    const seed = items.length;
    return items.map((_, i) => GLYPHS[(i * 7 + seed * 3 + 1) % GLYPHS.length]);
  }, [items.length]);

  return (
    <nav className="side-rail" aria-label="Section navigation">
      {items.map((it, i) =>
      <button
        key={it.key}
        className={`side-rail-item${it.active ? ' active' : ''}`}
        onClick={it.onClick}
        aria-label={it.label}
        title={it.label}
        style={{ cursor: 'none' }}>
        
          <span className="side-rail-glyph">{glyphMix[i]}</span>
        </button>
      )}
    </nav>);

}

Object.assign(window, { KineticText, Reveal, useInView, useMagnetic, ScrollProgress, SideNav });
