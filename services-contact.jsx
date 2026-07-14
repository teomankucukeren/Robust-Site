// services-contact.jsx — Services accordion + Contact form + Footer
const { useState, useEffect, useRef } = React;

const SERVICES_DATA = [
{
  num: '01',
  title: 'Film & Video Production',
  tags: ['Concept', 'Set', 'Delivery'],
  desc: 'We produce films and video content from concept to set and final delivery. Our production approach brings together direction, cinematography, planning, and post-production to create work that feels intentional and well-crafted.'
},
{
  num: '02',
  title: 'Animation & Motion Design',
  tags: ['Rhythm', 'Clarity', 'Purpose'],
  desc: 'We design animated visuals, motion graphics, and moving image systems that bring ideas to life beyond live-action. From brand animations to title sequences, explainers, and 2D/3D-led content, we craft motion with rhythm, clarity, and purpose.'
},
{
  num: '03',
  title: 'Campaign & Brand Content',
  tags: ['Purpose', 'Consistency', 'Impact'],
  desc: 'We create campaign films, social-first content, and branded visuals shaped around a clear idea. From launch videos to ongoing content needs, we help brands communicate with purpose, consistency, and strong visual impact.'
},
{
  num: '04',
  title: 'AI Film Making / Generative Production',
  tags: ['Faster', 'Smarter', 'Distinct'],
  desc: 'We explore AI-powered filmmaking as a new creative layer within visual production. From concept development and visual prototyping to generative scenes, AI-assisted workflows, and experimental film techniques, we use emerging tools to shape bold ideas faster, smarter, and with a distinct visual direction.'
},
{
  num: '05',
  title: 'Visual Design / Art Direction',
  tags: ['Mood', 'Composition', 'Identity'],
  desc: 'We shape the visual language behind each project through design, mood, composition, and art direction. Whether for a film, campaign, animation, or digital piece, we build a visual identity that supports the story and strengthens the brand.'
}];


function Services({ layout = '01' }) {
  // Desktop: '01' index · '02' cards · '03' accordion · '04' full-bleed ·
  // '05' quiet · '06' credits · '07' expanding panels · '08' ghost numerals ·
  // '09' cinema strip · '10' rack focus · '11' frames · '12' index accordion ·
  // '13' column accordion · '14' crosshair grid · '15' spotlight list ·
  // '16' showcase reel · '17' call sheet · 'list' original.
  // Tablet/mobile always the compact accordion.
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 961px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 961px)');
    const fn = (e) => setWide(e.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  const mode = layout === 'index' ? '01' : layout; // legacy stored value
  if (mode === '01' && wide) return <ServicesIndex />;
  if (mode === '02' && wide) return <ServicesCards />;
  if (mode === '03' && wide) return <ServicesAccordionX />;
  if (mode === '04' && wide) return <ServicesFullBleed />;
  if (mode === '05' && wide) return <ServicesQuiet />;
  if (mode === '06' && wide) return <ServicesCredits />;
  if (mode === '07' && wide) return <ServicesPanels />;
  if (mode === '08' && wide) return <ServicesNumerals />;
  if (mode === '09' && wide) return <ServicesPanelsX />;
  if (mode === '10' && wide) return <ServicesFocus />;
  if (mode === '11' && wide) return <ServicesFrames />;
  if (mode === '12' && wide) return <ServicesIndexAcc />;
  if (mode === '13' && wide) return <ServicesColumns />;
  if (mode === '14' && wide) return <ServicesCrosshair />;
  if (mode === '15' && wide) return <ServicesSpotlight />;
  if (mode === '16' && wide) return <ServicesShowcase />;
  if (mode === '17' && wide) return <ServicesCallSheet />;
  return <ServicesAccordion />;
}

/* ── Desktop alternative 17: call sheet ──────────────────
   Shot-list table — service · description · keywords in hairline
   rows. Rows fade-rise in with a stagger while each row's hairline
   draws itself across the page. */
function ServicesCallSheet() {
  const [open, setOpen] = useState(0);
  return (
    <section id="services" style={{ marginTop: 'clamp(-150px, -12vh, -50px)', paddingTop: 'clamp(40px, 6vh, 84px)' }}>
      <div className="gutter shell" style={{ paddingBottom: 'clamp(36px, 4.5vh, 56px)' }}>
        <div>
          <Reveal variant="fade">
            <span className="eyebrow">03</span>
          </Reveal>
          <Reveal variant="mask" delay={0.12} style={{ marginTop: '14px' }}>
            <h2 className="display-l"><KineticText text="What We Do" /></h2>
          </Reveal>
        </div>
      </div>

      <div className="svcd-wrap">
        {SERVICES_DATA.map((svc, i) => {
          const isOpen = open === i;
          return (
            <Reveal variant="fade" delay={0.09 * i} key={i}>
              <div className={`svcd-row${isOpen ? ' is-open' : ''}`}>
                <button className="svcd-head" style={{ cursor: 'none' }}
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}>
                  <h3 className="svcd-title">{svc.title}</h3>
                  <span className="svcd-plus" aria-hidden="true">+</span>
                </button>
                <div className="svcd-collapse" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
                  <div className="svcd-collapse-inner">
                    <p className="svc-desc svcd-desc">{svc.desc}</p>
                    <div className="svcd-tags">
                      {svc.tags.map((t) => <span key={t}>{t}</span>)}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>);
        })}
      </div>
    </section>);

}

/* ── Desktop alternative 16: showcase reel ─────────────────
   A tab rail of the five services up top; below, a wide stage where
   the active service plays big — title left, description + tags
   right. Auto-advances like a reel (pauses on hover); clicking a
   tab jumps to it. */
