(() => {
  const $ = (s, root = document) => root.querySelector(s);

  function addStyles() {
    if ($('#contact-enhancements-styles')) return;
    const link = document.createElement('link');
    link.id = 'contact-enhancements-styles';
    link.rel = 'stylesheet';
    link.href = 'contact-enhancements.css?v=3';
    document.head.appendChild(link);
  }

  async function getSiteSettings() {
    try {
      const response = await fetch(`content/site.json?contact=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) return {};
      const json = await response.json();
      return json.site || {};
    } catch {
      return {};
    }
  }

  function socialLink(label, url) {
    if (!url) return '';
    return `<a class="social-chip" href="${url}" target="_blank" rel="noopener noreferrer">${label}<span>↗</span></a>`;
  }

  function buildContactSection(settings) {
    const oldSection = $('#contact');
    if (!oldSection) return;

    const email = (settings.email || '').trim();
    const facebook = (settings.facebook || '').trim();
    const instagram = (settings.instagram || '').trim();
    const tiktok = (settings.tiktok || '').trim();
    const text = settings.contactText || 'If you have a thoughtful project, a story worth telling, or simply want to say hello, I’d love to hear from you.';

    const section = document.createElement('section');
    section.className = 'contact-hub';
    section.id = 'contact';
    section.innerHTML = `
      <div class="section-shell contact-hub-grid">
        <div class="contact-intro reveal visible">
          <p class="eyebrow">Let’s make something meaningful</p>
          <h2>Writing collaborations,<br><em>brand stories & kind hellos.</em></h2>
          <p class="contact-lead">${text}</p>
          ${email ? `<div class="contact-direct"><span>Prefer email?</span><a href="mailto:${email}">Email Tam directly <span>↗</span></a></div>` : ''}
          <div class="social-row" aria-label="Social media links">
            ${socialLink('Facebook', facebook)}
            ${socialLink('Instagram', instagram)}
            ${socialLink('TikTok', tiktok)}
          </div>
        </div>
        <div class="contact-card reveal visible">
          <div class="contact-card-heading">
            <span class="contact-card-icon" aria-hidden="true">✉</span>
            <div><p class="eyebrow">Send a note</p><h3>Tell me what you have in mind.</h3></div>
          </div>
          ${email ? `
          <form id="contact-form" action="https://formsubmit.co/${encodeURIComponent(email)}" method="POST">
            <input type="hidden" name="_subject" value="New message from Softly, Tam">
            <input type="hidden" name="_template" value="table">
            <input type="hidden" name="_captcha" value="true">
            <input type="text" name="_honey" class="contact-honeypot" tabindex="-1" autocomplete="off">
            <div class="contact-form-grid">
              <label><span>Name</span><input type="text" name="name" autocomplete="name" placeholder="Your name" required></label>
              <label><span>Email</span><input type="email" name="email" autocomplete="email" placeholder="you@example.com" required></label>
              <label class="full"><span>What is this about?</span><select name="inquiry" required><option value="">Choose one</option><option>Writing collaboration</option><option>Brand / content project</option><option>Partnership</option><option>Reader message</option><option>Something else</option></select></label>
              <label class="full"><span>Subject</span><input type="text" name="subject" maxlength="100" placeholder="A short subject" required></label>
              <label class="full"><span>Message</span><textarea name="message" rows="6" minlength="10" placeholder="Share a little about your idea, timeline, or what you would like to say…" required></textarea></label>
            </div>
            <div class="contact-form-footer"><button class="button primary" type="submit">Send message <span>→</span></button><p>Your message will be delivered to my inbox.</p></div>
            <p class="contact-privacy">Your details are used only to reply to your message. See the <a href="privacy.html">privacy note</a>.</p>
          </form>` : `<div class="contact-empty"><p>Contact form setup is ready. Add your Gmail address in Pages CMS under <strong>Website content → Brand, introduction & contact → Contact email</strong> to activate message delivery.</p></div>`}
        </div>
      </div>`;

    oldSection.replaceWith(section);
  }

  function updateFooterSocials(settings) {
    const links = $('.footer-links');
    if (!links) return;
    const instagramLegacy = $('[data-social-instagram]', links);
    if (instagramLegacy) instagramLegacy.remove();

    const emailLegacy = $('[data-contact-email]', links);
    const socialHtml = [
      settings.facebook ? socialLink('Facebook', settings.facebook) : '',
      settings.instagram ? socialLink('Instagram', settings.instagram) : '',
      settings.tiktok ? socialLink('TikTok', settings.tiktok) : ''
    ].join('');
    if (socialHtml) {
      const wrap = document.createElement('span');
      wrap.className = 'footer-social-inline';
      wrap.innerHTML = socialHtml;
      if (emailLegacy) links.insertBefore(wrap, emailLegacy);
      else links.appendChild(wrap);
    }
  }

  function addFloatingContact() {
    if ($('.contact-fab')) return;
    const a = document.createElement('a');
    a.className = 'contact-fab';
    a.href = '#contact';
    a.setAttribute('aria-label', 'Contact Tam');
    a.innerHTML = '<span>✉</span><b>Contact</b>';
    document.body.appendChild(a);
  }

  async function startContactEnhancements() {
    if ($('.contact-hub')) return;
    addStyles();
    const settings = await getSiteSettings();
    buildContactSection(settings);
    updateFooterSocials(settings);
    addFloatingContact();
  }

  function waitForCoreRender() {
    let checks = 0;
    const timer = setInterval(() => {
      checks += 1;
      const year = $('#year');
      if ((year && year.textContent.trim()) || checks >= 40) {
        clearInterval(timer);
        startContactEnhancements();
      }
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForCoreRender, { once: true });
  } else {
    waitForCoreRender();
  }
})();
