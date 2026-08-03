/* project-case.jsx — derlenmiş. Kaynağı kök dizinde düzenle, sonra yeniden derle. */
(function(){
// project-case.jsx — full-screen editorial case-study page for DESIGN works
// Opens in place of the video overlay when a work carries a `gallery` array.
const {
  useState,
  useEffect,
  useRef
} = React;
function ProjectCase({
  work,
  onClose,
  onNav,
  instant
}) {
  const [lang] = useLang();
  // `instant`: reached by prev/next from an already-open overlay — render at full
  // opacity so nothing flashes through underneath.
  const [vis, setVis] = useState(!!instant);
  const scrollerRef = useRef(null);
  const bg = work.caseBg || 'var(--orange)';
  const fg = work.caseFg || '#050505';
  const bgStyle = work.caseTexture ? {
    backgroundColor: bg,
    backgroundImage: `url(${work.caseTexture})`,
    backgroundSize: '380px auto',
    backgroundRepeat: 'repeat'
  } : {
    background: bg
  };
  // Pick a cursor that reads against the background: light bg → dark cursor.
  const lightText = fg.toLowerCase() === '#ffffff' || fg.toLowerCase() === '#fff' || fg.toLowerCase() === 'white';
  const close = () => {
    setVis(false);
    setTimeout(onClose, 400);
  };
  useEffect(() => {
    const id = setTimeout(() => setVis(true), 12);
    document.body.style.overflow = 'hidden';
    const cursorClass = lightText ? 'cursor-light' : 'cursor-dark';
    document.body.classList.add(cursorClass);
    const onKey = e => {
      if (e.key === 'Escape') close();
    };
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

  // aboutTR is only filled in for a few case studies so far — fall back to the
  // English about text, and tag which language actually ended up on screen so
  // the uppercase kicker/labels don't get the wrong casing rule.
  const aboutText = lang === 'TR' && work.aboutTR ? work.aboutTR : work.about;
  const aboutLang = lang === 'TR' && work.aboutTR ? 'tr' : 'en';
  const aboutParas = aboutText ? aboutText.split('\n\n').filter(Boolean) : [];
  const uiLang = lang === 'TR' ? 'tr' : 'en';
  const meta = [{
    l: rbT('pcase.client', lang),
    v: work.client
  }, {
    l: rbT('pcase.designer', lang),
    v: work.designer
  }, {
    l: rbT('pcase.year', lang),
    v: work.year
  }, {
    l: rbT('pcase.role', lang),
    v: work.role
  }].filter(m => m.v);
  return /*#__PURE__*/React.createElement("div", {
    ref: scrollerRef,
    className: `pcase${[29, 30].includes(work.id) ? ' pcase--tight' : ''}`,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 10000,
      ...bgStyle,
      color: fg,
      '--pc-fg': fg,
      '--pc-bg': bg,
      overflowY: 'auto',
      overflowX: 'hidden',
      opacity: vis ? 1 : 0,
      transition: 'opacity 0.4s ease'
    }
  }, onNav && /*#__PURE__*/React.createElement(PCaseNav, {
    side: "left",
    glyph: "\u21BC",
    color: fg,
    onClick: () => onNav(-1)
  }), onNav && /*#__PURE__*/React.createElement(PCaseNav, {
    side: "right",
    glyph: "\u21C0",
    color: fg,
    onClick: () => onNav(1)
  }), /*#__PURE__*/React.createElement("div", {
    className: "gutter",
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: '26px',
      paddingBottom: '26px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: `color-mix(in oklab, ${bg} 88%, transparent)`,
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid color-mix(in oklab, var(--pc-fg) 16%, transparent)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: close,
    style: {
      background: 'none',
      border: 'none',
      padding: 0,
      fontFamily: "'Space Grotesk'",
      fontWeight: 600,
      fontSize: '13px',
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: fg,
      cursor: 'none'
    }
  }, "Robust"), /*#__PURE__*/React.createElement(PCaseClose, {
    onClick: close,
    color: fg
  })), /*#__PURE__*/React.createElement("div", {
    className: "gutter",
    style: {
      paddingTop: 'clamp(48px, 9vh, 104px)',
      paddingBottom: 'clamp(28px, 4vh, 48px)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow",
    lang: "en",
    style: {
      color: fg
    }
  }, work.type), /*#__PURE__*/React.createElement("h1", {
    className: "display-xl",
    style: {
      marginTop: '16px',
      maxWidth: '18ch',
      color: fg
    }
  }, work.title), /*#__PURE__*/React.createElement("div", {
    className: "pcase-meta"
  }, meta.map(m => /*#__PURE__*/React.createElement("div", {
    key: m.l,
    className: "pcase-meta-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pcase-meta-label",
    lang: uiLang
  }, m.l), /*#__PURE__*/React.createElement("div", {
    className: "pcase-meta-value"
  }, m.v))))), work.stacked ? /*#__PURE__*/React.createElement(React.Fragment, null, work.about && /*#__PURE__*/React.createElement("div", {
    className: "gutter pcase-about"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pcase-about-kicker",
    lang: uiLang
  }, rbT('pcase.overview', lang)), /*#__PURE__*/React.createElement("div", {
    lang: aboutLang
  }, aboutParas.map((p, i) => /*#__PURE__*/React.createElement("p", {
    key: i,
    className: "pcase-about-body",
    style: i > 0 ? {
      marginTop: '1.1em'
    } : undefined
  }, p)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 var(--gutter)',
      marginTop: 'clamp(12px, 3vh, 40px)',
      paddingBottom: 'clamp(60px, 10vh, 140px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      lineHeight: 0,
      maxWidth: 'min(1120px, 94vw)',
      margin: '0 auto'
    }
  }, gallery.map((src, i) => /*#__PURE__*/React.createElement(PCaseImg, {
    key: i,
    src: src,
    priority: i === 0
  }))))) : /*#__PURE__*/React.createElement(React.Fragment, null, hero && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 var(--gutter)',
      marginTop: 'clamp(12px, 3vh, 40px)'
    }
  }, /*#__PURE__*/React.createElement(PCaseImg, {
    src: hero,
    priority: true
  })), work.about && /*#__PURE__*/React.createElement("div", {
    className: "gutter pcase-about"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pcase-about-kicker",
    lang: uiLang
  }, rbT('pcase.overview', lang)), /*#__PURE__*/React.createElement("div", {
    lang: aboutLang
  }, aboutParas.map((p, i) => /*#__PURE__*/React.createElement("p", {
    key: i,
    className: "pcase-about-body",
    style: i > 0 ? {
      marginTop: '1.1em'
    } : undefined
  }, p)))), rest.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "gutter",
    style: {
      paddingBottom: 'clamp(60px, 10vh, 140px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pcase-collage"
  }, rest.map((src, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "pcase-collage-item"
  }, /*#__PURE__*/React.createElement(PCaseImg, {
    src: src
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "gutter pcase-footer"
  }, /*#__PURE__*/React.createElement(PCaseClose, {
    onClick: close,
    label: rbT('pcase.back', lang),
    color: fg
  })));
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
function optimize(src, w) {
  return rbImg(src, w);
}

