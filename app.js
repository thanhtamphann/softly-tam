const fallback = {
  site: { name: "Softly, Tam", authorName: "Tam Phan", heroEyebrow: "A quiet corner of the internet", heroTitle: "For the days you are learning to choose yourself.", heroIntro: "Honest writing about caring for your mind, building a calmer relationship with money, loving without losing yourself, and growing at your own pace.", profileImage: "", aboutTitle: "Hi, I’m Tam. I write to make life feel a little less lonely.", aboutBody: ["I’m a content writer, curious observer, and lifelong student of what makes us human.", "No perfect routines. Just thoughtful stories and grounded ideas for becoming more at home in your own life."], contactText: "If you have a thoughtful project, a story worth telling, or simply want to say hello, I’d love to hear from you.", newsletterTitle: "A little pause, delivered gently.", newsletterText: "Occasional notes on being human, finding clarity, and creating a life that feels like yours.", footerTagline: "Thoughtful notes for a gentler, braver life.", email: "", instagram: "" },
  topics: [
    {name:"Self-Care", icon:"☼", note:"Rest, rituals & boundaries", color:"#f2c98c"},
    {name:"Money", icon:"◌", note:"Calm, practical finances", color:"#b9cdb7"},
    {name:"Love", icon:"♡", note:"Connection without losing you", color:"#e7afa8"},
    {name:"Psychology", icon:"⌁", note:"Understanding your inner world", color:"#b8c9db"},
    {name:"Real Life", icon:"✦", note:"Personal essays & honest notes", color:"#cbb9d9"}
  ],
  posts: []
};

let data = fallback;
let activeTopic = "All";
let siteSettings = fallback.site;
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const escapeHtml = value => String(value ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const slugify = value => String(value || "story").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const postUrl = p => `post.html?story=${encodeURIComponent(p.slug || slugify(p.title))}`;
const topicFor = name => (data.topics || []).find(t => t.name === name) || {color:"#dfc4a9",icon:"✦"};
const displayDate = value => {
  const date=String(value||"");
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return date;
  return new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",year:"numeric",timeZone:"UTC"}).format(new Date(`${date}T00:00:00Z`));
};
const readingTime = p => {
  const htmlText=p.content?new DOMParser().parseFromString(p.content,"text/html").body.textContent||"":"";
  const articleText=htmlText||[p.lead,...(p.body||[]),p.quote].filter(Boolean).join(" ");
  const words=articleText.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1,Math.ceil(words/220))} min read`;
};
function prepareHeroAnimation(){
  const hero=$('.hero'); const title=$('[data-hero-title]');
  if(!hero||!title)return;
  const words=title.textContent.trim().split(/\s+/);
  title.setAttribute('aria-label',words.join(' '));
  title.innerHTML=words.map((word,index)=>`<span class="hero-word" style="--word-index:${index}" aria-hidden="true">${escapeHtml(word)}</span>`).join(' ');
  hero.classList.add('hero-animate');
  requestAnimationFrame(()=>requestAnimationFrame(()=>hero.classList.add('is-entered')));
}

function postArt(p){
  const topic=topicFor(p.category); const color=p.color || topic.color;
  return p.image ? `<a class="post-art" href="${postUrl(p)}"><img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" loading="lazy"></a>` : `<a class="post-art" style="--post-color:${escapeHtml(color)}" href="${postUrl(p)}" aria-label="Read ${escapeHtml(p.title)}"><span class="art-shape a"></span><span class="art-shape b"></span><span class="art-line"></span><span class="art-topic">${escapeHtml(topic.icon)}</span></a>`;
}
function meta(p, includeDate=true){return `<div class="post-meta"><span>${escapeHtml(p.category)}</span>${includeDate&&p.date?`<span>${escapeHtml(displayDate(p.date))}</span>`:""}<span>${escapeHtml(readingTime(p))}</span></div>`}
function postCard(p){const topic=topicFor(p.category);const color=p.color||topic.color;return `<article class="post-card reveal" data-category="${escapeHtml(p.category)}" style="--card-color:${escapeHtml(color)}">${postArt(p)}<div class="post-copy">${meta(p)}<h3><a href="${postUrl(p)}">${escapeHtml(p.title)}</a></h3><p>${escapeHtml(p.excerpt)}</p><a class="read-link" href="${postUrl(p)}"><span>Read the story</span><b aria-hidden="true">↗</b></a></div></article>`}

