/* services-contact.jsx — derlenmiş. Kaynağı kök dizinde düzenle, sonra yeniden derle. */
(function(){
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// services-contact.jsx — Services accordion + Contact form + Footer
const {
  useState,
  useEffect,
  useRef
} = React;
const SERVICES_DATA = [{
  num: '01',
  title: 'Film & Video Production',
  titleTR: 'Film & Video Prodüksiyonu',
  tags: ['Concept', 'Set', 'Delivery'],
  tagsTR: ['KONSEPT', 'SET', 'YAYIN'],
  desc: 'End-to-end film and video production across broadcast, digital, social, and out-of-home campaigns. Crafted from concept to final cut with a clear visual language and purpose.',
  descTR: 'TV, dijital, sosyal medya ve açıkhava kampanyaları için uçtan uca film ve video prodüksiyonu. Konseptten son kurguya kadar her projeyi, net bir görsel dil ve belirgin bir amaca odaklanarak işliyoruz.'
}, {
  num: '02',
  title: 'Animation & Motion Design',
  titleTR: 'Animasyon & Motion Design',
  tags: ['Rhythm', 'Clarity', 'Purpose'],
  tagsTR: ['RİTİM', 'NETLİK', 'ANLAM'],
  desc: 'We design animated visuals, motion graphics, and moving image systems that bring ideas to life beyond live-action. From brand animations to title sequences, explainers, and 2D/3D-led content, we craft motion with rhythm, clarity, and purpose.',
  descTR: 'Fikirleri klasik prodüksiyon sınırlarının ötesine taşıyan hareketli görsel sistemler ve motion grafikler tasarlıyoruz. Marka animasyonlarından jenerik tasarımlarına, explainer videolardan 2D/3D içeriklere kadar harekete ritim, netlik ve amaç katıyoruz.'
}, {
  num: '03',
  title: 'Campaign & Brand Content',
  titleTR: 'Kampanya & Marka İçerikleri',
  tags: ['Purpose', 'Consistency', 'Impact'],
  tagsTR: ['ANLATI', 'SÜREKLİLİK', 'ETKİ'],
  desc: 'Building campaign narratives and branded content systems for modern media ecosystems. Creating adaptable video frameworks that extend across launches, digital platforms, and social channels.',
  descTR: 'Modern medya ekosistemleri için kampanya kurguları ve marka içerik sistemleri tasarlıyoruz. Lansmanlardan dijital mecralara ve sosyal kanallara kadar genişleyen esnek video yapıları üretiyoruz.'
}, {
  num: '04',
  title: 'AI Film Making / Generative Production',
  titleTR: 'AI Film Yapımı / Generative Prodüksiyon',
  tags: ['Faster', 'Smarter', 'Distinct'],
  tagsTR: ['ÖZGÜN', 'HIZLI', 'TUTARLI'],
  desc: 'We explore AI-powered filmmaking as a new creative layer within visual production. From concept development and visual prototyping to generative scenes, AI-assisted workflows, and experimental film techniques, we use emerging tools to shape bold ideas faster, smarter, and with a distinct visual direction.',
  descTR: 'Üretken yapay zekâ araçlarını stüdyo vizyonumuzla harmanlayarak yapım süreçlerini yeniden tanımlıyoruz. Konsept aşamasından final kareye kadar; özgün, hızlı ve tutarlı görsel dünyalar kurguluyoruz.'
}, {
  num: '05',
  title: 'Visual Design / Art Direction',
  titleTR: 'Görsel Tasarım / Art Direction',
  tags: ['Mood', 'Composition', 'Identity'],
  tagsTR: ['ATMOSFER', 'KOMPOZİSYON', 'KİMLİK'],
  desc: 'Creating visual identities and art direction systems for brands, campaigns, and moving images. From brand guidelines to motion languages, building structured design frameworks across all platforms.',
  descTR: 'Markalar, kampanyalar ve hareketli dünyalar için görsel kimlikler ve art direction sistemleri tasarlıyoruz. Marka rehberlerinden hareket dillerine kadar, tüm mecralarda işleyen güçlü tasarım altyapıları kurguluyoruz.'
}];
function Services({
  layout = '01'
}) {
  // Desktop: '01' index · '02' cards · '03' accordion · '04' full-bleed ·
  // '05' quiet · '06' credits · '07' expanding panels · '08' ghost numerals ·
  // '09' cinema strip · '10' rack focus · '11' frames · '12' index accordion ·
  // '13' column accordion · '14' crosshair grid · '15' spotlight list ·
  // '16' showcase reel · '17' call sheet · 'list' original.
  // Tablet/mobile always the compact accordion.
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 961px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 961px)');
    const fn = e => setWide(e.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  // Phones (<761px) keep the original compact accordion; tablet + desktop get
  // the Split Directory (Concept C).
  const [phone, setPhone] = useState(() => window.matchMedia('(max-width: 760px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)');
    const fn = e => setPhone(e.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  const mode = layout === 'index' ? '01' : layout; // legacy stored value
  if (mode === '01' && wide) return /*#__PURE__*/React.createElement(ServicesIndex, null);
  if (mode === '02' && wide) return /*#__PURE__*/React.createElement(ServicesCards, null);
  if (mode === '03' && wide) return /*#__PURE__*/React.createElement(ServicesAccordionX, null);
  if (mode === '04' && wide) return /*#__PURE__*/React.createElement(ServicesFullBleed, null);
  if (mode === '05' && wide) return /*#__PURE__*/React.createElement(ServicesQuiet, null);
  if (mode === '06' && wide) return /*#__PURE__*/React.createElement(ServicesCredits, null);
  if (mode === '07' && wide) return /*#__PURE__*/React.createElement(ServicesPanels, null);
  if (mode === '08' && wide) return /*#__PURE__*/React.createElement(ServicesNumerals, null);
  if (mode === '09' && wide) return /*#__PURE__*/React.createElement(ServicesPanelsX, null);
  if (mode === '10' && wide) return /*#__PURE__*/React.createElement(ServicesFocus, null);
  if (mode === '11' && wide) return /*#__PURE__*/React.createElement(ServicesFrames, null);
  if (mode === '12' && wide) return /*#__PURE__*/React.createElement(ServicesIndexAcc, null);
  if (mode === '13' && wide) return /*#__PURE__*/React.createElement(ServicesColumns, null);
  if (mode === '14' && wide) return /*#__PURE__*/React.createElement(ServicesCrosshair, null);
  if (mode === '15' && wide) return /*#__PURE__*/React.createElement(ServicesSpotlight, null);
  if (mode === '16' && wide) return /*#__PURE__*/React.createElement(ServicesShowcase, null);
  if (mode === '17' && wide) return /*#__PURE__*/React.createElement(ServicesCallSheet, null);
  // Default ('list'): Split Directory on tablet + desktop, accordion on phones.
  if (!phone) return /*#__PURE__*/React.createElement(ServicesSplitC, null);
  return /*#__PURE__*/React.createElement(ServicesAccordion, null);
}

/* ── Desktop alternative 17: call sheet ──────────────────
   Shot-list table — service · description · keywords in hairline
   rows. Rows fade-rise in with a stagger while each row's hairline
   draws itself across the page. */
function ServicesCallSheet() {
  const [open, setOpen] = useState(0);
  return /*#__PURE__*/React.createElement("section", {
    id: "services",
    style: {
      marginTop: 'clamp(-150px, -12vh, -50px)',
      paddingTop: 'clamp(40px, 6vh, 84px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gutter shell",
    style: {
      paddingBottom: 'clamp(36px, 4.5vh, 56px)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "03")), /*#__PURE__*/React.createElement(Reveal, {
    variant: "mask",
    delay: 0.12,
    style: {
      marginTop: '14px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "display-l"
  }, /*#__PURE__*/React.createElement(KineticText, {
    text: "What We Do"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "svcd-wrap"
  }, SERVICES_DATA.map((svc, i) => {
    const isOpen = open === i;
    return /*#__PURE__*/React.createElement(Reveal, {
      variant: "fade",
      delay: 0.09 * i,
      key: i
    }, /*#__PURE__*/React.createElement("div", {
      className: `svcd-row${isOpen ? ' is-open' : ''}`
    }, /*#__PURE__*/React.createElement("button", {
      className: "svcd-head",
      style: {
        cursor: 'none'
      },
      "aria-expanded": isOpen,
      onClick: () => setOpen(isOpen ? null : i)
    }, /*#__PURE__*/React.createElement("h3", {
      className: "svcd-title"
    }, svc.title), /*#__PURE__*/React.createElement("span", {
      className: "svcd-plus",
      "aria-hidden": "true"
    }, "+")), /*#__PURE__*/React.createElement("div", {
      className: "svcd-collapse",
      style: {
        gridTemplateRows: isOpen ? '1fr' : '0fr'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "svcd-collapse-inner"
    }, /*#__PURE__*/React.createElement("p", {
      className: "svc-desc svcd-desc"
    }, svc.desc), /*#__PURE__*/React.createElement("div", {
      className: "svcd-tags"
    }, svc.tags.map(t => /*#__PURE__*/React.createElement("span", {
      key: t
    }, t)))))));
  })));
}

/* ── Desktop alternative 16: showcase reel ─────────────────
   A tab rail of the five services up top; below, a wide stage where
   the active service plays big — title left, description + tags
   right. Auto-advances like a reel (pauses on hover); clicking a
   tab jumps to it. */
function ServicesShowcase() {
  const [on, setOn] = useState(0);
  const hovRef = useRef(false);
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => {
      if (!hovRef.current) setOn(p => (p + 1) % SERVICES_DATA.length);
    }, 5000);
    return () => clearInterval(t);
  }, [reduced]);
  const svc = SERVICES_DATA[on];
  return /*#__PURE__*/React.createElement("section", {
    id: "services",
    style: {
      marginTop: 'clamp(-150px, -12vh, -50px)',
      paddingTop: 'clamp(40px, 6vh, 84px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gutter shell",
    style: {
      paddingBottom: 'clamp(36px, 4.5vh, 56px)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "03")), /*#__PURE__*/React.createElement(Reveal, {
    variant: "mask",
    delay: 0.12,
    style: {
      marginTop: '14px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "display-l"
  }, /*#__PURE__*/React.createElement(KineticText, {
    text: "What We Do"
  }))))), /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    className: "svct-wrap",
    onMouseEnter: () => {
      hovRef.current = true;
    },
    onMouseLeave: () => {
      hovRef.current = false;
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "svct-rail",
    role: "tablist"
  }, SERVICES_DATA.map((s, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    role: "tab",
    "aria-selected": on === i,
    className: `svct-tab${on === i ? ' is-on' : ''}`,
    style: {
      cursor: 'none'
    },
    onClick: () => setOn(i)
  }, /*#__PURE__*/React.createElement("span", null, s.title), on === i && !reduced && /*#__PURE__*/React.createElement("i", {
    className: "svct-meter",
    key: `m${i}`
  })))), /*#__PURE__*/React.createElement("div", {
    className: "svct-stage",
    key: on
  }, /*#__PURE__*/React.createElement("h3", {
    className: "svct-title"
  }, svc.title), /*#__PURE__*/React.createElement("div", {
    className: "svct-side"
  }, /*#__PURE__*/React.createElement("p", {
    className: "svc-desc svct-desc"
  }, svc.desc), /*#__PURE__*/React.createElement("span", {
    className: "svct-tagline"
  }, svc.tags.join(' · ')))))));
}

