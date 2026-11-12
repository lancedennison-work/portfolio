// game-player.js
// Drives .game-player blocks: shows a screenshot with a play button, and only
// loads the live game into the iframe once it's clicked, so the page doesn't
// pull in a whole game engine (or start its audio) just by being opened.
//
//   <div class="game-player" data-url="https://…/my-game/">
//     <button class="game-poster" type="button" style="background-image: url('…');">
//       <span class="game-play-btn">▶ play here</span>
//     </button>
//     <iframe title="My Game" allow="autoplay; fullscreen; gamepad" allowfullscreen hidden></iframe>
//   </div>
//
// Per-game sizing goes in the block's style: --game-aspect (default 16 / 9),
// --game-bg (letterbox colour, default #000) and max-width for games that
// don't scale to their window.

(function () {
  document.querySelectorAll('.game-player[data-url]').forEach(player => {
    const poster = player.querySelector('.game-poster');
    const frame = player.querySelector('iframe');
    if (!poster || !frame) return;

    poster.addEventListener('click', () => {
      // Hand the game keyboard focus as soon as it loads
      frame.addEventListener('load', () => frame.focus(), { once: true });
      frame.src = player.dataset.url;
      frame.hidden = false;
      poster.hidden = true;
    });
  });
})();
