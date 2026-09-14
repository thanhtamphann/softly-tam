(() => {
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const safeUrl=value=>{try{const raw=String(value||'').trim();if(!raw)return'';if(/^(mailto:|tel:|#|\/)/i.test(raw))return raw;const u=new URL(raw,location.href);return['http:','https:'].includes(u.protocol)?u.href:''}catch{return''}};
  const esc=value=>String(value??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const fetchJson=async path=>{try{const r=await fetch(`${path}?v=${Date.now()}`,{cache:'no-store'});return r.ok?await r.json():{}}catch{return{}}};

  function setMeta(control){
    const seo=control.seo||{}; const site=control.site||{};
    if(seo.siteTitle)document.title=seo.siteTitle;
    const md=$('meta[name="description"]'); if(md&&seo.metaDescription)md.content=seo.metaDescription;
    const ogt=$('meta[property="og:title"]');if(ogt&&seo.siteTitle)ogt.content=seo.siteTitle;
    const ogd=$('meta[property="og:description"]');if(ogd&&seo.metaDescription)ogd.content=seo.metaDescription;
    if(seo.socialImage){let ogi=$('meta[property="og:image"]');if(!ogi){ogi=document.createElement('meta');ogi.setAttribute('property','og:image');document.head.appendChild(ogi)}ogi.content=seo.socialImage}
    if(seo.canonicalUrl){let c=$('link[rel="canonical"]');if(!c){c=document.createElement('link');c.rel='canonical';document.head.appendChild(c)}c.href=seo.canonicalUrl}
    if(site.defaultLanguage)document.documentElement.lang=site.defaultLanguage;
  }

  function applyDesign(control){
    const d=control.design||{};const root=document.documentElement;const body=document.body;
    if(d.primaryColor)root.style.setProperty('--ink',d.primaryColor);
    if(d.backgroundColor)root.style.setProperty('--milk',d.backgroundColor);
    if(d.surfaceColor)root.style.setProperty('--cream',d.surfaceColor);
    if(d.accentColor){root.style.setProperty('--coral',d.accentColor);root.style.setProperty('--accent-runtime',d.accentColor)}
    if(d.mutedColor)root.style.setProperty('--muted',d.mutedColor);
    ['theme-original','theme-minimal','theme-editorial','theme-dark','color-mode-dark','animation-none','animation-subtle','animation-strong','animation-slide','animation-fade','animation-zoom','animation-slow','animation-normal','animation-fast'].forEach(c=>body.classList.remove(c));
    body.classList.add(`theme-${d.theme||'editorial'}`,`animation-${d.animation||'subtle'}`,`animation-${d.animationSpeed||'normal'}`);
    const saved=localStorage.getItem('site-color-mode');const mode=saved||(d.defaultMode||'light');body.classList.toggle('color-mode-dark',mode==='dark');
    if(d.allowVisitorDarkMode){let btn=$('.theme-toggle');if(!btn){btn=document.createElement('button');btn.className='theme-toggle';btn.type='button';const host=$('.utility-links')||$('.site-header');host.appendChild(btn)}const sync=()=>btn.textContent=document.body.classList.contains('color-mode-dark')?'Light mode':'Dark mode';sync();btn.onclick=()=>{const dark=!document.body.classList.contains('color-mode-dark');document.body.classList.toggle('color-mode-dark',dark);localStorage.setItem('site-color-mode',dark?'dark':'light');sync()}}else{$('.theme-toggle')?.remove()}
  }

  function renderAnnouncement(control){
    $('.announcement-bar')?.remove();const a=control.announcement||{};if(!a.enabled||!a.text)return;
    const bar=document.createElement('div');bar.className='announcement-bar';bar.append(document.createTextNode(a.text));
    const url=safeUrl(a.url);if(url&&a.linkLabel){const link=document.createElement('a');link.href=url;link.textContent=a.linkLabel;if(a.newTab){link.target='_blank';link.rel='noopener noreferrer'}bar.appendChild(link)}
    const close=document.createElement('button');close.className='announcement-close';close.type='button';close.setAttribute('aria-label','Close announcement');close.textContent='×';close.onclick=()=>bar.remove();bar.appendChild(close);document.body.prepend(bar);
  }

  function renderMenu(control,pages){
    const nav=$('#site-nav');if(!nav)return;nav.replaceChildren();
    const menu=[...(control.menu||[])].filter(i=>i.enabled!==false);
    const custom=(pages.pages||[]).filter(p=>p.published&&p.showInMenu).sort((a,b)=>(a.order||0)-(b.order||0)).map(p=>({label:p.menuLabel||p.title,url:`page.html?page=${encodeURIComponent(p.slug)}`,enabled:true,newTab:false,custom:true}));
    [...menu,...custom].forEach(item=>{const url=safeUrl(item.url)||item.url;if(!url)return;const a=document.createElement('a');a.href=url;a.textContent=item.label||'Link';if(item.custom)a.className='custom-page-link';if(item.newTab){a.target='_blank';a.rel='noopener noreferrer'}nav.appendChild(a)})
  }

  function renderGlobalCta(control){
    $$('.global-cta-wrap').forEach(el=>el.remove());const items=(control.ctaButtons||[]).filter(i=>i.enabled!==false&&i.label&&i.url);if(!items.length)return;
    const host=$('.utility-links')||$('.site-header');const wrap=document.createElement('span');wrap.className='global-cta-wrap';items.forEach(i=>{const a=document.createElement('a');a.className=i.style==='text'?'text-link':`button ${i.style==='secondary'?'secondary':'primary'}`;a.textContent=i.label;a.href=safeUrl(i.url)||i.url;if(i.newTab){a.target='_blank';a.rel='noopener noreferrer'}wrap.appendChild(a)});host.appendChild(wrap);
  }

  function projectSection(projects){
    const list=(projects.projects||[]).filter(p=>p.published!==false).sort((a,b)=>(a.order||0)-(b.order||0));
    const sec=document.createElement('section');sec.id='projects';sec.className='projects-section control-section';sec.dataset.controlSection='projects';sec.innerHTML=`<div class="section-shell"><div class="control-section-heading"><div><p class="eyebrow">Selected work</p><h2>Projects & videos.</h2></div><p>Selected creative work, stories and experiments.</p></div><div class="projects-grid">${list.map(p=>`<article class="project-card" style="--card-accent:${esc(p.color||'#d98168')}">${p.thumbnail?`<img src="${esc(p.thumbnail)}" alt="${esc(p.title)}">`:''}<div class="project-meta"><span>${esc(p.category||'Project')}</span>${p.views?`<span>${esc(p.views)} views</span>`:''}${p.likes?`<span>${esc(p.likes)} likes</span>`:''}</div><h3>${esc(p.title)}</h3><p>${esc(p.description||'')}</p>${p.videoUrl?`<a class="read-link" href="${esc(p.videoUrl)}" target="_blank" rel="noopener noreferrer">Watch video ↗</a>`:''}${p.ctaUrl?` <a class="read-link" href="${esc(p.ctaUrl)}">${esc(p.ctaLabel||'View project')} ↗</a>`:''}${Array.isArray(p.gallery)&&p.gallery.length?`<div class="project-gallery">${p.gallery.slice(0,10).map(img=>`<img src="${esc(img)}" alt="">`).join('')}</div>`:''}</article>`).join('')}</div></div>`;return sec;
  }

  function caseSection(cases){
    const list=(cases.caseStudies||[]).filter(p=>p.published).sort((a,b)=>(a.order||0)-(b.order||0));
    const sec=document.createElement('section');sec.id='case-studies';sec.className='case-studies-section control-section';sec.dataset.controlSection='caseStudies';sec.innerHTML=`<div class="section-shell"><div class="control-section-heading"><div><p class="eyebrow">Case studies</p><h2>How the work came together.</h2></div></div><div class="case-grid">${list.map(p=>`<article class="case-card" style="--card-accent:${esc(p.color||'#b8c9db')}">${p.images?.[0]?`<img src="${esc(p.images[0])}" alt="${esc(p.title)}">`:''}<h3>${esc(p.title)}</h3><p>${esc(p.summary||'')}</p><a class="read-link" href="case-study.html?case=${encodeURIComponent(p.slug)}">Read case study ↗</a></article>`).join('')}</div></div>`;return sec;
  }

  function organizeSections(control,projects,cases){
    const main=$('main#top');if(!main)return;
    let blog=$('[data-control-section="blog"]');if(!blog){blog=document.createElement('div');blog.dataset.controlSection='blog';blog.className='control-section';const front=$('.front-page');const desk=$('.journal-desk');front?.before(blog);if(front)blog.appendChild(front);if(desk)blog.appendChild(desk)}
    const existingProjects=$('[data-control-section="projects"]');if(existingProjects)existingProjects.remove();
    const existingCases=$('[data-control-section="caseStudies"]');if(existingCases)existingCases.remove();
    main.appendChild(projectSection(projects));main.appendChild(caseSection(cases));
    const map={hero:$('.editorial-intro'),projects:$('[data-control-section="projects"]'),blog:$('[data-control-section="blog"]'),caseStudies:$('[data-control-section="caseStudies"]'),topics:$('#topics'),about:$('#about'),contact:$('#contact'),newsletter:$('#letters')};
    const settings=(control.homepage?.sections||[]).slice().sort((a,b)=>(a.order||0)-(b.order||0));
    settings.forEach(s=>{const el=map[s.id];if(!el)return;el.hidden=s.enabled===false;el.classList.add('control-section');el.dataset.controlSection=s.id;main.appendChild(el)});
  }

  function syncBrand(control){
    const s=control.site||{};if(s.name)$$('[data-site-name]').forEach(el=>el.textContent=s.name);if(s.authorName)$$('[data-author-name]').forEach(el=>el.textContent=s.authorName);if(s.tagline){const t=$('[data-footer-tagline]');if(t)t.textContent=s.tagline}
    const hp=control.homepage||{};if(hp.heroEyebrow&&$('[data-hero-eyebrow]'))$('[data-hero-eyebrow]').textContent=hp.heroEyebrow;if(hp.heroTitle&&$('[data-hero-title]'))$('[data-hero-title]').textContent=hp.heroTitle;if(hp.heroIntro&&$('[data-hero-intro]'))$('[data-hero-intro]').textContent=hp.heroIntro;
  }

  async function init(){
    const [control,projects,cases,pages]=await Promise.all([fetchJson('content/control.json'),fetchJson('content/projects.json'),fetchJson('content/case-studies.json'),fetchJson('content/pages.json')]);
    ensureAssets();setMeta(control);applyDesign(control);renderAnnouncement(control);syncBrand(control);renderMenu(control,pages);renderGlobalCta(control);organizeSections(control,projects,cases);
  }

  function ensureAssets(){if(!$('link[href*="control-center.css"]')){const l=document.createElement('link');l.rel='stylesheet';l.href='control-center.css?v=1';document.head.appendChild(l)}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,500),{once:true});else setTimeout(init,500);
})();
