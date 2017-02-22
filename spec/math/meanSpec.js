import mean from '../../src/scripts/math/mean.js';

describe("Mean", function() {

  it("it computes a zero mean.", () => {
    expect(mean([0])).toBe(0);
  });

  it("it computes a simple mean.", () => {
    expect(mean([2, 3, 4])).toBe(3);
  });

  it("it computes a complex mean.", () => {
    expect(mean([5, 16, -2, -100, 0])).toBe(-16.2);
  });

  it("it returns undefined for an empty array.", () => {
    expect(mean([])).toBe(undefined);
  });

  it("it allows a value accessor function.", () => {
    const arr = [{v: 2}, {v: 3}, {v: 4}],
          value = function (d) { return d.v; };

    expect(mean(arr, value)).toBe(3);
  });

  it("it allows a weight accessor function.", () => {
    const arr = [
            {v: 2, w: 1},
            {v: 3, w: 2},
            {v: 4, w: 2}
          ],
          value = function (d) { return d.v },
          weight = function (d) { return d.w };

    expect(mean(arr, value, weight)).toBe(3.2);
  });

});
