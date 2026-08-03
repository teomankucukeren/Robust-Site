/* hero.jsx — derlenmiş. Kaynağı kök dizinde düzenle, sonra yeniden derle. */
(function(){
// hero.jsx — Full-screen cinematic hero: soft-focus entrance + scroll parallax
const { useState, useEffect, useRef, useLayoutEffect } = React;

let heroEnteredOnce = false;

function KineticHead({ text }) {
  const words = String(text).split(' ');
  return words.map((w, i) => {
    const dot = w.endsWith('.');
    const core = dot ? w.slice(0, -1) : w;
    const sep = core === '◦' || core === '·' || core === '•';
    return React.createElement(React.Fragment, { key: i },
      sep
        ? React.createElement('span', { className: 'hero-sep', 'aria-hidden': 'true', style: { display: 'inline-block', width: '0.11em', height: '0.11em', borderRadius: '50%', background: 'currentColor', verticalAlign: '0.22em', opacity: 0.55 } })
        : React.createElement(React.Fragment, null, React.createElement(KineticText, { text: core }), dot && React.createElement('span', { style: { color: 'var(--gray-3)', fontSize: '0.7em' } }, '.')),
      i < words.length - 1 ? ' ' : null
    );
  });
}

function Hero({ setView, tw = {} }) {
  const [lang] = useLang();
  const t = (k) => rbT(k, lang);
  const headlineSize = tw.headlineSize || 'default';
  const headlineMode = tw.headlineMode || 'statement';
  const ctaStyle = tw.ctaStyle || 'links';
  const socialGlow = tw.socialGlow || 'bright';

  const headline = t('hero.headline');
  const eyebrow = t('hero.eyebrow');
  const headEndsDot = headline.trim().endsWith('.');
  const headSpace = headline.lastIndexOf(' ');
  const headHead = headSpace > 0 ? headline.slice(0, headSpace) : '';
  const headTail = headSpace > 0 ? headline.slice(headSpace + 1) : headline;

  const H1_SIZE = {
    default: { fontSize: 'clamp(38px, 7vw, 104px)', whiteSpace: 'nowrap', lineHeight: 1.0 },
    large:   { fontSize: 'clamp(44px, 8.5vw, 132px)', whiteSpace: 'nowrap', lineHeight: 1.0 },
    huge:    { fontSize: 'clamp(50px, 10.5vw, 168px)', whiteSpace: 'normal', lineHeight: 0.96 }
  }[headlineSize];

  const [loaded, setLoaded] = useState(heroEnteredOnce);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width:760px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(max-width:760px)');
    const on = () => setIsMobile(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  const [linePulse, setLinePulse] = useState(0);
  const contentRef = useRef(null);
  const socialsRef = useRef(null);
  const h1Ref = useRef(null);
  const lineRef = useRef(null);
  const caretRef = useRef(null);
  const typedOnceRef = useRef(heroEnteredOnce);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoaded(true);
      if (contentRef.current) contentRef.current.style.opacity = '1';
    }, 120);
    return () => clearTimeout(t);
  }, []);

  useLayoutEffect(() => {
    const h1 = h1Ref.current;
    if (!h1) return;
    const chars = Array.from(h1.querySelectorAll('.kchar'));
    const period = h1.querySelector('.hero-period');
    chars.forEach((c) => { c.style.opacity = '1'; });
    if (period) period.style.opacity = '1';
  }, [lang]);

  useEffect(() => {
    let raf = null;
    const update = () => {
      raf = null;
      const el = contentRef.current;
      if (!el) return;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const p = Math.min(1, y / (vh * 0.9));
      el.style.transition = 'none';
      el.style.transform = `translate3d(0, ${y * -0.22}px, 0)`;
      el.style.opacity = String(Math.max(0, Math.min(1, 1 - p * 1.1)));
      const soc = socialsRef.current;
      if (soc) {
        soc.style.transition = 'none';
        soc.style.transform = `translate3d(0, ${y * -0.22}px, 0)`;
        soc.style.opacity = String(Math.max(0, Math.min(1, 1 - p * 1.1)));
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return React.createElement('section', { id: 'hero', style: {
    position: 'relative', width: '100%', height: '100svh', minHeight: '560px', overflow: 'hidden',
    display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start',
    paddingBottom: 'calc(clamp(96px, 15vh, 184px) - 70px)'
  } },
    React.createElement('div', { style: {
      position: 'absolute', inset: 0, zIndex: 2,
      background: 'radial-gradient(ellipse at 50% 40%, rgba(5,5,5,0) 0%, rgba(5,5,5,0.5) 55%, rgba(5,5,5,0.96) 100%)',
      WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, #000 52%, transparent 100%)',
      maskImage: 'linear-gradient(to bottom, #000 0%, #000 52%, transparent 100%)'
    } }),
    React.createElement('div', { style: {
      position: 'absolute', inset: 0, zIndex: 3,
      background: 'linear-gradient(to bottom, rgba(5,5,5,0.7) 0%, transparent 18%, transparent 78%, rgba(5,5,5,1) 100%)',
      WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, #000 52%, transparent 100%)',
      maskImage: 'linear-gradient(to bottom, #000 0%, #000 52%, transparent 100%)'
    } }),
    React.createElement('div', { ref: contentRef, style: {
      position: 'relative', zIndex: 4, textAlign: 'left', padding: '0 var(--gutter)', width: '100%',
      maxWidth: '1400px', marginTop: '-30px', opacity: loaded ? 1 : 0,
      transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1)', willChange: 'transform, opacity'
    } },
      React.createElement('h1', { ref: h1Ref, className: 'hero-h1', style: {
        margin: '0 0 clamp(40px, 5vh, 64px)', ...H1_SIZE, fontSize: 'clamp(28px, 3.56vw, 57px)',
        lineHeight: 1.0, letterSpacing: '-0.03em', opacity: loaded ? 1 : 0,
        transform: loaded ? 'translateY(0)' : 'translateY(14px)',
        transition: 'opacity 0.85s ease 0.4s, transform 0.85s cubic-bezier(0.16,1,0.3,1) 0.4s',
        willChange: 'transform, opacity'
      } },
        React.createElement('span', { className: 'hero-line', key: lang, ref: lineRef, lang: lang === 'TR' ? 'tr' : 'en' },
          React.createElement('span', { className: 'hero-caret', ref: caretRef }),
          React.createElement('span', { style: { color: '#f2f0ec' } },
            headHead && React.createElement(React.Fragment, null, React.createElement(KineticHead, { text: headHead }), ' '),
            React.createElement('span', { className: 'hero-tail' }, React.createElement(KineticHead, { text: headTail }))
          )
        )
      ),
      React.createElement('div', { className: 'hero-actions', style: {
        opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.85s ease 0.4s, transform 0.85s cubic-bezier(0.16,1,0.3,1) 0.4s',
        willChange: 'transform, opacity'
      } },
        ctaStyle === 'solid'
          ? React.createElement(React.Fragment, null,
              React.createElement(HeroCtaSolid, { label: t('hero.explore'), lang: lang === 'TR' ? 'tr' : 'en', onClick: () => setView('works') }),
              React.createElement(HeroCta, { play: true, label: t('hero.showreel'), lang: lang === 'TR' ? 'tr' : 'en', onClick: () => window.RBRouter.openShowreel() })
            )
          : React.createElement(React.Fragment, null,
              React.createElement(HeroCta, { orange: true, label: t('hero.showreel'), lang: lang === 'TR' ? 'tr' : 'en', onClick: () => window.RBRouter.openShowreel() }),
              React.createElement('span', { className: 'hero-cta-divider', 'aria-hidden': 'true' }),
              React.createElement(HeroCta, { primary: true, label: t('hero.explore'), lang: lang === 'TR' ? 'tr' : 'en', onClick: () => setView('works') })
            )
      )
    ),
    React.createElement('div', { ref: socialsRef, className: 'hero-socials',
      'data-line-pulse': linePulse ? (linePulse % 2 ? 'a' : 'b') : undefined,
      style: {
        opacity: isMobile ? (loaded ? (socialGlow === 'dim' ? 0.45 : 1) : 0) : (socialGlow === 'dim' ? 0.45 : 1),
        transition: isMobile ? 'opacity 0.85s ease 0.4s' : 'opacity 0.4s ease'
      }
    },
      [
        { label: 'Vimeo', icon: React.createElement(IconVimeo, null), href: 'https://vimeo.com/robust' },
        { label: 'Instagram', icon: React.createElement(IconInstagram, null), href: 'https://www.instagram.com/robust.film/?hl=tr' },
        { label: 'LinkedIn', icon: React.createElement(IconLinkedIn, null), href: 'https://www.linkedin.com/company/robustfims' }
      ].map(({ label, icon, href }) => React.createElement(SocialAnchor, { key: label, label, icon, href, onActivate: () => setLinePulse((n) => n + 1) }))
    ),
    React.createElement('div', { className: 'hero-scrollcue' },
      React.createElement('span', { className: 'hero-scrollcue-text', style: { fontFamily: "'Space Grotesk'", fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase' } }, t('hero.scroll')),
      React.createElement('div', { className: 'hero-scrollcue-line', style: { width: '1px', height: '36px', background: 'linear-gradient(to bottom, #ffffff, transparent)', animation: 'rb-scroll 2.2s ease-in-out infinite' } }),
      React.createElement('span', { className: 'hero-scrollcue-arrow', 'aria-hidden': 'true' }, '\u21C2')
    )
  );
}

function HeroCtaSolid({ label, onClick, lang }) {
  const [hov, setHov] = useState(false);
  const magRef = useMagnetic(0.12);
  return React.createElement('button', {
    ref: magRef, onClick, lang, onMouseEnter: () => setHov(true), onMouseLeave: () => setHov(false),
    style: {
      fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', fontWeight: 600, letterSpacing: '0.18em',
      textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '12px',
      padding: '15px 30px', borderRadius: '999px', whiteSpace: 'nowrap', cursor: 'none',
      color: '#050505', background: 'var(--orange)', border: '1px solid var(--orange)',
      boxShadow: hov ? '0 16px 42px -12px rgba(255,69,0,0.7)' : '0 8px 24px -14px rgba(255,69,0,0.55)',
      transition: 'box-shadow 0.35s ease'
    }
  }, label, React.createElement('span', { 'aria-hidden': 'true', style: {
    display: 'inline-block', fontSize: '15px', lineHeight: 1,
    transform: hov ? 'translateX(5px)' : 'translateX(0)', transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1)'
  } }, '\u21C0'));
}

function HeroCta({ label, primary, play, orange, noArrow, onClick, lang }) {
  const [hov, setHov] = useState(false);
  const magRef = useMagnetic(0.1);
  return React.createElement('button', {
    ref: magRef, onClick, lang,
    className: 'hero-cta' + (play ? ' hero-cta-play' : '') + (primary ? ' hero-cta-primary' : ''),
    onMouseEnter: () => setHov(true), onMouseLeave: () => setHov(false),
    style: {
      fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', fontWeight: 500, letterSpacing: '0.2em',
      textTransform: 'uppercase', background: 'none', border: 'none', padding: '8px 0',
      display: 'inline-flex', alignItems: 'center', gap: '12px', whiteSpace: 'nowrap', cursor: 'none',
      color: (play || orange) ? 'var(--orange)' : (hov ? 'var(--orange)' : 'var(--gray-3)'),
      transition: 'color 0.35s ease'
    }
  },
    play && React.createElement('span', { className: 'hero-cta-playbadge', 'aria-hidden': 'true' },
      React.createElement('svg', { width: '10', height: '12', viewBox: '0 0 10 12', fill: 'currentColor' },
        React.createElement('path', { d: 'M0 0L10 6L0 12V0Z' }))),
    React.createElement('span', { style: { position: 'relative', display: 'inline-block', color: (play || orange) ? 'var(--orange)' : 'inherit' } },
      label,
      React.createElement('span', { style: {
        position: 'absolute', left: 0, bottom: '-5px', height: '1px', width: '100%', background: 'currentColor',
        transform: hov ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left', transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1)'
      } })
    ),
    primary && !noArrow && React.createElement('span', { className: 'hero-cta-arrow', 'aria-hidden': 'true', style: {
      display: 'inline-block', fontSize: '15px', lineHeight: 1,
      transform: hov ? 'translateX(5px)' : 'translateX(0)', transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1)'
    } }, '\u21C0')
  );
}

function SocialAnchor({ label, icon, href, onActivate }) {
  const [hov, setHov] = useState(false);
  const external = !!href;
  return React.createElement('a', {
    href: href || '#', title: label, target: external ? '_blank' : undefined,
    rel: external ? 'noopener noreferrer' : undefined,
    onClick: (e) => { if (!external) e.preventDefault(); onActivate && onActivate(); },
    onMouseEnter: () => setHov(true), onMouseLeave: () => setHov(false),
    style: {
      color: hov ? 'var(--orange)' : '#ffffff',
      transition: 'color 0.3s ease, filter 0.3s ease, transform 0.45s cubic-bezier(0.16,1,0.3,1)',
      filter: hov ? 'drop-shadow(0 0 5px rgba(var(--orange-rgb), 0.95)) drop-shadow(0 0 14px rgba(var(--orange-rgb), 0.6)) drop-shadow(0 0 28px rgba(var(--orange-rgb), 0.3))' : 'none',
      transform: hov ? 'translateY(-4px) scale(1.22)' : 'translateY(0) scale(1)',
      transformOrigin: 'center', display: 'flex', cursor: 'none'
    }
  }, icon);
}

function IconVimeo() {
  return React.createElement('svg', { width: '17', height: '17', viewBox: '0 0 24 24', fill: 'currentColor' },
    React.createElement('path', { d: 'M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.612-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.478 4.807z' }));
}
function IconInstagram() {
  return React.createElement('svg', { width: '17', height: '17', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.6', strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('rect', { x: '2', y: '2', width: '20', height: '20', rx: '5', ry: '5' }),
    React.createElement('circle', { cx: '12', cy: '12', r: '4' }),
    React.createElement('circle', { cx: '17.5', cy: '6.5', r: '0.7', fill: 'currentColor', stroke: 'none' }));
}
function IconLinkedIn() {
  return React.createElement('svg', { width: '17', height: '17', viewBox: '0 0 24 24', fill: 'currentColor' },
    React.createElement('path', { d: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z' }),
    React.createElement('rect', { x: '2', y: '9', width: '4', height: '12' }),
    React.createElement('circle', { cx: '4', cy: '4', r: '2' }));
}

Object.assign(window, { Hero });
})();
