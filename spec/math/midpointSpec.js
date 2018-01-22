'use strict';

var d2b = require('../../');


describe("Midpoint", function() {

  it("it computes the midpoint of one value.", () => {
    expect(d2b.midpoint([0])).toEqual(0);
  });

  it("it computes a simple midpoint.", () => {
    expect(d2b.midpoint([2, 4, 3])).toEqual(3);
  });

  it("it computes the midpoint of any given set of integers.", () => {
    expect(d2b.midpoint([5, 16, -2, -100, 0])).toEqual(-42);
  });

  it("it returns undefined for an empty array.", () => {
    expect(d2b.midpoint([])).toEqual(undefined);
  });

  it("it allows a value accessor function.", () => {
    const arr = [{v: 2}, {v: 3}, {v: 4}],
          value = function (d) { return d.v; };

    expect(d2b.midpoint(arr, value)).toEqual(3);
  });

  it("it calculates midpoint of decimal values",() => {
    expect(d2b.midpoint([3.6,2.3])).toEqual(2.95);
  });




});
