'use strict';

var d2b = require('../../');

describe("Median", function() {

  it("it computes a zero median.", () => {
    expect(d2b.median([0])).toBe(0);
  });

  it("it computes a simple median consisting of odd numbers.", () => {
    expect(d2b.median([2, 3, 4])).toBe(3);
  });

  it("it computes a simple median consisting of even numbers.", () => {
    expect(d2b.median([2, 3, 4,5])).toBe(3.5);
  });

  it("it computes a complex median.", () => {
    expect(d2b.median([5, 16, -2, -100, 0])).toBe(0);
  });

 it("it returns undefined for an empty array.", () => {
    expect(d2b.median([])).toEqual(undefined);
  });

 it("it calculates the median of decimal values",() => {
    expect(d2b.median([3.6,2.3])).toEqual(2.95);
  });

  it("it allows a value accessor function.", () => {
    const arr = [{v:1}, {v: 2}, {v: 3}, {v: 4}],
          value = function (d) { return d.v; };

    expect(d2b.median(arr, value)).toEqual(2.5);
  });

  it("it allows a weight accessor function.", () => {
    const arr = [
            {v: 2, w: 1},
            {v: 3, w: 2},
            {v: 4, w: 2}
          ],
          value = function (d) { return d.v },
          weight = function (d) { return d.w };

    expect(d2b.median(arr, value, weight)).toEqual(3);
  });



  });
