
var reNumber = /[-+]?(?:\d+\.\d+|\d+\.|\.\d+|\d+)(?:[eE][-]?\d+)?/g;

function formatNumber(s) {
  return Math.abs((s = +s) - Math.round(s)) < 1e-6 ? Math.round(s) : s.toFixed(6);
}

function normalize (path) {
  return path.replace(reNumber, formatNumber);
};

function description (selection) {
  return normalize(selection.attr('d'));
};

exports.description = description;
exports.normalize = normalize;
