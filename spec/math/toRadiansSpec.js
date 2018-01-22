'use strict';

var d2b = require('../../');

describe("d2b.toRadians()", function() {

  it("converts zero degrees.", function () {
    expect(d2b.toRadians(0)).toEqual(0);
  });

  it("converts 1 degree.", function () {
    expect(d2b.toRadians(1)).toEqual(0.017453292519943295);
  });

  it("converts 180 degrees.", function () {
    expect(d2b.toRadians(180)).toEqual(Math.PI);
  });

  it("converts 90 degrees.", function () {
    expect(d2b.toRadians(90)).toEqual(Math.PI/2);
  });
});