function renderSite(){
  const s={...fallback.site,...(data.site||{})};
  siteSettings=s;
  document.title=`${s.name} — Notes for a gentler life`;
  const description=s.heroIntro || fallback.site.heroIntro;
  document.querySelector('meta[name="description"]').content=description;
  document.querySelector('meta[property="og:title"]').content=document.title;
  document.querySelector('meta[property="og:description"]').content=description;
  $$('[data-site-name]').forEach(el=>el.textContent=s.name);
  $$('[data-author-name]').forEach(el=>el.textContent=s.authorName || 'Tam Phan');
  $('[data-hero-eyebrow]').textContent=s.heroEyebrow; $('[data-hero-title]').textContent=s.heroTitle; $('[data-hero-intro]').textContent=s.heroIntro;
  if(s.profileImage){const img=$('[data-profile-image]');img.src=s.profileImage;img.alt=`Portrait of ${s.name}`;img.hidden=false;$('.portrait-placeholder').hidden=true}
  const aboutParts=(s.aboutTitle||'').split('. '); $('[data-about-title]').innerHTML=`${escapeHtml(aboutParts.shift()||'')}.${aboutParts.length?`<br><em>${escapeHtml(aboutParts.join('. '))}</em>`:''}`;
  $('[data-about-body]').innerHTML=(s.aboutBody||[]).map(x=>`<p>${escapeHtml(x)}</p>`).join('');
  $('[data-contact-text]').textContent=s.contactText || fallback.site.contactText;
  $('[data-newsletter-title]').textContent=s.newsletterTitle; $('[data-newsletter-text]').textContent=s.newsletterText; $('[data-footer-tagline]').textContent=s.footerTagline;
  $$('[data-contact-email]').forEach(el=>{if(s.email){el.href=`mailto:${s.email}`}else{el.hidden=true}});
  if(s.instagram){$('[data-social-instagram]').href=s.instagram}else{$('[data-social-instagram]').hidden=true}
}
function renderFeatured(){
  const posts=data.posts||[]; const fi=Math.max(0,posts.findIndex(p=>p.featured)); const p=posts[fi];
  if(!p){$('#featured-post').hidden=true;return}
  const topic=topicFor(p.category); const color=p.color||topic.color;
  $('#featured-post').innerHTML=`<article class="featured-card reveal" style="--card-color:${escapeHtml(color)}"><span class="featured-label">Featured essay</span>${postArt(p)}<div class="post-copy">${meta(p)}<p class="author-line">By ${escapeHtml(p.author||siteSettings.authorName||'Tam Phan')}</p><h3><a href="${postUrl(p)}">${escapeHtml(p.title)}</a></h3><p>${escapeHtml(p.excerpt)}</p><a class="read-link" href="${postUrl(p)}"><span>Read the story</span><b aria-hidden="true">↗</b></a></div></article>`;
}
function renderTopics(){
  $('#topic-grid').innerHTML=(data.topics||[]).map(t=>`<a class="topic-card reveal" style="--topic-color:${escapeHtml(t.color||'#dfc4a9')}" href="#journal" data-filter="${escapeHtml(t.name)}"><span class="topic-icon">${escapeHtml(t.icon)}</span><div><h3>${escapeHtml(t.name)}</h3><p>${escapeHtml(t.note)}</p></div></a>`).join('');
  $('#filter-pills').innerHTML=['All',...(data.topics||[]).map(t=>t.name)].map(name=>`<button class="filter-pill${name==='All'?' active':''}" data-topic="${escapeHtml(name)}">${escapeHtml(name)}</button>`).join('');
}
function renderJournal(){
  const query=($('#post-search').value||'').trim().toLowerCase(); const featured=(data.posts||[]).find(p=>p.featured);
  const posts=(data.posts||[]).filter(p=>p!==featured).filter(p=>(activeTopic==='All'||p.category===activeTopic)&&(!query||`${p.title} ${p.excerpt} ${(p.tags||[]).join(' ')}`.toLowerCase().includes(query)));
  const groups=activeTopic==='All'?(data.topics||[]).map(t=>t.name):[activeTopic];
  $('#topic-sections').innerHTML=groups.map(name=>{const items=posts.filter(p=>p.category===name); if(!items.length)return ''; const topic=topicFor(name);return `<section class="journal-group" style="--topic-color:${escapeHtml(topic.color)}"><div class="group-heading"><span>${escapeHtml(topic.icon)}</span><div><h3>${escapeHtml(name)}</h3><small>${escapeHtml(topic.note||'Thoughtful notes and practical ideas')}</small></div><p>${items.length} ${items.length===1?'story':'stories'}</p></div><div class="post-grid" data-count="${items.length}">${items.map(postCard).join('')}</div></section>`}).join('');
  $('#empty-state').hidden=posts.length>0;
  $('#result-count').textContent=`${posts.length} ${posts.length===1?'story':'stories'}${activeTopic==='All'?'':` in ${activeTopic}`}${query?` matching “${query}”`:''}`;
  $$('.filter-pill').forEach(b=>b.classList.toggle('active',b.dataset.topic===activeTopic)); reveal();
}
function bind(){
  $('#post-search').addEventListener('input',renderJournal);
  $('#filter-pills').addEventListener('click',e=>{const b=e.target.closest('[data-topic]');if(!b)return;activeTopic=b.dataset.topic;renderJournal()});
  $('#topic-grid').addEventListener('click',e=>{const a=e.target.closest('[data-filter]');if(!a)return;activeTopic=a.dataset.filter;renderJournal()});
  $('.menu-toggle').onclick=()=>{const n=$('#site-nav');const open=n.classList.toggle('open');$('.menu-toggle').setAttribute('aria-expanded',open)};
  const newsletterButton=$('#newsletter-form button');
  if(siteSettings.newsletterUrl){$('#newsletter-form').onsubmit=e=>{e.preventDefault();location.href=siteSettings.newsletterUrl}}
  else{newsletterButton.type='button';newsletterButton.disabled=true;newsletterButton.textContent='Letters coming soon'}
}
function showToast(message){$('.toast').textContent=message;$('.toast').classList.add('show');setTimeout(()=>$('.toast').classList.remove('show'),3500)}
function reveal(){if(matchMedia('(prefers-reduced-motion: reduce)').matches){$$('.reveal').forEach(el=>el.classList.add('visible'));return}const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.05});$$('.reveal:not(.visible)').forEach(el=>io.observe(el))}
async function init(){try{const r=await fetch(`content/site.json?fresh=${Date.now()}`,{cache:'no-store'});if(r.ok)data=await r.json()}catch(e){}renderSite();prepareHeroAnimation();renderFeatured();renderTopics();renderJournal();bind();reveal();$('#year').textContent=new Date().getFullYear()}
init();
