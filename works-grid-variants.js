/* ============================================================
   Selected Works — Grid Explorations · builders + behaviors
   Depends on window.WORKS (works-grid-data.js)
   Motion: shutter-wipe media, counter-scaling image, masked
   line text, spring easing, focus-scaling, parallax drift.
   ============================================================ */
(function(){
  const W = window.WORKS;
  const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  // media frame: counter-scaling image + shutter wipe + gradient
  const frame = (w, cls='') => `<div class="frame ${cls}"><img class="mi" src="${w.cover}" alt="${w.title}" loading="lazy"><span class="grad"></span><span class="shutter"></span></div>`;

  /* ---- V1 Staggered Masonry ---- */
  function masonry(root){
    const ratios = ['3/4','16/9','1','4/5','16/10','3/4','1','16/9','4/5','3/4'];
    W.forEach((w,i)=>{
      root.appendChild(el(`
        <article class="reveal" style="--md:${(i%3)*0.08}s">
          <div class="frame" style="aspect-ratio:${ratios[i]}">
            <img class="mi" src="${w.cover}" alt="${w.title}" loading="lazy"><span class="grad"></span><span class="shutter"></span>
          </div>
          <div class="card-meta">
            <span class="card-cat mask"><span>${w.cat}</span></span>
            <h3 class="card-title mask"><span>${w.title}</span></h3>
            <span class="card-sub fade" style="--md:.2s">${w.client} · ${w.year}</span>
          </div>
        </article>`));
    });
  }

  /* ---- V2 Editorial Split Rows ---- */
  function editorial(root){
    W.forEach((w)=>{
      root.appendChild(el(`
        <div class="v-ed-row reveal">
          <div class="v-ed-media">${frame(w,'wipe-x')}</div>
          <div class="v-ed-text">
            <div class="v-ed-num fade">${w.n}</div>
            <span class="card-cat mask" style="--md:.1s"><span>${w.cat} — ${w.type}</span></span>
            <h3 class="card-title mask" style="--md:.18s"><span>${w.title}</span></h3>
            <div class="card-sub fade" style="--md:.34s">${w.client} · ${w.year}</div>
          </div>
        </div>`));
    });
  }

  /* ---- V3 Focus-Pull Grid ---- */
  function uniform(root){
    W.forEach((w,i)=>{
      root.appendChild(el(`
        <article class="reveal" style="--md:${(i%3)*0.08}s">
          ${frame(w)}
          <div class="card-meta">
            <span class="card-cat mask"><span>${w.cat}</span></span>
            <h3 class="card-title mask" style="--md:.08s"><span>${w.title}</span></h3>
          </div>
        </article>`));
    });
  }

  /* ---- V4 Diagonal Cascade ---- */
  function diagonal(root){
    const cols = 4;
    W.forEach((w,i)=>{
      const row = Math.floor(i/cols), col = i%cols;
      root.appendChild(el(`
        <article class="reveal" style="--md:${(row+col)*0.07}s">
          <div class="frame">
            <img class="mi" src="${w.cover}" alt="${w.title}" loading="lazy"><span class="grad"></span><span class="shutter"></span>
            <div class="d-label"><span class="card-cat">${w.cat}</span><h3 class="card-title">${w.title}</h3></div>
          </div>
        </article>`));
    });
  }

  /* ---- V5 Sticky Index + Scrolling Cards ---- */
  function sticky(root){
    root.innerHTML = `
      <aside class="v-sticky-aside">
        <div class="v-sticky-count"><span data-cur>01</span><small> / ${String(W.length).padStart(2,'0')}</small></div>
        <div class="v-sticky-cat" data-cat>${W[0].cat}</div>
        <div class="v-sticky-now" data-now>${W[0].title}</div>
      </aside>
      <div class="v-sticky-list"></div>`;
    const list = root.querySelector('.v-sticky-list');
    const curEl = root.querySelector('[data-cur]'), catEl = root.querySelector('[data-cat]'), nowEl = root.querySelector('[data-now]');
    W.forEach((w,i)=>{
      list.appendChild(el(`
        <article class="s-item reveal" data-i="${i}">
          ${frame(w)}
          <div class="card-meta">
            <h3 class="card-title mask"><span>${w.title}</span></h3>
            <span class="card-sub fade" style="--md:.15s">${w.client} · ${w.year}</span>
          </div>
        </article>`));
    });
    const io = new IntersectionObserver((ents)=>{
      ents.forEach(e=>{
        if(e.isIntersecting){
          const w = W[+e.target.dataset.i];
          [curEl,catEl,nowEl].forEach(n=>n.style.opacity=0);
          setTimeout(()=>{ curEl.textContent=w.n; catEl.textContent=w.cat; nowEl.textContent=w.title; [curEl,catEl,nowEl].forEach(n=>n.style.opacity=1); },130);
        }
      });
    }, {rootMargin:'-45% 0px -45% 0px'});
    list.querySelectorAll('.s-item').forEach(n=>io.observe(n));
  }

  /* ---- V6 Horizontal Pinned Band (focus-scaling) ---- */
  function horiz(root){
    root.innerHTML = `<div class="v-horiz-pin"><div class="v-horiz-rail"></div><div class="v-horiz-hint">Scroll <span>→</span> horizontal reveal</div></div>`;
    const rail = root.querySelector('.v-horiz-rail');
    W.forEach((w)=>{
      rail.appendChild(el(`
        <article class="v-horiz-card">
          ${frame(w)}
          <div class="card-meta">
            <span class="card-cat">${w.cat}</span>
            <h3 class="card-title">${w.title}</h3>
            <span class="card-sub">${w.client} · ${w.year}</span>
          </div>
        </article>`));
    });
    // media begins revealed for the pinned rail (always on screen)
    rail.querySelectorAll('.frame').forEach(f=>{ f.querySelector('.shutter').style.display='none'; f.querySelector('.mi').style.transform='scale(1)'; });
    const cards = [...rail.querySelectorAll('.v-horiz-card')];
    function onScroll(){
      const r = root.getBoundingClientRect();
      const total = root.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / total));
      const gutter = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gutter'))*2;
      const dist = rail.scrollWidth - window.innerWidth + gutter;
      rail.style.transform = `translate3d(${-p*dist}px,0,0)`;
      // focus-scale: card nearest viewport-center is largest / brightest
      const cx = window.innerWidth/2;
      cards.forEach(c=>{
        const cr = c.getBoundingClientRect();
        const d = Math.abs((cr.left+cr.width/2) - cx) / (window.innerWidth*0.6);
        const k = Math.max(0, 1-d);
        c.querySelector('.mi').style.transform = `scale(${(0.94+0.12*k).toFixed(3)})`;
        c.style.opacity = (0.45+0.55*k).toFixed(3);
      });
    }
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  /* ---- V7 Curtain Reveal ---- */
  function curtain(root){
    W.forEach((w,i)=>{
      const c = el(`
        <article class="reveal" style="--md:${(i%3)*0.09}s">
          <div class="frame">
            <img class="mi" src="${w.cover}" alt="${w.title}" loading="lazy"><span class="grad"></span>
            <div class="curtain"></div>
          </div>
          <div class="card-meta">
            <span class="card-cat mask"><span>${w.cat}</span></span>
            <h3 class="card-title mask" style="--md:.08s"><span>${w.title}</span></h3>
          </div>
        </article>`);
      c.querySelector('.curtain').style.transitionDelay = `${(i%3)*0.09}s`;
      root.appendChild(c);
    });
  }

  /* ---- V8 Overlapping Offset Parallax ---- */
  function parallax(root){
    W.forEach((w,i)=>{
      const speed = [0.06,-0.05,0.09][i%3];
      const cell = el(`
        <article class="reveal" data-speed="${speed}" style="transform:translateY(var(--py,0))">
          ${frame(w)}
          <div class="card-meta">
            <span class="card-cat mask"><span>${w.cat}</span></span>
            <h3 class="card-title mask" style="--md:.08s"><span>${w.title}</span></h3>
          </div>
        </article>`);
      root.appendChild(cell);
    });
    const cells = [...root.querySelectorAll('.reveal')];
    function onScroll(){
      const vh = window.innerHeight;
      cells.forEach(c=>{
        const r = c.getBoundingClientRect();
        if(r.bottom < -300 || r.top > vh+300) return;
        const mid = r.top + r.height/2 - vh/2;
        c.style.setProperty('--py', `${(mid * +c.dataset.speed).toFixed(1)}px`);
      });
    }
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  /* ---- V9 Full-bleed Alternating Strips ---- */
  function strips(root){
    W.forEach((w)=>{
      root.appendChild(el(`
        <div class="v-strip reveal">
          <div class="strip-bg"><img src="${w.cover}" alt="${w.title}" loading="lazy"></div>
          <div class="strip-inner">
            <div>
              <div class="strip-num fade">${w.n} — ${w.cat}</div>
              <h3 class="strip-title mask"><span>${w.title}</span></h3>
              <div class="strip-rule"></div>
            </div>
            <div class="strip-side fade" style="--md:.25s">${w.client}<br>${w.type}<br>${w.year}</div>
          </div>
        </div>`));
    });
    const io = new IntersectionObserver((ents)=>ents.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); }), {threshold:.3});
    root.querySelectorAll('.v-strip').forEach(n=>io.observe(n));
  }

  /* ---- V10 Index List + Floating Thumbnail ---- */
  function indexList(root){
    const float = el(`<div class="v-idx-float"><img alt=""></div>`);
    document.body.appendChild(float);
    const fImg = float.querySelector('img');
    W.forEach((w,i)=>{
      const row = el(`
        <div class="v-idx-row reveal">
          <span class="i-num mask"><span>${w.n}</span></span>
          <span class="i-title mask" style="--md:.06s"><span>${w.title}</span></span>
          <span class="i-cat mask" style="--md:.12s"><span>${w.cat}</span></span>
        </div>`);
      row.addEventListener('mouseenter', ()=>{ fImg.src = w.cover; float.classList.add('show'); });
      row.addEventListener('mouseleave', ()=>{ float.classList.remove('show'); });
      root.appendChild(row);
    });
    window.addEventListener('mousemove', (e)=>{ float.style.left = e.clientX+'px'; float.style.top = e.clientY+'px'; });
  }

  const builders = { masonry, editorial, uniform, diagonal, sticky, horiz, curtain, parallax, strips, indexList };

  function init(){
    document.querySelectorAll('[data-build]').forEach(node=>{ const fn = builders[node.dataset.build]; if(fn) fn(node); });

    // global reveal observer — toggles .in on every .reveal unit
    const io = new IntersectionObserver((ents)=>ents.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }}), {threshold:.16, rootMargin:'0px 0px -8% 0px'});
    document.querySelectorAll('.reveal').forEach(n=>io.observe(n));

    // right-rail nav active state
    const dots = [...document.querySelectorAll('.exp-nav a')];
    const secs = [...document.querySelectorAll('.exp')];
    const navIO = new IntersectionObserver((ents)=>{ ents.forEach(e=>{
      if(e.isIntersecting){ const id = e.target.id; dots.forEach(d=>d.classList.toggle('active', d.getAttribute('href')==='#'+id)); }
    }); }, {rootMargin:'-45% 0px -45% 0px'});
    secs.forEach(s=>navIO.observe(s));
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
