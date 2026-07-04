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
  if (window.Vimeo) {
    try { player = new window.Vimeo.Player(iframe); } catch (e) {}
  }
  function pause() { if (player) player.pause().catch(function () {}); }
  function play()  { if (player) player.play().catch(function () {}); }

  window.__rbBgReel = { pause: pause, play: play };

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) pause(); else play();
  });
})();
