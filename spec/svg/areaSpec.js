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
describe('d2b.svgArea()', function() {

  var x, y, area;

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
    var svg = d3.select(window.document.querySelector('svg')).attr('width','100%').attr('height','100%');

    // Set datum to fixture and apply the line generator
    return svg.datum(fixture).call(area);
  };

  beforeEach(function (){
    x = d3.scaleLinear().domain([1, 5]).range([0, 300]);
    y = d3.scaleLinear().domain([0, 10]).range([100, 0]);


    area = d2b.svgArea().x(x).y(y);
  });

  it('has correct type', function () {
    expect(area.type()).toBe('area');
  });

  it('has area-graphs `g` group', function (done) {
    domTest(function (errors, window) {
      var svg = generate(window, fixtures[0]);

      expect(svg.selectAll('g.d2b-area-graphs').size()).toBe(1);

      done();
    });
  });

  it('has correct amount of area `g` groups', function (done) {
    domTest(function (errors, window) {
      var svg = generate(window, fixtures[1]);

      expect(svg.selectAll('g.d2b-area-graph').size()).toBe(2);

      done();
    });
  });



  it('has correct path description `d`', function(done) {
    domTest(function (errors, window) {
      var svg = generate(window, fixtures[0]);

      expect(pathDesc(svg.select('path.d2b-area'))).toBe('M0,80L75,60L150,90L225,10L300,30L300,100L225,100L150,100L75,100L0,100Z');

      done();
    });
  });

  it('supports basic stacking', function(done) {
    area.stackBy(true);

    domTest(function (errors, window) {
      var svg = generate(window, fixtures[1]);

      var paths = {
        'Graph 1': 'M0,80L75,60L150,90L225,10L300,30L300,100L225,100L150,100L75,100L0,100Z',
        'Graph 2': 'M0,20L75,30L150,40L225,-80L300,20L300,30L225,10L150,90L75,60L0,80Z',
      };

      svg.selectAll('path.d2b-area').each(function (d) {
        expect(pathDesc(d3.select(this))).toBe(paths[d.data.label]);
      });

      done();
    });
  });

  it('supports custom d3 area', function(done) {
    var d3Area = d3.area().curve(d3.curveBasis);
    area.area(d3Area);

    domTest(function (errors, window) {
      var svg = generate(window, fixtures[0]);

      var description = 'M0,80L12.500000,76.666667C25,73.333333,50,66.666667,75,68.333333C100,70,125,80,150,71.666667C175,63.333333,200,36.666667,225,26.666667C250,16.666667,275,23.333333,287.500000,26.666667L300,30L300,100L287.500000,100C275,100,250,100,225,100C200,100,175,100,150,100C125,100,100,100,75,100C50,100,25,100,12.500000,100L0,100Z';

      expect(pathDesc(svg.select('path.d2b-area'))).toBe(description);

      done();
    });
  });

  it('supports custom stacking', function(done) {
    var d3Stack = d3.stack().offset(d3.stackOffsetExpand);
    area.stackBy(true).stack(d3Stack);
    y.domain([0, 1]);

    domTest(function (errors, window) {
      var svg = generate(window, fixtures[1]);

      var paths = {
        'Graph 1': 'M0,75L75,42.857143L150,83.333333L225,50L300,12.500000L300,100L225,100L150,100L75,100L0,100Z',
        'Graph 2': 'M0,0L75,0L150,0L225,0L300,0L300,12.500000L225,50L150,83.333333L75,42.857143L0,75Z',
      };

      svg.selectAll('path.d2b-area').each(function (d) {
        expect(pathDesc(d3.select(this))).toBe(paths[d.data.label]);
      });

      done();
    });
  });

  it('supports custom scales', function(done) {
    area
      .x(d3.scaleBand().domain([1, 2, 3, 4, 5]).range([0, 300]))
      .y(d3.scalePow().exponent(0.5).domain([0, 100]).range([150, 0]));

    domTest(function (errors, window) {
      var svg = generate(window, fixtures[0]);

      expect(pathDesc(svg.select('path.d2b-area'))).toBe('M30,128.786797L90,120L150,135L210,105L270,110.313730L270,150L210,150L150,150L90,150L30,150Z');


      done();
    });
  });

  it('supports graph key accessor', function(done) {
    var oldNodes;
    area.key(function (d) { return d.label; });

    domTest(function (errors, window) {
      var oldNodes = getNodes(generate(window, fixtures[1]));
      expect(oldNodes).toEqual(getNodes(generate(window, fixtures[1])));
      expect(oldNodes[0]).toEqual(getNodes(generate(window, fixtures[4]))[0]);
      expect(oldNodes).not.toBeEqualNodes(getNodes(generate(window, fixtures[4])));

      done();
    });

    function getNodes (svg) {
      return svg.selectAll('path.d2b-area').nodes();
    }
  });

  it('supports graphs accessor', function(done) {
    area.graphs(function (d) { return d.graphs; });

    domTest(function (errors, window) {
      var svg = generate(window, fixtures[2]);

      expect(svg.selectAll('g.d2b-area-graph').size()).toBe(1);

      done();
    });
  });

  it('supports values accessor', function(done) {
    area.values(function (d) { return d.vals; });

    domTest(function (errors, window) {
      var svg = generate(window, fixtures[3]);

      expect(pathDesc(svg.select('path.d2b-area'))).toBe('M0,80L75,60L150,90L225,10L300,30L300,100L225,100L150,100L75,100L0,100Z');

      done();
    });
  });

  it('supports x and y point accessor', function(done) {
    area
      .px(function (d) { return d.xVal; })
      .py(function (d) { return d.yVal; });

    domTest(function (errors, window) {
      var svg = generate(window, fixtures[6]);

      expect(pathDesc(svg.select('path.d2b-area'))).toBe('M0,80L75,60L150,90L225,10L300,30L300,100L225,100L150,100L75,100L0,100Z');

      done();
    });
  });

  it('has correct visible points', function(done) {
    domTest(function (errors, window) {
      var svg = generate(window, fixtures[7]);

      var points = area.getVisiblePoints(svg).map(function (d) { return [d.x, d.y]; });

      expect(points).toEqual([[1,0], [2,0], [1,0], [2,0], [1,2], [2,4], [1,6],[2,3]])

      done();
    });
  });

  it('has custom colors', function (done) {
    var color = d3.scaleOrdinal()
      .domain(['Graph 1', 'Graph 2'])
      .range(['rgb(128, 0, 128)', 'rgb(0, 128, 128)']);

    area.color(function (d) { return color(d.label); });

    domTest(function (errors, window) {
      var svg = generate(window, fixtures[1]);

      svg.selectAll('path.d2b-area').each(function (d) {
        expect(d3.select(this).style('fill')).toBe(color(d.data.label));
      });

      done();
    });
  });








});
