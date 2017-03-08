beforeEach(function () {
  jasmine.addMatchers({
    toBeEqualNodes: function (util, customEqualityTesters) {
      return {
        compare: function (actual, expected) {
          var errorFound = false;

          if (actual.length !== expected.length) errorFound = true;
          else {
            actual.forEach(function (node) {
              if (!expected.includes(node)) errorFound = true;
            });
            expected.forEach(function (node) {
              if (!actual.includes(node)) errorFound = true;
            });
          }

          if (errorFound) {
            return {
              pass: false
            };
          } else {
            return {
              pass: true
            };
          }
        }
      }
    }
  });
});
