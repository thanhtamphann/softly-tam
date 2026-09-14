(() => {
  const safeUrl = value => {
    try {
      const raw = String(value || '').trim();
      if (!raw) return '';
      if (/^(mailto:|tel:)/i.test(raw)) return raw;
      const url = new URL(raw, location.href);
      return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
    } catch { return ''; }
  };

  function ensureStyles() {
    if (document.querySelector('link[data-branding-sync]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'branding-sync.css?v=2';
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

  function getChannels(site) {
    const configured = Array.isArray(site.contactChannels) ? site.contactChannels : [];
    const channels = configured
      .filter(item => item && item.enabled !== false && item.label && safeUrl(item.url))
      .map(item => ({
        label: String(item.label),
        icon: String(item.icon || ''),
        url: safeUrl(item.url),
        note: String(item.note || ''),
        showInContact: item.showInContact !== false,
        showInFooter: item.showInFooter !== false,
        newTab: item.newTab !== false
      }));

    if (channels.length) return channels;

    return [
      { label: 'Facebook', icon: 'f', url: safeUrl(site.facebook), showInContact: true, showInFooter: true, newTab: true },
      { label: 'Instagram', icon: '◎', url: safeUrl(site.instagram), showInContact: true, showInFooter: true, newTab: true },
      { label: 'TikTok', icon: '♪', url: safeUrl(site.tiktok), showInContact: true, showInFooter: true, newTab: true }
    ].filter(item => item.url);
  }

  function makeChannelLink(channel, className = '') {
    const a = document.createElement('a');
    a.href = channel.url;
    a.className = className;
    if (channel.newTab && !/^(mailto:|tel:)/i.test(channel.url)) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    if (channel.icon) {
      const symbol = document.createElement('span');
      symbol.className = 'channel-symbol';
      symbol.textContent = channel.icon;
      a.appendChild(symbol);
    }
    const label = document.createElement('span');
    label.className = 'channel-label';
    label.textContent = channel.label;
    a.appendChild(label);
    if (channel.note) a.title = channel.note;
    return a;
  }

  function setFooterChannels(channels) {
    document.querySelectorAll('.footer-social-inline, .dynamic-social-links').forEach(el => el.remove());
    document.querySelectorAll('[data-social-instagram]').forEach(el => el.remove());

    const footerChannels = channels.filter(item => item.showInFooter);
    document.querySelectorAll('.footer-links').forEach(footer => {
      if (!footerChannels.length) return;
      const wrap = document.createElement('span');
      wrap.className = 'dynamic-social-links';
      footerChannels.forEach(channel => wrap.appendChild(makeChannelLink(channel, 'footer-channel-link')));
      footer.appendChild(wrap);
    });
  }

  function setContactChannels(channels) {
    const contactChannels = channels.filter(item => item.showInContact);
    const contact = document.querySelector('#contact');
    if (!contact) return;

    let row = contact.querySelector('.social-row');
    if (!row) {
      row = document.createElement('div');
      row.className = 'social-row dynamic-contact-channels';
      const host = contact.querySelector('.contact-intro') || contact.querySelector('.contact-inner > div:last-child') || contact;
      host.appendChild(row);
    }
    row.replaceChildren();
    row.classList.add('dynamic-contact-channels');
    contactChannels.forEach(channel => row.appendChild(makeChannelLink(channel, 'social-chip channel-chip')));
    row.hidden = contactChannels.length === 0;
  }

  function setChannels(site) {
    const channels = getChannels(site);
    setFooterChannels(channels);
    setContactChannels(channels);
  }

  async function sync() {
    ensureStyles();
    try {
      const response = await fetch(`content/site.json?sync=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) return;
      const data = await response.json();
      const site = data.site || {};
      setBrand(site);
      setChannels(site);
      const tagline = document.querySelector('[data-footer-tagline]');
      if (tagline && site.footerTagline) tagline.textContent = site.footerTagline;
    } catch {}
  }

  function start() {
    sync();
    [700, 1600, 3200].forEach(delay => setTimeout(sync, delay));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
