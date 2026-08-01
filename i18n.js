// i18n.js — shared language store across all component scripts.
// Plain JS (no JSX) so it can load before React component files.
// Exposes: window.useLang(), window.setRbLang(l), window.rbT(key), window.RB_LANGS.
//
// Language architecture (subdirectory model)
// ------------------------------------------
// The BUILT pages declare their own language in <head>:
//   <meta name="rb-lang"     content="TR">    ← this page's language, authoritative
//   <meta name="rb-lang-alt" content="/en/">  ← where the other language lives
// On those pages the language is a property of the URL, not of localStorage:
//   robust.film/     → Turkish
//   robust.film/en/  → English
// so the switch NAVIGATES (preserving the #hash) instead of re-rendering, and a
// shared link always opens in the language it was shared in.
//
// The root working file (index.html) carries no rb-lang meta — there the old
// in-page switch behaviour is kept so the source stays directly editable.
(function () {
  const STORE_KEY  = 'rb-lang';         // last known language
  const CHOICE_KEY = 'rb-lang-choice';  // set only when the user picks a language by hand
  const DEFAULT    = 'TR';

  function metaVal(name) {
    const m = document.querySelector('meta[name="' + name + '"]');
    return (m && m.getAttribute('content')) || '';
  }

  // '' on the working file, 'TR' | 'EN' on a built page.
  const PAGE_LANG = metaVal('rb-lang').toUpperCase();
  const ALT_URL   = metaVal('rb-lang-alt');

  let initial = DEFAULT;
  if (PAGE_LANG === 'TR' || PAGE_LANG === 'EN') {
    initial = PAGE_LANG;
  } else {
    try { initial = localStorage.getItem(STORE_KEY) || DEFAULT; } catch (e) {}
  }
  window.__rbLang = window.__rbLang || initial;

  // Titles per language — swapped in place, since the <title> in the file only
  // describes the language that file was built for.
  const SELF_TITLE = document.title;
  const ALT_TITLE  = metaVal('rb-title-alt') || document.title;

  // Both language URLs are resolved ONCE, against the address the document was
  // loaded from. They must not be recomputed later: the switch rewrites the
  // address bar, so a relative path would then resolve against the new address
  // and the way back would point at itself.
  function resolveUrl(u) {
    let a = u || './';
    if (!/(^|\.)robust\.film$/i.test(location.hostname) && /\/$/.test(a)) a += 'index.html';
    return a;
  }
  const SELF_PATH = location.pathname;
  const ALT_PATH = (function () {
    try { return new URL(resolveUrl(ALT_URL), location.href).pathname; } catch (e) { return SELF_PATH; }
  })();

  const subs = (window.__rbLangSubs = window.__rbLangSubs || new Set());

  function setRbLang(l) {
    if (l !== 'EN' && l !== 'TR') return;

    // Remember that this was a deliberate choice — the first-visit language
    // detection on the Turkish page must never override it again.
    try {
      localStorage.setItem(CHOICE_KEY, l);
      localStorage.setItem(STORE_KEY, l);
    } catch (e) {}

    // Built page → switch IN PLACE and rewrite the address bar.
    //
    // Navigating to the other file would be a real page load: the background
    // reel restarts, the canvas re-initialises, the scroll position resets.
    // Instead the text swaps in place and the URL is rewritten without a
    // reload — so the address still says /en/ (copy it, share it, reload it and
    // the English document is served) while nothing on screen is torn down.
    if (PAGE_LANG) {
      if (l === window.__rbLang) return;
      const toSelf = (l === PAGE_LANG);
      try {
        history.replaceState(history.state, '', (toSelf ? SELF_PATH : ALT_PATH) + window.location.hash);
      } catch (e) {}
      document.title = toSelf ? SELF_TITLE : ALT_TITLE;
      // The root lang must describe the text actually on screen: with lang="tr"
      // the browser applies Turkish casing to English words too ("STUDİO",
      // "SERVİCES"). Safe here because the visible copy follows the dictionary.
      try { document.documentElement.lang = l.toLowerCase(); } catch (e) {}
      window.__rbLang = l;
      try { localStorage.setItem(STORE_KEY, l); } catch (e) {}
      subs.forEach((fn) => { try { fn(l); } catch (e) {} });
      return;
    }

    // Working file → in-page switch (unchanged behaviour).
    window.__rbLang = l;
    // NOTE: intentionally do NOT touch document.documentElement.lang here.
    // Flipping the root <lang> makes the browser re-shape every text node with
    // the new locale's kerning rules (the dotted/dotless "i"), which visibly
    // squished the still-English hero headline on each EN⇄TR switch. On the
    // built pages this never happens: lang is written into the file once.
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
    'nav.studio':   { EN: 'Studio',   TR: 'Stüdyo' },
    'nav.works':    { EN: 'Work',     TR: 'Projeler' },
    'nav.services': { EN: 'Services', TR: 'Hizmetler' },
    'nav.contact':  { EN: 'Contact',  TR: 'İletişim' },

    // Hero
    'hero.headline': { EN: 'Ideas—developed, shaped, produced',  TR: 'Ideas—developed, shaped, produced' },
    'hero.showreel': { EN: 'Showreel',                  TR: 'Showreel' },
    'hero.explore':  { EN: 'Explore the Work',          TR: 'Projeler' },
    'hero.scroll':   { EN: 'Scroll',                    TR: 'Kaydır' },

    // Highlights / Works
    'works.title':   { EN: 'Highlights',        TR: 'Seçili Projeler' },
    'works.viewAll': { EN: 'View Full Archive', TR: 'Projeleri İncele' },

    // About / Studio
    'about.title':   { EN: 'The Studio',        TR: 'Stüdyo' },
    // Bu üçü Türkçe sürümde de İngilizce kalıyor (stüdyonun tercihi).
    'about.since': { EN: 'Since', TR: 'Since' },
    'about.foundedBy': { EN: 'Founded by',      TR: 'Founded by' },
    'about.basedIn': { EN: 'Based in Istanbul', TR: 'Based in Istanbul' },
    'about.leadPre': {
      EN: 'Founded in Istanbul in 2019, ',
      TR: '2019’da İstanbul’da kurulan ',
    },
    'about.leadPost': {
      EN: ' is a creative production studio driven by ideas, craftsmanship, and visual storytelling.',
      TR: ', fikir, zanaat ve görsel hikâye anlatıcılığını bir araya getiren bir kreatif prodüksiyon stüdyosudur.',
    },
    'about.body': {
      EN: 'We work across creative development, production, and post-production, creating films and experiences with a clear point of view. From brand films and digital campaigns to animation and motion-led work, we develop ideas, build their visual worlds, and carry them through every stage of production.',
      TR: 'Kreatif geliştirmeden prodüksiyon ve post-prodüksiyona kadar tüm süreci üstleniyor; güçlü fikirlerden beslenen, kendine özgü bir görsel dile sahip işler üretiyoruz. Marka filmleri, dijital kampanyalar, animasyon ve hareket odaklı deneyimler için hikâyeyi geliştiriyor, görsel dünyayı kuruyor ve üretimin her aşamasını yürütüyoruz.',
    },
    // TR çevirisi henüz onaylanmadı — boş kaldığı sürece paragraf Türkçede render edilmez.
    'about.body2': {
      EN: '',
      TR: '',
    },

    // Services
    'services.title': { EN: 'What We Do', TR: 'Hizmetler' },

    // Contact
    'contact.headline1': { EN: 'Got something', TR: '' },
    'contact.headline2': { EN: 'in mind?',      TR: 'İletişim' },
    'contact.status':    { EN: 'Available for projects — 2026', TR: 'Yeni projeler için müsaitiz — 2026' },
    'contact.label':     { EN: 'Contact Us', TR: 'İletişim Formu' },
    'contact.note':      { EN: 'Every message reaches us directly — expect a reply within two working days.', TR: 'Her mesaj bize doğrudan ulaşır — iki iş günü içinde yanıt bekleyebilirsin.' },
    'contact.field.name':    { EN: 'Name',    TR: 'İsim' },
    'contact.field.email':   { EN: 'Email',   TR: 'E-posta' },
    'contact.field.message': { EN: 'Message', TR: 'Mesaj' },
    'contact.ph.name':    { EN: 'Your name', TR: 'Ad - Soyad' },
    'contact.ph.email':   { EN: 'you@studio.com', TR: 'ornek@sirket.com' },
    'contact.ph.message': { EN: 'Tell us what’s on your mind', TR: 'Aklından geçeni bizimle paylaş.' },
    'contact.err.name':         { EN: 'Please add your name.', TR: 'Adını eklemeyi unutma.' },
    'contact.err.email':        { EN: 'Please add your email address.', TR: 'E-posta adresini eklemeyi unutma.' },
    'contact.err.emailFormat':  { EN: 'That doesn’t look like a valid email — check the format.', TR: 'Bu geçerli bir e-posta adresine benzemiyor — formatı kontrol et.' },
    'contact.err.message':      { EN: 'Tell us what’s on your mind.', TR: 'Aklından geçeni bizimle paylaş.' },
    'contact.sending':   { EN: 'Sending…', TR: 'Gönderiliyor…' },
    'contact.sent':      { EN: 'Message Sent', TR: 'Mesaj Gönderildi' },
    'contact.tryAgain':  { EN: 'Try Again', TR: 'Tekrar Dene' },
    'contact.send':      { EN: 'Send Message', TR: 'Gönder' },
    'contact.sentNote':  { EN: 'Thanks — we\'ll reply within two working days.', TR: 'Teşekkürler — iki iş günü içinde döneceğiz.' },
    'contact.errGeneric': { EN: 'Something went wrong — please email us directly.', TR: 'Bir şeyler ters gitti — lütfen bize doğrudan e-posta gönder.' },
    'contact.errNetwork': { EN: 'Network error — please email us directly.', TR: 'Bağlantı hatası — lütfen bize doğrudan e-posta gönder.' },

    // Footer
    'footer.brand':    { EN: 'Creative media studio crafting films, campaigns and visual experiences. Istanbul — since 2019.', TR: 'Film, kampanya ve görsel deneyimler üreten yaratıcı medya stüdyosu. İstanbul — 2019’dan beri.' },
    'footer.location': { EN: 'Location', TR: 'Lokasyon' },
    'footer.menu':     { EN: 'Menu', TR: 'Menü' },
    'footer.connect':  { EN: 'Connect', TR: 'Sosyal' },
    'footer.rights':   { EN: 'All Rights Reserved.', TR: 'Tüm Hakları Saklıdır.' },
    'footer.backToTop': { EN: 'Back to top', TR: 'Başa Dön' },

    // Project case study (Work / Highlights → opened project page)
    'pcase.overview': { EN: 'Overview',  TR: 'Genel Bakış' },
    'pcase.client':   { EN: 'Client',    TR: 'Müşteri' },
    'pcase.designer': { EN: 'Designer',  TR: 'Tasarımcı' },
    'pcase.year':     { EN: 'Year',      TR: 'Yıl' },
    'pcase.role':     { EN: 'Role',      TR: 'Rol' },
    'pcase.close':    { EN: 'ESC — Close',        TR: 'ESC — Kapat' },
    'pcase.back':     { EN: '← Back to Archive',  TR: '← Arşive Dön' },

    // Video overlay (click-to-play, both Highlights and Work page)
    'credit.project':    { EN: 'Project',    TR: 'Proje' },
    'credit.type':       { EN: 'Type',       TR: 'Tür' },
    'credit.production': { EN: 'Production', TR: 'Prodüksiyon' },
    'credit.agency':     { EN: 'Agency',     TR: 'Ajans' },
    'credit.director':   { EN: 'Director',   TR: 'Yönetmen' },
    'credit.dop':        { EN: 'DoP',        TR: 'Görüntü Yönetmeni' },
    'credit.editor':     { EN: 'Editor',     TR: 'Kurgu' },
    'overlay.prevFilm':  { EN: 'Previous film', TR: 'Önceki film' },
    'overlay.nextFilm':  { EN: 'Next film',     TR: 'Sonraki film' },
    'overlay.replay':    { EN: 'Replay', TR: 'Tekrar Oynat' },

    // Work / Archive page
    'archive.eyebrow':  { EN: 'Archive',  TR: 'Projeler' },
    'archive.title':    { EN: 'Work',     TR: 'Arşiv' },
    'archive.projects': { EN: 'Projects', TR: 'Proje' },
    'archive.backHome': { EN: '← Back to Home', TR: '← Ana Sayfa' },
    'archive.cat.all':             { EN: 'ALL',             TR: 'TÜMÜ' },
    'archive.cat.production':      { EN: 'PRODUCTION',      TR: 'PRODÜKSİYON' },
    'archive.cat.animation':       { EN: 'ANIMATION',       TR: 'ANİMASYON' },
    'archive.cat.post-production': { EN: 'POST-PRODUCTION', TR: 'POST PRODÜKSİYON' },
    'archive.cat.design':          { EN: 'DESIGN',          TR: 'TASARIM' },
  };

  // Look up a key in the current (or given) language, falling back to EN then the key.
  function rbT(key, lang) {
    const L = lang || window.__rbLang || DEFAULT;
    const entry = DICT[key];
    if (!entry) return key;
    // An empty string is a deliberate "not translated yet, don't show" marker,
    // so it must not fall back to English.
    if (entry[L] !== undefined) return entry[L];
    return entry.EN || key;
  }

  Object.assign(window, { useLang, setRbLang, rbT, RB_LANGS: ['TR', 'EN'], RB_DICT: DICT, RB_PAGE_LANG: PAGE_LANG });
})();