function ServicesShowcase() {
  const [on, setOn] = useState(0);
  const hovRef = useRef(false);
  const reduced = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => {
      if (!hovRef.current) setOn((p) => (p + 1) % SERVICES_DATA.length);
    }, 5000);
    return () => clearInterval(t);
  }, [reduced]);

  const svc = SERVICES_DATA[on];
  return (
    <section id="services" style={{ marginTop: 'clamp(-150px, -12vh, -50px)', paddingTop: 'clamp(40px, 6vh, 84px)' }}>
      <div className="gutter shell" style={{ paddingBottom: 'clamp(36px, 4.5vh, 56px)' }}>
        <div>
          <Reveal variant="fade">
            <span className="eyebrow">03</span>
          </Reveal>
          <Reveal variant="mask" delay={0.12} style={{ marginTop: '14px' }}>
            <h2 className="display-l"><KineticText text="What We Do" /></h2>
          </Reveal>
        </div>
      </div>

      <Reveal variant="fade">
        <div className="svct-wrap"
          onMouseEnter={() => {hovRef.current = true;}}
          onMouseLeave={() => {hovRef.current = false;}}>

          <div className="svct-rail" role="tablist">
            {SERVICES_DATA.map((s, i) =>
            <button key={i} role="tab" aria-selected={on === i}
              className={`svct-tab${on === i ? ' is-on' : ''}`}
              style={{ cursor: 'none' }}
              onClick={() => setOn(i)}>
                <span>{s.title}</span>
                {on === i && !reduced && <i className="svct-meter" key={`m${i}`}></i>}
              </button>
            )}
          </div>

          <div className="svct-stage" key={on}>
            <h3 className="svct-title">{svc.title}</h3>
            <div className="svct-side">
              <p className="svc-desc svct-desc">{svc.desc}</p>
              <span className="svct-tagline">{svc.tags.join(' · ')}</span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>);

}

/* ── Desktop alternative 15: spotlight list ────────────────
   Big bare titles stacked full-width; a floating card with the
   description + tags trails the cursor over the hovered row, like
   a viewfinder readout. */
function ServicesSpotlight() {
  const [hov, setHov] = useState(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const onMove = (e) => setPos({ x: e.clientX, y: e.clientY });

  const CARD_W = 380;
  const flip = typeof window !== 'undefined' && pos.x > window.innerWidth - (CARD_W + 80);
  const cardStyle = {
    left: flip ? pos.x - CARD_W - 28 : pos.x + 28,
    top: pos.y
  };

  return (
    <section id="services" style={{ marginTop: 'clamp(-150px, -12vh, -50px)', paddingTop: 'clamp(40px, 6vh, 84px)' }}>
      <div className="gutter shell" style={{ paddingBottom: 'clamp(36px, 4.5vh, 56px)' }}>
        <div>
          <Reveal variant="fade">
            <span className="eyebrow">03</span>
          </Reveal>
          <Reveal variant="mask" delay={0.12} style={{ marginTop: '14px' }}>
            <h2 className="display-l"><KineticText text="What We Do" /></h2>
          </Reveal>
        </div>
      </div>

      <div className={`svcw-list${hov !== null ? ' has-hov' : ''}`} onMouseMove={onMove} onMouseLeave={() => setHov(null)}>
        {SERVICES_DATA.map((svc, i) =>
        <Reveal key={i} variant="fade" delay={0.05 * i}>
            <div className={`svcw-row${hov === i ? ' is-hov' : ''}`} onMouseEnter={() => setHov(i)}>
              <h3 className="svcw-title">{svc.title}</h3>
              <span className="svc-arrow svcw-arrow" aria-hidden="true">⇀</span>
            </div>
          </Reveal>
        )}

        {hov !== null &&
        <div className="svcw-float" style={cardStyle}>
            <span className="svcw-float-tags">{SERVICES_DATA[hov].tags.join(' · ')}</span>
            <p className="svcw-float-desc">{SERVICES_DATA[hov].desc}</p>
          </div>
        }
      </div>

      {/* hover-less fallback content for touch/keyboard stays in the DOM */}
      <div className="sr-only">
        {SERVICES_DATA.map((svc, i) => <p key={i}>{svc.desc}</p>)}
      </div>
    </section>);

}

/* ── Desktop alternative 14: crosshair grid ────────────────
   A continuous technical grid — 3 cells over 2 — sharing hairlines,
   with '+' registration marks at the interior intersections (like a
   lens chart / technical drawing). Everything is visible at once;
   hover lifts a cell and warms its marks. */
function ServicesCrosshair() {
  return (
    <section id="services" style={{ marginTop: 'clamp(-150px, -12vh, -50px)', paddingTop: 'clamp(40px, 6vh, 84px)' }}>
      <div className="gutter shell" style={{ paddingBottom: 'clamp(36px, 4.5vh, 56px)' }}>
        <div>
          <Reveal variant="fade">
            <span className="eyebrow">03</span>
          </Reveal>
          <Reveal variant="mask" delay={0.12} style={{ marginTop: '14px' }}>
            <h2 className="display-l"><KineticText text="What We Do" /></h2>
          </Reveal>
        </div>
      </div>

      <Reveal variant="fade">
        <div className="svch-wrap">
          <div className="svch-grid">
            {SERVICES_DATA.map((svc, i) =>
            <article key={i} className={`svch-cell svch-cell-${i < 3 ? 'a' : 'b'}`}>
                <div className="svch-top">
                  <h3 className="svch-title">{svc.title}</h3>
                  <span className="svc-arrow svch-arrow" aria-hidden="true">⇀</span>
                </div>
                <p className="svc-desc svch-desc">{svc.desc}</p>
                <span className="svch-tagline">{svc.tags.join(' · ')}</span>
              </article>
            )}
            <span className="svch-mark" style={{ left: '33.333%', top: '50%' }} aria-hidden="true">+</span>
            <span className="svch-mark" style={{ left: '66.667%', top: '50%' }} aria-hidden="true">+</span>
            <span className="svch-mark" style={{ left: '50%', top: '100%' }} aria-hidden="true">+</span>
          </div>
        </div>
      </Reveal>
    </section>);

}

/* ── Desktop alternative 13: column accordion ──────────────
   Horizontal accordion in 01's editorial language: five columns
   SIDE BY SIDE separated by vertical hairlines (no boxes). The open
   column widens and its description + tags unfold under the title;
   the others stay as narrow title columns. */
function ServicesColumns() {
  const [on, setOn] = useState(0);
  return (
    <section id="services" style={{ marginTop: 'clamp(-150px, -12vh, -50px)', paddingTop: 'clamp(40px, 6vh, 84px)' }}>
      <div className="gutter shell" style={{ paddingBottom: 'clamp(36px, 4.5vh, 56px)' }}>
        <div>
          <Reveal variant="fade">
            <span className="eyebrow">03</span>
          </Reveal>
          <Reveal variant="mask" delay={0.12} style={{ marginTop: '14px' }}>
            <h2 className="display-l"><KineticText text="What We Do" /></h2>
          </Reveal>
        </div>
      </div>

      <Reveal variant="fade">
        <div className="svcz-row">
          {SERVICES_DATA.map((svc, i) => {
            const isOn = on === i;
            return (
              <button key={i} className={`svcz-col${isOn ? ' is-on' : ''}`} style={{ cursor: 'none' }}
                onMouseEnter={() => setOn(i)} onClick={() => setOn(i)}
                aria-expanded={isOn}>
                <div className="svcz-head">
                  <h3 className="svcz-title">{svc.title}</h3>
                  <span className="svcz-plus" aria-hidden="true">+</span>
                </div>
                <div className="svcz-body">
                  <p className="svc-desc svcz-desc">{svc.desc}</p>
                  <div className="svc-tags svcz-tags">
                    {svc.tags.map((t) => <span key={t} className="svc-tag">{t}</span>)}
                  </div>
                </div>
              </button>);
          })}
        </div>
      </Reveal>
    </section>);

}

/* ── Desktop alternative 12: index accordion ───────────────
   01's editorial index turned into an accordion: hairline rows with
   number + title; the open row reveals its description SIDE BY SIDE
   with the title in the right column. One open at a time. */
function ServicesIndexAcc() {
  const [open, setOpen] = useState(0);
  return (
    <section id="services" style={{ marginTop: 'clamp(-150px, -12vh, -50px)', paddingTop: 'clamp(40px, 6vh, 84px)' }}>
      <div className="gutter shell" style={{ paddingBottom: 'clamp(36px, 4.5vh, 56px)' }}>
        <div>
          <Reveal variant="fade">
            <span className="eyebrow">03</span>
          </Reveal>
          <Reveal variant="mask" delay={0.12} style={{ marginTop: '14px' }}>
            <h2 className="display-l"><KineticText text="What We Do" /></h2>
          </Reveal>
        </div>
      </div>

      <div className="svcy-wrap">
        {SERVICES_DATA.map((svc, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={i} variant="fade" delay={0.05 * i}>
              <article className={`svcy-row${isOpen ? ' is-open' : ''}`}>
                <button className="svcy-grid" style={{ cursor: 'none' }}
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}>
                  <span className="svcy-num">{svc.num}</span>
                  <div className="svcy-main">
                    <h3 className="svcy-title">{svc.title}</h3>
                    {isOpen &&
                    <div className="svc-tags svcy-tags">
                        {svc.tags.map((t) => <span key={t} className="svc-tag">{t}</span>)}
                      </div>
                    }
                  </div>
                  {isOpen ?
                  <p className="svc-desc svcy-desc">{svc.desc}</p> :
                  <span className="svcy-spacer" aria-hidden="true"></span>
                  }
                  <span className="svcy-plus" aria-hidden="true">+</span>
                </button>
              </article>
            </Reveal>);
        })}
      </div>
    </section>);

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
  return (
    <section id="services" style={{ marginTop: 'clamp(-150px, -12vh, -50px)', paddingTop: 'clamp(40px, 6vh, 84px)' }}>
      <div className="gutter shell" style={{ paddingBottom: 'clamp(36px, 4.5vh, 56px)' }}>
        <div>
          <Reveal variant="fade">
            <span className="eyebrow">03</span>
          </Reveal>
          <Reveal variant="mask" delay={0.12} style={{ marginTop: '14px' }}>
            <h2 className="display-l"><KineticText text="What We Do" /></h2>
          </Reveal>
        </div>
      </div>

      <div className="svcv-stage">
        <Reveal variant="fade" style={{ width: '100%' }}>
          <div className="svcv-strip">
            {SERVICES_DATA.map((svc, i) => {
              const isOn = on === i;
              return (
                <button key={i} className={`svcv-panel${isOn ? ' is-on' : ''}`} style={{ cursor: 'none' }}
                  onMouseEnter={() => setOn(i)} onClick={() => setOn(i)}
                  aria-expanded={isOn}>
                  <h3 className="svcv-title">{svc.title}</h3>
                  <div className="svcv-body">
                    <p className="svc-desc svcv-desc">{svc.desc}</p>
                    <span className="svcv-tagline">{svc.tags.join(' · ')}</span>
                  </div>
                </button>);
            })}
          </div>
        </Reveal>
      </div>
    </section>);

}

