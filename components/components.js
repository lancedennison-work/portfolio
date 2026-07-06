// components.js
// Each page passes its root-relative prefix via data-prefix on the script tag:
//   <script src="./components/components.js" data-prefix="./"></script>    (root pages)
//   <script src="../components/components.js" data-prefix="../"></script>   (projects/ pages)

(function () {
  const script = document.currentScript;
  const prefix = script ? (script.getAttribute('data-prefix') || './') : './';

  function resolveLinks(container) {
    container.querySelectorAll('[data-link]').forEach(a => {
      a.href = prefix + a.getAttribute('data-link');
    });
    // Mark the current page link active
    container.querySelectorAll('a[href]').forEach(a => {
      if (a.href === window.location.href) {
        a.classList.add('active');
      }
    });
  }

  function load(url, placeholderId, onDone) {
    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error('Could not load ' + url);
        return r.text();
      })
      .then(html => {
        const el = document.getElementById(placeholderId);
        if (!el) return;
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        el.replaceWith(...tmp.childNodes);
        if (onDone) onDone();
      })
      .catch(console.error);
  }

  load(prefix + 'components/nav.html', 'nav-placeholder', () => {
    // Use the placeholder's next siblings, not querySelector('nav')
    // which would match the TOC <nav> on loop-factory.html
    const nav  = document.querySelector('nav.site-nav');
    const menu = document.getElementById('mobileMenu');
    if (nav)  resolveLinks(nav);
    if (menu) resolveLinks(menu);

    const btn = document.getElementById('hamburger');
    if (btn && menu) {
      btn.addEventListener('click', () => {
        btn.classList.toggle('open');
        menu.classList.toggle('open');
      });
      menu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          btn.classList.remove('open');
          menu.classList.remove('open');
        });
      });
    }

    window.dispatchEvent(new Event('componentsLoaded'));
  });

  load(prefix + 'components/footer.html', 'footer-placeholder', () => {
    const footer = document.querySelector('footer');
    if (footer) resolveLinks(footer);
  });
})();
