// blog-toc.js
// Shared behavior for the Passassin blog pages: sticky-TOC scroll offset,
// TOC highlighting, and the .reveal animation.
// Row 1 of the TOC links to the other pages, row 2 to this page's phases.

// Make href anchor link scroll padding based off header height
let lastTocHeight = null;
function updateScrollPadding() {
  const toc = document.querySelector('.toc');
  if (!toc) return 0;
  const tocHeight = toc.getBoundingClientRect().height;
  const tocMargin = parseFloat(window.getComputedStyle(toc).marginBottom) / 2;
  const total = tocHeight + tocMargin;
  // Only write when it actually moved. --toc-h also feeds the media max-height
  // in style.css, so rewriting it on every resize would resize every image and
  // video on the page — and with overflow-anchor: none the reader's position
  // slides when that happens mid-scroll.
  if (total !== lastTocHeight) {
    lastTocHeight = total;
    document.documentElement.style.setProperty('--toc-h', total + 'px');
  }
  return total;
}
window.addEventListener('load', () => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      updateScrollPadding();
    });
  });
});
window.addEventListener('resize', updateScrollPadding);
window.addEventListener('componentsLoaded', () => {
  updateScrollPadding();
});
// Row 1 links go to other pages; row 2 links are in-page anchors. Both are left
// to the browser: html carries scroll-padding-top: var(--toc-h), so a plain
// anchor jump lands under the TOC, and components.js turns smooth scrolling on
// for the duration of the jump. We only refresh the offset first — this script
// never scrolls the window itself, so nothing competes with the reader.
document.querySelector('.toc').addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || href[0] !== '#') return;
  updateScrollPadding();
});

// TOC active highlight on scroll
const tocSteps = document.querySelectorAll('.step[id]');
const tocObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const match = entry.target.id.match(/^step-(\d+)-(\d+)$/);
    if (!match) return;
    const activePhase = match[1];
    // Leave row 1 alone; its current-page link is marked in the markup.
    document.querySelectorAll('.toc-list a[href^="#"]').forEach(l => l.classList.remove('toc-active'));
    const activePhaseLink = document.querySelector(`.toc-list a[href="#phase-${activePhase}"]`);
    if (activePhaseLink) activePhaseLink.classList.add('toc-active');
  });
}, {
  rootMargin: `-${64 + 40}px 0px -55% 0px`,
  threshold: 0
});
tocSteps.forEach(step => tocObserver.observe(step));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
  // threshold 0 rather than a fraction: a tall section would otherwise need a
  // large slice of itself on screen before 5% is met. The positive bottom
  // margin starts the fade just before the section scrolls into view.
}, { threshold: 0, rootMargin: '0px 0px 10% 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// The media videos are autoplay+loop, so every one of them keeps decoding even
// while it is far off screen. Three at once is enough to drop frames and make
// scrolling feel uneven, so only let the visible ones run.
const mediaVideos = document.querySelectorAll('.media-placeholder video');
if (mediaVideos.length) {
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        if (video.paused) video.play().catch(() => { });
      } else if (!video.paused) {
        video.pause();
      }
    });
  }, { rootMargin: '200px 0px' });
  mediaVideos.forEach(video => videoObserver.observe(video));
}

// Set the offset once up front so an anchored deep link lands in the right
// place instead of waiting for the load event.
updateScrollPadding();