/* Images load straight from jsDelivr — a real CDN that handles concurrent
   requests reliably. A cached image can fire `load` before React attaches the
   handler, leaving it stuck invisible — so we also check `complete` on mount. */
function PCaseImg({
  src,
  priority
}) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth > 0) setLoaded(true);
  }, [src]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      overflow: 'hidden',
      background: 'rgba(5,5,5,0.07)',
      minHeight: loaded ? 0 : '30vh'
    }
  }, /*#__PURE__*/React.createElement("img", {
    ref: imgRef,
    src: src,
    alt: "",
    loading: "eager",
    decoding: "async",
    fetchpriority: priority ? 'high' : 'auto',
    onLoad: () => setLoaded(true),
    style: {
      display: 'block',
      width: '100%',
      height: 'auto',
      opacity: loaded ? 1 : 0,
      transform: loaded ? 'scale(1)' : 'scale(1.015)',
      transition: 'opacity 0.7s ease, transform 0.9s cubic-bezier(0.16,1,0.3,1)'
    }
  }));
}

/* Prev / next funnel arrows for a case page. Fixed to the viewport edges and
   coloured with the page's own foreground so they always contrast the artwork. */
function PCaseNav({
  side,
  glyph,
  color,
  onClick
}) {
  const [hov, setHov] = useState(false);
  const out = side === 'left' ? -1 : 1;
  return /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onClick();
    },
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    "aria-label": side === 'left' ? 'Previous project' : 'Next project',
    style: {
      position: 'fixed',
      top: '50%',
      [side]: 'clamp(14px, 2.4vw, 40px)',
      transform: `translateY(-50%) translateX(${hov ? out * 4 : 0}px)`,
      width: 'clamp(52px, 4.4vw, 68px)',
      height: 'clamp(52px, 4.4vw, 68px)',
      borderRadius: '50%',
      zIndex: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      cursor: 'none',
      userSelect: 'none',
      background: hov ? color : `color-mix(in oklab, ${color} 10%, transparent)`,
      border: `1.5px solid color-mix(in oklab, ${color} ${hov ? 100 : 42}%, transparent)`,
      color: hov ? `color-mix(in oklab, ${color} 12%, #ffffff)` : color,
      fontSize: 'clamp(24px, 2.2vw, 32px)',
      lineHeight: 1,
      boxShadow: hov ? `0 8px 30px color-mix(in oklab, ${color} 30%, transparent)` : 'none',
      transition: 'color 0.22s ease, background 0.22s ease, border-color 0.22s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.22s ease'
    }
  }, glyph);
}
function PCaseClose({
  onClick,
  label,
  color = '#050505'
}) {
  const [lang] = useLang();
  const shownLabel = label || rbT('pcase.close', lang);
  const [hov, setHov] = useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    lang: lang === 'TR' ? 'tr' : 'en',
    style: {
      background: 'none',
      border: 'none',
      color: hov ? color : `color-mix(in oklab, ${color} 60%, transparent)`,
      fontFamily: "'Space Grotesk'",
      fontWeight: 600,
      fontSize: '12px',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      cursor: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: hov ? '13px' : '9px',
      transition: 'gap 0.32s cubic-bezier(0.16,1,0.3,1), color 0.24s'
    }
  }, shownLabel);
}
Object.assign(window, {
  ProjectCase,
  rbImg
});
})();
