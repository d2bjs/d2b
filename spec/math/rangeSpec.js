'use strict';

var d2b = require('../../');

describe("Range", function() {

  it("it computes the range of one value.", function() {
    expect(d2b.range([0])).toEqual(0);
  });

  it("it computes range of a set of positive numbers.", function() {
    expect(d2b.range([2, 4, 3])).toEqual(2);
  });

  it("it computes the range of any given set of integers.", function() {
    expect(d2b.range([5, 16, -2, -100, 0])).toEqual(116);
  });

  it("it returns undefined for an empty array.", function() {
    expect(d2b.range([])).toEqual(undefined);
  });

  it("it allows a value accessor function.", function() {
    const arr = [{v: 2}, {v: 3}, {v: 4}],
          value = function (d) { return d.v; };

    expect(d2b.range(arr, value)).toEqual(2);
  });

  it("it calculates range of decimal values",function() {
    expect(d2b.range([3.6,2.3])).toEqual(1.3000000000000003);
  });






});
