'use strict';

// load dependencies
var d3 = require('d3');
var d2b = require('../../');
var jsdom = require('jsdom-no-contextify');

// get graph fixtures
var fixtures = require('../support/fixtures/graphFixtures');

// get method for retrieving a normalized path description from a d3 selection
var pathDesc = require('../support/utilities/path').description;

// describe svgLine
describe('d2b.svgScatter()', function() {

  var x, y, scatter;

  function domTest (callback) {
    var htmlStub ='<html><body><svg></svg></body></html>';

    return jsdom.env({
      features: {QuerySelector: true},
      html : htmlStub,
      done: callback
    });
  };

  function generate (window, fixture) {
    // Get d3 svg selection.
    var svg = d3.select(window.document.querySelector('svg'));
    // Set datum to fixture and apply the line generator
    return svg.datum(fixture).call(scatter);
  };

  beforeEach(function () {
    x = d3.scaleLinear().domain([1, 5]).range([0, 300]);
    y = d3.scaleLinear().domain([0, 10]).range([100, 0]);

    scatter = d2b.svgScatter().x(x).y(y);
  });

  it('has correct type', function () {
    expect(scatter.type()).toBe('scatter');
  });

  it('has scatter-graphs `g` group', function (done) {
    domTest(function (errors, window) {
      var svg = generate(window, fixtures[1]);

      expect(svg.selectAll('g.d2b-scatter-graphs').size()).toBe(1);

      done();
    });
  });

  it('has scatter-graphs `g` group', function (done) {
    domTest(function (errors, window) {
      var svg = generate(window, fixtures[1]);

      expect(svg.selectAll('g.d2b-scatter-graph').size()).toBe(2);

      done();
    });
  });

  it('has has correct number of scatter points', function (done) {
    domTest(function (errors, window) {
      var svg = generate(window, fixtures[1]);

      expect(svg.selectAll('g.d2b-scatter-point').size()).toBe(10);

      done();
    });
  });

  it('has custom colors', function (done) {
    var color = d3.scaleOrdinal()
      .domain(['Graph 1', 'Graph 2'])
      .range(['rgb(128, 0, 128)', 'rgb(0, 128, 128)']);

    scatter.color(function (d) { return color(d.label); });

    domTest(function (errors, window) {
      var svg = generate(window, fixtures[1]);

      svg.selectAll('path.d2b-point-front').each(function (d) {
        expect(d3.select(this).style('fill')).toBe(color(d.graph.data.label));
      });

      done();
    });
  });

});
