(()=>{
  let cfg={};
  const fired=new Set();

  async function getConfig(){
    try{
      const r=await fetch('content/analytics.json?v='+Date.now(),{cache:'no-store'});
      return r.ok?await r.json():{};
    }catch{return{}}
  }

  function send(name,params={}){
    if(typeof window.gtag==='function')window.gtag('event',name,params);
  }

  function installGa(id){
    window.dataLayer=window.dataLayer||[];
    window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};
    window.gtag('js',new Date());
    window.gtag('config',id,{send_page_view:cfg.trackPageViews!==false});
    const s=document.createElement('script');
    s.async=true;
    s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(id);
    document.head.appendChild(s);
  }

  function trackArticle(){
    if(cfg.trackArticleProgress===false)return;
    const article=document.querySelector('#article-body');
    if(!article)return;
    const slug=new URLSearchParams(location.search).get('story')||'article';
    const title=document.querySelector('#article-title')?.textContent?.trim()||document.title;
    const base={article_slug:slug,article_title:title};
    send('article_reader',base);

    const marks=(cfg.progressMilestones||[25,50,75,90,100]).map(Number).filter(n=>n>0&&n<=100).sort((a,b)=>a-b);
    const check=()=>{
      const rect=article.getBoundingClientRect();
      const top=rect.top+scrollY;
      const height=Math.max(article.offsetHeight,1);
      const pct=Math.max(0,Math.min(100,Math.round((scrollY+innerHeight-top)/height*100)));
      marks.forEach(mark=>{
        const key='p'+mark;
        if(pct>=mark&&!fired.has(key)){
          fired.add(key);
          send('article_progress',{...base,percent:mark});
          if(mark===100)send('article_complete',base);
        }
      });
    };
    addEventListener('scroll',check,{passive:true});
    addEventListener('resize',check,{passive:true});
    setTimeout(check,800);

    if(cfg.trackEngagedReaders!==false){
      const seconds=Math.max(10,Number(cfg.engagedSeconds)||30);
      setTimeout(()=>send('engaged_reader',{...base,seconds}),seconds*1000);
    }
  }

  async function init(){
    cfg=await getConfig();
    if(cfg.enabled!==true)return;
    const id=String(cfg.measurementId||'').trim();
    if(!/^G-[A-Z0-9]+$/i.test(id))return;
    installGa(id);
    setTimeout(trackArticle,1200);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
