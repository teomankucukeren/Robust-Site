// router.js — client-side history + deep-link routing for the SPA.
//
// URL scheme (hash-based, works on static hosting / GitHub Pages):
//   /                      → home
//   #/work                 → Work archive page
//   #/project/<slug>       → a project (video plays, or design case study)
//   #/showreel             → studio showreel overlay
//
// History model
// -------------
// Every navigation that should be its own "Back" stop calls history.pushState.
//   • Home → Work            : push(work)
//   • Open a project         : push(project, base = home|works)
//   • Open the showreel       : push(showreel)
// Sideways navigation between projects (prev/next arrows) REPLACES the current
// entry — so pressing Back from any project returns to its base (Home or the
// Work page), never to the previously-swiped project.
// The X / Esc / backdrop close calls history.back(), popping to that base.
//
// A project's base (home vs works) is kept in history.state, not the URL, so a
// shared/cold-loaded link resolves to base = home → Back returns to the
// homepage, exactly as if the project had been opened from Highlights.
(function () {
  const SHOWREEL = {
    title: 'Showreel', client: 'Robust', type: 'Studio Reel',
    year: '2019', vimeoId: '374179028', __showreel: true,
  };

  // ── slug helpers ──────────────────────────────────────────────────────────
  function slugify(s) {
    let x = String(s || '');
    x = x.replace(/Ç/g, 'c').replace(/ç/g, 'c')
         .replace(/Ğ/g, 'g').replace(/ğ/g, 'g')
         .replace(/İ/g, 'i').replace(/I/g, 'i').replace(/ı/g, 'i')
         .replace(/Ö/g, 'o').replace(/ö/g, 'o')
         .replace(/Ş/g, 's').replace(/ş/g, 's')
         .replace(/Ü/g, 'u').replace(/ü/g, 'u');
    x = x.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    x = x.replace(/&/g, '-and-').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return x || 'project';
  }

  let _mapped = false;
  let _slugToWork = {};
  function ensureMaps() {
    const cat = window.FEATURED_WORKS;
    // Rebuild until the catalogue is available (router loads before it).
    if (_mapped && Object.keys(_slugToWork).length) return;
    if (!cat || !cat.length) return;
    _slugToWork = {};
    const used = {};
    cat.forEach((w) => {
      let s = slugify(w.title);
      if (used[s]) s = s + '-' + w.id;
      used[s] = true;
      w.__slug = s;
      _slugToWork[s] = w;
    });
    _mapped = true;
  }

  function slugForWork(work) {
    if (!work) return '';
    if (work.__showreel) return 'showreel';
    ensureMaps();
    if (work.__slug) return work.__slug;
    return slugify(work.title);
  }

  function workForSlug(slug) {
    if (!slug) return null;
    if (slug === 'showreel') return SHOWREEL;
    ensureMaps();
    return _slugToWork[slug] || null;
  }

  // ── route <-> url / state ───────────────────────────────────────────────────
  function urlFor(route) {
    switch (route.name) {
      case 'works':    return '#/work';
      case 'project':  return '#/project/' + encodeURIComponent(route.slug || slugForWork(route.work));
      case 'showreel': return '#/showreel';
      default:         return location.pathname + location.search; // home → no hash
    }
  }

  function serialize(route) {
    return {
      rb: true,
      name: route.name,
      slug: route.slug || (route.work ? slugForWork(route.work) : null),
      base: route.base || null,
      noNav: !!route.noNav,
      work: route.work || null,
    };
  }

  function deserialize(state) {
    const r = {
      name: state.name || 'home',
      slug: state.slug || null,
      base: state.base || null,
      noNav: !!state.noNav,
      work: state.work || null,
    };
    if (r.name === 'showreel' && !r.work) r.work = SHOWREEL;
    if (r.name === 'project' && !r.work) r.work = workForSlug(r.slug);
    if (r.name === 'project' && !r.work) return { name: 'home' };
    return r;
  }

  function parseHash(hash) {
    let h = (hash || '').replace(/^#/, '');
    if (h === '/work' || h === '/works') return { name: 'works' };
    if (h === '/showreel') return { name: 'showreel', work: SHOWREEL };
    const m = h.match(/^\/project\/(.+)$/);
    if (m) {
      const slug = decodeURIComponent(m[1]);
      const w = workForSlug(slug);
      if (w) return { name: 'project', slug, base: 'home', noNav: false, work: w };
    }
    return { name: 'home' };
  }

  // ── store + subscription ────────────────────────────────────────────────────
  let _current = { name: 'home' };
  const _subs = new Set();
  function notify() { _subs.forEach((fn) => { try { fn(_current); } catch (e) {} }); }
  function setCurrent(route) { _current = route; notify(); }

  function push(route) {
    history.pushState(serialize(route), '', urlFor(route));
    setCurrent(route);
  }
  function replace(route) {
    history.replaceState(serialize(route), '', urlFor(route));
    setCurrent(route);
  }

  // ── public navigation API ───────────────────────────────────────────────────
  const RBRouter = {
    SHOWREEL,
    slugForWork,
    workForSlug,
    get() { return _current; },
    subscribe(fn) { _subs.add(fn); return () => _subs.delete(fn); },

    openWorks() { push({ name: 'works' }); },

    openProject(work, opts) {
      opts = opts || {};
      push({
        name: 'project',
        slug: slugForWork(work),
        base: opts.base || 'home',
        noNav: !!opts.noNav,
        work,
      });
    },

    // prev/next within the overlay — keep the same base, don't add a Back stop.
    changeProject(work) {
      replace({
        name: 'project',
        slug: slugForWork(work),
        base: _current.base || 'home',
        noNav: _current.noNav,
        work,
      });
    },

    openShowreel() { push({ name: 'showreel', work: SHOWREEL }); },

    goHome() { if (_current.name !== 'home') push({ name: 'home' }); },

    back() { history.back(); },

    // Called once, after the component catalogue is loaded, before React mounts.
    init() {
      const route = parseHash(location.hash);
      if (route.name === 'home') {
        replace(route);
      } else {
        // Synthesize a Home entry beneath the deep-linked view so Back always
        // has somewhere to go (homepage) before leaving the site.
        history.replaceState(serialize({ name: 'home' }), '', location.pathname + location.search);
        push(route);
      }
    },

    // React hook — subscribes a component to route changes.
    useRoute() {
      const [r, setR] = React.useState(_current);
      React.useEffect(() => RBRouter.subscribe(setR), []);
      return r;
    },
  };

  window.addEventListener('popstate', function (e) {
    const route = (e.state && e.state.rb) ? deserialize(e.state) : parseHash(location.hash);
    setCurrent(route);
  });

  window.RBRouter = RBRouter;
})();
