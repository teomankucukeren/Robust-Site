// hero.jsx — Full-screen cinematic hero: soft-focus entrance + scroll parallax
const { useState, useEffect, useRef, useLayoutEffect } = React;

function Hero({ setView, tw = {} }) {
  const headlineSize = tw.headlineSize || 'default';
  const headlineMode = tw.headlineMode || 'statement';
  const showEyebrow = tw.showEyebrow !== false;
  const ctaStyle = tw.ctaStyle || 'links';
  const socialGlow = tw.socialGlow || 'bright';
  const eyebrowText = tw.eyebrowText || 'Independent film & visual studio — İstanbul';

  const H1_SIZE = {
    default: { fontSize: 'clamp(38px, 7vw, 104px)', whiteSpace: 'nowrap', lineHeight: 1.0 },
    large:   { fontSize: 'clamp(44px, 8.5vw, 132px)', whiteSpace: 'nowrap', lineHeight: 1.0 },
    huge:    { fontSize: 'clamp(50px, 10.5vw, 168px)', whiteSpace: 'normal', lineHeight: 0.96 }
  }[headlineSize];

  const [loaded, setLoaded] = useState(false);
  const [entered, setEntered] = useState(false);
  const [showreel, setShowreel] = useState(false);
  const [linePulse, setLinePulse] = useState(0);
  const contentRef = useRef(null);
  const h1Ref = useRef(null);
  const WO = window.WorkOverlay;

  useEffect(() => {
    const t = setTimeout(() => {
      setLoaded(true);
      // direct-DOM fallback so the hero can never stay hidden if a re-render is lost
      if (contentRef.current) contentRef.current.style.opacity = '1';
    }, 120);
    return () => clearTimeout(t);
  }, []);

  // Entrance — characters condense out of soft focus.
  // No hard masks, no sharp cuts: opacity + blur + gentle rise, long ease.
  useLayoutEffect(() => {
    const h1 = h1Ref.current;
    if (!h1) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const chars = h1.querySelectorAll('.kchar');
    if (!window.gsap || reduce || chars.length === 0) {
      setEntered(true);
      return;
    }
    window.gsap.set(chars, { opacity: 0, y: 22, filter: 'blur(12px)' });
    const tween = window.gsap.to(chars, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 1.7,
      ease: 'power3.out',
      stagger: { each: 0.024 },
      delay: 0.35,
      clearProps: 'all',
      onComplete: () => setEntered(true)
    });
    return () => tween.kill();
  }, []);

  // Scroll parallax: manifesto drifts up + fades as you scroll past
  useEffect(() => {
    let raf = null;
    const update = () => {
      raf = null;
      const el = contentRef.current;
      if (!el) return;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const p = Math.min(1, y / (vh * 0.9));
      el.style.transform = `translateY(${y * -0.22}px)`;
      el.style.opacity = String(Math.max(0, Math.min(1, 1 - p * 1.1)));
    };
    const onScroll = () => {if (!raf) raf = requestAnimationFrame(update);};
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const lineCls = `hero-line${entered ? ' entered' : ''}`;

  return (
    <section id="hero" style={{
      position: 'relative',
      width: '100%',
      height: '100svh',
      minHeight: '560px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      paddingBottom: 'calc(clamp(96px, 15vh, 184px) - 70px)'
    }}>
      {/* Radial vignette */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        background: 'radial-gradient(ellipse at 50% 40%, rgba(5,5,5,0) 0%, rgba(5,5,5,0.5) 55%, rgba(5,5,5,0.96) 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, #000 52%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, #000 0%, #000 52%, transparent 100%)'
      }}></div>
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3,
        background: 'linear-gradient(to bottom, rgba(5,5,5,0.7) 0%, transparent 18%, transparent 78%, rgba(5,5,5,1) 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, #000 52%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, #000 0%, #000 52%, transparent 100%)'
      }}></div>

      {/* Central manifesto */}
      <div ref={contentRef} style={{
        position: 'relative', zIndex: 4,
        textAlign: 'left',
        padding: '0 var(--gutter)',
        width: '100%',
        maxWidth: '1400px',
        opacity: loaded ? 1 : 0,
        transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1)',
        willChange: 'transform, opacity'
      }}>
        {showEyebrow &&
          <div className="hero-kicker" style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 1s ease 0.5s, transform 1s cubic-bezier(0.16,1,0.3,1) 0.5s'
          }}>{eyebrowText}</div>
        }

        <h1 ref={h1Ref} className="hero-h1" style={{ margin: '0 0 clamp(40px, 5vh, 64px)', ...H1_SIZE, fontSize: 'clamp(30px, 4.4vw, 76px)' }}>
          <span className={lineCls}>
            <HeadlineTyper prefix="We shape ideas into " words={['stories', 'motion', 'visuals']} />
          </span>
        </h1>

        <div className="hero-actions" style={{
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 1.1s ease 1.3s, transform 1.1s cubic-bezier(0.16,1,0.3,1) 1.3s'
        }}>
          {ctaStyle === 'solid' ?
            <>
              <HeroCtaSolid label="Explore the Work" onClick={() => setView('works')} />
              <HeroCta play label="Showreel" onClick={() => setShowreel(true)} />
            </> :
            <>
              <HeroCta primary label="Explore the Work" onClick={() => setView('works')} />
              <HeroCta play label="Showreel" onClick={() => setShowreel(true)} />
            </>
          }
        </div>
      </div>

      {/* Social anchors — right rail, clear orange accent */}
      <div className="hero-socials" data-line-pulse={linePulse ? (linePulse % 2 ? 'a' : 'b') : undefined}
        style={{ opacity: socialGlow === 'dim' ? 0.45 : 1, transition: 'opacity 0.4s ease' }}>
        {[
        { label: 'Vimeo', icon: <IconVimeo />, href: 'https://vimeo.com/robust' },
        { label: 'Instagram', icon: <IconInstagram />, href: 'https://www.instagram.com/robust.film/?hl=tr' },
        { label: 'LinkedIn', icon: <IconLinkedIn /> }].
        map(({ label, icon, href }) =>
        <SocialAnchor key={label} label={label} icon={icon} href={href} onActivate={() => setLinePulse((n) => n + 1)} />
        )}
      </div>

      {/* Scroll cue */}
      <div className="hero-scrollcue">
        <span style={{ fontFamily: "'Space Grotesk'", fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase' }}>Scroll</span>
        <div style={{ width: '1px', height: '36px', background: 'linear-gradient(to bottom, #ffffff, transparent)', animation: 'rb-scroll 2.2s ease-in-out infinite' }}></div>
      </div>

      {/* Showreel overlay */}
      {showreel && WO &&
      <WO
        work={{ title: 'Showreel', client: 'Robust', type: 'Studio Reel', year: '2019', vimeoId: '374179028' }}
        big
        links={[
          { label: 'Selected Works', onClick: () => {
              setShowreel(false);
              setTimeout(() => {
                const el = document.getElementById('works-vitrin');
                if (el) {
                  const top = el.getBoundingClientRect().top + window.scrollY - 80;
                  window.scrollTo({ top, behavior: 'instant' });
                  window.__rbFunnelSnapUntil = performance.now() + 300;
                }
              }, 420);
            } },
          { label: 'Archive', onClick: () => { setShowreel(false); setTimeout(() => setView('works'), 420); } }
        ]}
        onClose={() => setShowreel(false)} />
      }
    </section>);

}

