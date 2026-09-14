(()=>{
  const STORAGE_KEY='softly-tam-color-mode';
  const OLD_KEY='site-color-mode';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  async function loadControl(){try{const r=await fetch('content/control.json?v='+Date.now(),{cache:'no-store'});return r.ok?await r.json():{}}catch{return{}}}
  function getSavedMode(){const current=localStorage.getItem(STORAGE_KEY);if(current==='light'||current==='dark')return current;const old=localStorage.getItem(OLD_KEY);if(old==='light'||old==='dark'){localStorage.setItem(STORAGE_KEY,old);localStorage.removeItem(OLD_KEY);return old}return''}
  function applyMode(mode){const dark=mode==='dark';document.body.classList.toggle('color-mode-dark',dark);document.documentElement.dataset.colorMode=dark?'dark':'light';const meta=$('meta[name="theme-color"]');if(meta)meta.content=dark?'#1d1a18':'#fbf7f0';$$('.theme-toggle-unified').forEach(btn=>{btn.setAttribute('aria-pressed',String(dark));btn.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');btn.innerHTML=`<span class="theme-icon" aria-hidden="true">${dark?'☀':'☾'}</span><span>${dark?'Light':'Dark'}</span>`})}
  function installToggle(allow){$$('.theme-toggle,.article-theme-toggle').forEach(el=>el.remove());if(!allow){$$('.theme-toggle-unified').forEach(el=>el.remove());return}if($('.theme-toggle-unified'))return;const btn=document.createElement('button');btn.type='button';btn.className='theme-toggle-unified';const host=$('.utility-links')||$('.article-header-actions')||$('.site-header');if(host)host.prepend(btn);btn.addEventListener('click',()=>{const next=document.body.classList.contains('color-mode-dark')?'light':'dark';localStorage.setItem(STORAGE_KEY,next);applyMode(next)});applyMode(document.body.classList.contains('color-mode-dark')?'dark':'light')}
  function installMotion(){document.body.classList.add('motion-calm');document.body.classList.remove('animation-strong','animation-slide','animation-zoom','animation-fast');}
  async function init(){const control=await loadControl();const design=control.design||{};const mode=getSavedMode()||(design.defaultMode==='dark'?'dark':'light');applyMode(mode);installToggle(design.allowVisitorDarkMode!==false);installMotion()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
