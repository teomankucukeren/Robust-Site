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
    title: 'Showreel', client: 'Robust', type: 'Studio Reel', typeTR: 'Stüdyo Reeli',
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
      case 'project':  return '#/project/' + encodeURIComponent(route.slug || slugForWork(route.work)) +
                              (route.base === 'works' ? '?from=work' : '');
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
    // The page a project was opened FROM lives in the hash query (?from=work),
    // not only in history.state — so Back still returns to the Work page after a
    // reload, a shared link, or any browser that drops our state object.
    let q = '';
    const qi = h.indexOf('?');
    if (qi >= 0) { q = h.slice(qi + 1); h = h.slice(0, qi); }
    if (h === '/work' || h === '/works') return { name: 'works' };
    if (h === '/showreel') return { name: 'showreel', work: SHOWREEL };
    const m = h.match(/^\/project\/(.+)$/);
    if (m) {
      const slug = decodeURIComponent(m[1]);
      const w = workForSlug(slug);
      const base = /(^|&)from=work(&|$)/.test(q) ? 'works' : 'home';
      if (w) return { name: 'project', slug, base, noNav: false, work: w };
    }
    return { name: 'home' };
  }

  // The view that must sit under a route — i.e. where Back has to land.
  function baseRouteUnder(route) {
    if (route.name === 'project' && route.base === 'works') return { name: 'works' };
    return { name: 'home' };
  }

  // ── store + subscription ────────────────────────────────────────────────────
  let _current = { name: 'home' };
  const _subs = new Set();
  function notify() { _subs.forEach((fn) => { try { fn(_current); } catch (e) {} }); }
  function setCurrent(route) { _current = route; notify(); }

  // Where our own back() call expects to land. Checked on the next popstate: if
  // the entry beneath us is not the base we came from (state dropped, an iframe
  // slipped an entry into the stack), we correct the landing in place instead of
  // dumping the viewer on the homepage.
  let _expectBack = null;

  function push(route) {
    _expectBack = null;
    history.pushState(serialize(route), '', urlFor(route));
    setCurrent(route);
  }
  function replace(route) {
    _expectBack = null;
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

    back() { _expectBack = baseRouteUnder(_current); history.back(); },

    // Called once, after the component catalogue is loaded, before React mounts.
    init() {
      const route = parseHash(location.hash);
      if (route.name === 'home') {
        replace(route);
      } else {
        // Synthesize the right entry beneath the deep-linked view so Back always
        // has somewhere to go: the Work page for a project opened from the
        // archive, the homepage for everything else.
        const under = baseRouteUnder(route);
        history.replaceState(serialize(under), '', urlFor(under));
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
    const want = _expectBack;
    _expectBack = null;
    // Our own back() ran but the stack put us somewhere else — rewrite this
    // entry into the view the viewer actually came from.
    if (want && route.name !== want.name) { replace(want); return; }
    setCurrent(route);
  });

  window.RBRouter = RBRouter;
})();

  // Reliable smooth "back to top". Plain window.scrollTo({top:0,behavior:'smooth'})
  // can stop short on mobile: scrolling up shows the browser's address bar,
  // which shrinks/grows the viewport mid-animation, and some browsers end the
  // native smooth-scroll early against the now-stale target. We keep the native
  // smooth animation (so it still looks/feels smooth) but watch it with rAF and
  // snap the rest of the way if it stalls before reaching 0.
  window.rbScrollToTop = function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    let last = -1, stalled = 0;
    (function watch() {
      const y = window.scrollY;
      if (y <= 0) return;
      if (y === last) {
        stalled++;
        if (stalled > 2) { window.scrollTo({ top: 0, behavior: 'smooth' }); stalled = 0; }
      } else {
        stalled = 0;
      }
      last = y;
      requestAnimationFrame(watch);
    })();
  };

