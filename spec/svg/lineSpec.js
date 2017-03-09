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
describe('d2b.svgLine()', function() {

  var x, y, line;

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
    return svg.datum(fixture).call(line);
  };

  beforeEach(function () {
    x = d3.scaleLinear().domain([1, 5]).range([0, 300]);
    y = d3.scaleLinear().domain([0, 10]).range([100, 0]);

    line = d2b.svgLine().x(x).y(y);
  });

  it('has correct type', function () {
    expect(line.type()).toBe('line');
  });

  it('has line-graphs `g` group', function (done) {
    domTest(function (errors, window) {
      var svg = generate(window, fixtures[0]);

      expect(svg.selectAll('g.d2b-line-graphs').size()).toBe(1);

      done();
    });
  });

  it('has correct amount of line `g` groups', function (done) {
    domTest(function (errors, window) {
      var svg = generate(window, fixtures[1]);

      expect(svg.selectAll('g.d2b-line-graph').size()).toBe(2);

      done();
    });
  });

  it('has custom colors', function (done) {
    var color = d3.scaleOrdinal()
      .domain(['Graph 1', 'Graph 2'])
      .range(['rgb(128, 0, 128)', 'rgb(0, 128, 128)']);

    line.color(function (d) { return color(d.label); });

    domTest(function (errors, window) {
      var svg = generate(window, fixtures[1]);

      svg.selectAll('path.d2b-line').each(function (d) {
        expect(d3.select(this).style('stroke')).toBe(color(d.data.label));
      });

      done();
    });
  });

  it('has correct path description `d`', function(done) {
    domTest(function (errors, window) {
      var svg = generate(window, fixtures[0]);

      expect(pathDesc(svg.select('path.d2b-line'))).toBe('M0,80L75,60L150,90L225,10L300,30');

      done();
    });
  });

  it('supports basic stacking', function(done) {
    line.stackBy(true);

    domTest(function (errors, window) {
      var svg = generate(window, fixtures[1]);

      var paths = {
        'Graph 1': 'M0,80L75,60L150,90L225,10L300,30',
        'Graph 2': 'M0,20L75,30L150,40L225,-80L300,20',
      };

      svg.selectAll('path.d2b-line').each(function (d) {
        expect(pathDesc(d3.select(this))).toBe(paths[d.data.label]);
      });

      done();
    });
  });

  it('supports custom d3 line', function(done) {
    var d3Line = d3.line().curve(d3.curveBasis);
    line.line(d3Line);

    domTest(function (errors, window) {
      var svg = generate(window, fixtures[0]);

      var description = 'M0,80L12.500000,76.666667C25,73.333333,50,66.666667,75,68.333333C100,70,125,80,150,71.666667C175,63.333333,200,36.666667,225,26.666667C250,16.666667,275,23.333333,287.500000,26.666667L300,30';

      expect(pathDesc(svg.select('path.d2b-line'))).toBe(description);

      done();
    });
  });

  it('supports custom stacking', function(done) {
    var d3Stack = d3.stack().offset(d3.stackOffsetExpand);
    line.stackBy(true).stack(d3Stack);
    y.domain([0, 1]);

    domTest(function (errors, window) {
      var svg = generate(window, fixtures[1]);

      var paths = {
        'Graph 1': 'M0,75L75,42.857143L150,83.333333L225,50L300,12.500000',
        'Graph 2': 'M0,0L75,0L150,0L225,0L300,0',
      };

      svg.selectAll('path.d2b-line').each(function (d) {
        expect(pathDesc(d3.select(this))).toBe(paths[d.data.label]);
      });

      done();
    });
  });

  it('supports stacking with custom alignment', function(done) {
    var d3Stack = d3.stack().offset(d3.stackOffsetExpand);
    line.stackBy(true).align(function (d) { return d.align; });

    domTest(function (errors, window) {
      var svg = generate(window, fixtures[5]);

      var paths = {
        'Graph 1': 'M0,80L75,60L150,90L225,10L300,30',
        'Graph 2': 'M0,80L75,60L150,90L225,10L300,30',
      };

      svg.selectAll('path.d2b-line').each(function (d) {
        expect(pathDesc(d3.select(this))).toBe(paths[d.data.label]);
      });

      done();
    });
  });

  it('supports custom scales', function(done) {
    line
      .x(d3.scaleBand().domain([1, 2, 3, 4, 5]).range([0, 300]))
      .y(d3.scalePow().exponent(0.5).domain([0, 100]).range([150, 0]));

    domTest(function (errors, window) {
      var svg = generate(window, fixtures[0]);

      expect(pathDesc(svg.select('path.d2b-line'))).toBe('M30,128.786797L90,120L150,135L210,105L270,110.313730');

      done();
    });
  });

  it('supports graph key accessor', function(done) {
    var oldNodes;
    line.key(function (d) { return d.label; });

    domTest(function (errors, window) {
      var oldNodes = getNodes(generate(window, fixtures[1]));
      expect(oldNodes).toEqual(getNodes(generate(window, fixtures[1])));
      expect(oldNodes[0]).toEqual(getNodes(generate(window, fixtures[4]))[0]);
      expect(oldNodes).not.toBeEqualNodes(getNodes(generate(window, fixtures[4])));

      done();
    });

    function getNodes (svg) {
      return svg.selectAll('path.d2b-line').nodes();
    }
  });

  it('supports graphs accessor', function(done) {
    line.graphs(function (d) { return d.graphs; });

    domTest(function (errors, window) {
      var svg = generate(window, fixtures[2]);

      expect(svg.selectAll('g.d2b-line-graph').size()).toBe(1);

      done();
    });
  });

  it('supports values accessor', function(done) {
    line.values(function (d) { return d.vals; });

    domTest(function (errors, window) {
      var svg = generate(window, fixtures[3]);

      expect(pathDesc(svg.select('path.d2b-line'))).toBe('M0,80L75,60L150,90L225,10L300,30');

      done();
    });
  });

  it('supports x and y point accessor', function(done) {
    line
      .px(function (d) { return d.xVal; })
      .py(function (d) { return d.yVal; });

    domTest(function (errors, window) {
      var svg = generate(window, fixtures[6]);

      expect(pathDesc(svg.select('path.d2b-line'))).toBe('M0,80L75,60L150,90L225,10L300,30');

      done();
    });
  });

  it('has correct visible points', function(done) {
    domTest(function (errors, window) {
      var svg = generate(window, fixtures[7]);

      var points = line.getVisiblePoints(svg).map(function (d) { return [d.x, d.y]; });

      expect(points).toEqual([[1,2], [2,4], [1,6], [2,3]])

      done();
    });
  });

});
