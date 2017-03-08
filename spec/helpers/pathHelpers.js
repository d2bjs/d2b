beforeEach(function() {

  var pathNormalize;

  var reNumber = /[-+]?(?:\d+\.\d+|\d+\.|\.\d+|\d+)(?:[eE][-]?\d+)?/g;

  function formatNumber(s) {
    return Math.abs((s = +s) - Math.round(s)) < 1e-6 ? Math.round(s) : s.toFixed(6);
  }

  pathNormalize = this.pathNormalize = function (path) {
    return path.replace(reNumber, formatNumber);
  };

  this.pathDescription = function (selection) {
    return pathNormalize(selection.attr('d'));
  };

});
