(() => {
  const safeUrl = value => {
    try {
      const url = new URL(String(value || ''), location.href);
      return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
    } catch { return ''; }
  };

  function ensureStyles() {
    if (document.querySelector('link[data-branding-sync]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'branding-sync.css?v=1';
    link.dataset.brandingSync = 'true';
    document.head.appendChild(link);
  }

  function setFavicon(value) {
    const href = safeUrl(value) || 'assets/site-icon.svg';
    let link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = href;
  }

  function setBrand(site) {
    document.querySelectorAll('[data-site-name]').forEach(el => {
      el.textContent = site.name || 'Softly, Tam';
    });
    document.querySelectorAll('[data-author-name]').forEach(el => {
      el.textContent = site.authorName || 'Tam Phan';
    });

    const logo = safeUrl(site.logoImage);
    document.querySelectorAll('.brand-mark').forEach(mark => {
      mark.replaceChildren();
      mark.classList.toggle('has-image', Boolean(logo));
      if (logo) {
        const img = document.createElement('img');
        img.src = logo;
        img.alt = '';
        mark.appendChild(img);
      } else {
        mark.textContent = 'S';
      }
    });
    setFavicon(site.favicon);
  }

  function setSocials(site) {
    const items = [
      ['Facebook', safeUrl(site.facebook)],
      ['Instagram', safeUrl(site.instagram)],
      ['TikTok', safeUrl(site.tiktok)]
    ].filter(([, url]) => url);

    document.querySelectorAll('.footer-social-inline, .dynamic-social-links').forEach(el => el.remove());
    document.querySelectorAll('[data-social-instagram]').forEach(el => el.remove());

    document.querySelectorAll('.footer-links').forEach(footer => {
      if (!items.length) return;
      const wrap = document.createElement('span');
      wrap.className = 'dynamic-social-links';
      items.forEach(([label, url]) => {
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = label;
        wrap.appendChild(a);
      });
      footer.appendChild(wrap);
    });
  }

  async function sync() {
    ensureStyles();
    try {
      const response = await fetch(`content/site.json?sync=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) return;
      const data = await response.json();
      const site = data.site || {};
      setBrand(site);
      setSocials(site);
      const tagline = document.querySelector('[data-footer-tagline]');
      if (tagline && site.footerTagline) tagline.textContent = site.footerTagline;
    } catch {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      sync();
      setTimeout(sync, 1200);
    }, { once: true });
  } else {
    sync();
    setTimeout(sync, 1200);
  }
})();
