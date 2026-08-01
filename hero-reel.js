// hero-reel.js — Hero background reel: single looping Vimeo stream.
// (The studio's own edit — replaces the earlier multi-clip montage.)
(function () {
  var reel = document.getElementById('rb-bg-reel');
  if (!reel) return;

  var SRC = 'https://player.vimeo.com/video/1205471028?h=2542065429' +
    '&background=1&autoplay=1&loop=1&muted=1&autopause=0&controls=0&title=0&byline=0&portrait=0&badge=0&dnt=1';

  var shot = document.createElement('div');
  shot.className = 'rb-reel-shot';
  var iframe = document.createElement('iframe');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allow', 'autoplay; fullscreen');
  iframe.setAttribute('title', 'Background reel');
  iframe.src = SRC;
  shot.appendChild(iframe);
  reel.appendChild(shot);

  // Pause while a film overlay is open (bandwidth) or the tab is hidden.
  var player = null;
  var started = false; // true once we've actually seen frames play at least once
  if (window.Vimeo) {
    try { player = new window.Vimeo.Player(iframe); } catch (e) {}
  }
  function pause() { if (player) player.pause().catch(function () {}); }
  function play()  { if (player) player.play().catch(function () {}); }

  window.__rbBgReel = { pause: pause, play: play };

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) pause(); else play();
  });

  // Some mobile browsers (iOS Safari with "Auto-Play Videos" set to Off/
  // Wi-Fi Only, some in-app webviews) silently refuse the muted autoplay
  // above — the iframe just sits on Vimeo's own first-frame thumbnail
  // forever, since nothing ever nudges it again. A real user gesture
  // (tap or scroll) satisfies those policies, so retry play on the
  // viewer's first interaction until it actually starts.
  if (player) {
    player.on('playing', function () { started = true; cleanupGestures(); });
    player.on('timeupdate', function () { started = true; cleanupGestures(); });
  }
  function retry() {
    if (started || !player) return;
    player.play().catch(function () {});
  }
  function cleanupGestures() {
    window.removeEventListener('touchstart', retry, true);
    window.removeEventListener('pointerdown', retry, true);
    window.removeEventListener('scroll', retry, true);
  }
  window.addEventListener('touchstart', retry, true);
  window.addEventListener('pointerdown', retry, true);
  window.addEventListener('scroll', retry, { capture: true, passive: true });
})();