/* ── Desktop alternative 15: spotlight list ────────────────
   Big bare titles stacked full-width; a floating card with the
   description + tags trails the cursor over the hovered row, like
   a viewfinder readout. */
function ServicesSpotlight() {
  const [hov, setHov] = useState(null);
  const [pos, setPos] = useState({
    x: 0,
    y: 0
  });
  const onMove = e => setPos({
    x: e.clientX,
    y: e.clientY
  });
  const CARD_W = 380;
  const flip = typeof window !== 'undefined' && pos.x > window.innerWidth - (CARD_W + 80);
  const cardStyle = {
    left: flip ? pos.x - CARD_W - 28 : pos.x + 28,
    top: pos.y
  };
  return /*#__PURE__*/React.createElement("section", {
    id: "services",
    style: {
      marginTop: 'clamp(-150px, -12vh, -50px)',
      paddingTop: 'clamp(40px, 6vh, 84px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gutter shell",
    style: {
      paddingBottom: 'clamp(36px, 4.5vh, 56px)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "03")), /*#__PURE__*/React.createElement(Reveal, {
    variant: "mask",
    delay: 0.12,
    style: {
      marginTop: '14px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "display-l"
  }, /*#__PURE__*/React.createElement(KineticText, {
    text: "What We Do"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: `svcw-list${hov !== null ? ' has-hov' : ''}`,
    onMouseMove: onMove,
    onMouseLeave: () => setHov(null)
  }, SERVICES_DATA.map((svc, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: i,
    variant: "fade",
    delay: 0.05 * i
  }, /*#__PURE__*/React.createElement("div", {
    className: `svcw-row${hov === i ? ' is-hov' : ''}`,
    onMouseEnter: () => setHov(i)
  }, /*#__PURE__*/React.createElement("h3", {
    className: "svcw-title"
  }, svc.title), /*#__PURE__*/React.createElement("span", {
    className: "svc-arrow svcw-arrow",
    "aria-hidden": "true"
  }, "\u21C0")))), hov !== null && /*#__PURE__*/React.createElement("div", {
    className: "svcw-float",
    style: cardStyle
  }, /*#__PURE__*/React.createElement("span", {
    className: "svcw-float-tags"
  }, SERVICES_DATA[hov].tags.join(' · ')), /*#__PURE__*/React.createElement("p", {
    className: "svcw-float-desc"
  }, SERVICES_DATA[hov].desc))), /*#__PURE__*/React.createElement("div", {
    className: "sr-only"
  }, SERVICES_DATA.map((svc, i) => /*#__PURE__*/React.createElement("p", {
    key: i
  }, svc.desc))));
}

/* ── Desktop alternative 14: crosshair grid ────────────────
   A continuous technical grid — 3 cells over 2 — sharing hairlines,
   with '+' registration marks at the interior intersections (like a
   lens chart / technical drawing). Everything is visible at once;
   hover lifts a cell and warms its marks. */
function ServicesCrosshair() {
  return /*#__PURE__*/React.createElement("section", {
    id: "services",
    style: {
      marginTop: 'clamp(-150px, -12vh, -50px)',
      paddingTop: 'clamp(40px, 6vh, 84px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gutter shell",
    style: {
      paddingBottom: 'clamp(36px, 4.5vh, 56px)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "03")), /*#__PURE__*/React.createElement(Reveal, {
    variant: "mask",
    delay: 0.12,
    style: {
      marginTop: '14px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "display-l"
  }, /*#__PURE__*/React.createElement(KineticText, {
    text: "What We Do"
  }))))), /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    className: "svch-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "svch-grid"
  }, SERVICES_DATA.map((svc, i) => /*#__PURE__*/React.createElement("article", {
    key: i,
    className: `svch-cell svch-cell-${i < 3 ? 'a' : 'b'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "svch-top"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "svch-title"
  }, svc.title), /*#__PURE__*/React.createElement("span", {
    className: "svc-arrow svch-arrow",
    "aria-hidden": "true"
  }, "\u21C0")), /*#__PURE__*/React.createElement("p", {
    className: "svc-desc svch-desc"
  }, svc.desc), /*#__PURE__*/React.createElement("span", {
    className: "svch-tagline"
  }, svc.tags.join(' · ')))), /*#__PURE__*/React.createElement("span", {
    className: "svch-mark",
    style: {
      left: '33.333%',
      top: '50%'
    },
    "aria-hidden": "true"
  }, "+"), /*#__PURE__*/React.createElement("span", {
    className: "svch-mark",
    style: {
      left: '66.667%',
      top: '50%'
    },
    "aria-hidden": "true"
  }, "+"), /*#__PURE__*/React.createElement("span", {
    className: "svch-mark",
    style: {
      left: '50%',
      top: '100%'
    },
    "aria-hidden": "true"
  }, "+")))));
}

/* ── Desktop alternative 13: column accordion ──────────────
   Horizontal accordion in 01's editorial language: five columns
   SIDE BY SIDE separated by vertical hairlines (no boxes). The open
   column widens and its description + tags unfold under the title;
   the others stay as narrow title columns. */
function ServicesColumns() {
  const [on, setOn] = useState(0);
  return /*#__PURE__*/React.createElement("section", {
    id: "services",
    style: {
      marginTop: 'clamp(-150px, -12vh, -50px)',
      paddingTop: 'clamp(40px, 6vh, 84px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gutter shell",
    style: {
      paddingBottom: 'clamp(36px, 4.5vh, 56px)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "03")), /*#__PURE__*/React.createElement(Reveal, {
    variant: "mask",
    delay: 0.12,
    style: {
      marginTop: '14px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "display-l"
  }, /*#__PURE__*/React.createElement(KineticText, {
    text: "What We Do"
  }))))), /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    className: "svcz-row"
  }, SERVICES_DATA.map((svc, i) => {
    const isOn = on === i;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      className: `svcz-col${isOn ? ' is-on' : ''}`,
      style: {
        cursor: 'none'
      },
      onMouseEnter: () => setOn(i),
      onClick: () => setOn(i),
      "aria-expanded": isOn
    }, /*#__PURE__*/React.createElement("div", {
      className: "svcz-head"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "svcz-title"
    }, svc.title), /*#__PURE__*/React.createElement("span", {
      className: "svcz-plus",
      "aria-hidden": "true"
    }, "+")), /*#__PURE__*/React.createElement("div", {
      className: "svcz-body"
    }, /*#__PURE__*/React.createElement("p", {
      className: "svc-desc svcz-desc"
    }, svc.desc), /*#__PURE__*/React.createElement("div", {
      className: "svc-tags svcz-tags"
    }, svc.tags.map(t => /*#__PURE__*/React.createElement("span", {
      key: t,
      className: "svc-tag"
    }, t)))));
  }))));
}

/* ── Desktop alternative 12: index accordion ───────────────
   01's editorial index turned into an accordion: hairline rows with
   number + title; the open row reveals its description SIDE BY SIDE
   with the title in the right column. One open at a time. */
function ServicesIndexAcc() {
  const [open, setOpen] = useState(0);
  return /*#__PURE__*/React.createElement("section", {
    id: "services",
    style: {
      marginTop: 'clamp(-150px, -12vh, -50px)',
      paddingTop: 'clamp(40px, 6vh, 84px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gutter shell",
    style: {
      paddingBottom: 'clamp(36px, 4.5vh, 56px)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "03")), /*#__PURE__*/React.createElement(Reveal, {
    variant: "mask",
    delay: 0.12,
    style: {
      marginTop: '14px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "display-l"
  }, /*#__PURE__*/React.createElement(KineticText, {
    text: "What We Do"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "svcy-wrap"
  }, SERVICES_DATA.map((svc, i) => {
    const isOpen = open === i;
    return /*#__PURE__*/React.createElement(Reveal, {
      key: i,
      variant: "fade",
      delay: 0.05 * i
    }, /*#__PURE__*/React.createElement("article", {
      className: `svcy-row${isOpen ? ' is-open' : ''}`
    }, /*#__PURE__*/React.createElement("button", {
      className: "svcy-grid",
      style: {
        cursor: 'none'
      },
      "aria-expanded": isOpen,
      onClick: () => setOpen(isOpen ? null : i)
    }, /*#__PURE__*/React.createElement("span", {
      className: "svcy-num"
    }, svc.num), /*#__PURE__*/React.createElement("div", {
      className: "svcy-main"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "svcy-title"
    }, svc.title), isOpen && /*#__PURE__*/React.createElement("div", {
      className: "svc-tags svcy-tags"
    }, svc.tags.map(t => /*#__PURE__*/React.createElement("span", {
      key: t,
      className: "svc-tag"
    }, t)))), isOpen ? /*#__PURE__*/React.createElement("p", {
      className: "svc-desc svcy-desc"
    }, svc.desc) : /*#__PURE__*/React.createElement("span", {
      className: "svcy-spacer",
      "aria-hidden": "true"
    }), /*#__PURE__*/React.createElement("span", {
      className: "svcy-plus",
      "aria-hidden": "true"
    }, "+"))));
  })));
}

/* ── Desktop alternative 11: frames ─────────────────────
   Built from scratch on the expanding-strip idea: five separate
   hairline-framed panels with breathing room between them. Titles
   are horizontal and legible from the start; the open frame widens,
   warms its border and reveals the description at the bottom.
   The whole strip is vertically centered between the "What We Do"
   header and the next section. */
function ServicesFrames() {
  const [on, setOn] = useState(0);
  return /*#__PURE__*/React.createElement("section", {
    id: "services",
    style: {
      marginTop: 'clamp(-150px, -12vh, -50px)',
      paddingTop: 'clamp(40px, 6vh, 84px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gutter shell",
    style: {
      paddingBottom: 'clamp(36px, 4.5vh, 56px)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "03")), /*#__PURE__*/React.createElement(Reveal, {
    variant: "mask",
    delay: 0.12,
    style: {
      marginTop: '14px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "display-l"
  }, /*#__PURE__*/React.createElement(KineticText, {
    text: "What We Do"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "svcv-stage"
  }, /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade",
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "svcv-strip"
  }, SERVICES_DATA.map((svc, i) => {
    const isOn = on === i;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      className: `svcv-panel${isOn ? ' is-on' : ''}`,
      style: {
        cursor: 'none'
      },
      onMouseEnter: () => setOn(i),
      onClick: () => setOn(i),
      "aria-expanded": isOn
    }, /*#__PURE__*/React.createElement("h3", {
      className: "svcv-title"
    }, svc.title), /*#__PURE__*/React.createElement("div", {
      className: "svcv-body"
    }, /*#__PURE__*/React.createElement("p", {
      className: "svc-desc svcv-desc"
    }, svc.desc), /*#__PURE__*/React.createElement("span", {
      className: "svcv-tagline"
    }, svc.tags.join(' · '))));
  })))));
}

/* ── Desktop alternative 10: rack focus ───────────────────
   Expanding panels with a depth-of-field twist: collapsed frames
   sit softly out of focus (blurred, dimmed) like background bokeh;
   the open frame racks into focus, its title bottom-left and the
   description landing beside it — everything bottom-aligned, so
   texts can never collide. */
function ServicesFocus() {
  const [on, setOn] = useState(0);
  return /*#__PURE__*/React.createElement("section", {
    id: "services",
    style: {
      marginTop: 'clamp(-150px, -12vh, -50px)',
      paddingTop: 'clamp(40px, 6vh, 84px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gutter shell",
    style: {
      paddingBottom: 'clamp(36px, 4.5vh, 56px)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "03")), /*#__PURE__*/React.createElement(Reveal, {
    variant: "mask",
    delay: 0.12,
    style: {
      marginTop: '14px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "display-l"
  }, /*#__PURE__*/React.createElement(KineticText, {
    text: "What We Do"
  }))))), /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    className: "svcf-row"
  }, SERVICES_DATA.map((svc, i) => {
    const isOn = on === i;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      className: `svcf-panel${isOn ? ' is-on' : ''}`,
      style: {
        cursor: 'none'
      },
      onMouseEnter: () => setOn(i),
      onClick: () => setOn(i),
      "aria-expanded": isOn
    }, /*#__PURE__*/React.createElement("span", {
      className: "svcf-tagline"
    }, svc.tags.join(' · ')), /*#__PURE__*/React.createElement("div", {
      className: "svcf-foot"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "svcf-title"
    }, svc.title), /*#__PURE__*/React.createElement("p", {
      className: "svc-desc svcf-desc"
    }, svc.desc)));
  }))));
}

/* ── Desktop alternative 09: cinema strip ─────────────────
   Expanding panels — collapsed frames show the title VERTICALLY;
   the open frame widens and shows it horizontally with the
   description + tags. No numbers, no watermark, no underline. */
function ServicesPanelsX() {
  const [on, setOn] = useState(0);
  return /*#__PURE__*/React.createElement("section", {
    id: "services",
    style: {
      marginTop: 'clamp(-150px, -12vh, -50px)',
      paddingTop: 'clamp(40px, 6vh, 84px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gutter shell",
    style: {
      paddingBottom: 'clamp(36px, 4.5vh, 56px)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "03")), /*#__PURE__*/React.createElement(Reveal, {
    variant: "mask",
    delay: 0.12,
    style: {
      marginTop: '14px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "display-l"
  }, /*#__PURE__*/React.createElement(KineticText, {
    text: "What We Do"
  }))))), /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    className: "svcs-row"
  }, SERVICES_DATA.map((svc, i) => {
    const isOn = on === i;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      className: `svcs-panel${isOn ? ' is-on' : ''}`,
      style: {
        cursor: 'none'
      },
      onMouseEnter: () => setOn(i),
      onClick: () => setOn(i),
      "aria-expanded": isOn
    }, /*#__PURE__*/React.createElement("span", {
      className: "svcs-vtitle",
      "aria-hidden": "true"
    }, svc.title), /*#__PURE__*/React.createElement("div", {
      className: "svcs-body"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "svcs-title"
    }, svc.title), /*#__PURE__*/React.createElement("p", {
      className: "svc-desc svcs-desc"
    }, svc.desc), /*#__PURE__*/React.createElement("div", {
      className: "svc-tags svcs-tags"
    }, svc.tags.map(t => /*#__PURE__*/React.createElement("span", {
      key: t,
      className: "svc-tag"
    }, t)))));
  }))));
}

/* ── Desktop alternative 08: ghost numerals ───────────────
   Each service rides a massive outlined numeral — rows zigzag
   left/right, title + description overlap the number. Hovering a
   row warms the numeral's stroke to orange. */
function ServicesNumerals() {
  return /*#__PURE__*/React.createElement("section", {
    id: "services",
    style: {
      marginTop: 'clamp(-150px, -12vh, -50px)',
      paddingTop: 'clamp(40px, 6vh, 84px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gutter shell",
    style: {
      paddingBottom: 'clamp(36px, 4.5vh, 56px)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "03")), /*#__PURE__*/React.createElement(Reveal, {
    variant: "mask",
    delay: 0.12,
    style: {
      marginTop: '14px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "display-l"
  }, /*#__PURE__*/React.createElement(KineticText, {
    text: "What We Do"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "svcn-wrap"
  }, SERVICES_DATA.map((svc, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: i,
    variant: "fade",
    delay: 0.05 * i
  }, /*#__PURE__*/React.createElement("article", {
    className: `svcn-row${i % 2 ? ' is-flip' : ''}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "svcn-ghost",
    "aria-hidden": "true"
  }, svc.num), /*#__PURE__*/React.createElement("div", {
    className: "svcn-content"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "svcn-title"
  }, svc.title), /*#__PURE__*/React.createElement("p", {
    className: "svc-desc svcn-desc"
  }, svc.desc), /*#__PURE__*/React.createElement("span", {
    className: "svcn-tagline"
  }, svc.tags.join(' · '))))))));
}