/* ── Headline typewriter — types white prefix, then orange rotating word, one caret ── */
function HeadlineTyper({ prefix, words }) {
  const [prefixShown, setPrefixShown] = useState(0);
  const [orange, setOrange] = useState('');
  const stateRef = useRef({ phase: 'prefix', pi: 0, wordIndex: 0, char: 0 });

  useEffect(() => {
    const full = (idx) => words[idx] + '.';
    const START = 450, PTYPE = 55, WTYPE = 90, DELETE = 45, HOLD = 2100, PAUSE = 350;
    let timeout;
    const tick = () => {
      const s = stateRef.current;
      if (s.phase === 'prefix') {
        s.pi++;
        setPrefixShown(s.pi);
        if (s.pi >= prefix.length) {
          s.phase = 'typeWord';
          timeout = setTimeout(tick, 220);
        } else {
          timeout = setTimeout(tick, PTYPE);
        }
      } else if (s.phase === 'typeWord') {
        const w = full(s.wordIndex);
        s.char++;
        setOrange(w.slice(0, s.char));
        if (s.char >= w.length) {
          s.phase = 'delete';
          timeout = setTimeout(tick, HOLD);
        } else {
          timeout = setTimeout(tick, WTYPE);
        }
      } else if (s.phase === 'delete') {
        const w = full(s.wordIndex);
        s.char--;
        setOrange(w.slice(0, s.char));
        if (s.char <= 0) {
          s.wordIndex = (s.wordIndex + 1) % words.length;
          s.phase = 'typeWord';
          timeout = setTimeout(tick, PAUSE);
        } else {
          timeout = setTimeout(tick, DELETE);
        }
      }
    };
    timeout = setTimeout(tick, START);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <span style={{ whiteSpace: 'nowrap' }}>
      <span className="ht-prefix" style={{ color: '#ffffff' }}>{prefix.slice(0, prefixShown)}</span>
      <span style={{ color: 'var(--orange)', fontFamily: 'var(--f-display)', fontWeight: 700, letterSpacing: '-0.025em' }}>{orange}</span>
      <span aria-hidden="true" style={{
        display: 'inline-block', width: '0.055em', height: '0.92em',
        background: 'var(--orange)', marginLeft: '0.04em',
        transform: 'translateY(0.06em)',
        animation: 'rb-caret-blink 1.05s steps(1) infinite'
      }}></span>
    </span>);
}




/* ── Solid primary CTA — filled orange pill, stronger affordance ── */
function HeroCtaSolid({ label, onClick }) {
  const [hov, setHov] = useState(false);
  const magRef = useMagnetic(0.12);
  return (
    <button ref={magRef} onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', fontWeight: 600,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        display: 'inline-flex', alignItems: 'center', gap: '12px',
        padding: '15px 30px', borderRadius: '999px', whiteSpace: 'nowrap', cursor: 'none',
        color: '#050505', background: 'var(--orange)', border: '1px solid var(--orange)',
        boxShadow: hov ? '0 16px 42px -12px rgba(255,69,0,0.7)' : '0 8px 24px -14px rgba(255,69,0,0.55)',
        transition: 'box-shadow 0.35s ease'
      }}>
      {label}
      <span aria-hidden="true" style={{
        display: 'inline-block', fontSize: '15px', lineHeight: 1,
        transform: hov ? 'translateX(5px)' : 'translateX(0)',
        transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1)'
      }}>⇀</span>
    </button>);
}

