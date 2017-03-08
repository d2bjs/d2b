'use strict';

var d2b = require('../../');

describe("d2b.mean()", function() {

  it("computes a zero mean.", function () {
    expect(d2b.mean([0])).toBe(0);
  });

  it("computes a simple mean.", function () {
    expect(d2b.mean([2, 3, 4])).toBe(3);
  });

  it("computes a complex mean.", function () {
    expect(d2b.mean([5, 16, -2, -100, 0])).toBe(-16.2);
  });

  it("returns undefined for an empty array.", function () {
    expect(d2b.mean([])).toBe(undefined);
  });

  it("allows a value accessor function.", function () {
    const arr = [{v: 2}, {v: 3}, {v: 4}],
          value = function (d) { return d.v; };

    expect(d2b.mean(arr, value)).toBe(3);
  });

  it("allows a weight accessor function.", function () {
    const arr = [
            {v: 2, w: 1},
            {v: 3, w: 2},
            {v: 4, w: 2}
          ],
          value = function (d) { return d.v },
          weight = function (d) { return d.w };

    expect(d2b.mean(arr, value, weight)).toBe(3.2);
  });

});
