import median from '../../src/scripts/math/median.js';

describe("Median", function() {

  it("it computes a zero median.", () => {
    expect(median([0])).toBe(0);
  });

  it("it computes a simple median.", () => {
    expect(median([2, 3, 4])).toBe(3);
  });

  it("it computes a complex mean.", () => {
    expect(median([5, 16, -2, -100, 0])).toBe(0);
  });

  // it("it returns undefined for an empty array.", () => {
  //   expect(mean([])).toBe(undefined);
  // });
  //
  // it("it allows a value accessor function.", () => {
  //   const arr = [{v: 2}, {v: 3}, {v: 4}],
  //         value = function (d) { return d.v; };
  //
  //   expect(mean(arr, value)).toBe(3);
  // });
  //
  // it("it allows a weight accessor function.", () => {
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
