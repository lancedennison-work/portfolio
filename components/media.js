// media.js
// Drives .media-placeholder blocks. The wrapper's data-label is the single
// source of truth: it becomes the caption, and it is mirrored onto the media as
// alt text so the two can never drift apart.
//
//   <div class="media-placeholder" data-label="hitscan trace debug">
//     <img src="…">
//   </div>
//
// While the media is still coming down the caption reads "loading… <label>";
// once it arrives the caption is just the label. If it fails, the media is
// hidden and the label stays, so the block still says what should be there.

(function () {
  function captionFor(block) {
    let caption = block.querySelector('.media-placeholder-label');
    if (!caption) {
      caption = document.createElement('p');
      caption.className = 'media-placeholder-label';
      block.appendChild(caption);
    }
    return caption;
  }

  function setup(block) {
    const label = block.getAttribute('data-label') || '';
    const media = block.querySelector('img, video');
    const caption = captionFor(block);

    if (media) {
      if (media.tagName === 'IMG') media.alt = label;
      else media.setAttribute('aria-label', label);
    }

    function finish(state) {
      block.classList.remove('is-loading');
      block.classList.add(state);
      caption.textContent = label;
    }

    function settle() {
      finish('is-loaded');
    }

    function fail() {
      if (media) media.style.display = 'none';
      finish('is-failed');
    }

    // No media, or nothing to fetch: there is no load to wait on.
    if (!media || !media.getAttribute('src')) {
      fail();
      return;
    }

    const loaded = media.tagName === 'IMG'
      ? media.complete && media.naturalWidth > 0
      : media.readyState >= 2;

    if (loaded) {
      settle();
      return;
    }

    block.classList.add('is-loading');
    caption.textContent = 'loading… ' + label;
    media.addEventListener(media.tagName === 'IMG' ? 'load' : 'loadeddata', settle, { once: true });
    media.addEventListener('error', fail, { once: true });
  }

  document.querySelectorAll('.media-placeholder[data-label]').forEach(setup);
})();
