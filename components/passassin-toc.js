// passassin-toc.js
// Single source of truth for the Passassin blog's page list. Each page drops in
// a tag where the markup belongs and this script renders it in place, during
// parsing, so the sticky TOC has its final height before blog-toc.js measures it.
//
//   <script src="../components/passassin-toc.js" data-root="../" data-render="sections"></script>
//   <script src="../components/passassin-toc.js" data-root="../" data-render="pager"></script>
//   <script src="./components/passassin-toc.js"  data-root="./"  data-render="directory"></script>
//
// data-root is the path from the current page back to the site root.
// Must be a classic (non-async, non-defer) script: it relies on document.currentScript.
//
// To add a page, add one entry to PAGES.

(function () {
  const PAGES = [
    { path: 'passassin-demo.html', name: 'Intro' },
    {
      path: 'passassin/agent.html', name: 'Agent',
      desc: 'the base class: movement, hitboxes, animation state, and the observer record'
    },
    {
      path: 'passassin/class-split.html', name: 'Class Split',
      desc: 'splitting Agent into Player and Enemy — aiming and behavior states'
    },
    {
      path: 'passassin/complex-vision.html', name: 'Complex Vision',
      desc: 'detection meters, angle-based fill curves, and activity profiles'
    },
    {
      path: 'passassin/ai-movement.html', name: 'AI movement',
      desc: 'hand-rolled pathfinding, from wall bumpers to composite obstacles'
    },
    { path: 'passassin/object-grouping.html', name: 'Object Grouping', desc: '' },
    {
      path: 'passassin/enemy-combat.html', name: 'Expanding Combat',
      desc: 'inaccurate enemy fire with separate horizontal and vertical spread'
    },
  ];

  const script = document.currentScript;
  if (!script) return;
  const root = script.getAttribute('data-root') || './';
  const mode = script.getAttribute('data-render');

  const href = p => root + p.path;
  const here = PAGES.findIndex(p => window.location.pathname.endsWith('/' + p.path));
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

  let html = '';

  if (mode === 'sections') {
    html = '<ul class="toc-list">\n        <p class="toc-phase-label">sections</p>\n' +
      PAGES.map((p, i) =>
        '        <li><a href="' + href(p) + '"' + (i === here ? ' class="toc-active"' : '') + '>' +
        esc(p.name) + '</a></li>'
      ).join('\n') + '\n      </ul>';
  } else if (mode === 'pager') {
    const link = (p, cls, label) =>
      '<a class="' + cls + '" href="' + href(p) + '"><span>' + label + '</span>' + esc(p.name) + '</a>';
    if (here > 0) html += '      ' + link(PAGES[here - 1], 'blog-pager-prev', 'previous') + '\n';
    if (here >= 0 && here < PAGES.length - 1) html += '      ' + link(PAGES[here + 1], 'blog-pager-next', 'next') + '\n';
  } else if (mode === 'directory') {
    html = PAGES.slice(1).map((p, i) =>
      '      <a class="blog-part" href="' + href(p) + '">\n' +
      '        <span class="blog-part-num">' + String(i + 1).padStart(2, '0') + '</span>\n' +
      '        <span class="blog-part-name">' + esc(p.name) + '</span>\n' +
      '        <span class="blog-part-desc">' + esc(p.desc || '') + '</span>\n' +
      '      </a>'
    ).join('\n') + '\n';
  }

  script.insertAdjacentHTML('beforebegin', html);
})();
