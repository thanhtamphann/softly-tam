const fallback = {
  site: { name: "Softly, Tam", heroEyebrow: "A quiet corner of the internet", heroTitle: "For the days you are learning to choose yourself.", heroIntro: "Honest writing about caring for your mind, building a calmer relationship with money, loving without losing yourself, and growing at your own pace.", profileImage: "", aboutTitle: "Hi, I’m Tam. I write to make life feel a little less lonely.", aboutBody: ["I’m a content writer, curious observer, and lifelong student of what makes us human. This space is where I turn lived moments and careful research into words you can actually use.", "No perfect routines. No one-size-fits-all answers. Just thoughtful stories and grounded ideas for becoming more at home in your own life."], newsletterTitle: "A little pause, delivered gently.", newsletterText: "Occasional notes on being human, finding clarity, and creating a life that feels like yours.", footerTagline: "Thoughtful notes for a gentler, braver life.", email: "", instagram: "" },
  topics: [
    {name:"Self-Care", icon:"☼", note:"Rest, rituals & boundaries"},{name:"Money", icon:"◌", note:"Calm, practical finances"},{name:"Love", icon:"♡", note:"Connection without losing you"},{name:"Psychology", icon:"⌁", note:"Understanding your inner world"},{name:"Real Life", icon:"✦", note:"Personal essays & honest notes"}
  ],
  posts: [
    {title:"You Don’t Need to Earn Your Rest", category:"Self-Care", date:"September 12, 2026", readTime:"6 min read", excerpt:"Why slowing down can feel so uncomfortable—and how to rest before your body forces you to.", lead:"Rest is not a reward for becoming exhausted. It is part of the work of being alive.", body:["For a long time, I treated rest like a finish line. I could reach it after every message was answered, every task was checked, and everyone else was comfortable. The problem was that the finish line kept moving.","Real rest begins when we stop asking whether we have done enough to deserve it. It can be ten unhurried minutes, a meal without a screen, or one honest no.","A gentler life is built in small permissions. Today, let rest be one of them."], color:"#dfc4a9", image:"", featured:true},
    {title:"A Simple Money Date With Yourself", category:"Money", date:"September 7, 2026", readTime:"5 min read", excerpt:"A shame-free monthly ritual to understand your money and make one clear next decision.", lead:"You do not need to love spreadsheets to feel safe with money.", body:["Choose one quiet hour, make a drink you like, and open your accounts without judgment. The first goal is simply to know what is true.","Write down what came in, what went out, and which expense surprised you. Then choose one small action for next month.","Clarity grows when we meet our numbers regularly, with curiosity instead of criticism."], color:"#d5d8bf", image:""},
    {title:"Love Should Not Require Self-Abandonment", category:"Love", date:"August 30, 2026", readTime:"7 min read", excerpt:"The quiet difference between compromise and disappearing inside a relationship.", lead:"Healthy love makes room for two whole people.", body:["Compromise asks both people to move. Self-abandonment asks one person to vanish.","Notice the small moments: Do you edit every feeling before speaking? Are your needs always framed as too much? Can you disagree and remain emotionally safe?", "Love can be tender and still have boundaries. In fact, that may be what allows tenderness to last."], color:"#e6beb5", image:""},
    {title:"Why We Overthink After a Good Day", category:"Psychology", date:"August 22, 2026", readTime:"6 min read", excerpt:"When calm feels unfamiliar, the mind sometimes searches for a problem. Here is why.", lead:"Sometimes anxiety appears not because something is wrong, but because peace is unfamiliar.", body:["The nervous system learns patterns. If uncertainty has been normal for a long time, a quiet day can feel suspicious.","Naming this response creates a little space around it. You can say: nothing is wrong right now; my mind is searching for an old pattern.","You do not have to argue with every thought. Let some pass without turning them into instructions."], color:"#c7cfcb", image:""},
    {title:"The Year I Stopped Performing My Life", category:"Real Life", date:"August 14, 2026", readTime:"8 min read", excerpt:"What changed when I stopped asking how my choices looked and started asking how they felt.", lead:"A beautiful-looking life and a life that feels like yours are not always the same thing.", body:["I had become very good at choosing what sounded impressive. I was less practiced at noticing what brought me alive.","The shift was not dramatic. It began with quieter choices: work I wanted to learn from, people I did not have to perform around, and mornings that belonged to me.","We can change direction without turning the old path into a mistake."], color:"#dccfb9", image:""},
    {title:"Five Tiny Ways to Feel More Like Yourself", category:"Self-Care", date:"August 4, 2026", readTime:"4 min read", excerpt:"Small anchors for the weeks when you feel scattered, tired, or far away from yourself.", lead:"Coming back to yourself does not always require a reinvention.", body:["Wear the color you keep saving. Take the familiar route without headphones. Make the food that tastes like home.","Send one honest message. Put one unfinished expectation down.","Identity is often restored through small acts of recognition."], color:"#edd7b8", image:""}
  ]
};