/* ── Desktop alternative 07: expanding panels ──────────────
   Five tall panels side by side filling the width — like frames on
   a strip of film. Collapsed panels show a vertical title; hovering
   one widens it and its description fades in. */
function ServicesPanels() {
  const [on, setOn] = useState(0);
  return /*#__PURE__*/React.createElement("section", {
    id: "services",
    style: {
      marginTop: 'clamp(-150px, -12vh, -50px)',
      paddingTop: 'clamp(40px, 6vh, 84px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gutter shell",
    style: {
      paddingBottom: 'clamp(36px, 4.5vh, 56px)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "03")), /*#__PURE__*/React.createElement(Reveal, {
    variant: "mask",
    delay: 0.12,
    style: {
      marginTop: '14px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "display-l"
  }, /*#__PURE__*/React.createElement(KineticText, {
    text: "What We Do"
  }))))), /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    className: "svcp-row"
  }, SERVICES_DATA.map((svc, i) => {
    const isOn = on === i;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      className: `svcp-panel${isOn ? ' is-on' : ''}`,
      style: {
        cursor: 'none'
      },
      onMouseEnter: () => setOn(i),
      onClick: () => setOn(i),
      "aria-expanded": isOn
    }, /*#__PURE__*/React.createElement("span", {
      className: "svcp-num"
    }, svc.num), /*#__PURE__*/React.createElement("span", {
      className: "svcp-vtitle",
      "aria-hidden": "true"
    }, svc.title), /*#__PURE__*/React.createElement("div", {
      className: "svcp-body"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "svcp-title"
    }, svc.title), /*#__PURE__*/React.createElement("p", {
      className: "svc-desc svcp-desc"
    }, svc.desc), /*#__PURE__*/React.createElement("span", {
      className: "svcp-tagline"
    }, svc.tags.join(' · '))));
  }))));
}

