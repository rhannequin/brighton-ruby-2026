/* Positions any element with `data-year` along the timeline.
   Uses a piecewise-linear scale: ancient millennia compressed,
   modern centuries stretched, so dense post-1500 events stay legible. */
(function () {
  // [year, percentage] anchor pairs, strictly increasing in year.
  // Tweak these to rebalance the visual scale.
  var ANCHORS = [
    [-3000,   0],
    [-2000,  18],
    [    0,  38],
    [ 1000,  55],
    [ 1900,  88],
    [ 2026, 100]
  ];

  function yearToPct(year) {
    if (year <= ANCHORS[0][0]) return ANCHORS[0][1];
    var last = ANCHORS[ANCHORS.length - 1];
    if (year >= last[0]) return last[1];
    for (var i = 0; i < ANCHORS.length - 1; i++) {
      var y0 = ANCHORS[i][0], p0 = ANCHORS[i][1];
      var y1 = ANCHORS[i + 1][0], p1 = ANCHORS[i + 1][1];
      if (year >= y0 && year <= y1) {
        var t = (year - y0) / (y1 - y0);
        return p0 + t * (p1 - p0);
      }
    }
    return last[1];
  }

  function position(root) {
    (root || document).querySelectorAll('[data-year]').forEach(function (el) {
      var year = parseFloat(el.dataset.year);
      if (!isNaN(year)) el.style.left = yearToPct(year) + '%';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { position(); });
  } else {
    position();
  }

  // Re-run on Reveal slide changes so dynamically-added markup is also placed.
  document.addEventListener('ready', function () { position(); });
  document.addEventListener('slidechanged', function () { position(); });
})();
