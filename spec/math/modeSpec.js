// 'use strict';
//
// var d2b = require('../../');
//
// describe("Mode", function() {
//
//   it("computes a zero mode.", function () {
//     expect(d2b.mode([0])).toEqual(undefined);
//   });
//
//   it("computes a simple mode.", function () {
//     expect(d2b.mode([2, 3, 4])).toEqual(undefined);
//   });
//
//   it("computes a simple mode.", function () {
//
//     expect(d2b.mode([2, 3, 4, 3, 3, 2])).toEqual(3);
//   });
//
//   it("computes a simple mode.", function () {
//
//     expect(d2b.mode([2, 3, 4, 3, 3, 2,2])).toEqual([3,2]);
//   });
//
//
//
//
//   it("returns undefined for an empty array.", function () {
//     expect(d2b.mode([])).toEqual(undefined);
//   });
//
//   it("allows a value accessor function.", function () {
//     const arr = [{v: 2}, {v: 3}, {v: 4}],
//           arr1 = [{v: 2}, {v: 3}, {v: 4}, {v: 4}],
//
//           value = function (d) { return d.v; };
//
//     expect(d2b.mode(arr, value)).toEqual(undefined);
//     expect(d2b.mode(arr1, value)).toEqual(4);
//   });
//
//
//
//   it("allows a weight accessor function.", function () {
//     const arr = [
//             {v: 2, w: 1},
//             {v: 3, w: 2},
//             {v: 4, w: 2}
//           ],
//           a = [3,4],
//           value = function (d) { return d.v },
//           weight = function (d) { return d.w };
//
//     expect(d2b.mode(arr, value, weight)).toEqual(a);
//   });
//
//
//
//
//
//
//
// });
