'use strict';

var d2b = require('../../');

describe("d2b.median()", function() {

  it("computes a zero median.", function () {
    expect(d2b.median([0])).toBe(0);
  });

  it("computes a simple median.", function () {
    expect(d2b.median([2, 3, 4])).toBe(3);
  });

  it("computes a complex median.", function () {
    expect(d2b.median([5, 16, -2, -100, 0])).toBe(0);
  });

  // it("it returns undefined for an empty array.", function () {
  //   expect(mean([])).toBe(undefined);
  // });
  //
  // it("it allows a value accessor function.", function () {
  //   const arr = [{v: 2}, {v: 3}, {v: 4}],
  //         value = function (d) { return d.v; };
  //
  //   expect(mean(arr, value)).toBe(3);
  // });
  //
  // it("it allows a weight accessor function.", function () {
  //   const arr = [
  //           {v: 2, w: 1},
  //           {v: 3, w: 2},
  //           {v: 4, w: 2}
  //         ],
  //         value = function (d) { return d.v },
  //         weight = function (d) { return d.w };
  //
  //   expect(mean(arr, value, weight)).toBe(3.2);
  // });

});
