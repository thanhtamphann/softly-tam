(()=>{
  const $=(s,r=document)=>r.querySelector(s);
  async function load(){try{const r=await fetch('content/control.json?contact='+Date.now(),{cache:'no-store'});return r.ok?await r.json():{}}catch{return{}}}
  function makeChannel(item){
    const hasUrl=Boolean(item.url);
    const el=document.createElement(hasUrl?'a':'span');
    el.className='contact-channel-chip'+(hasUrl?'':' is-placeholder');
    if(hasUrl){el.href=item.url;if(item.newTab!==false&&!String(item.url).startsWith('mailto:')){el.target='_blank';el.rel='noopener noreferrer'}}
    const label=document.createElement('span');label.textContent=item.label||'Channel';el.appendChild(label);
    if(item.note){const note=document.createElement('span');note.className='channel-note';note.textContent='· '+item.note;el.appendChild(note)}
    return el;
  }
  async function run(){
    const control=await load();const c=control.contact||{};const site=control.site||{};
    const old=$('#contact');if(!old)return;
    const section=document.createElement('section');section.id='contact';section.className='contact-hub';
    const shell=document.createElement('div');shell.className='section-shell contact-hub-grid';section.appendChild(shell);
    const intro=document.createElement('div');intro.className='contact-intro reveal visible';shell.appendChild(intro);
    const eyebrow=document.createElement('p');eyebrow.className='eyebrow';eyebrow.textContent='Let’s make something meaningful';intro.appendChild(eyebrow);
    const heading=document.createElement('h2');heading.textContent=c.heading||'Writing collaborations, brand stories & kind hellos.';intro.appendChild(heading);
    const lead=document.createElement('p');lead.className='contact-lead';lead.textContent=c.text||'';intro.appendChild(lead);
    const channels=document.createElement('div');channels.className='social-row dynamic-contact-channels';(c.channels||[]).filter(x=>x&&x.enabled!==false&&x.showInContact!==false).forEach(x=>channels.appendChild(makeChannel(x)));intro.appendChild(channels);
    const card=document.createElement('div');card.className='contact-card reveal visible';shell.appendChild(card);
    const title=document.createElement('h3');title.textContent='Tell me what you have in mind.';card.appendChild(title);
    const email=String(c.recipientEmail||site.email||'').trim();
    if(c.formEnabled!==false&&email){
      const form=document.createElement('form');form.id='contact-form';form.method='POST';form.action='https://formsubmit.co/'+encodeURIComponent(email);
      const fields=[['Name','text','name'],['Email','email','email'],['Subject','text','subject']];
      fields.forEach(([labelText,type,name])=>{const label=document.createElement('label');label.textContent=labelText;const input=document.createElement('input');input.type=type;input.name=name;input.required=true;label.appendChild(input);form.appendChild(label)});
      const mlabel=document.createElement('label');mlabel.textContent='Message';const textarea=document.createElement('textarea');textarea.name='message';textarea.rows=6;textarea.required=true;mlabel.appendChild(textarea);form.appendChild(mlabel);
      const button=document.createElement('button');button.className='button primary';button.type='submit';button.textContent='Send message →';form.appendChild(button);card.appendChild(form);
    }else{
      const p=document.createElement('p');p.className='contact-empty';p.textContent='Add a recipient email in Pages CMS to activate the contact form.';card.appendChild(p);
    }
    old.replaceWith(section);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(run,1000),{once:true});else setTimeout(run,1000);
})();