/* ── Desktop alternative 10: rack focus ───────────────────
   Expanding panels with a depth-of-field twist: collapsed frames
   sit softly out of focus (blurred, dimmed) like background bokeh;
   the open frame racks into focus, its title bottom-left and the
   description landing beside it — everything bottom-aligned, so
   texts can never collide. */
function ServicesFocus() {
  const [on, setOn] = useState(0);
  return (
    <section id="services" style={{ marginTop: 'clamp(-150px, -12vh, -50px)', paddingTop: 'clamp(40px, 6vh, 84px)' }}>
      <div className="gutter shell" style={{ paddingBottom: 'clamp(36px, 4.5vh, 56px)' }}>
        <div>
          <Reveal variant="fade">
            <span className="eyebrow">03</span>
          </Reveal>
          <Reveal variant="mask" delay={0.12} style={{ marginTop: '14px' }}>
            <h2 className="display-l"><KineticText text="What We Do" /></h2>
          </Reveal>
        </div>
      </div>

      <Reveal variant="fade">
        <div className="svcf-row">
          {SERVICES_DATA.map((svc, i) => {
            const isOn = on === i;
            return (
              <button key={i} className={`svcf-panel${isOn ? ' is-on' : ''}`} style={{ cursor: 'none' }}
                onMouseEnter={() => setOn(i)} onClick={() => setOn(i)}
                aria-expanded={isOn}>
                <span className="svcf-tagline">{svc.tags.join(' · ')}</span>
                <div className="svcf-foot">
                  <h3 className="svcf-title">{svc.title}</h3>
                  <p className="svc-desc svcf-desc">{svc.desc}</p>
                </div>
              </button>);
          })}
        </div>
      </Reveal>
    </section>);

}

