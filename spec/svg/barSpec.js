// 'use strict';
//
// // load dependencies
// var d3 = require('d3');
// var d2b = require('../../');
// var jsdom = require('jsdom-no-contextify');
//
// // get graph fixtures
// var fixtures = require('../support/fixtures/graphFixtures');
//
// // get method for retrieving a normalized path description from a d3 selection
// var pathDesc = require('../support/utilities/path').description;
//
// // describe svgLine
// describe('d2b.svgBar()', function() {
//
//   var x, y, bar;
//
//   function domTest (callback) {
//     var htmlStub ='<html><body><svg></svg></body></html>';
//
//     return jsdom.env({
//       features: {QuerySelector: true},
//       html : htmlStub,
//       done: callback
//     });
//   };
//
//   function generate (window, fixture) {
//     // Get d3 svg selection.
//     var svg = d3.select(window.document.querySelector('svg'));
//     // Set datum to fixture and apply the line generator
//     return svg.datum(fixture).call(bar);
//   };
//
//   beforeEach(function () {
//     x = d3.scaleLinear().domain([1, 5]).range([100, 500]);
//     y = d3.scaleLinear().domain([0, 10]).range([100, 0]);
//
//     bar = d2b.svgBar().x(x).y(y);
//   });
//
//
//   it('has correct type', function () {
//     expect(bar.type()).toBe('bar');
//   });
//
//   it('has bar-graphs `g` group', function (done) {
//     domTest(function (errors, window) {
//       var svg = generate(window, fixtures[1]);
//
//       expect(svg.selectAll('g.d2b-bar-graphs').size()).toBe(1);
//
//       done();
//     });
//   });
//
//   it('has correct number of bar `g` groups', function (done) {
//     domTest(function (errors, window) {
//       var svg = generate(window, fixtures[1]);
//
//       expect(svg.selectAll('g.d2b-bar-graph').size()).toBe(2);
//
//       done();
//     });
//   });
//
//   it('has correct number of bars representing all elements of data', function (done) {
//     domTest(function (errors, window) {
//       var svg = generate(window, fixtures[1]);
//
//       expect(svg.selectAll('g.d2b-bar-group').size()).toBe(10);
//
//       done();
//     });
//   });
//
//   it('each bar has correct width ', function(done) {
//     domTest(function (errors, window) {
//       var svg = generate(window, fixtures[1]);
//
//       svg.selectAll('rect').each(function (d) {
//         expect(d3.select(this).attr('width')).toBe('25');
//       });
//       done();
//     });
//   });
//
//   it('each bar has correct x and y coordinates ', function(done) {
//     domTest(function (errors, window) {
//       var svg = generate(window, fixtures[1]);
//
//       const arr = [
//         [
//           'translate(75,80)',
//           'translate(175,60)',
//           'translate(275,90)',
//           'translate(375,10)',
//           'translate(475,30)'
//         ],
//         [
//           'translate(100,40)',
//           'translate(200,70)',
//           'translate(300,50)',
//           'translate(400,10)',
//           'translate(500,90)'
//         ]
//       ];
//
//       svg.selectAll('g.d2b-bar-graph').each(function (d, i) {
//         d3.select(this).selectAll('g.d2b-bar-group').each(function (d, j) {
//           expect(d3.select(this).attr('transform')).toEqual(arr[i][j])
//         })
//       });
//
//       done();
//     });
//   });
//
//   it('supports basic stacking', function(done) {
//     bar.stackBy(true);
//
//     domTest(function (errors, window) {
//       var svg = generate(window, fixtures[1]);
//
//       var stacker = d2b.stack();
//
//       svg.selectAll('path.d2b-line').each(function (d) {
//         expect(pathDesc(d3.select(this))).toBe(paths[d.data.label]);
//       });
//
//       done();
//     });
//   });
//
//   it('it supports custom padding', function(done) {
//     domTest(function (errors, window) {
//       bar.padding(0.1);
//       var svg = generate(window, fixtures[1]);
//       svg.selectAll('rect').each(function (d) {
//         expect(d3.select(this).attr('width')).toBe('45');
//       });
//       done();
//     });
//   });
//
//   it('it supports custom group padding', function(done) {
//     domTest(function (errors, window) {
//       bar.groupPadding(0.1);
//       var svg = generate(window, fixtures[1]);
//       svg.selectAll('rect').each(function (d) {
//         expect(d3.select(this).attr('width')).toBe('20');
//       });
//       done();
//     });
//   });
//
//
//   it('each bar has correct height ', function(done) {
//     domTest(function (errors, window) {
//       var svg = generate(window, fixtures[1]);
//       svg.selectAll('rect').each(function (d) {
//         expect(d3.select(this).attr('height')).toEqual((100 - y(d.y)).toString());
//       });
//       done();
//     });
//   });
//
//
//   it('supports custom scales', function(done) {
//     bar
//       .x(d3.scaleBand().domain([1, 2, 3, 4, 5]).range([0, 300]))
//       .y(d3.scalePow().exponent(0.5).domain([0, 100]).range([150, 0]));
//
//     domTest(function (errors, window) {
//       var svg = generate(window, fixtures[1]);
//
//       svg.selectAll('rect').each(function (d) {
//         expect(d3.select(this).attr('width')).toBe('15');
//       });
//       done();
//     });
//   });
//
//   it('supports graph key accessor', function(done) {
//     var oldNodes;
//     bar.key(function (d) { return d.label; });
//
//     function getNodes (svg) {
//       return svg.selectAll('g.d2b-bar-group').nodes();
//     };
//
//     domTest(function (errors, window) {
//       var oldNodes = getNodes(generate(window, fixtures[1]));
//       expect(oldNodes).toEqual(getNodes(generate(window, fixtures[1])));
//       expect(oldNodes[0]).toEqual(getNodes(generate(window, fixtures[4]))[0]);
//       expect(oldNodes).not.toBeEqualNodes(getNodes(generate(window, fixtures[4])));
//
//       done();
//     });
//   });
//
//   it('supports graphs accessor', function(done) {
//     bar.graphs(function (d) { return d.graphs; });
//
//     domTest(function (errors, window) {
//       var svg = generate(window, fixtures[2]);
//
//       expect(svg.selectAll('g.d2b-bar-graph').size()).toBe(1);
//
//       done();
//     });
//   });
//
//   it('supports values accessor', function(done) {
//     bar.values(function (d) { return d.vals; });
//
//
//     domTest(function (errors, window) {
//       var svg = generate(window, fixtures[3]);
//
//       svg.selectAll('rect').each(function (d) {
//         expect(d3.select(this).attr('width')).toBe('50');
//       });
//
//       svg.selectAll('rect').each(function (d) {
//         expect(d3.select(this).attr('height')).toEqual((100 - y(d.y)).toString());
//       });
//
//       done();
//     });
//   });
//
//   it('has correct visible points', function(done) {
//     domTest(function (errors, window) {
//       var svg = generate(window, fixtures[7]);
//
//       var points = bar.getVisiblePoints(svg).map(function (d) { return [d.x, d.y]; });
//
//       expect(points).toEqual([[1,0], [2,0], [1,0], [2,0], [1, 2], [2, 4], [1, 6], [2, 3]])
//
//       done();
//     });
//   });
// });
