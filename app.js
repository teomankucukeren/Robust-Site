/* app.jsx — derlenmiş. Kaynağı kök dizinde düzenle, sonra yeniden derle. */
(function(){
// app.jsx — Root application with view state
const {
  useState,
  useEffect,
  useCallback
} = React;

// Tweaks panelinin görünürlüğü. Yayın alan adında ziyaretçi bunu görmemeli;
// ?tweaks=1 ile açılır ve o sekme boyunca (sessionStorage) açık kalır.
const TWEAKS_VISIBLE = (() => {
  try {
    if (/(^|\.)robust\.film$/i.test(location.hostname)) {
      if (/[?&]tweaks=1/.test(location.search)) {
        sessionStorage.setItem('rb-tweaks', '1');
        return true;
      }
      return sessionStorage.getItem('rb-tweaks') === '1';
    }
    return true;
  } catch (e) {
    return false;
  }
})();
try {
  // ascii loader does its own orange-flash hard-cut, so the page underneath
  // must snap straight in (no soft blur/scale) the instant the flash lifts.
  document.body.dataset.reveal = 'hard';
} catch (e) {}
const HERO_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "headlineSize": "large",
  "headlineMode": "statement",
  "ctaStyle": "links",
  "socialGlow": "bright",
  "svcLayout": "list"
} /*EDITMODE-END*/;
function App() {
  const [lang] = useLang();
  const route = window.RBRouter.useRoute();
  // The ASCII boot sequence is a first-impression, not a page transition. Once
  // it has played in this tab it stays played — so switching language (which is
  // a real navigation to /en/ or /) lands straight on the content.
  const [booted, setBooted] = useState(() => {
    try {
      return sessionStorage.getItem('rb-boot') === '1';
    } catch (e) {
      return false;
    }
  });
  const [tw, setTweak] = useTweaks(HERO_TWEAK_DEFAULTS);
  // Within the Works section: 'sphere' (the 3D vault) or 'simple' (flat list).
  const [worksMode, setWorksMode] = useState('simple');

  // The base page rendered UNDER any project/showreel overlay. A project opened
  // from the archive sits over the Work page; everything else sits over Home.
  const baseView = route.name === 'works' || route.name === 'project' && route.base === 'works' ? 'works' : 'home';
  const showHome = baseView === 'home';
  const showWorks = baseView === 'works';

  // setView bridge — nav/hero/footer still call setView('home'|'works').
  const setView = useCallback(v => {
    if (v === 'works') window.RBRouter.openWorks();else window.RBRouter.goHome();
  }, []);

  // Jump instantly to a section ID (home-view only).
  // Smooth-scrolling through the Works funnel triggers its 3D rotation
  // animation for every pixel traveled — instant jump avoids that entirely.
  const scrollToSection = useCallback(id => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top,
        behavior: 'instant'
      });
      // Tell the Works funnel to SNAP to the new scroll position rather than
      // easing into it — otherwise its internal lerp sweeps every card through
      // a full rotation to catch up. Snap-window covers the instant jump.
      window.__rbFunnelSnapUntil = performance.now() + 300;
    }, 80);
  }, []);

  // Reveal the background reel only once the loader has finished, so its first
  // buffered frame can never flash behind the loader during mount.
  useEffect(() => {
    if (booted) document.body.dataset.booted = 'true';
  }, [booted]);

  // Casing guard, NOT a translation to-do list.
  //
  // The Turkish document declares <html lang="tr">, so the browser applies
  // Turkish uppercase rules to every text-transform:uppercase label. That is
  // right for Turkish copy — but wrong for the English proper nouns these
  // sections are full of: client names, project titles, credit roles
  // ("PHİLİPS", "İNSİDE"). Marking the section lang="en" fixes their casing.
  //
  // Translated labels are unaffected: each one carries its own lang="tr" in the
  // component (see svcLang / the rbT call sites), and an explicit child lang
  // always beats the inherited one. So this list stays as long as the sections
  // contain English names — it does not mean the copy is untranslated.
  const PROPER_NOUN_SECTIONS = ['#clients', '#works-vitrin', '#services', '[data-screen-label="Works Archive"]'];
  useEffect(() => {
    if (!booted) return;
    PROPER_NOUN_SECTIONS.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.setAttribute('lang', 'en'));
    });
  }, [booted, baseView, route.name]);

  // Jump to top when the base page changes; always return to the sphere when
  // leaving Works. Opening an overlay does not change baseView, so Home keeps
  // its scroll position behind the overlay (and restores it on close).
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
    document.body.dataset.view = baseView;
    if (baseView !== 'works') setWorksMode('simple');
  }, [baseView]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, `
        @keyframes rb-scroll {
          0%, 100% { opacity: 0.35; transform: scaleY(1);   }
          50%       { opacity: 0.8;  transform: scaleY(1.3); }
        }
        @keyframes rb-scan {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(200%);  }
        }
        @keyframes rb-grain {
          0%   { transform: translate(0, 0); }
          25%  { transform: translate(-24px, 16px); }
          50%  { transform: translate(18px, -22px); }
          75%  { transform: translate(-14px, -10px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes rb-fadein {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes rb-page-reveal {
          from { opacity: 0; transform: scale(1.045); filter: blur(9px); }
          60%  { opacity: 1; }
          to   { opacity: 1; transform: scale(1);     filter: blur(0);   }
        }
        @keyframes cg-recblink {
          0% { opacity: 1; } 50% { opacity: 0.2; } 100% { opacity: 1; }
        }
        @keyframes rb-word-in {
          from { opacity: 0; transform: translateY(0.5em); filter: blur(8px); }
          to   { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes rb-word-roll {
          from { opacity: 0; transform: translateY(105%); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes rb-caret-blink {
          0%, 50% { opacity: 1; }
          50.01%, 100% { opacity: 0; }
        }
        @keyframes rb-word-out {
          from { opacity: 1; transform: translateY(0); filter: blur(0); }
          to   { opacity: 0; transform: translateY(-0.4em); filter: blur(8px); }
        }
        .rb-page-enter {
          animation: rb-page-reveal 1s cubic-bezier(0.16,1,0.3,1) backwards;
          transform-origin: 50% 42%;
        }
        /* hard cut: the orange panel does the reveal — page just snaps in clean */
        body[data-reveal="hard"] .rb-page-enter {
          animation: rb-fadein 0.2s linear backwards;
          transform: none;
          filter: none;
        }
      `), /*#__PURE__*/React.createElement(AsciiLoader, {
    onReveal: () => setBooted(true)
  }), booted && /*#__PURE__*/React.createElement(ScrollProgress, null), booted && /*#__PURE__*/React.createElement(SideNav, {
    view: baseView,
    setView: setView
  }), booted && showHome && /*#__PURE__*/React.createElement("div", {
    className: "rb-page-enter",
    "data-screen-label": "Home"
  }, /*#__PURE__*/React.createElement(Nav, {
    view: baseView,
    setView: setView,
    scrollToSection: scrollToSection
  }), /*#__PURE__*/React.createElement(Hero, {
    setView: setView,
    tw: tw
  }), /*#__PURE__*/React.createElement(About, null), /*#__PURE__*/React.createElement(Ticker, null), /*#__PURE__*/React.createElement(WorksVitrin, {
    setView: setView
  }), /*#__PURE__*/React.createElement(Services, {
    layout: tw.svcLayout
  }), /*#__PURE__*/React.createElement(Contact, null), /*#__PURE__*/React.createElement(Footer, {
    setView: setView,
    scrollToSection: scrollToSection
  })), booted && showWorks && /*#__PURE__*/React.createElement("div", {
    className: "rb-page-enter",
    "data-screen-label": "Works Archive"
  }, /*#__PURE__*/React.createElement(WorksArchive, {
    setView: setView
  })), booted && route.name === 'project' && (() => {
    const WO = window.WorkOverlay;
    if (!WO || !route.work) return null;
    const list = route.noNav ? null : route.base === 'works' ? window.__rbArchiveList || window.ARCHIVE_WORKS : window.SELECTED_WORKS;
    return (
      /*#__PURE__*/
      // No React key on purpose: keying by work would remount the overlay on
      // prev/next, replaying its fade-in and flashing the page underneath.
      React.createElement(WO, {
        work: route.work,
        list: list,
        onChange: route.noNav ? undefined : w => window.RBRouter.changeProject(w),
        onClose: () => window.RBRouter.back()
      })
    );
  })(), booted && route.name === 'showreel' && (() => {
    const WO = window.WorkOverlay;
    if (!WO) return null;
    return /*#__PURE__*/React.createElement(WO, {
      work: route.work || window.RBRouter.SHOWREEL,
      big: true,
      links: [{
        label: rbT('works.title', lang),
        onClick: () => {
          const el = document.getElementById('works-vitrin');
          if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({
              top,
              behavior: 'instant'
            });
            window.__rbFunnelSnapUntil = performance.now() + 300;
          }
          window.RBRouter.closeTo({ name: 'home' });
        }
      }, {
        label: rbT('nav.works', lang),
        onClick: () => {
          window.RBRouter.closeTo({ name: 'works', cat: null });
        }
      }],
      onClose: () => window.RBRouter.back()
    });
  })(), booted && route.name === 'home' && TWEAKS_VISIBLE && /*#__PURE__*/React.createElement(TweaksPanel, {
    title: "Tweaks"
  }, /*#__PURE__*/React.createElement(TweakSection, {
    label: "Headline"
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Size",
    value: tw.headlineSize,
    options: ['default', 'large', 'huge'],
    onChange: v => setTweak('headlineSize', v)
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Content",
    value: tw.headlineMode,
    options: ['statement', 'rotate'],
    onChange: v => setTweak('headlineMode', v)
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Actions & rail"
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "CTA style",
    value: tw.ctaStyle,
    options: ['links', 'solid'],
    onChange: v => setTweak('ctaStyle', v)
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Social icons",
    value: tw.socialGlow,
    options: ['bright', 'dim'],
    onChange: v => setTweak('socialGlow', v)
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Services (desktop)"
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Layout",
    value: tw.svcLayout === 'index' ? '01' : tw.svcLayout,
    options: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', 'list'],
    onChange: v => setTweak('svcLayout', v)
  })));
}
const root = ReactDOM.createRoot(document.getElementById('root'));
window.RBRouter.init();
root.render(/*#__PURE__*/React.createElement(App, null));
})();
