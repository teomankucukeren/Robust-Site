// mobile-motion.js — phone-only (≤760px) scroll-entrance choreography.
// Tags elements the shared <Reveal> wrapper doesn't cover with data-mm
// variants; one IntersectionObserver flips data-mm-in as they enter from
// the bottom. Styling lives in robust.css under the ≤760px media block, so
// tablet/desktop are untouched even if attributes linger after a resize.
// Uses attributes (not classes) so React className re-renders can't wipe
// the revealed state. Transform/opacity only — cheap on mobile GPUs.
(function () {
  'use strict';
  if (window.__rbMobileMotion) return;
  window.__rbMobileMotion = true;

  var mqM = window.matchMedia('(max-width: 760px)');
  var mqR = window.matchMedia('(prefers-reduced-motion: reduce)');

  var GROUPS = [
    { sel: '#clients .vt-wrap', v: 'band' },        // client marquee sweeps in from the right
    { sel: '.svc-list .svc-item', v: 'cue' },       // service rows wipe in like a cue sheet
    { sel: '.contact-form .cf-field', v: 'rise' },  // brief form fields, staggered
    { sel: '.contact-form .cf-foot', v: 'rise' },
    { sel: '.footer-grid > div', v: 'rise' },       // footer blocks, staggered
    // NOTE: .footer-bottom (© line + Back-to-top) is intentionally NOT animated.
    // As the page's very last element it kept landing in the observer's bottom
    // dead-zone and never revealed, so we leave it permanently visible.
    { sel: '.rb-divider', v: 'wire' }               // hairlines draw across
  ];

  var io = null;

  function onEnter(entries) {
    var incoming = [];
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) incoming.push(entries[i]);
    }
    // Elements entering in the same frame stagger top→bottom.
    incoming.sort(function (a, b) {
      return a.boundingClientRect.top - b.boundingClientRect.top;
    });
    incoming.forEach(function (e, i) {
      e.target.style.setProperty('--mm-d', Math.min(i * 90, 360) + 'ms');
      e.target.setAttribute('data-mm-in', '');
      if (io) io.unobserve(e.target);
    });
  }

  function scan() {
    if (!mqM.matches || mqR.matches) return;
    if (!io) {
      io = new IntersectionObserver(onEnter, {
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.01
      });
    }
    GROUPS.forEach(function (g) {
      var els = document.querySelectorAll(g.sel);
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (el.hasAttribute('data-mm')) continue;
        el.setAttribute('data-mm', g.v);
        // Already scrolled past → show instantly, never animate on scroll-up.
        var r = el.getBoundingClientRect();
        if (r.bottom < 0) { el.setAttribute('data-mm-in', ''); continue; }
        io.observe(el);
      }
    });
  }

  var rafId = 0;
  function queueScan() {
    if (rafId) return;
    rafId = requestAnimationFrame(function () { rafId = 0; scan(); });
  }

  function start() {
    var root = document.getElementById('root');
    if (!root) { setTimeout(start, 120); return; }
    // React mounts/remounts sections on view changes — re-tag as they appear.
    new MutationObserver(queueScan).observe(root, { childList: true, subtree: true });
    queueScan();
  }

  if (mqM.addEventListener) mqM.addEventListener('change', queueScan);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
