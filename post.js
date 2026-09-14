const $=s=>document.querySelector(s);
const escapeHtml=value=>String(value??"").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const slugify=value=>String(value||"story").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
let data;
function topicFor(name){return(data.topics||[]).find(t=>t.name===name)||{color:"#dfc4a9",icon:"✦"}}
function showToast(message){$(".toast").textContent=message;$(".toast").classList.add("show");setTimeout(()=>$(".toast").classList.remove("show"),3000)}
function notFound(){document.title="Story not found — Softly, Tam";$("#article").innerHTML='<div class="not-found"><p class="eyebrow">A missing page</p><h1>This story wandered away.</h1><p><a href="index.html#journal">Return to the journal →</a></p></div>';$("#related").hidden=true}
function render(post){
  const topic=topicFor(post.category); const description=post.seoDescription||post.excerpt;
  document.title=`${post.title} — ${data.site?.name||"Softly, Tam"}`;$("#meta-description").content=description;$("#og-title").content=post.title;$("#og-description").content=description;$("#site-name").textContent=data.site?.name||"Softly, Tam";
  $("#article-meta").innerHTML=`<span>${escapeHtml(post.category)}</span><span>${escapeHtml(post.date)}</span><span>${escapeHtml(post.readTime)}</span>`;
  $("#article-title").textContent=post.title;$("#article-excerpt").textContent=post.excerpt;$("#article-byline").textContent=`By ${post.author||"Tam Phan"}`;
  $("#article-cover").style.setProperty("--cover-color",post.color||topic.color);$("#article-cover").innerHTML=post.image?`<img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}">`:`<span class="art-shape a"></span><span class="art-shape b"></span><span class="art-line"></span><span class="art-topic">${escapeHtml(topic.icon)}</span>`;
  const paragraphs=(post.body||[]).map((p,i)=>`${i===1&&post.quote?`<blockquote class="article-quote">“${escapeHtml(post.quote)}”</blockquote>`:""}<p>${escapeHtml(p)}</p>`).join("");
  $("#article-body").innerHTML=`${post.lead?`<p><strong>${escapeHtml(post.lead)}</strong></p>`:""}${paragraphs}<div class="article-tags">${(post.tags||[]).map(t=>`<span>#${escapeHtml(t)}</span>`).join("")}</div>`;
  const related=(data.posts||[]).filter(p=>p!==post&&p.category===post.category).slice(0,2); if(related.length<2)related.push(...(data.posts||[]).filter(p=>p!==post&&!related.includes(p)).slice(0,2-related.length));
  $("#related-grid").innerHTML=related.map(p=>{const t=topicFor(p.category);return`<a class="related-card" href="post.html?story=${encodeURIComponent(p.slug||slugify(p.title))}"><span class="related-swatch" style="--card-color:${p.color||t.color}">${t.icon}</span><span class="related-copy"><span>${escapeHtml(p.category)}</span><h3>${escapeHtml(p.title)}</h3></span></a>`}).join("");
}
async function init(){try{const r=await fetch("content/site.json",{cache:"no-store"});data=await r.json()}catch(e){notFound();return}const slug=new URLSearchParams(location.search).get("story");const post=(data.posts||[]).find(p=>(p.slug||slugify(p.title))===slug);if(!post){notFound();return}render(post);$("#year").textContent=new Date().getFullYear()}
$("#copy-link").onclick=async()=>{await navigator.clipboard.writeText(location.href);showToast("Story link copied ♡")};
$("#share-native").onclick=async()=>{if(navigator.share){await navigator.share({title:document.title,url:location.href})}else{await navigator.clipboard.writeText(location.href);showToast("Story link copied ♡")}};
addEventListener("scroll",()=>{const max=document.documentElement.scrollHeight-innerHeight;$(".reading-progress span").style.width=`${max?scrollY/max*100:0}%`},{passive:true});
init();