let data = fallback;
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const art = p => p.image ? `<div class="post-art"><img src="${p.image}" alt="${p.title}" /></div>` : `<div class="post-art" style="--post-color:${p.color || '#e5c9ae'}"><span class="art-shape a"></span><span class="art-shape b"></span><span class="art-line"></span></div>`;
const meta = p => `<div class="post-meta"><span>${p.category}</span><span>${p.readTime}</span></div>`;
const readButton = i => `<button class="read-link" data-read="${i}">Read the story →</button>`;

function render(){
  const s=data.site || fallback.site;
  $$('[data-site-name]').forEach(el=>el.textContent=s.name);
  $('[data-hero-eyebrow]').textContent=s.heroEyebrow; $('[data-hero-title]').textContent=s.heroTitle; $('[data-hero-intro]').textContent=s.heroIntro;
  if(s.profileImage){const img=$('[data-profile-image]');img.src=s.profileImage;img.alt=`Portrait of ${s.name}`;img.hidden=false;$('.portrait-placeholder').hidden=true}
  $('[data-about-title]').innerHTML=(s.aboutTitle || '').replace(/\. /,'<br><em>').concat('</em>');
  $('[data-about-body]').innerHTML=(s.aboutBody||[]).map(x=>`<p>${x}</p>`).join('');
  $('[data-newsletter-title]').textContent=s.newsletterTitle; $('[data-newsletter-text]').textContent=s.newsletterText; $('[data-footer-tagline]').textContent=s.footerTagline;
  if(s.email){$('[data-contact-email]').href=`mailto:${s.email}`}else{$('[data-contact-email]').hidden=true} if(s.instagram){$('[data-social-instagram]').href=s.instagram}else{$('[data-social-instagram]').hidden=true}
  const posts=data.posts||[]; const fi=Math.max(0,posts.findIndex(p=>p.featured)); const featured=posts[fi] || fallback.posts[0];
  $('#featured-post').innerHTML=`<article class="featured-card reveal">${art(featured)}<div class="post-copy">${meta(featured)}<h3>${featured.title}</h3><p>${featured.excerpt}</p>${readButton(fi)}</div></article>`;
  $('#post-grid').innerHTML=posts.filter((_,i)=>i!==fi).map((p)=>{const i=posts.indexOf(p);return `<article class="post-card reveal" data-extra="${i>3}">${art(p)}<div class="post-copy">${meta(p)}<h3>${p.title}</h3><p>${p.excerpt}</p>${readButton(i)}</div></article>`}).join('');
  $$('[data-extra="true"]').forEach(el=>el.hidden=true);
  $('#topic-grid').innerHTML=(data.topics||[]).map(t=>`<a class="topic-card reveal" href="#journal" data-filter="${t.name}"><span class="topic-icon">${t.icon}</span><div><h3>${t.name}</h3><p>${t.note}</p></div></a>`).join('');
  bindDynamic(); reveal();
}
function bindDynamic(){
  $$('[data-read]').forEach(b=>b.onclick=()=>openArticle(data.posts[+b.dataset.read]));
  $$('[data-filter]').forEach(a=>a.onclick=()=>setTimeout(()=>filterPosts(a.dataset.filter),50));
}
function openArticle(p){const body=(p.body||[]).map(x=>`<p>${x}</p>`).join('');$('#article-content').innerHTML=`${meta(p)}<h1>${p.title}</h1><p class="article-lead">${p.lead||p.excerpt}</p><div class="article-body">${body}</div>`;$('#article-dialog').showModal()}
function filterPosts(category){$$('.post-card').forEach(card=>{const title=$('h3',card).textContent;const p=data.posts.find(x=>x.title===title);card.hidden=p?.category!==category});$('#load-more').textContent='Show all stories';$('#load-more').dataset.filtered='true'}
function reveal(){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.08});$$('.reveal').forEach(el=>io.observe(el))}
async function init(){try{const r=await fetch('content/site.json',{cache:'no-store'});if(r.ok)data=await r.json()}catch(e){} render();$('#year').textContent=new Date().getFullYear()}
$('.menu-toggle').onclick=()=>{const n=$('#site-nav');const open=n.classList.toggle('open');$('.menu-toggle').setAttribute('aria-expanded',open)};
$('.dialog-close').onclick=()=>$('#article-dialog').close();$('#article-dialog').onclick=e=>{if(e.target.id==='article-dialog')e.target.close()};
$('#load-more').onclick=e=>{if(e.currentTarget.dataset.filtered){$$('.post-card').forEach(x=>x.hidden=false);delete e.currentTarget.dataset.filtered}else{$$('[data-extra="true"]').forEach(x=>x.hidden=false)}e.currentTarget.hidden=true};
$('#newsletter-form').onsubmit=e=>{e.preventDefault();$('.toast').textContent='Thank you — your quiet corner is saved ♡';$('.toast').classList.add('show');e.target.reset();setTimeout(()=>$('.toast').classList.remove('show'),3500)};
init();