/* ── Desktop alternative 09: cinema strip ─────────────────
   Expanding panels — collapsed frames show the title VERTICALLY;
   the open frame widens and shows it horizontally with the
   description + tags. No numbers, no watermark, no underline. */
function ServicesPanelsX() {
  const [on, setOn] = useState(0);
  return (
    <section id="services" style={{ marginTop: 'clamp(-150px, -12vh, -50px)', paddingTop: 'clamp(40px, 6vh, 84px)' }}>
      <div className="gutter shell" style={{ paddingBottom: 'clamp(36px, 4.5vh, 56px)' }}>
        <div>
          <Reveal variant="fade">
            <span className="eyebrow">03</span>
          </Reveal>
          <Reveal variant="mask" delay={0.12} style={{ marginTop: '14px' }}>
            <h2 className="display-l"><KineticText text="What We Do" /></h2>
          </Reveal>
        </div>
      </div>

      <Reveal variant="fade">
        <div className="svcs-row">
          {SERVICES_DATA.map((svc, i) => {
            const isOn = on === i;
            return (
                <button key={i} className={`svcs-panel${isOn ? ' is-on' : ''}`} style={{ cursor: 'none' }}
                onMouseEnter={() => setOn(i)} onClick={() => setOn(i)}
                aria-expanded={isOn}>
                <span className="svcs-vtitle" aria-hidden="true">{svc.title}</span>
                <div className="svcs-body">
                  <h3 className="svcs-title">{svc.title}</h3>
                  <p className="svc-desc svcs-desc">{svc.desc}</p>
                  <div className="svc-tags svcs-tags">
                    {svc.tags.map((t) => <span key={t} className="svc-tag">{t}</span>)}
                  </div>
                </div>
              </button>);
          })}
        </div>
      </Reveal>
    </section>);

}

/* ── Desktop alternative 08: ghost numerals ───────────────
   Each service rides a massive outlined numeral — rows zigzag
   left/right, title + description overlap the number. Hovering a
   row warms the numeral's stroke to orange. */
function ServicesNumerals() {
  return (
    <section id="services" style={{ marginTop: 'clamp(-150px, -12vh, -50px)', paddingTop: 'clamp(40px, 6vh, 84px)' }}>
      <div className="gutter shell" style={{ paddingBottom: 'clamp(36px, 4.5vh, 56px)' }}>
        <div>
          <Reveal variant="fade">
            <span className="eyebrow">03</span>
          </Reveal>
          <Reveal variant="mask" delay={0.12} style={{ marginTop: '14px' }}>
            <h2 className="display-l"><KineticText text="What We Do" /></h2>
          </Reveal>
        </div>
      </div>

      <div className="svcn-wrap">
        {SERVICES_DATA.map((svc, i) =>
        <Reveal key={i} variant="fade" delay={0.05 * i}>
            <article className={`svcn-row${i % 2 ? ' is-flip' : ''}`}>
              <span className="svcn-ghost" aria-hidden="true">{svc.num}</span>
              <div className="svcn-content">
                <h3 className="svcn-title">{svc.title}</h3>
                <p className="svc-desc svcn-desc">{svc.desc}</p>
                <span className="svcn-tagline">{svc.tags.join(' · ')}</span>
              </div>
            </article>
          </Reveal>
        )}
      </div>
    </section>);

}

/* ── Desktop alternative 07: expanding panels ──────────────
   Five tall panels side by side filling the width — like frames on
   a strip of film. Collapsed panels show a vertical title; hovering
   one widens it and its description fades in. */
function ServicesPanels() {
  const [on, setOn] = useState(0);
  return (
    <section id="services" style={{ marginTop: 'clamp(-150px, -12vh, -50px)', paddingTop: 'clamp(40px, 6vh, 84px)' }}>
      <div className="gutter shell" style={{ paddingBottom: 'clamp(36px, 4.5vh, 56px)' }}>
        <div>
          <Reveal variant="fade">
            <span className="eyebrow">03</span>
          </Reveal>
          <Reveal variant="mask" delay={0.12} style={{ marginTop: '14px' }}>
            <h2 className="display-l"><KineticText text="What We Do" /></h2>
          </Reveal>
        </div>
      </div>

      <Reveal variant="fade">
        <div className="svcp-row">
          {SERVICES_DATA.map((svc, i) => {
            const isOn = on === i;
            return (
              <button key={i} className={`svcp-panel${isOn ? ' is-on' : ''}`} style={{ cursor: 'none' }}
                onMouseEnter={() => setOn(i)} onClick={() => setOn(i)}
                aria-expanded={isOn}>
                <span className="svcp-num">{svc.num}</span>
                <span className="svcp-vtitle" aria-hidden="true">{svc.title}</span>
                <div className="svcp-body">
                  <h3 className="svcp-title">{svc.title}</h3>
                  <p className="svc-desc svcp-desc">{svc.desc}</p>
                  <span className="svcp-tagline">{svc.tags.join(' · ')}</span>
                </div>
              </button>);
          })}
        </div>
      </Reveal>
    </section>);

}

/* ── Desktop alternative 06: film credits ─────────────────
   End-credits style: each service is a centered block — mono
   number, title, centered description, tag words as a quiet mono
   line — separated by short centered hairlines. */
function ServicesCredits() {
  return (
    <section id="services" style={{ marginTop: 'clamp(-150px, -12vh, -50px)', paddingTop: 'clamp(40px, 6vh, 84px)' }}>
      <div className="gutter shell" style={{ paddingBottom: 'clamp(36px, 4.5vh, 56px)' }}>
        <div>
          <Reveal variant="fade">
            <span className="eyebrow">03</span>
          </Reveal>
          <Reveal variant="mask" delay={0.12} style={{ marginTop: '14px' }}>
            <h2 className="display-l"><KineticText text="What We Do" /></h2>
          </Reveal>
        </div>
      </div>

      <div className="svcc-wrap">
        {SERVICES_DATA.map((svc, i) =>
        <Reveal key={i} variant="fade" delay={0.05 * i}>
            <article className="svcc-block">
              {i > 0 && <span className="svcc-rule" aria-hidden="true"></span>}
              <span className="svcc-num">{svc.num}</span>
              <h3 className="svcc-title">{svc.title}</h3>
              <p className="svc-desc svcc-desc">{svc.desc}</p>
              <span className="svcc-tagline">{svc.tags.join(' · ')}</span>
            </article>
          </Reveal>
        )}
      </div>
    </section>);

}

