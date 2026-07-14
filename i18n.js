// i18n.js — shared language store across all babel component scripts.
// Plain JS (no JSX) so it can load before React component files.
// Exposes: window.useLang(), window.setRbLang(l), window.rbT(key), window.RB_LANGS.
(function () {
  const STORE_KEY = 'rb-lang';
  const DEFAULT = 'EN';

  // Persisted current language, shared on window so every script sees the same value.
  let initial = DEFAULT;
  try { initial = localStorage.getItem(STORE_KEY) || DEFAULT; } catch (e) {}
  window.__rbLang = window.__rbLang || initial;

  const subs = (window.__rbLangSubs = window.__rbLangSubs || new Set());

  function setRbLang(l) {
    if (l !== 'EN' && l !== 'TR') return;
    window.__rbLang = l;
    try { localStorage.setItem(STORE_KEY, l); } catch (e) {}
    // NOTE: intentionally do NOT touch document.documentElement.lang here.
    // Flipping the root <lang> makes the browser re-shape every text node with
    // the new locale's kerning rules (the dotted/dotless "i"), which visibly
    // squished the still-English hero headline ("We shape ideas into…") on
    // each EN⇄TR switch. Per-element lang can be set on translated blocks later.
    subs.forEach((fn) => { try { fn(l); } catch (e) {} });
  }

  // React hook — subscribes a component to language changes.
  function useLang() {
    const [lang, setLang] = React.useState(window.__rbLang);
    React.useEffect(() => {
      const fn = (l) => setLang(l);
      subs.add(fn);
      // catch any change that happened between render and effect
      if (window.__rbLang !== lang) setLang(window.__rbLang);
      return () => subs.delete(fn);
    }, []);
    return [lang, setRbLang];
  }

  // Translation dictionary. Add keys here as more of the site gets localised.
  const DICT = {
    // Navigation
    'nav.studio':   { EN: 'Studio',       TR: 'Stüdyo' },
    'nav.works':    { EN: 'Work',         TR: 'İşler' },
    'nav.services': { EN: 'Services',     TR: 'Ne Yapıyoruz' },
    'nav.contact':  { EN: 'Contact', TR: 'İletişim' },
  };

  // Look up a key in the current (or given) language, falling back to EN then the key.
  function rbT(key, lang) {
    const L = lang || window.__rbLang || DEFAULT;
    const entry = DICT[key];
    if (!entry) return key;
    return entry[L] || entry.EN || key;
  }

  Object.assign(window, { useLang, setRbLang, rbT, RB_LANGS: ['TR', 'EN'], RB_DICT: DICT });
})();
