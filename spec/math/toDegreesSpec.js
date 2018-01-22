'use strict';

var d2b = require('../../');

describe("d2b.toDegrees()", function() {

  it("converts zero radians.", function () {
    expect(d2b.toDegrees(0)).toEqual(0);
  });

  it("converts 1 radian.", function () {
    expect(d2b.toDegrees(1)).toEqual(57.29577951308232);
  });

  it("converts PI radians.", function () {
    expect(d2b.toDegrees(Math.PI)).toEqual(180);
  });

  it("converts PI/2 radians.", function () {
    expect(d2b.toDegrees(Math.PI/2)).toEqual(90);
  });




});