/* ── Desktop alternative 05: quiet index ──────────────────
   Same full-width footprint as 04 but restrained: modest titles,
   description beside them, tags as a quiet mono line on the right.
   Elegant hairline rows, subtle hover. */
function ServicesQuiet() {
  return (
    <section id="services" style={{ marginTop: 'clamp(-150px, -12vh, -50px)', paddingTop: 'clamp(40px, 6vh, 84px)' }}>
      <div className="gutter shell" style={{ paddingBottom: 'clamp(36px, 4.5vh, 56px)' }}>
        <div>
          <Reveal variant="fade">
            <span className="eyebrow">03</span>
          </Reveal>
          <Reveal variant="mask" delay={0.12} style={{ marginTop: '14px' }}>
            <h2 className="display-l"><KineticText text="What We Do" /></h2>
          </Reveal>
        </div>
      </div>

      <div className="svcq-wrap">
        {SERVICES_DATA.map((svc, i) =>
        <Reveal key={i} variant="fade" delay={0.05 * i}>
            <article className="svcq-row">
              <span className="svcq-num">{svc.num}</span>
              <div className="svcq-main">
                <h3 className="svcq-title">{svc.title}</h3>
                <span className="svcq-tagline">{svc.tags.join(' · ')}</span>
              </div>
              <p className="svc-desc svcq-desc">{svc.desc}</p>
            </article>
          </Reveal>
        )}
      </div>
    </section>);

}

/* ── Desktop alternative 04: full-bleed index ──────────────
   Edge-to-edge rows spanning the whole viewport — oversized titles
   on the left, description + tags always visible on the right,
   hairlines running the full page width. */
function ServicesFullBleed() {
  return (
    <section id="services" style={{ marginTop: 'clamp(-150px, -12vh, -50px)', paddingTop: 'clamp(40px, 6vh, 84px)' }}>
      <div className="gutter shell" style={{ paddingBottom: 'clamp(36px, 4.5vh, 56px)' }}>
        <div>
          <Reveal variant="fade">
            <span className="eyebrow">03</span>
          </Reveal>
          <Reveal variant="mask" delay={0.12} style={{ marginTop: '14px' }}>
            <h2 className="display-l"><KineticText text="What We Do" /></h2>
          </Reveal>
        </div>
      </div>

      <div className="svcb-wrap">
        {SERVICES_DATA.map((svc, i) =>
        <Reveal key={i} variant="fade" delay={0.05 * i}>
            <article className="svcb-row">
              <span className="svcb-num">{svc.num}</span>
              <h3 className="svcb-title">{svc.title}</h3>
              <div className="svcb-side">
                <p className="svc-desc svcb-desc">{svc.desc}</p>
                <div className="svc-tags svcb-tags">
                  {svc.tags.map((t) => <span key={t} className="svc-tag">{t}</span>)}
                </div>
              </div>
            </article>
          </Reveal>
        )}
      </div>
    </section>);

}

/* ── Desktop alternative 03: editorial accordion ────────────
   Full-width hairline rows — number · big title · plus toggle.
   One row open at a time; the open row indents its description
   under the title column. First row open by default. */
function ServicesAccordionX() {
  const [open, setOpen] = useState(0);
  return (
    <section id="services" style={{ marginTop: 'clamp(-150px, -12vh, -50px)', paddingTop: 'clamp(40px, 6vh, 84px)' }}>
      <div className="gutter shell" style={{ paddingBottom: 'clamp(36px, 4.5vh, 56px)' }}>
        <div>
          <Reveal variant="fade">
            <span className="eyebrow">03</span>
          </Reveal>
          <Reveal variant="mask" delay={0.12} style={{ marginTop: '14px' }}>
            <h2 className="display-l"><KineticText text="What We Do" /></h2>
          </Reveal>
        </div>
      </div>

      <div className="svca-wrap">
        {SERVICES_DATA.map((svc, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={i} variant="fade" delay={0.05 * i}>
              <article className={`svca-row${isOpen ? ' is-open' : ''}`}>
                <button className="svca-head" style={{ cursor: 'none' }}
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}>
                  <span className="svca-num">{svc.num}</span>
                  <span className="svca-title">{svc.title}</span>
                  <span className="svca-plus" aria-hidden="true">+</span>
                </button>
                {isOpen &&
                <div className="svca-body">
                    <div className="svc-tags svca-tags">
                      {svc.tags.map((t) => <span key={t} className="svc-tag">{t}</span>)}
                    </div>
                    <p className="svc-desc svca-desc">{svc.desc}</p>
                  </div>
                }
              </article>
            </Reveal>);
        })}
      </div>
    </section>);

}

/* ── Desktop alternative 02: card grid ─────────────────────
   Hairline-framed cards in a 2-column grid (the 5th spans wide).
   Number top-left, arrow top-right, title · description · tags below.
   Hover lifts the card onto a faint surface and warms the frame. */
function ServicesCards() {
  return (
    <section id="services" style={{ marginTop: 'clamp(-150px, -12vh, -50px)', paddingTop: 'clamp(40px, 6vh, 84px)' }}>
      <div className="gutter shell" style={{ paddingBottom: 'clamp(36px, 4.5vh, 56px)' }}>
        <div>
          <Reveal variant="fade">
            <span className="eyebrow">03</span>
          </Reveal>
          <Reveal variant="mask" delay={0.12} style={{ marginTop: '14px' }}>
            <h2 className="display-l"><KineticText text="What We Do" /></h2>
          </Reveal>
        </div>
      </div>

      <div className="svcg-wrap">
        <div className="svcg-grid">
          {SERVICES_DATA.map((svc, i) =>
          <Reveal key={i} variant="fade" delay={0.06 * i} className="svcg-cell">
              <article className="svcg-card">
                <div className="svcg-head">
                  <span className="svcg-num">{svc.num}</span>
                  <span className="svc-arrow svcg-arrow" aria-hidden="true">⇀</span>
                </div>
                <h3 className="svcg-title">{svc.title}</h3>
                <p className="svc-desc svcg-desc">{svc.desc}</p>
                <div className="svc-tags svcg-tags">
                  {svc.tags.map((t) => <span key={t} className="svc-tag">{t}</span>)}
                </div>
              </article>
            </Reveal>
          )}
        </div>
      </div>
    </section>);

}

