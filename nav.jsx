// nav.jsx — Fixed top navigation + mobile fullscreen menu
const { useState, useEffect } = React;

// Each nav item keeps a stable id (used for routing) + a translation key (used for display).
const NAV_ITEMS = [
  { id: 'Studio',      key: 'nav.studio' },
  { id: 'Works',       key: 'nav.works' },
  { id: 'Services',    key: 'nav.services' },
  { id: 'Get In Touch', key: 'nav.contact' },
];

// Menu social icons (inherit currentColor)
function MmVimeo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.612-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.478 4.807z" />
    </svg>);
}
function MmInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <circle cx="12" cy="12" r="4"></circle>
      <circle cx="17.5" cy="6.5" r="0.7" fill="currentColor" stroke="none"></circle>
    </svg>);
}
function MmLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12"></rect>
      <circle cx="4" cy="4" r="2"></circle>
    </svg>);
}

function Nav({ view, setView, scrollToSection }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang] = useLang();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    if (!menuOpen) return;
    // Lock background scroll WITHOUT any layout change. Toggling overflow/position
    // on <html>/<body> reflows the page, and on mobile that reflow (dynamic toolbar
    // / viewport recompute) shifted the still-visible fixed nav — the logo, lang
    // switch and burger jumped upward as the menu faded in. A non-passive
    // touchmove/wheel guard freezes scrolling with zero geometry change instead.
    const prevent = (e) => {
      const menu = document.querySelector('.mmenu');
      // let the menu itself scroll on short viewports where it overflows
      if (menu && menu.contains(e.target) && menu.scrollHeight > menu.clientHeight) return;
      e.preventDefault();
    };
    window.addEventListener('touchmove', prevent, { passive: false });
    window.addEventListener('wheel', prevent, { passive: false });
    return () => {
      window.removeEventListener('touchmove', prevent, { passive: false });
      window.removeEventListener('wheel', prevent, { passive: false });
      document.body.classList.remove('menu-open');
    };
  }, [menuOpen]);

  const handleNavClick = (item) => {
    setMenuOpen(false);
    if (item === 'Works') {
      setView('works');
    } else if (item === 'Studio') {
      setView('home');
      scrollToSection && scrollToSection('about');
    } else if (item === 'Services') {
      setView('home');
      scrollToSection && scrollToSection('services');
    } else if (item === 'Get In Touch') {
      setView('home');
      scrollToSection && scrollToSection('contact');
    }
  };

  return (
    <>
      <nav className={`rb-nav${scrolled ? ' scrolled' : ''}`}>
        {/* Logo — swap src for "Asset 2.png" when the real file is uploaded */}
        <div
          onClick={() => { setMenuOpen(false); setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          style={{ display: 'flex', alignItems: 'center', cursor: 'none', position: 'relative', zIndex: 2600 }}
        >
          <LogoMark />
        </div>

        {/* Desktop links — centered */}
        <div className="rb-nav-links">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.id}
              label={rbT(item.key, lang)}
              active={item.id === 'Works' && view === 'works'}
              onClick={() => handleNavClick(item.id)}
            />
          ))}
        </div>

        {/* Right side — language switch + mobile burger */}
        <div className="rb-nav-right">
          <LangSwitch />
          <button
            className={`rb-burger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
            style={{ cursor: 'none' }}
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile fullscreen menu */}
      <div className={`mmenu${menuOpen ? ' open' : ''}`}>
        <button className="mmenu-close" onClick={() => setMenuOpen(false)} aria-label="Kapat" style={{ cursor: 'none' }}>✕</button>
        <div className="mmenu-lang-top"><LangSwitch /></div>
        <nav className="mmenu-list">
          {NAV_ITEMS.map((item, i) => (
            <button
              key={item.id}
              className="mmenu-link"
              style={{ '--mm-delay': `${0.08 + i * 0.07}s`, cursor: 'none' }}
              onClick={() => handleNavClick(item.id)}
            >
              <span className="mm-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="mm-label">{rbT(item.key, lang)}</span>
            </button>
          ))}
        </nav>
        <div className="mmenu-foot">
          <div className="mmenu-socials">
            <a className="mmenu-social" href="https://vimeo.com/robust" target="_blank" rel="noopener noreferrer" aria-label="Vimeo" style={{ cursor: 'none' }}><MmVimeo /></a>
            <a className="mmenu-social" href="https://www.instagram.com/robust.film/?hl=tr" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ cursor: 'none' }}><MmInstagram /></a>
            <a className="mmenu-social" href="https://www.linkedin.com/company/robustfims" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ cursor: 'none' }}><MmLinkedIn /></a>
          </div>
          <a className="mmenu-mail" href="mailto:contact@robust.film" style={{ cursor: 'none' }}>contact@robust.film</a>
        </div>
      </div>
    </>
  );
}

function LangSwitch() {
  const [lang, setLang] = useLang();
  return (
    <div className="rb-lang" aria-label="Language">
      {RB_LANGS.map((l, i) => (
        <React.Fragment key={l}>
          {i === 1 && <span style={{ color: '#2e2e2e', fontSize: '11px', fontFamily: "'Space Grotesk', sans-serif" }}>/</span>}
          <button
            onClick={() => setLang(l)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'none',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '11px',
              letterSpacing: '0.18em',
              fontWeight: lang === l ? 600 : 400,
              color: lang === l ? 'var(--orange)' : '#555555',
              transition: 'color 0.3s ease',
              padding: '4px 2px',
            }}
          >{l}</button>
        </React.Fragment>
      ))}
    </div>
  );
}

function NavLink({ label, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  const lit = hovered || active;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'none',
        border: 'none',
        color: lit ? 'var(--orange)' : 'rgba(255,255,255,0.7)',
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 500,
        fontSize: '12px',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        cursor: 'none',
        transition: 'color 0.3s ease',
        padding: '4px 0',
        position: 'relative',
      }}
    >
      {label}
      <span style={{
        position: 'absolute',
        bottom: 0, left: 0,
        height: '1px',
        background: 'var(--orange)',
        width: lit ? '100%' : '0',
        transition: 'width 0.35s cubic-bezier(0.16,1,0.3,1)',
        boxShadow: lit ? '0 0 6px rgba(var(--orange-rgb), 0.7)' : 'none',
      }}></span>
    </button>
  );
}

function LogoMark({ size = 17, color = '#ffffff' }) {
  // Official ROBUST wordmark — viewBox 850.41 × 112.79 (≈7.54:1)
  return (
    <svg height={size} width={size * 7.54} viewBox="0 0 850.41 112.79" fill={color} xmlns="http://www.w3.org/2000/svg" aria-label="Robust">
      <path d="M104.33,78.64l20.21,32.58h-33.21l-17.7-29.29H28.2v29.29H0V1.57h86.16c24.91,0,41.98,15.82,41.98,40.26,0,17.86-9.09,31.02-23.81,36.81ZM28.2,58.27h50.13c8.46,0,21.62,0,21.62-16.45s-13.16-16.6-21.62-16.6H28.2v33.05Z"></path>
      <path d="M135.81,56.24C135.81,19.89,156.48,0,204.73,0s68.92,20.05,68.92,56.24-20.83,56.55-68.92,56.55-68.92-20.05-68.92-56.55ZM245.46,56.24c0-22.24-11.28-32.58-40.73-32.58s-40.73,10.18-40.73,32.58,11.44,32.9,40.73,32.9,40.73-10.5,40.73-32.9Z"></path>
      <path d="M419.8,79.26c0,18.48-10.81,31.96-35.72,31.96h-100.25V1.57h96.49c24.91,0,32.58,12.69,32.58,28.82,0,7.68-3.13,15.2-8.62,21.3,9.4,5.8,15.51,14.88,15.51,27.57ZM312.03,44.64h58.27c7.52,0,14.41,0,14.41-11.43s-6.89-11.28-14.57-11.28h-58.12v22.71ZM391.61,77.85c0-11.59-6.89-11.59-14.41-11.59h-65.17v23.18h65.17c7.52,0,14.41,0,14.41-11.59Z"></path>
      <path d="M496.55,112.79c-48.25,0-68.92-18.33-68.92-56.55V1.57h28.2v54.67c0,15.35,4.23,32.9,40.73,32.9s40.73-17.7,40.73-32.9V1.57h28.2v54.67c0,38.07-20.83,56.55-68.92,56.55Z"></path>
      <path d="M603.85,73.47c0,11.59,9.4,16.92,45.11,16.92,29.61,0,38.54-3.29,38.54-11.91,0-9.08-6.27-10.65-41.82-12.38-47.78-2.19-66.73-9.71-66.73-34.31S603.54,0,644.58,0s66.42,10.34,66.42,37.44h-28.2c0-12.06-12.06-15.04-41.35-15.04-27.73,0-34.31,2.66-34.31,10.81s6.58,10.03,38.54,11.91c43.23,2.35,70.02,4.7,70.02,32.43,0,29.29-27.73,35.25-68.3,35.25-44.96,0-71.74-7.68-71.74-39.32h28.2Z"></path>
      <path d="M850.41,25.22h-53.26v86h-28.2V25.22h-53.26V1.57h134.72v23.65Z"></path>
    </svg>
  );
}

Object.assign(window, { Nav, LogoMark });