/* ── Desktop alternative 06: film credits ─────────────────
   End-credits style: each service is a centered block — mono
   number, title, centered description, tag words as a quiet mono
   line — separated by short centered hairlines. */
function ServicesCredits() {
  return /*#__PURE__*/React.createElement("section", {
    id: "services",
    style: {
      marginTop: 'clamp(-150px, -12vh, -50px)',
      paddingTop: 'clamp(40px, 6vh, 84px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gutter shell",
    style: {
      paddingBottom: 'clamp(36px, 4.5vh, 56px)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "03")), /*#__PURE__*/React.createElement(Reveal, {
    variant: "mask",
    delay: 0.12,
    style: {
      marginTop: '14px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "display-l"
  }, /*#__PURE__*/React.createElement(KineticText, {
    text: "What We Do"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "svcc-wrap"
  }, SERVICES_DATA.map((svc, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: i,
    variant: "fade",
    delay: 0.05 * i
  }, /*#__PURE__*/React.createElement("article", {
    className: "svcc-block"
  }, i > 0 && /*#__PURE__*/React.createElement("span", {
    className: "svcc-rule",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    className: "svcc-num"
  }, svc.num), /*#__PURE__*/React.createElement("h3", {
    className: "svcc-title"
  }, svc.title), /*#__PURE__*/React.createElement("p", {
    className: "svc-desc svcc-desc"
  }, svc.desc), /*#__PURE__*/React.createElement("span", {
    className: "svcc-tagline"
  }, svc.tags.join(' · ')))))));
}

/* ── Desktop alternative 05: quiet index ──────────────────
   Same full-width footprint as 04 but restrained: modest titles,
   description beside them, tags as a quiet mono line on the right.
   Elegant hairline rows, subtle hover. */
function ServicesQuiet() {
  return /*#__PURE__*/React.createElement("section", {
    id: "services",
    style: {
      marginTop: 'clamp(-150px, -12vh, -50px)',
      paddingTop: 'clamp(40px, 6vh, 84px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gutter shell",
    style: {
      paddingBottom: 'clamp(36px, 4.5vh, 56px)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "03")), /*#__PURE__*/React.createElement(Reveal, {
    variant: "mask",
    delay: 0.12,
    style: {
      marginTop: '14px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "display-l"
  }, /*#__PURE__*/React.createElement(KineticText, {
    text: "What We Do"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "svcq-wrap"
  }, SERVICES_DATA.map((svc, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: i,
    variant: "fade",
    delay: 0.05 * i
  }, /*#__PURE__*/React.createElement("article", {
    className: "svcq-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "svcq-num"
  }, svc.num), /*#__PURE__*/React.createElement("div", {
    className: "svcq-main"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "svcq-title"
  }, svc.title), /*#__PURE__*/React.createElement("span", {
    className: "svcq-tagline"
  }, svc.tags.join(' · '))), /*#__PURE__*/React.createElement("p", {
    className: "svc-desc svcq-desc"
  }, svc.desc))))));
}

/* ── Desktop alternative 04: full-bleed index ──────────────
   Edge-to-edge rows spanning the whole viewport — oversized titles
   on the left, description + tags always visible on the right,
   hairlines running the full page width. */
function ServicesFullBleed() {
  return /*#__PURE__*/React.createElement("section", {
    id: "services",
    style: {
      marginTop: 'clamp(-150px, -12vh, -50px)',
      paddingTop: 'clamp(40px, 6vh, 84px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gutter shell",
    style: {
      paddingBottom: 'clamp(36px, 4.5vh, 56px)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "03")), /*#__PURE__*/React.createElement(Reveal, {
    variant: "mask",
    delay: 0.12,
    style: {
      marginTop: '14px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "display-l"
  }, /*#__PURE__*/React.createElement(KineticText, {
    text: "What We Do"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "svcb-wrap"
  }, SERVICES_DATA.map((svc, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: i,
    variant: "fade",
    delay: 0.05 * i
  }, /*#__PURE__*/React.createElement("article", {
    className: "svcb-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "svcb-num"
  }, svc.num), /*#__PURE__*/React.createElement("h3", {
    className: "svcb-title"
  }, svc.title), /*#__PURE__*/React.createElement("div", {
    className: "svcb-side"
  }, /*#__PURE__*/React.createElement("p", {
    className: "svc-desc svcb-desc"
  }, svc.desc), /*#__PURE__*/React.createElement("div", {
    className: "svc-tags svcb-tags"
  }, svc.tags.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    className: "svc-tag"
  }, t)))))))));
}

