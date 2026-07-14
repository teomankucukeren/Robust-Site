// app.jsx — Root application with view state
const { useState, useEffect, useCallback } = React;

try {
  // ascii loader does its own orange-flash hard-cut, so the page underneath
  // must snap straight in (no soft blur/scale) the instant the flash lifts.
  document.body.dataset.reveal = 'hard';
} catch (e) {}

const HERO_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "headlineSize": "large",
  "headlineMode": "statement",
  "showEyebrow": false,
  "eyebrowText": "Independent film & visual studio \u2014 \u0130stanbul",
  "ctaStyle": "links",
  "socialGlow": "bright",
  "svcLayout": "list"
}/*EDITMODE-END*/;

function App() {
  const [view, setView] = useState('home');
  const [booted, setBooted] = useState(false);
  const [tw, setTweak] = useTweaks(HERO_TWEAK_DEFAULTS);
  // Within the Works section: 'sphere' (the 3D vault) or 'simple' (flat list).
  const [worksMode, setWorksMode] = useState('simple');

  // Jump instantly to a section ID (home-view only).
  // Smooth-scrolling through the Works funnel triggers its 3D rotation
  // animation for every pixel traveled — instant jump avoids that entirely.
  const scrollToSection = useCallback((id) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'instant' });
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

  // Jump to top on view change; always return to the sphere when leaving Works
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.body.dataset.view = view;
    if (view !== 'works') setWorksMode('simple');
  }, [view]);

  return (
    <>
      {/* Global keyframe animations */}
      <style>{`
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
      `}</style>

      <AsciiLoader onReveal={() => setBooted(true)} />

      {booted && <ScrollProgress />}
      {booted && <SideNav view={view} setView={setView} />}

      {booted && view === 'home' && (
        <div className="rb-page-enter" data-screen-label="Home">
          <Nav view={view} setView={setView} scrollToSection={scrollToSection} />
          <Hero setView={setView} tw={tw} />
          <About />
          <Ticker />
          <WorksVitrin setView={setView} />
          <Services layout={tw.svcLayout} />
          <Contact />
          <Footer setView={setView} scrollToSection={scrollToSection} />
        </div>
      )}

      {booted && view === 'works' && (
        <div className="rb-page-enter" data-screen-label="Works Archive">
          <WorksArchive setView={setView} />
        </div>
      )}

      {booted && view === 'home' && (
        <TweaksPanel title="Tweaks">
          <TweakSection label="Headline" />
          <TweakRadio label="Size" value={tw.headlineSize}
            options={['default', 'large', 'huge']}
            onChange={(v) => setTweak('headlineSize', v)} />
          <TweakRadio label="Content" value={tw.headlineMode}
            options={['statement', 'rotate']}
            onChange={(v) => setTweak('headlineMode', v)} />

          <TweakSection label="Context" />
          <TweakToggle label="Eyebrow line" value={tw.showEyebrow}
            onChange={(v) => setTweak('showEyebrow', v)} />
          {tw.showEyebrow &&
            <TweakText label="Eyebrow text" value={tw.eyebrowText}
              onChange={(v) => setTweak('eyebrowText', v)} />}

          <TweakSection label="Actions & rail" />
          <TweakRadio label="CTA style" value={tw.ctaStyle}
            options={['links', 'solid']}
            onChange={(v) => setTweak('ctaStyle', v)} />
          <TweakRadio label="Social icons" value={tw.socialGlow}
            options={['bright', 'dim']}
            onChange={(v) => setTweak('socialGlow', v)} />

          <TweakSection label="Services (desktop)" />
          <TweakRadio label="Layout" value={tw.svcLayout === 'index' ? '01' : tw.svcLayout}
            options={['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', 'list']}
            onChange={(v) => setTweak('svcLayout', v)} />
        </TweaksPanel>
      )}
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
