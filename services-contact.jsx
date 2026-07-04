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


function Services() {
  // Vertical service list — hover to enlarge, arrows alongside each row.
  return <ServicesAccordion />;
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
  const [openM, setOpenM] = useState(0);
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
                  <a href="tel:+905362707505">+90 536 270 75 05</a>
                  <a href="tel:+905071883117">+90 507 188 31 17</a>
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
            {[['Vimeo', 'https://vimeo.com/robust'], ['Instagram', 'https://www.instagram.com/robust.film/?hl=tr'], ['LinkedIn', 'https://www.linkedin.com/company/robust-film']].map(([s, url]) =>
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