/* ── Desktop alternative 03: editorial accordion ────────────
   Full-width hairline rows — number · big title · plus toggle.
   One row open at a time; the open row indents its description
   under the title column. First row open by default. */
function ServicesAccordionX() {
  const [open, setOpen] = useState(0);
  return /*#__PURE__*/React.createElement("section", {
    id: "services",
    style: {
      marginTop: 'clamp(-150px, -12vh, -50px)',
      paddingTop: 'clamp(40px, 6vh, 84px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gutter shell",
    style: {
      paddingBottom: 'clamp(36px, 4.5vh, 56px)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "03")), /*#__PURE__*/React.createElement(Reveal, {
    variant: "mask",
    delay: 0.12,
    style: {
      marginTop: '14px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "display-l"
  }, /*#__PURE__*/React.createElement(KineticText, {
    text: "What We Do"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "svca-wrap"
  }, SERVICES_DATA.map((svc, i) => {
    const isOpen = open === i;
    return /*#__PURE__*/React.createElement(Reveal, {
      key: i,
      variant: "fade",
      delay: 0.05 * i
    }, /*#__PURE__*/React.createElement("article", {
      className: `svca-row${isOpen ? ' is-open' : ''}`
    }, /*#__PURE__*/React.createElement("button", {
      className: "svca-head",
      style: {
        cursor: 'none'
      },
      "aria-expanded": isOpen,
      onClick: () => setOpen(isOpen ? null : i)
    }, /*#__PURE__*/React.createElement("span", {
      className: "svca-num"
    }, svc.num), /*#__PURE__*/React.createElement("span", {
      className: "svca-title"
    }, svc.title), /*#__PURE__*/React.createElement("span", {
      className: "svca-plus",
      "aria-hidden": "true"
    }, "+")), isOpen && /*#__PURE__*/React.createElement("div", {
      className: "svca-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "svc-tags svca-tags"
    }, svc.tags.map(t => /*#__PURE__*/React.createElement("span", {
      key: t,
      className: "svc-tag"
    }, t))), /*#__PURE__*/React.createElement("p", {
      className: "svc-desc svca-desc"
    }, svc.desc))));
  })));
}

/* ── Desktop alternative 02: card grid ─────────────────────
   Hairline-framed cards in a 2-column grid (the 5th spans wide).
   Number top-left, arrow top-right, title · description · tags below.
   Hover lifts the card onto a faint surface and warms the frame. */
function ServicesCards() {
  return /*#__PURE__*/React.createElement("section", {
    id: "services",
    style: {
      marginTop: 'clamp(-150px, -12vh, -50px)',
      paddingTop: 'clamp(40px, 6vh, 84px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gutter shell",
    style: {
      paddingBottom: 'clamp(36px, 4.5vh, 56px)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "03")), /*#__PURE__*/React.createElement(Reveal, {
    variant: "mask",
    delay: 0.12,
    style: {
      marginTop: '14px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "display-l"
  }, /*#__PURE__*/React.createElement(KineticText, {
    text: "What We Do"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "svcg-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "svcg-grid"
  }, SERVICES_DATA.map((svc, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: i,
    variant: "fade",
    delay: 0.06 * i,
    className: "svcg-cell"
  }, /*#__PURE__*/React.createElement("article", {
    className: "svcg-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "svcg-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "svcg-num"
  }, svc.num), /*#__PURE__*/React.createElement("span", {
    className: "svc-arrow svcg-arrow",
    "aria-hidden": "true"
  }, "\u21C0")), /*#__PURE__*/React.createElement("h3", {
    className: "svcg-title"
  }, svc.title), /*#__PURE__*/React.createElement("p", {
    className: "svc-desc svcg-desc"
  }, svc.desc), /*#__PURE__*/React.createElement("div", {
    className: "svc-tags svcg-tags"
  }, svc.tags.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    className: "svc-tag"
  }, t)))))))));
}

/* ── Desktop alternative: editorial index ───────────────────
   All five services open at once — number · title+tags · description
   in one rhythmic stack. No hover-hunting; hover only brightens the
   row hairline and slides the arrow in. */
function ServicesIndex() {
  return /*#__PURE__*/React.createElement("section", {
    id: "services",
    style: {
      marginTop: 'clamp(-150px, -12vh, -50px)',
      paddingTop: 'clamp(40px, 6vh, 84px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gutter shell",
    style: {
      paddingBottom: 'clamp(36px, 4.5vh, 56px)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "03")), /*#__PURE__*/React.createElement(Reveal, {
    variant: "mask",
    delay: 0.12,
    style: {
      marginTop: '14px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "display-l"
  }, /*#__PURE__*/React.createElement(KineticText, {
    text: "What We Do"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "svcx-wrap"
  }, SERVICES_DATA.map((svc, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: i,
    variant: "fade",
    delay: 0.06 * i
  }, /*#__PURE__*/React.createElement("article", {
    className: "svcx-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "svcx-num"
  }, svc.num), /*#__PURE__*/React.createElement("div", {
    className: "svcx-main"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "svcx-title"
  }, svc.title), /*#__PURE__*/React.createElement("div", {
    className: "svc-tags svcx-tags"
  }, svc.tags.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    className: "svc-tag"
  }, t)))), /*#__PURE__*/React.createElement("p", {
    className: "svc-desc svcx-desc"
  }, svc.desc), /*#__PURE__*/React.createElement("span", {
    className: "svc-arrow svcx-arrow",
    "aria-hidden": "true"
  }, "\u21C0"))))));
}

/* ── Wide layout: scroll-driven vertical carousel ───────────
   The five titles ride a gentle vertical arc — the one at the front
   grows to full white; neighbours shrink, tilt back slightly, recede
   in Z and fade. A soft orange halo sits behind the front title.
   Scroll position drives which service is forward; the description
   panel stays pinned and crossfades. */