/* ── Desktop alternative: editorial index ───────────────────
   All five services open at once — number · title+tags · description
   in one rhythmic stack. No hover-hunting; hover only brightens the
   row hairline and slides the arrow in. */
function ServicesIndex() {
  return (
    <section id="services" style={{ marginTop: 'clamp(-150px, -12vh, -50px)', paddingTop: 'clamp(40px, 6vh, 84px)' }}>
      <div className="gutter shell" style={{ paddingBottom: 'clamp(36px, 4.5vh, 56px)' }}>
        <div>
          <Reveal variant="fade">
            <span className="eyebrow">03</span>
          </Reveal>
          <Reveal variant="mask" delay={0.12} style={{ marginTop: '14px' }}>
            <h2 className="display-l"><KineticText text="What We Do" /></h2>
          </Reveal>
        </div>
      </div>

      <div className="svcx-wrap">
        {SERVICES_DATA.map((svc, i) =>
        <Reveal key={i} variant="fade" delay={0.06 * i}>
            <article className="svcx-row">
              <span className="svcx-num">{svc.num}</span>
              <div className="svcx-main">
                <h3 className="svcx-title">{svc.title}</h3>
                <div className="svc-tags svcx-tags">
                  {svc.tags.map((t) => <span key={t} className="svc-tag">{t}</span>)}
                </div>
              </div>
              <p className="svc-desc svcx-desc">{svc.desc}</p>
              <span className="svc-arrow svcx-arrow" aria-hidden="true">⇀</span>
            </article>
          </Reveal>
        )}
      </div>
    </section>);

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
        if (idx !== activeRef.current) {activeRef.current = idx;setActive(idx);}

        for (let i = 0; i < N; i++) {
          const el = itemRefs.current[i];
          if (!el) continue;
          const d = i - af; // signed distance from the front slot
          const angle = d * STEP;
          const cos = Math.cos(angle),sin = Math.sin(angle);
          const depth = (cos + 1) / 2; // 1 = front, 0 = back
          const f = Math.exp(-Math.pow(d / 0.95, 2)); // soft focus around the front

          const y = sin * R; // gentle arc up / down
          const z = (cos - 1) * R; // recede behind the front
          const rotX = -(d * STEP * 180 / Math.PI) * 0.72; // subtle pitch
          const sc = 0.5 + 0.5 * f; // front full size, others shrink
          const op = 0.1 + 0.9 * Math.pow(f, 0.6);
          const bl = (1 - f) * 2.1;

          el.style.transform =
          `translateY(-50%) translate3d(0, ${y.toFixed(1)}px, ${z.toFixed(1)}px) ` +
          `rotateX(${rotX.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
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
          pel.style.transform =
          `translateY(-50%) translateY(${ty.toFixed(1)}px) scale(${scale.toFixed(3)})`;
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

  const scrollToService = (i) => {
    const track = trackRef.current;if (!track) return;
    const vh = window.innerHeight;
    const STICKY_TOP = 80;
    const trackAbsTop = track.getBoundingClientRect().top + window.scrollY;
    const total = track.offsetHeight - vh;
    window.scrollTo({ top: trackAbsTop - STICKY_TOP + i / (N - 1) * total, behavior: 'smooth' });
  };

  return (
    <section id="services">
      <div ref={trackRef} className="svc-track" style={{ height: `${N * 36}vh` }}>
        <div className="svc-sticky">

          <div className="gutter shell svc-svchead">
            <Reveal variant="fade">
              <span className="eyebrow">03</span>
            </Reveal>
            <Reveal variant="mask" delay={0.12} style={{ marginTop: '14px' }}>
              <h2 className="display-l"><KineticText text="What We Do" /></h2>
            </Reveal>
          </div>

          <div className="gutter svc-split svc-split-wheel">

            <div className="svc-wheel-wrap">
              {/* progress rail — orange line fills as you scroll */}
              <div className="svc-rail" aria-hidden="true">
                <div ref={barRef} className="svc-rail-fill"></div>
              </div>

              <div className="svc-wheel">
                {SERVICES_DATA.map((svc, i) =>
                <button
                  key={i}
                  ref={(el) => {itemRefs.current[i] = el;}}
                  className={`svc-wheel-item${active === i ? ' on' : ''}`}
                  onClick={() => active === i ? null : scrollToService(i)}
                  style={{ cursor: 'none' }}>
                  
                    <span className="svc-title">{svc.title}</span>
                    <span className="svc-arrow" aria-hidden="true">⇀</span>
                  </button>
                )}
              </div>
            </div>

            <aside className="svc-panel svc-panel-wheel" aria-label="Service descriptions">
              <div className="svc-panel-flow">
                {SERVICES_DATA.map((svc, i) =>
                <div className="svc-pitem" key={i} ref={(el) => {panelRefs.current[i] = el;}}>
                    <div className="svc-tags">
                      {svc.tags.map((t) => <span key={t} className="svc-tag">{t}</span>)}
                    </div>
                    <p className="svc-desc">{svc.desc}</p>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>);

}

/* ── Narrow / touch fallback: original accordion ── */
function ServicesAccordion() {
  const [active, setActive] = useState(0);
  const [openM, setOpenM] = useState(null);
  const canHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

  return (
    <section id="services" style={{ marginTop: 'clamp(-150px, -12vh, -50px)', paddingTop: 'clamp(40px, 6vh, 84px)' }}>
      <div className="gutter shell" style={{ paddingBottom: 'clamp(36px, 4.5vh, 56px)' }}>
        <div>
          <Reveal variant="fade">
            <span className="eyebrow">03</span>
          </Reveal>
          <Reveal variant="mask" delay={0.12} style={{ marginTop: '14px' }}>
            <h2 className="display-l"><KineticText text="What We Do" /></h2>
          </Reveal>
        </div>
      </div>

      <div className="gutter svc-split" style={{ marginTop: '36px' }}>
        <div className="svc-list">
          {SERVICES_DATA.map((svc, i) =>
          <ServiceRow
            key={i}
            svc={svc}
            active={active === i}
            openM={openM === i}
            onEnter={() => canHover && setActive(i)}
            onClick={() => {setActive(i);setOpenM(openM === i ? null : i);}} />

          )}
        </div>

        <SvcPanel svc={SERVICES_DATA[active]} />
      </div>
    </section>);

}

/* Right-hand description panel — crossfades when the hovered service changes */
function SvcPanel({ svc }) {
  const [shown, setShown] = useState(svc);
  const [vis, setVis] = useState(true);

  useEffect(() => {
    if (svc === shown) return;
    setVis(false);
    const t = setTimeout(() => {setShown(svc);setVis(true);}, 180);
    return () => clearTimeout(t);
  }, [svc, shown]);

  return (
    <aside className="svc-panel" aria-live="polite">
      <div className={`svc-panel-inner${vis ? '' : ' is-out'}`}>
        <div className="svc-tags">
          {shown.tags.map((t) => <span key={t} className="svc-tag">{t}</span>)}
        </div>
        <p className="svc-desc">{shown.desc}</p>
      </div>
    </aside>);

}

function ServiceRow({ svc, active, openM, onEnter, onClick }) {
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

  return (
    <div className={`svc-item${active ? ' on' : ''}`} onMouseEnter={onEnter}>
      <button className="svc-row-grid" onClick={onClick} style={{ cursor: 'none' }} aria-expanded={openM}>
        <span className="svc-title">{svc.title}</span>
        <span className={`svc-plus${openM ? ' is-open' : ''}`} aria-hidden="true">+</span>
        <span className="svc-arrow" aria-hidden="true">⇀</span>
      </button>

      {/* Inline body — only visible on touch / narrow layouts (panel hidden there).
          NB: CSS transitions on this node get pinned at their start value in this
          app, so we toggle open/closed instantly — content stays fully readable. */}
      <div className="svc-m-body" style={{
        overflow: 'hidden',
        maxHeight: openM ? '2000px' : '0px',
        opacity: openM ? 1 : 0
      }}>
        <div ref={bodyRef} className="svc-m-inner">
          <div className="svc-tags">
            {svc.tags.map((t) => <span key={t} className="svc-tag">{t}</span>)}
          </div>
          <p className="svc-desc">{svc.desc}</p>
        </div>
      </div>
    </div>);

}

/* ── Contact ── */
// Formspree endpoint — messages land in the studio inbox linked to this form.
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mvzjdaya';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errMsg, setErrMsg] = useState('');
  const [errors, setErrors] = useState({}); // per-field validation messages

  const update = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Please add your name.';
    if (!form.email.trim()) errs.email = 'Please add your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = 'That doesn’t look like a valid email — check the format.';
    if (!form.message.trim()) errs.message = 'Tell us a little about the project.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;
    // Honeypot — if a bot filled the hidden field, silently drop it.
    const trap = e.target.querySelector('input[name="_gotcha"]');
    if (trap && trap.value) return;

    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); if (status === 'error') setStatus('idle'); return; }
    setErrors({});

    setStatus('sending');
    setErrMsg('');
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          _subject: `New project brief — ${form.name || 'Website'}`,
        }),
      });
      if (res.ok) {
        setStatus('sent');
        setForm({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 4500);
      } else {
        const data = await res.json().catch(() => ({}));
        const msg = data && data.errors && data.errors[0] && data.errors[0].message;
        setErrMsg(msg || 'Something went wrong — please email us directly.');
        setStatus('error');
      }
    } catch (err) {
      setErrMsg('Network error — please email us directly.');
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="contact-sec">

      <div className="gutter shell contact-wrap">

        {/* headline — kept exactly where it was */}
        <div className="contact-lead">
          <Reveal variant="fade">
            <span className="eyebrow">04</span>
          </Reveal>
          <Reveal variant="mask" delay={0.12} style={{ marginTop: '14px' }}>
            <h2 className="contact-headline"><KineticText text="Got something" /><br /><span style={{ color: 'var(--orange)' }}><KineticText text="in mind?" /></span></h2>
          </Reveal>
        </div>
      </div>

      {/* full-width transmit block — footer-style, spans the section edge to edge */}
      <div className="ct-block">
          <div className="ct-grid">

            <div className="ct-col ct-col--info" style={{ transform: "translateY(30px)" }}>
              <Reveal variant="fade" delay={0.08}>
                <span className="contact-status"><i aria-hidden="true"></i>Available for projects — 2026</span>
              </Reveal>
              <Reveal variant="fade" delay={0.12}>
                <a className="contact-bigmail" href="mailto:contact@robust.film">
                  <span className="u">contact@robust.film</span>
                  <em aria-hidden="true">⇀</em>
                </a>
              </Reveal>
              <Reveal variant="fade" delay={0.16}>
                <div className="contact-phones">
                  <a href="https://wa.me/905362707505" target="_blank" rel="noopener noreferrer">+90 536 270 75 05</a>
                  <a href="https://wa.me/905071883117" target="_blank" rel="noopener noreferrer">+90 507 188 31 17</a>
                </div>
              </Reveal>
              <Reveal variant="fade" delay={0.22}>
                <p className="contact-note contact-note--desktop">Every message reaches us directly — expect a reply within two working days.</p>
                <p className="contact-note contact-note--mobile">Esentepe, Tevfik Erdönmez Paşa Sokak No:2/1 D:6<br />34394 Şişli / İstanbul</p>
              </Reveal>
            </div>

            <div className="ct-col" style={{ padding: "0px", transform: "translateY(-5px)" }}>
              <Reveal variant="fade" delay={0.1}>
                <span className="ct-label">Project Brief</span>
              </Reveal>
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <CField index="01" label="Name" value={form.name} onChange={(v) => update('name', v)} placeholder="Your name" error={errors.name} />
                <CField index="02" label="Email" type="email" value={form.email} onChange={(v) => update('email', v)} placeholder="you@studio.com" error={errors.email} />
                <CField index="03" label="Message" value={form.message} onChange={(v) => update('message', v)} placeholder="Tell us about your project" multiline error={errors.message} />
                {/* Honeypot — hidden from humans; traps bots */}
                <input type="text" name="_gotcha" tabIndex="-1" autoComplete="off" aria-hidden="true"
                  style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }} />
                <div className="cf-foot">
                  {status === 'error' &&
                    <span role="alert" className="cf-formnote cf-formnote--err">{errMsg}</span>}
                  {status === 'sent' &&
                    <span className="cf-formnote cf-formnote--ok">Thanks — we'll reply within two working days.</span>}
                  <CSendBtn status={status} />
                </div>
              </form>
            </div>

          </div>
        </div>
    </section>);

}

function CMeta({ label, value, link }) {
  return (
    <div>
      <div className="cmeta-label">{label}</div>
      {link ?
      <a href={`mailto:${value}`} style={{ fontFamily: "'Space Grotesk'", fontSize: '15px', color: '#999', textDecoration: 'none', transition: 'color 0.3s', cursor: 'none' }}
      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--orange)'}
      onMouseLeave={(e) => e.currentTarget.style.color = '#999'}>
        {value}</a> :
      <span className="cmeta-value">{value}</span>
      }
    </div>);

}

function CField({ index, label, value, onChange, type = 'text', placeholder = '', multiline = false, error }) {
  const [focus, setFocus] = useState(false);
  const common = {
    value,
    onChange: (e) => onChange(e.target.value),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    placeholder,
    className: 'cf-input',
    'aria-invalid': error ? 'true' : undefined
  };
  return (
    <div className={`cf-field${multiline ? ' cf-full' : ''}${error ? ' has-err' : ''}`}>
      <label className={`cf-label${focus ? ' on' : ''}`}>
        {index && <span className="cf-num">{index}</span>}
        <span>{label}</span>
      </label>
      <div className={`cf-inputwrap${focus ? ' on' : ''}`}>
        {multiline ?
        <textarea rows={2} {...common}></textarea> :
        <input type={type} {...common} />}
        <span className="cf-line" style={{ transform: (focus || error) ? 'scaleX(1)' : 'scaleX(0)' }}></span>
      </div>
      {error && <span className="cf-err" role="alert">{error}</span>}
    </div>);

}

function CSendBtn({ status }) {
  const [hov, setHov] = useState(false);
  const magRef = useMagnetic(0.18);
  const sending = status === 'sending';
  const sent = status === 'sent';
  const label = sending ? 'Sending…' : sent ? 'Message Sent' : status === 'error' ? 'Try Again' : 'Send Message';
  const glyph = sending ? '·' : sent ? '✓' : '⇀';
  return (
    <button type="submit" ref={magRef} disabled={sending}
    onMouseEnter={() => setHov(true)}
    onMouseLeave={() => setHov(false)}
    style={{
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
    }}>
      <span>{label}</span>
      <span aria-hidden="true" style={{
        display: 'inline-block',
        transform: (sent || sending) ? 'none' : hov ? 'translateX(6px)' : 'translateX(0)',
        transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1)'
      }}>{glyph}</span>
    </button>);

}

/* ── Footer ── */
function Footer({ setView, scrollToSection }) {
  const go = (item) => {
    if (item === 'Works') {
      setView && setView('works');
    } else {
      setView && setView('home');
      scrollToSection && scrollToSection(item === 'Studio' ? 'about' : item.toLowerCase());
    }
  };

  return (
    <footer className="rb-footer" style={{ marginTop: '0' }}>
      <div className="footer-grid">
        {/* Brand */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'flex-start' }}>
          <LogoMark size={16} />
          <p style={{
            fontFamily: "'Space Grotesk'", fontWeight: 300, fontSize: '14px',
            lineHeight: 1.7, color: '#6f6f6f', maxWidth: '34ch'
          }}>
            Creative media studio crafting films, campaigns and visual experiences. Istanbul — since 2019.
          </p>
        </div>

        {/* Location */}
        <div className="footer-location">
          <span className="footer-col-label">Location</span>
          <p style={{
            fontFamily: "'Space Grotesk'", fontWeight: 300, fontSize: '13.5px',
            lineHeight: 1.8, color: '#6f6f6f', maxWidth: '30ch'
          }}>
            Esentepe, Tevfik Erdönmez Paşa Sokak No:2/1 D:6<br />34394 Şişli / İstanbul
          </p>
        </div>

        {/* Menu */}
        <div>
          <span className="footer-col-label">Menu</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
            {[['Studio', 'Studio'], ['Archive', 'Works'], ['Services', 'Services'], ['Connect', 'Contact']].map(([label, target]) =>
            <button key={target} className="footer-link" style={{ cursor: 'none' }} onClick={() => go(target)}>
                {label}
              </button>
            )}
          </div>
        </div>

        {/* Connect */}
        <div>
          <span className="footer-col-label">Connect</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
            {[['Vimeo', 'https://vimeo.com/robust'], ['Instagram', 'https://www.instagram.com/robust.film/?hl=tr'], ['LinkedIn', 'https://www.linkedin.com/company/robustfims']].map(([s, url]) =>
            <a key={s} className="footer-link" href={url} target="_blank" rel="noopener noreferrer" style={{ cursor: 'none' }}>{s}</a>
            )}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="footer-fine">© 2026 Robust</span>
        <BackToTop />
      </div>
    </footer>);

}

function BackToTop() {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'none', border: 'none', cursor: 'none',
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        fontFamily: "'Space Grotesk'", fontSize: '12px', fontWeight: 700,
        letterSpacing: '0.2em', textTransform: 'uppercase',
        color: hov ? 'rgba(255,255,255,0.4)' : 'var(--gray-4)',
        transition: 'color 0.3s ease',
        padding: 0
      }}>
      <span style={{
        display: 'inline-block',
        transform: hov ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)'
      }}>↑</span>
      <span>Back to top</span>
    </button>);

}

Object.assign(window, { Services, Contact, Footer });