import * as d3 from 'd3';

import base from '../model/base';
import chartFrame from '../util/chartFrame';
import legend from '../util/legend';
import plane from '../svg/plane';
import color from '../util/color';
import tooltipAxis from '../util/tooltipAxis';
import d2bid from '../util/id';
import oreq from '../util/oreq';

export default function () {

  const $$ = {};

  const chart = function (context) {
    context.call($$.chartFrame);

    $$.legend
      .empty(d => d.data.hidden)
      .setEmpty((d, i, state) => d.data.hidden = state)
      .html(d => d.label)
      .key(d => d.label)
      .color(d => d.color);

    const selection = (context.selection)? context.selection() : context;

    selection.each(function (datum) {
      update.call(this, datum, context !== selection ? context : null);
    });

    selection.dispatch('chart-axis-updated', {bubbles: true});

    return chart;
  };

  base(chart, $$)
    .addProp('plane', plane())
    .addProp('chartFrame', chartFrame().legendEnabled(true).breadcrumbsEnabled(false))
    .addProp('legend', legend().clickable(true).dblclickable(true))
    .addPropFunctor('tooltipConfig', d => d.tooltipConfig)
    .addPropFunctor('duration', 250)
    .addPropFunctor('x', {})
    .addPropFunctor('y', {})
    .addPropFunctor('x2', {})
    .addPropFunctor('y2', {})
    .addPropFunctor('groups', d => d.groups)
    .addPropFunctor('sets', d => d.sets)
    // group functors
    .addPropFunctor('groupLabel', d => d.label)
    .addPropFunctor('groupColor', d => color($$.groupLabel(d)))
    // set functors
    .addPropFunctor('setGenerators', d => d.generators)
    .addPropFunctor('setXType', d => d.xType)
    .addPropFunctor('setYType', d => d.yType)
    .addPropFunctor('setGraphs', d => d.graphs)
    // graph functors
    .addPropFunctor('graphLabel', d => d.label)
    .addPropFunctor('graphGroup', d => d.group)
    .addPropFunctor('graphColor', d => color($$.graphLabel(d)))
    .addPropFunctor('graphTooltipConfig', d => d.tooltipConfig);

  function update (datum, transition) {
    const container = d3.select(this),
          chartContainer = container.select('.d2b-chart-container'),
          chartNode = chartContainer.node(),
          legendContainer = container.select('.d2b-legend-container'),
          size = chartContainer.node().__size__,
          sets = getSets(datum),
          allGraphs = getAllGraphs(sets),
          duration = $$.duration(datum),
          groups = getGroups(datum, sets);

    propagateHidden(groups);

    // make tooltip sticky on the chart node because tooltipAxis requires
    // one instance per axisChart
    let tooltip = chartNode.tooltip = chartNode.tooltip || tooltipAxis().trackX(true).trackY(false).threshold(50);

    tooltip
      .title(points => `${oreq(points[0].x, points[0].x1)}`)
      .clear();

    // update functionality
    $$.legend.values(groups);
    legendContainer
        .call($$.legend)
        .on('change', () => container.transition().duration(duration).call(chart))
      .selectAll('.d2b-legend-item')
        .on('mouseover', d => legendMouseover(d, chartContainer))
        .on('mouseout', d => legendMouseout(d, chartContainer));


    // update plane dimensions, width and height
    $$.plane.size(size);

    let plane = chartContainer.selectAll('.d2b-axis-plane').data([datum]),
        planeUpdate = plane,
        planeEnter = plane.enter().append('g').attr('class', 'd2b-axis-plane');

    plane = plane.merge(planeEnter);

    // enter axis-set wrapper
    let wrapper = chartContainer.selectAll('.d2b-axis-wrapper').data([datum]),
        wrapperUpdate = wrapper,
        wrapperEnter = wrapper.enter().append('g').attr('class', 'd2b-axis-wrapper');

    wrapperEnter.append('rect').attr('class', 'd2b-axis-background');

    wrapper = wrapper.merge(wrapperEnter);

    // enter axis-sets
    let set = wrapper.selectAll('.d2b-axis-set').data(sets),
        setEnter = set.enter().append('g').attr('class', 'd2b-axis-set'),
        setExit = set.exit();

    set = set.merge(setEnter).order();

    // queue transitions if context is a transition
    if (transition) {
      setExit = setExit.transition(transition);
      wrapperUpdate = wrapperUpdate.transition(transition);
      planeUpdate = planeUpdate.transition(transition);
    }

    // initialze generator and visible point sets
    const visible = {
      x: [],
      x2: [],
      y: [],
      y2: []
    };

    set.each(function (s) {
      const el = d3.select(this);

      this.genUpdate = el.selectAll('.d2b-graph-generator')
        .data(s.generators, d => d.key);

      this.genEnter = this.genUpdate.enter().append('g')
        .attr('class', 'd2b-graph-generator')
        .style('opacity', 0);

      this.genExit = this.genUpdate.exit();

      this.gen = this.genUpdate.merge(this.genEnter).order();

      this.gen.each(function (d, i) {
        const gen = d3.select(this),
              visiblePoints = d.generator
                .tooltipGraph(graph => {
                  if (i) return null;
                  let tooltipGraph = tooltip.graph(d2bid());

                  matchGraph(graph, allGraphs).tooltipConfig(tooltipGraph);
                  return tooltipGraph;
                })
                .color(graph => matchGraph(graph, allGraphs).color)
                .graphs(s.graphs.map(g => g.data).filter(g => !g.hidden))
                .getVisiblePoints(gen);

        if (d.generator.duration) d.generator.duration(duration);

        visiblePoints.forEach(point => {
          visible[s.xType].push(point.x);
          visible[s.yType].push(point.y);
        });

      });

    });

    const xData = $$.x(datum, visible.x),
          yData = $$.y(datum, visible.y),
          x2Data = $$.x2(datum, visible.x2),
          y2Data = $$.y2(datum, visible.y2);


    setupAxis(xData, visible.x, axisDefaults.x);
    setupAxis(yData, visible.y, axisDefaults.y);
    setupAxis(x2Data, visible.x2, axisDefaults.x2);
    setupAxis(y2Data, visible.y2, axisDefaults.y2);

    $$.plane
      .axis(d => d.__axis__)
      .x(xData.__axis__ ? xData : null)
      .y(yData.__axis__ ? yData : null)
      .x2(x2Data.__axis__ ? x2Data : null)
      .y2(y2Data.__axis__ ? y2Data : null);

    // update plane
    planeEnter.call($$.plane);
    planeUpdate.call($$.plane);

    // after plane update, fetch plane box
    const planeBox = $$.plane.box(plane);

    // add clip path from plane
    set.attr('clip-path', `url(#${plane.select('.d2b-clip-plane').attr('id')})`);

    // update the graphs with their generators
    set.each(function (s) {
      const xAxis = s.xType === 'x2'? x2Data.__axis__ : xData.__axis__,
            yAxis = s.yType === 'y2'? y2Data.__axis__ : yData.__axis__;

      if (transition) {
        this.genUpdate = this.genUpdate.transition(transition);
        this.genExit = this.genExit.transition(transition).style('opacity', 0);
      }

      this.genExit.remove();

      this.gen.each(function (d) {
        let el = d3.select(this);
        if (transition) el = el.transition(transition);
        
        d.generator
          .x(xAxis.scale())
          .y(yAxis.scale());

        el.style('opacity', 1).call(d.generator);
      });

      d3.select(this).on('change', () => container.transition().duration(duration).call(chart));
    });

    // remaining transitions and exits
    setExit.style('opacity', 0).remove();

    // position wrapper
    wrapperEnter
        .attr('transform', `translate(${planeBox.left}, ${planeBox.top})`)
      .select('rect.d2b-axis-background')
        .attr('height', Math.max(0, planeBox.height))
        .attr('width', Math.max(0, planeBox.width));

    wrapperUpdate
        .attr('transform', `translate(${planeBox.left}, ${planeBox.top})`)
      .select('rect.d2b-axis-background')
        .attr('height', Math.max(0, planeBox.height))
        .attr('width', Math.max(0, planeBox.width));

    // configure tooltip
    tooltip.row(point => {
      const graphLabel = matchGraph(point.graph.data, allGraphs).label;
      return `${graphLabel}: ${oreq(point.y, point.y1, point.median)}`;
    });

    $$.tooltipConfig(tooltip);
    tooltip
      .svgContainer(wrapper)
      .tracker(wrapper)
      .size(planeBox);

  }

  // defaultz axis components
  const bandDefault = d3.scaleBand(),
        linearDefault = d3.scaleLinear(),
        axisDefaults = {
          x: {
            band: bandDefault.copy(),
            linear: linearDefault.copy(),
            axis: d3.axisBottom()
          },
          y: {
            band: bandDefault.copy(),
            linear: linearDefault.copy(),
            axis: d3.axisLeft()
          },
          x2: {
            band: bandDefault.copy(),
            linear: linearDefault.copy(),
            axis: d3.axisTop()
          },
          y2: {
            band: bandDefault.copy(),
            linear: linearDefault.copy(),
            axis: d3.axisRight()
          }
        };

  function getGroups (d, sets = getSets(d), graphs = getAllGraphs(sets)) {
    const graphGroups = graphs.filter(graph => !graph.group);

    graphGroups.forEach(g => {
      g.groupType = 'graph';
      g.groupGraphs = [g];
    });

    return ($$.groups(d) || []).map(group => {
      const newGroup = {
        groupType: 'group',
        data: group,
        label: $$.groupLabel(group),
        color: $$.groupColor(group)
      };

      newGroup.groupGraphs = graphs.filter(graph => newGroup.label === graph.group);

      newGroup.groupGraphs.forEach(g => {
        g.color = newGroup.color;
      });

      return newGroup;
    })
    .concat(graphGroups);
  }

  function getSets (d) {
    return $$.sets(d).map(set => {
      const generatorTypes = {};
      return {
        data: set,
        xType: $$.setXType(set) || 'x',
        yType: $$.setYType(set) || 'y',
        generators: $$.setGenerators(set).map(generator => {
          const type = generator.type();
          generatorTypes[type] = generatorTypes[type] || 0;
          return {
            data: generator,
            key: `${type}-${generatorTypes[type] += 1}`,
            generator: generator
          };
        }),
        graphs: getSetGraphs(set)
      };
    });
  }

  function getSetGraphs (d) {
    return $$.setGraphs(d).map(graph => {
      return {
        data: graph,
        label: $$.graphLabel(graph) || '',
        color: $$.graphColor(graph),
        group: $$.graphGroup(graph),
        tooltipConfig: $$.graphTooltipConfig(graph) || function () {}
      };
    });
  }

  function getAllGraphs (sets) {
    return [].concat.apply([], sets.map( set => set.graphs ));
  }

  function propagateHidden (groups) {
    groups.forEach(group => {
      group.groupGraphs.forEach(graph => graph.data.hidden = group.data.hidden);
    });
  }

  function legendMouseover(d, selection) {
    const graphs = selection.selectAll('.d2b-graph');
    if (!d.groupGraphs.some(graph => !graph.data.hidden)) return;
    graphs
        .style('opacity', 0.2)
      .filter(graph => {
        return d.data === graph.data ||
               (d.groupGraphs.map(d => d.data) || []).indexOf(graph.data) > -1;
      })
        .style('opacity', '');
  }

  function legendMouseout(d, selection) {
    selection.selectAll('.d2b-graph').style('opacity', 1);
  }

  function matchGraph(graph, allGraphs) {
    return allGraphs.filter(g => g.data === graph || g.data === graph.data)[0];
  }

  function setupAxis(data, points, defaults) {
    if (!points.length) data.hidden = true;

    const axis = data.axis || defaults.axis,
          scale = data.scale ? data.scale.copy() : getScale(points, defaults);

    let domain = scale.domain();

    if (!scale.bandwidth && data.linearPadding) {
      const dist = domain[1] - domain[0];
      domain[0] = domain[0] + dist * data.linearPadding[0];
      domain[1] = domain[1] + dist * data.linearPadding[1];
    }

    scale.domain(domain);
    data.__axis__ = axis.scale(scale);
  }

  function getScale(points, defaults) {
    const band = points.some(d => isNaN(d)),
          domain = band ? d3.set(points).values() : d3.extent(points).map(d => d || 0),
          scale = band ? defaults.band : defaults.linear;

    return scale.domain(domain);
  }

  return chart;
}