/* ── Hero CTAs — plain text links (no boxes), animated underline ── */
function HeroCta({ label, primary, play, onClick }) {
  const [hov, setHov] = useState(false);
  const magRef = useMagnetic(0.1);

  return (
    <button ref={magRef} onClick={onClick}
    onMouseEnter={() => setHov(true)}
    onMouseLeave={() => setHov(false)}
    style={{
      fontFamily: "'Space Grotesk', sans-serif",
      fontSize: '13px',
      fontWeight: 500,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      background: 'none',
      border: 'none',
      padding: '8px 0',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '12px',
      whiteSpace: 'nowrap',
      cursor: 'none',
      color: primary ? 'var(--orange)' : hov ? 'var(--orange)' : '#ffffff',
      transition: 'color 0.35s ease'
    }}>
      <span style={{ position: 'relative', display: 'inline-block' }}>
        {label}
        <span style={{
          position: 'absolute', left: 0, bottom: '-5px',
          height: '1px', width: '100%',
          background: 'currentColor',
          transform: hov ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1)'
        }}></span>
      </span>
      {primary &&
      <span aria-hidden="true" style={{
        display: 'inline-block', fontSize: '15px', lineHeight: 1,
        transform: hov ? 'translateX(5px)' : 'translateX(0)',
        transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1)'
      }}>⇀</span>
      }
    </button>);

}

function SocialAnchor({ label, icon, href, onActivate }) {
  const [hov, setHov] = useState(false);
  const external = !!href;
  return (
    <a href={href || '#'} title={label}
    target={external ? '_blank' : undefined}
    rel={external ? 'noopener noreferrer' : undefined}
    onClick={(e) => { if (!external) e.preventDefault(); onActivate && onActivate(); }}
    onMouseEnter={() => setHov(true)}
    onMouseLeave={() => setHov(false)}
    style={{
      color: hov ? 'var(--orange)' : '#ffffff',
      transition: 'color 0.3s ease, filter 0.3s ease, transform 0.45s cubic-bezier(0.16,1,0.3,1)',
      filter: hov ? 'drop-shadow(0 0 5px rgba(var(--orange-rgb), 0.95)) drop-shadow(0 0 14px rgba(var(--orange-rgb), 0.6)) drop-shadow(0 0 28px rgba(var(--orange-rgb), 0.3))' : 'none',
      transform: hov ? 'translateY(-4px) scale(1.22)' : 'translateY(0) scale(1)',
      transformOrigin: 'center',
      display: 'flex',
      cursor: 'none'
    }}>
      {icon}
    </a>);

}

function IconVimeo() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.612-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.478 4.807z" />
    </svg>);

}
function IconInstagram() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <circle cx="12" cy="12" r="4"></circle>
      <circle cx="17.5" cy="6.5" r="0.7" fill="currentColor" stroke="none"></circle>
    </svg>);

}
function IconLinkedIn() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12"></rect>
      <circle cx="4" cy="4" r="2"></circle>
    </svg>);

}

Object.assign(window, { Hero });