function ServicesWheel() {
  const N = SERVICES_DATA.length;
  const trackRef = useRef(null);
  const itemRefs = useRef([]);
  const barRef = useRef(null);
  const panelRefs = useRef([]);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  // run one synchronous frame before the RAF loop so items are positioned
  // correctly the instant the section is scrolled into view
  const calcFrame = useRef(null);
  useEffect(() => {
    if (calcFrame.current) calcFrame.current();
  }, []);
  useEffect(() => {
    let raf;
    let pAnim = 0;
    const STEP = 27 * Math.PI / 180; // gentle angular gap between neighbours
    const R = 130; // arc radius (px)
    const STICKY_TOP = 80; // matches nav scroll offset & sticky top

    const loop = () => {
      const track = trackRef.current;
      if (track) {
        const vh = window.innerHeight;
        const rect = track.getBoundingClientRect();
        const total = Math.max(1, rect.height - vh);
        const target = Math.min(1, Math.max(0, -(rect.top - STICKY_TOP) / total));
        if (window.__rbFunnelSnapUntil && performance.now() < window.__rbFunnelSnapUntil) {
          pAnim = target;
        } else {
          pAnim += (target - pAnim) * 0.1;
        }
        const af = pAnim * (N - 1); // current floating index
        const idx = Math.max(0, Math.min(N - 1, Math.round(af)));
        if (idx !== activeRef.current) {
          activeRef.current = idx;
          setActive(idx);
        }
        for (let i = 0; i < N; i++) {
          const el = itemRefs.current[i];
          if (!el) continue;
          const d = i - af; // signed distance from the front slot
          const angle = d * STEP;
          const cos = Math.cos(angle),
            sin = Math.sin(angle);
          const depth = (cos + 1) / 2; // 1 = front, 0 = back
          const f = Math.exp(-Math.pow(d / 0.95, 2)); // soft focus around the front

          const y = sin * R; // gentle arc up / down
          const z = (cos - 1) * R; // recede behind the front
          const rotX = -(d * STEP * 180 / Math.PI) * 0.72; // subtle pitch
          const sc = 0.5 + 0.5 * f; // front full size, others shrink
          const op = 0.1 + 0.9 * Math.pow(f, 0.6);
          const bl = (1 - f) * 2.1;
          el.style.transform = `translateY(-50%) translate3d(0, ${y.toFixed(1)}px, ${z.toFixed(1)}px) ` + `rotateX(${rotX.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
          el.style.opacity = op.toFixed(3);
          el.style.filter = bl > 0.04 ? `blur(${bl.toFixed(2)}px)` : 'none';
          el.style.zIndex = String(100 + Math.round(depth * 100));
          el.style.pointerEvents = op < 0.16 ? 'none' : 'auto';
        }

        // Right-side descriptions ride the SAME scroll progress, but as a
        // gentle vertical flow: the active one is largest & clearest, the
        // upcoming ones sit faintly below at smaller scale, rising up and
        // resolving into focus as you scroll.
        const PANEL_STEP = Math.max(150, Math.min(230, vh * 0.18));
        for (let i = 0; i < N; i++) {
          const pel = panelRefs.current[i];
          if (!pel) continue;
          const d = i - af;
          const ad = Math.abs(d);
          const ty = d * PANEL_STEP;
          const scale = Math.max(0.84, 1 - ad * 0.07);
          let pop;
          if (d < 0) {
            pop = Math.max(0, 1 + d * 1.5); // past: lifts up & dissolves
          } else {
            pop = Math.pow(Math.max(0, 1 - d * 0.4), 1.5); // upcoming: faint, below
          }
          pel.style.transform = `translateY(-50%) translateY(${ty.toFixed(1)}px) scale(${scale.toFixed(3)})`;
          pel.style.opacity = pop.toFixed(3);
          pel.style.zIndex = String(100 - Math.round(ad * 10));
        }
        if (barRef.current) barRef.current.style.transform = `scaleY(${pAnim.toFixed(4)})`;
      }
      raf = requestAnimationFrame(loop);
    };
    // expose calc for the synchronous pre-frame
    calcFrame.current = loop;
    loop();
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [N]);
  const scrollToService = i => {
    const track = trackRef.current;
    if (!track) return;
    const vh = window.innerHeight;
    const STICKY_TOP = 80;
    const trackAbsTop = track.getBoundingClientRect().top + window.scrollY;
    const total = track.offsetHeight - vh;
    window.scrollTo({
      top: trackAbsTop - STICKY_TOP + i / (N - 1) * total,
      behavior: 'smooth'
    });
  };
  return /*#__PURE__*/React.createElement("section", {
    id: "services"
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    className: "svc-track",
    style: {
      height: `${N * 36}vh`
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "svc-sticky"
  }, /*#__PURE__*/React.createElement("div", {
    className: "gutter shell svc-svchead"
  }, /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "03")), /*#__PURE__*/React.createElement(Reveal, {
    variant: "mask",
    delay: 0.12,
    style: {
      marginTop: '14px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "display-l"
  }, /*#__PURE__*/React.createElement(KineticText, {
    text: "What We Do"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "gutter svc-split svc-split-wheel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "svc-wheel-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "svc-rail",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("div", {
    ref: barRef,
    className: "svc-rail-fill"
  })), /*#__PURE__*/React.createElement("div", {
    className: "svc-wheel"
  }, SERVICES_DATA.map((svc, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    ref: el => {
      itemRefs.current[i] = el;
    },
    className: `svc-wheel-item${active === i ? ' on' : ''}`,
    onClick: () => active === i ? null : scrollToService(i),
    style: {
      cursor: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "svc-title"
  }, svc.title), /*#__PURE__*/React.createElement("span", {
    className: "svc-arrow",
    "aria-hidden": "true"
  }, "\u21C0"))))), /*#__PURE__*/React.createElement("aside", {
    className: "svc-panel svc-panel-wheel",
    "aria-label": "Service descriptions"
  }, /*#__PURE__*/React.createElement("div", {
    className: "svc-panel-flow"
  }, SERVICES_DATA.map((svc, i) => /*#__PURE__*/React.createElement("div", {
    className: "svc-pitem",
    key: i,
    ref: el => {
      panelRefs.current[i] = el;
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "svc-tags"
  }, svc.tags.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    className: "svc-tag"
  }, t))), /*#__PURE__*/React.createElement("p", {
    className: "svc-desc"
  }, svc.desc)))))))));
}

/* ── Split Directory (Concept C) — tablet + desktop default ──────────
   Compact numbered list of the five services on the left; hovering a
   row swaps a live, crossfading description panel on the right. Reuses
   the page's --align-x column + translateX so it lines up with the
   funnel/Highlights above. Phones fall back to ServicesAccordion. */
function SccPanel({
  svc,
  lang
}) {
  const [shown, setShown] = useState(svc);
  const [vis, setVis] = useState(true);
  useEffect(() => {
    if (svc === shown) return;
    setVis(false);
    const t = setTimeout(() => {
      setShown(svc);
      setVis(true);
    }, 180);
    return () => clearTimeout(t);
  }, [svc, shown]);
  return /*#__PURE__*/React.createElement("aside", {
    className: "scc-panel",
    "aria-live": "polite"
  }, /*#__PURE__*/React.createElement("div", {
    className: `scc-panel-inner${vis ? '' : ' is-out'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "scc-plabel scc-plabel-tags",
    lang: svcLang(shown, lang, 'tags')
  }, svcTags(shown, lang).map((t, i) => /*#__PURE__*/React.createElement("span", {
    key: t
  }, t, i < svcTags(shown, lang).length - 1 ? /*#__PURE__*/React.createElement("span", {
    className: "scc-plabel-sep"
  }, " \xB7 ") : null))), /*#__PURE__*/React.createElement("p", {
    className: "scc-desc",
    lang: svcLang(shown, lang, 'desc')
  }, svcDesc(shown, lang))));
}

// Şu an yalnızca başlıklar Türkçeye çevrildi (tags/desc henüz gelmedi).
// TR yoksa EN'e döner — about.js'teki boş-string kuralı burada geçerli değil.
function svcTitle(svc, lang) {
  return lang === 'TR' && svc.titleTR ? svc.titleTR : svc.title;
}
function svcTags(svc, lang) {
  return lang === 'TR' && svc.tagsTR ? svc.tagsTR : svc.tags;
}
function svcDesc(svc, lang) {
  return lang === 'TR' && svc.descTR ? svc.descTR : svc.desc;
}
// Whether THIS field actually rendered in Turkish — not just the page's
// current language. A card with no TR copy falls back to English text, and
// that text must get lang="en" or the Turkish uppercase rule mangles it
// ("CLARİTY"). Compare the shown value against the translated value instead
// of trusting the global toggle.
function svcLang(svc, lang, field) {
  return lang === 'TR' && svc[field + 'TR'] ? 'tr' : 'en';
}
function ServicesSplitC() {
  const [lang] = useLang();
  const [active, setActive] = useState(0);
  const canHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;
  return /*#__PURE__*/React.createElement("section", {
    id: "services",
    style: {
      marginTop: 'clamp(-150px, -12vh, -50px)',
      paddingTop: 'clamp(40px, 6vh, 84px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gutter shell",
    style: {
      paddingBottom: 'clamp(36px, 4.5vh, 56px)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "03")), /*#__PURE__*/React.createElement(Reveal, {
    variant: "mask",
    delay: 0.12,
    style: {
      marginTop: '14px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "display-l",
    lang: lang === 'TR' ? 'tr' : 'en'
  }, /*#__PURE__*/React.createElement(KineticText, {
    text: rbT('services.title', lang)
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "gutter scc-split",
    style: {
      marginTop: 'clamp(52px, 6vh, 82px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "scc-rail"
  }, SERVICES_DATA.map((svc, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    className: `scc-item${active === i ? ' on' : ''}`,
    style: {
      cursor: 'none'
    },
    "aria-pressed": active === i,
    onMouseEnter: () => canHover && setActive(i),
    onClick: () => setActive(i)
  }, /*#__PURE__*/React.createElement("span", {
    className: "scc-t",
    lang: svcLang(svc, lang, 'title')
  }, svcTitle(svc, lang)), /*#__PURE__*/React.createElement("span", {
    className: "scc-arrow",
    "aria-hidden": "true"
  }, "\u21C0")))), /*#__PURE__*/React.createElement(SccPanel, {
    svc: SERVICES_DATA[active],
    lang: lang
  })));
}

/* ── Narrow / touch fallback: original accordion ── */
function ServicesAccordion() {
  const [lang] = useLang();
  const [active, setActive] = useState(0);
  const [openM, setOpenM] = useState(null);
  const canHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;
  return /*#__PURE__*/React.createElement("section", {
    id: "services",
    style: {
      marginTop: 'clamp(-150px, -12vh, -50px)',
      paddingTop: 'clamp(40px, 6vh, 84px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gutter shell",
    style: {
      paddingBottom: 'clamp(36px, 4.5vh, 56px)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "03")), /*#__PURE__*/React.createElement(Reveal, {
    variant: "mask",
    delay: 0.12,
    style: {
      marginTop: '14px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "display-l",
    lang: lang === 'TR' ? 'tr' : 'en'
  }, /*#__PURE__*/React.createElement(KineticText, {
    text: rbT('services.title', lang)
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "gutter svc-split",
    style: {
      marginTop: '36px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "svc-list"
  }, SERVICES_DATA.map((svc, i) => /*#__PURE__*/React.createElement(ServiceRow, {
    key: i,
    svc: svc,
    lang: lang,
    active: active === i,
    openM: openM === i,
    onEnter: () => canHover && setActive(i),
    onClick: () => {
      setActive(i);
      setOpenM(openM === i ? null : i);
    }
  }))), /*#__PURE__*/React.createElement(SvcPanel, {
    svc: SERVICES_DATA[active],
    lang: lang
  })));
}

/* Right-hand description panel — crossfades when the hovered service changes */
function SvcPanel({
  svc,
  lang
}) {
  const [shown, setShown] = useState(svc);
  const [vis, setVis] = useState(true);
  useEffect(() => {
    if (svc === shown) return;
    setVis(false);
    const t = setTimeout(() => {
      setShown(svc);
      setVis(true);
    }, 180);
    return () => clearTimeout(t);
  }, [svc, shown]);
  return /*#__PURE__*/React.createElement("aside", {
    className: "svc-panel",
    "aria-live": "polite"
  }, /*#__PURE__*/React.createElement("div", {
    className: `svc-panel-inner${vis ? '' : ' is-out'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "svc-tags",
    lang: svcLang(shown, lang, 'tags')
  }, svcTags(shown, lang).map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    className: "svc-tag"
  }, t))), /*#__PURE__*/React.createElement("p", {
    className: "svc-desc",
    lang: svcLang(shown, lang, 'desc')
  }, svcDesc(shown, lang))));
}
function ServiceRow({
  svc,
  lang,
  active,
  openM,
  onEnter,
  onClick
}) {
  const bodyRef = useRef(null);
  const [bodyH, setBodyH] = useState(0);
  useEffect(() => {
    const measure = () => {
      if (bodyRef.current) setBodyH(bodyRef.current.scrollHeight);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: `svc-item${active ? ' on' : ''}`,
    onMouseEnter: onEnter
  }, /*#__PURE__*/React.createElement("button", {
    className: "svc-row-grid",
    onClick: onClick,
    style: {
      cursor: 'none'
    },
    "aria-expanded": openM
  }, /*#__PURE__*/React.createElement("span", {
    className: "svc-title",
    lang: svcLang(svc, lang, 'title')
  }, svcTitle(svc, lang)), /*#__PURE__*/React.createElement("span", {
    className: `svc-plus${openM ? ' is-open' : ''}`,
    "aria-hidden": "true"
  }, openM ? '−' : '+'), /*#__PURE__*/React.createElement("span", {
    className: "svc-arrow",
    "aria-hidden": "true"
  }, "\u21C0")), /*#__PURE__*/React.createElement("div", {
    className: "svc-m-body",
    style: {
      overflow: 'hidden',
      maxHeight: openM ? '2000px' : '0px',
      opacity: openM ? 1 : 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: bodyRef,
    className: "svc-m-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "svc-tags",
    lang: svcLang(svc, lang, 'tags')
  }, svcTags(svc, lang).map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    className: "svc-tag"
  }, t))), /*#__PURE__*/React.createElement("p", {
    className: "svc-desc",
    lang: svcLang(svc, lang, 'desc')
  }, svcDesc(svc, lang)))));
}

/* ── Contact ── */
// Formspree endpoint — messages land in the studio inbox linked to this form.
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mvzjdaya';
function Contact() {
  const [lang] = useLang();
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errMsg, setErrMsg] = useState('');
  const [errors, setErrors] = useState({}); // per-field validation messages

  const update = (k, v) => {
    setForm(p => ({
      ...p,
      [k]: v
    }));
    if (errors[k]) setErrors(e => ({
      ...e,
      [k]: ''
    }));
  };
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = rbT('contact.err.name', lang);
    if (!form.email.trim()) errs.email = rbT('contact.err.email', lang);else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = rbT('contact.err.emailFormat', lang);
    if (!form.message.trim()) errs.message = rbT('contact.err.message', lang);
    return errs;
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (status === 'sending') return;
    // Honeypot — if a bot filled the hidden field, silently drop it.
    const trap = e.target.querySelector('input[name="_gotcha"]');
    if (trap && trap.value) return;
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      if (status === 'error') setStatus('idle');
      return;
    }
    setErrors({});
    setStatus('sending');
    setErrMsg('');
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          _subject: `New project brief — ${form.name || 'Website'}`
        })
      });
      if (res.ok) {
        setStatus('sent');
        setForm({
          name: '',
          email: '',
          message: ''
        });
        setTimeout(() => setStatus('idle'), 4500);
      } else {
        const data = await res.json().catch(() => ({}));
        const msg = data && data.errors && data.errors[0] && data.errors[0].message;
        setErrMsg(msg || rbT('contact.errGeneric', lang));
        setStatus('error');
      }
    } catch (err) {
      setErrMsg(rbT('contact.errNetwork', lang));
      setStatus('error');
    }
  };
  return /*#__PURE__*/React.createElement("section", {
    id: "contact",
    className: "contact-sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "gutter shell contact-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "contact-lead"
  }, /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "04")), /*#__PURE__*/React.createElement(Reveal, {
    variant: "mask",
    delay: 0.12,
    style: {
      marginTop: '14px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "contact-headline",
    lang: lang === 'TR' ? 'tr' : 'en'
  }, rbT('contact.headline1', lang) ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(KineticText, {
    text: rbT('contact.headline1', lang)
  }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--orange)'
    }
  }, /*#__PURE__*/React.createElement(KineticText, {
    text: rbT('contact.headline2', lang)
  }))) : lang === 'TR' ? /*#__PURE__*/React.createElement(KineticText, {
    text: "İletişim"
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--orange)'
    }
  }, /*#__PURE__*/React.createElement(KineticText, {
    text: rbT('contact.headline2', lang)
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "ct-block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ct-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ct-col ct-col--info",
    style: {
      transform: "translateY(30px)"
    }
  }, /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade",
    delay: 0.08
  }, /*#__PURE__*/React.createElement("span", {
    className: "contact-status",
    lang: lang === 'TR' ? 'tr' : 'en'
  }, /*#__PURE__*/React.createElement("i", {
    "aria-hidden": "true"
  }), rbT('contact.status', lang))), /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade",
    delay: 0.12
  }, /*#__PURE__*/React.createElement("a", {
    className: "contact-bigmail",
    href: "mailto:contact@robust.film"
  }, /*#__PURE__*/React.createElement("span", {
    className: "u"
  }, "contact@robust.film"), /*#__PURE__*/React.createElement("em", {
    "aria-hidden": "true"
  }, "\u21C0"))), /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade",
    delay: 0.16
  }, /*#__PURE__*/React.createElement("div", {
    className: "contact-phones"
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://wa.me/905362707505",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "+90 536 270 75 05"), /*#__PURE__*/React.createElement("a", {
    href: "https://wa.me/905071883117",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "+90 507 188 31 17"))), /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade",
    delay: 0.22
  }, /*#__PURE__*/React.createElement("p", {
    className: "contact-note contact-note--desktop",
    lang: lang === 'TR' ? 'tr' : 'en'
  }, rbT('contact.note', lang)), /*#__PURE__*/React.createElement("p", {
    className: "contact-note contact-note--mobile"
  }, "Esentepe, Tevfik Erd\xF6nmez Pa\u015Fa Sokak No:2/1 D:6", /*#__PURE__*/React.createElement("br", null), "34394 \u015Ei\u015Fli / \u0130stanbul"))), /*#__PURE__*/React.createElement("div", {
    className: "ct-col",
    style: {
      padding: "0px",
      transform: "translateY(-5px)"
    }
  }, /*#__PURE__*/React.createElement(Reveal, {
    variant: "fade",
    delay: 0.1
  }, /*#__PURE__*/React.createElement("span", {
    className: "ct-label",
    lang: lang === 'TR' ? 'tr' : 'en'
  }, rbT('contact.label', lang))), /*#__PURE__*/React.createElement("form", {
    className: "contact-form",
    onSubmit: handleSubmit,
    noValidate: true
  }, /*#__PURE__*/React.createElement(CField, {
    index: "01",
    label: rbT('contact.field.name', lang),
    value: form.name,
    onChange: v => update('name', v),
    placeholder: rbT('contact.ph.name', lang),
    error: errors.name
  }), /*#__PURE__*/React.createElement(CField, {
    index: "02",
    label: rbT('contact.field.email', lang),
    type: "email",
    value: form.email,
    onChange: v => update('email', v),
    placeholder: rbT('contact.ph.email', lang),
    error: errors.email
  }), /*#__PURE__*/React.createElement(CField, {
    index: "03",
    label: rbT('contact.field.message', lang),
    value: form.message,
    onChange: v => update('message', v),
    placeholder: rbT('contact.ph.message', lang),
    multiline: true,
    error: errors.message
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "_gotcha",
    tabIndex: "-1",
    autoComplete: "off",
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      left: '-9999px',
      width: '1px',
      height: '1px',
      opacity: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "cf-foot"
  }, status === 'error' && /*#__PURE__*/React.createElement("span", {
    role: "alert",
    className: "cf-formnote cf-formnote--err",
    lang: lang === 'TR' ? 'tr' : 'en'
  }, errMsg), status === 'sent' && /*#__PURE__*/React.createElement("span", {
    className: "cf-formnote cf-formnote--ok",
    lang: lang === 'TR' ? 'tr' : 'en'
  }, rbT('contact.sentNote', lang)), /*#__PURE__*/React.createElement(CSendBtn, {
    status: status
  })))))));
}
function CMeta({
  label,
  value,
  link
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "cmeta-label"
  }, label), link ? /*#__PURE__*/React.createElement("a", {
    href: `mailto:${value}`,
    style: {
      fontFamily: "'Space Grotesk'",
      fontSize: '15px',
      color: '#999',
      textDecoration: 'none',
      transition: 'color 0.3s',
      cursor: 'none'
    },
    onMouseEnter: e => e.currentTarget.style.color = 'var(--orange)',
    onMouseLeave: e => e.currentTarget.style.color = '#999'
  }, value) : /*#__PURE__*/React.createElement("span", {
    className: "cmeta-value"
  }, value));
}
function CField({
  index,
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  multiline = false,
  error
}) {
  const [lang] = useLang();
  const [focus, setFocus] = useState(false);
  const common = {
    value,
    onChange: e => onChange(e.target.value),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    placeholder,
    className: 'cf-input',
    'aria-invalid': error ? 'true' : undefined
  };
  return /*#__PURE__*/React.createElement("div", {
    className: `cf-field${multiline ? ' cf-full' : ''}${error ? ' has-err' : ''}`
  }, /*#__PURE__*/React.createElement("label", {
    className: `cf-label${focus ? ' on' : ''}`,
    lang: lang === 'TR' ? 'tr' : 'en'
  }, index && /*#__PURE__*/React.createElement("span", {
    className: "cf-num"
  }, index), /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("div", {
    className: `cf-inputwrap${focus ? ' on' : ''}`
  }, multiline ? /*#__PURE__*/React.createElement("textarea", _extends({
    rows: 2
  }, common)) : /*#__PURE__*/React.createElement("input", _extends({
    type: type
  }, common)), /*#__PURE__*/React.createElement("span", {
    className: "cf-line",
    style: {
      transform: focus || error ? 'scaleX(1)' : 'scaleX(0)'
    }
  })), error && /*#__PURE__*/React.createElement("span", {
    className: "cf-err",
    role: "alert"
  }, error));
}
function CSendBtn({
  status
}) {
  const [lang] = useLang();
  const [hov, setHov] = useState(false);
  const magRef = useMagnetic(0.18);
  const sending = status === 'sending';
  const sent = status === 'sent';
  const label = sending ? rbT('contact.sending', lang) : sent ? rbT('contact.sent', lang) : status === 'error' ? rbT('contact.tryAgain', lang) : rbT('contact.send', lang);
  const glyph = sending ? '·' : sent ? '✓' : '⇀';
  return /*#__PURE__*/React.createElement("button", {
    type: "submit",
    ref: magRef,
    disabled: sending,
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    lang: lang === 'TR' ? 'tr' : 'en',
    style: {
      alignSelf: 'flex-end',
      marginTop: '8px',
      background: 'transparent',
      border: 'none',
      padding: 0,
      color: 'var(--orange)',
      fontFamily: "'Space Grotesk'",
      fontWeight: 600,
      fontSize: '13px',
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      cursor: 'none',
      opacity: sending ? 0.65 : 1,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '14px',
      transition: 'color 0.35s ease, opacity 0.3s ease'
    }
  }, /*#__PURE__*/React.createElement("span", null, label), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'inline-block',
      transform: sent || sending ? 'none' : hov ? 'translateX(6px)' : 'translateX(0)',
      transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1)'
    }
  }, glyph));
}

/* ── Footer ── */
function Footer({
  setView,
  scrollToSection
}) {
  const [lang] = useLang();
  const go = item => {
    if (item === 'Works') {
      setView && setView('works');
    } else {
      setView && setView('home');
      scrollToSection && scrollToSection(item === 'Studio' ? 'about' : item.toLowerCase());
    }
  };
  return /*#__PURE__*/React.createElement("footer", {
    className: "rb-footer",
    style: {
      marginTop: '0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer-grid"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(LogoMark, {
    size: 16
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "'Space Grotesk'",
      fontWeight: 300,
      fontSize: '14px',
      lineHeight: 1.7,
      color: '#6f6f6f',
      maxWidth: '34ch'
    }
  }, rbT('footer.brand', lang))), /*#__PURE__*/React.createElement("div", {
    className: "footer-location"
  }, /*#__PURE__*/React.createElement("span", {
    className: "footer-col-label",
    lang: lang === 'TR' ? 'tr' : 'en'
  }, rbT('footer.location', lang)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "'Space Grotesk'",
      fontWeight: 300,
      fontSize: '13.5px',
      lineHeight: 1.8,
      color: '#6f6f6f',
      maxWidth: '30ch'
    }
  }, "Esentepe, Tevfik Erd\xF6nmez Pa\u015Fa Sokak No:2/1 D:6", /*#__PURE__*/React.createElement("br", null), "34394 \u015Ei\u015Fli / \u0130stanbul")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "footer-col-label",
    lang: lang === 'TR' ? 'tr' : 'en'
  }, rbT('footer.menu', lang)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      alignItems: 'flex-start'
    }
  }, [['nav.studio', 'Studio'], ['nav.works', 'Works'], ['nav.services', 'Services'], ['nav.contact', 'Contact']].map(([key, target]) => /*#__PURE__*/React.createElement("button", {
    key: target,
    className: "footer-link",
    lang: lang === 'TR' ? 'tr' : 'en',
    style: {
      cursor: 'none'
    },
    onClick: () => go(target)
  }, rbT(key, lang))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "footer-col-label",
    lang: lang === 'TR' ? 'tr' : 'en'
  }, rbT('footer.connect', lang)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      alignItems: 'flex-start'
    }
  }, [['Vimeo', 'https://vimeo.com/robust'], ['Instagram', 'https://www.instagram.com/robust.film/?hl=tr'], ['LinkedIn', 'https://www.linkedin.com/company/robustfims']].map(([s, url]) => /*#__PURE__*/React.createElement("a", {
    key: s,
    className: "footer-link",
    href: url,
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      cursor: 'none'
    }
  }, s))))), /*#__PURE__*/React.createElement("div", {
    className: "footer-bottom"
  }, /*#__PURE__*/React.createElement("span", {
    className: "footer-fine"
  }, "\xA9 2026 Robust"), /*#__PURE__*/React.createElement("span", {
    className: "footer-rights"
  }, rbT('footer.rights', lang)), /*#__PURE__*/React.createElement(BackToTop, null)));
}
function BackToTop() {
  const [lang] = useLang();
  const [hov, setHov] = useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => window.rbScrollToTop(),
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    lang: lang === 'TR' ? 'tr' : 'en',
    style: {
      background: 'none',
      border: 'none',
      cursor: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      fontFamily: "'Space Grotesk'",
      fontSize: '12px',
      fontWeight: 700,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: hov ? 'rgba(255,255,255,0.4)' : 'var(--gray-4)',
      transition: 'color 0.3s ease',
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      transform: hov ? 'translateY(-3px)' : 'translateY(0)',
      transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)'
    }
  }, "\u2191"), /*#__PURE__*/React.createElement("span", null, rbT('footer.backToTop', lang)));
}
Object.assign(window, {
  Services,
  Contact,
  Footer
});
})();
