describe("d2b.svgLine()", function() {

    var pathDescription;

    beforeEach(function() {
      pathDescription = this.pathDescription;

      this.svg = d3.select('body').append('svg');
      this.line = d2b.svgLine();

      this.x = d3.scaleLinear().domain([1, 5]).range([0, 300]),
      this.y = d3.scaleLinear().domain([0, 10]).range([100, 0]);

      this.line.x(this.x).y(this.y);

      this.svg.datum(this.graphFixture1).call(this.line);
    });

    afterEach(function() {
      if (!this.skipRemove) this.svg.remove();
    });

    it('has correct type', function () {
      expect(this.line.type()).toBe('line');
    });

    it('has line-graphs `g` group', function () {
      expect(this.svg.selectAll('g.d2b-line-graphs').size()).toBe(1);
    });

    it('has correct amount of line `g` groups', function () {
      this.svg
        .datum(this.graphFixture2)
        .call(this.line);

      expect(this.svg.selectAll('g.d2b-line-graph').size()).toBe(2);
    });

    it('has custom colors', function () {

      var color = d3.scaleOrdinal()
        .domain(['Line Graph 1', 'Line Graph 2'])
        .range(['rgb(128, 0, 128)', 'rgb(0, 128, 128)']);

      this.line.color(function (d) { return color(d.label); });

      this.svg.call(this.line);

      this.svg.selectAll('path.d2b-line').each(function (d) {
        expect(d3.select(this).style('stroke')).toBe(color(d.data.label));
      });

    });

    it('has correct path description `d`', function () {
      var path = this.svg.select('path.d2b-line'),
          description = 'M0,80L75,60L150,90L225,10L300,30';
      expect(this.pathDescription(path)).toBe(description);
    });


    it('supports basic stacking', function () {
      this.line.stackBy(true);
      this.svg.datum(this.graphFixture2).call(this.line);

      var paths = {
        'Graph 1': 'M0,80L75,60L150,90L225,10L300,30',
        'Graph 2': 'M0,20L75,30L150,40L225,-80L300,20',
      };

      this.svg.selectAll('path.d2b-line').each(function (d) {
        expect(pathDescription(d3.select(this))).toBe(paths[d.data.label]);
      });
    });

    it('supports custom d3 line', function () {
      var d3Line = d3.line().curve(d3.curveBasis);

      this.line.line(d3Line);
      this.svg.call(this.line);

        var path = this.svg.select('path.d2b-line'),
            description = 'M0,80L12.500000,76.666667C25,73.333333,50,66.666667,75,68.333333C100,70,125,80,150,71.666667C175,63.333333,200,36.666667,225,26.666667C250,16.666667,275,23.333333,287.500000,26.666667L300,30';

        expect(this.pathDescription(path)).toBe(description);
    });

    it('supports custom stacking', function () {
      var stack = d3.stack().offset(d3.stackOffsetExpand);

      this.y.domain([0, 1]);
      this.line.stackBy(true).stack(stack);
      this.svg.datum(this.graphFixture2).call(this.line);

      var paths = {
        'Graph 1': 'M0,75L75,42.857143L150,83.333333L225,50L300,12.500000',
        'Graph 2': 'M0,0L75,0L150,0L225,0L300,0',
      };

      this.svg.selectAll('path.d2b-line').each(function (d) {
        expect(pathDescription(d3.select(this))).toBe(paths[d.data.label]);
      });
    });

    it('supports stacking with custom alignment', function () {
      this.line.stackBy(true).align(function (d) { return d.align; });
      this.svg.datum(this.graphFixture6).call(this.line);

      var paths = {
        'Graph 1': 'M0,80L75,60L150,90L225,10L300,30',
        'Graph 2': 'M0,80L75,60L150,90L225,10L300,30',
      };

      this.svg.selectAll('path.d2b-line').each(function (d) {
        expect(pathDescription(d3.select(this))).toBe(paths[d.data.label]);
      });
    });

    it('supports custom scales', function () {
      this.line.x(d3.scaleBand().domain([1, 2, 3, 4, 5]).range([0, 300]));
      this.line.y(d3.scalePow().exponent(0.5).domain([0, 100]).range([150, 0]));
      this.svg.call(this.line);

      var path = this.svg.select('path.d2b-line'),
          description = 'M30,128.786797L90,120L150,135L210,105L270,110.313730';

      expect(this.pathDescription(path)).toBe(description);
    });

    it('supports graph key accessor', function () {
      var oldNodes, newNodes, svg = this.svg;

      var getNodes = function () {
        return svg.selectAll('path.d2b-line').nodes();
      };

      this.line.key(function (d) { return d.label; });
      svg.datum(this.graphFixture2).call(this.line);

      oldNodes = getNodes();

      svg.call(this.line);

      expect(oldNodes).toEqual(getNodes());

      svg.datum(this.graphFixture5).call(this.line);

      expect(oldNodes).not.toEqual(getNodes());
      expect(oldNodes[0]).toEqual(getNodes()[0]);
    });

    it('supports graphs accessor', function () {
      this.line.graphs(function (d) { return d.graphs; });
      this.svg.datum(this.graphFixture3).call(this.line);

      expect(this.svg.selectAll('g.d2b-line-graph').size()).toBe(1);
    });

    it('supports values accessor', function () {
      var path, description;

      this.line.values(function (d) { return d.vals; });
      this.svg.datum(this.graphFixture4).call(this.line);

      path = this.svg.select('path.d2b-line');
      description = 'M0,80L75,60L150,90L225,10L300,30';
      expect(this.pathDescription(path)).toBe(description);
    });

    it('supports x and y point accessor', function () {
      var path, description;

      this.line
        .px(function (d) { return d.xVal; })
        .py(function (d) { return d.yVal; });
      this.svg.datum(this.graphFixture7).call(this.line);

      path = this.svg.select('path.d2b-line');
      description = 'M0,80L75,60L150,90L225,10L300,30';
      expect(this.pathDescription(path)).toBe(description);
    });

    it('has correct visible points', function () {
      this.svg.datum(this.graphFixture8);

      var mapper = function (d) { return [d.x, d.y]; },
          points = this.line.getVisiblePoints(this.svg).map(mapper),
          expected = [[1,2], [2,4], [1,6], [2,3]];

      expect(points).toEqual(expected);
    });

});
