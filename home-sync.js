(()=>{
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  async function load(){try{const r=await fetch('content/home.json?fresh='+Date.now(),{cache:'no-store'});return r.ok?await r.json():{}}catch{return{}}}
  async function run(){
    const data=await load();
    const about=data.about||{};
    const newsletter=data.newsletter||{};
    if($('[data-about-title]')&&about.title)$('[data-about-title]').textContent=about.title;
    const aboutBody=$('[data-about-body]');
    if(aboutBody&&Array.isArray(about.body)){
      aboutBody.replaceChildren();
      about.body.forEach(value=>{const p=document.createElement('p');p.textContent=value;aboutBody.appendChild(p)});
    }
    const values=about.values||[];
    $$('.about-values span').forEach((el,i)=>{if(values[i])el.textContent=values[i]});
    if($('[data-newsletter-title]')&&newsletter.title)$('[data-newsletter-title]').textContent=newsletter.title;
    if($('[data-newsletter-text]')&&newsletter.text)$('[data-newsletter-text]').textContent=newsletter.text;
    const eyebrow=$('#letters .eyebrow');if(eyebrow&&newsletter.eyebrow)eyebrow.textContent=newsletter.eyebrow;
    const section=$('#letters');if(section)section.hidden=newsletter.enabled===false;
    const form=$('#newsletter-form');const button=form?.querySelector('button');
    if(button){
      if(newsletter.url){button.disabled=false;button.type='submit';button.textContent=(newsletter.buttonLabel||'Join the letters')+' →';form.onsubmit=e=>{e.preventDefault();location.href=newsletter.url}}
      else{button.disabled=true;button.type='button';button.textContent='Letters coming soon'}
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(run,900),{once:true});else setTimeout(run,900);
})();