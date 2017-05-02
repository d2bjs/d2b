import * as d3 from 'd3';

import base from '../model/base';
import color from '../util/color';
import stack from '../util/stack';
import id from '../util/id';
import isFinitePath from '../util/isFinitePath';

// line svg generator
export default function () {
  const $$ = {};

  function getGraphs (d, i) {
    const graphs = $$.graphs(d, i).map((graph, i) => {
      const newGraph = {
        data:          graph,
        index:         i,
        tooltipGraph:  $$.tooltipGraph(graph, i),
        shift:         $$.shift(graph, i),
        stackBy:       $$.stackBy(graph, i),
        key:           $$.key(graph, i),
        color:         $$.color(graph, i)
      };
      newGraph.values = $$.values(graph, i).map((point, i) => {
        const newPoint = {
          data:   point,
          index:  i,
          graph:  newGraph,
          x:      $$.px(point, i),
          y:      $$.py(point, i)
        };
        // initialize y1 and y0 (these will be overwritten by the stack if stacking applies)
        newPoint.y1 = newPoint.y;
        newPoint.y0 = 0;
        return newPoint;
      });
      return newGraph;
    });

    stackNest.entries(graphs).forEach(sg => stacker(sg.values));

    return graphs;
  }

  /* Update Function */
  const area = function (context) {
    const selection = context.selection? context.selection() : context;

    let graphs = selection.selectAll('.d2b-area-graphs').data(d => [d]);

    graphs = graphs.merge(graphs.enter().append('g').attr('class', 'd2b-area-graphs'));

    const graph = graphs.selectAll('.d2b-area-graph').data((d, i) => getGraphs(d, i), d => d.key);

    const graphEnter = graph.enter().append('g')
        .attr('class', 'd2b-area-graph d2b-graph')
        .style('opacity', 0);

    graphEnter
      .append('path')
        .attr('class', 'd2b-area')
        .style('fill', d => d.color)
        .attr('d', function (d) {
          // on entered graphs initialize with the preserved scales
          // if there are any
          const graphsNode = this.parentNode.parentNode,
                x = graphsNode.__scaleX,
                y = graphsNode.__scaleY;

          return getPath.call(this, d, x || $$.x, y || $$.y);
        });

    let graphUpdate = graph.merge(graphEnter).order(),
        graphExit = graph.exit();

    let areaUpdate = graphUpdate.select('.d2b-area');

    if (context !== selection) {
      graphUpdate = graphUpdate.transition(context);
      graphExit = graphExit.transition(context);
      areaUpdate = areaUpdate.transition(context);

      graphExit
          .style('opacity', 0)
        .select('.d2b-area')
          .attr('d', function (d) { return getPath.call(this, d, $$.x, $$.y); });
    }

    graphUpdate.style('opacity', 1);

    graphExit.remove();

    areaUpdate
        .style('fill', d => d.color)
        .attr('d', function (d) { return getPath.call(this, d, $$.x, $$.y, true); });

    // Make a copy of the scales sticky on the 'graphs' node
    const xCopy = $$.x.copy(), yCopy = $$.y.copy();

    graphs.each(function () {
      this.__scaleX = xCopy;
      this.__scaleY = yCopy;
    });

    selection.dispatch('svg-area-updated', {bubbles: true});

    return area;
  };

  const getPath = function (d, x, y, setupTooltip = false) {

    let shift = d.shift;
    if (shift === null) shift = (x.bandwidth)? x.bandwidth() / 2 : 0;

    if (d.tooltipGraph && setupTooltip) d.tooltipGraph
      .data(d.values)
      .x(d => x(d.x) + shift)
      .y(d => y(d.y1))
      .color(d.color);

    $$.area
      .x(d => x(d.x) + shift)
      .y0(d => y(d.y0))
      .y1(d => y(d.y1));

    const path = $$.area(d.values);

    return isFinitePath(path) ? path : this.getAttribute('d');

  };

  const stacker = stack()
    .values(d => d.values)
    .y(d => d.y)
    .x(d => d.x);

  const stackNest = d3.nest().key(d => {
    const key = d.stackBy;
    return (key !== false && key !== null)? key : id();
  });

  /* Inherit from base model */
  base(area, $$)
    .addProp('area', d3.area())
    .addProp('stack', stacker.stack(), null, d => stacker.stack(d))
    .addProp('x', d3.scaleLinear())
    .addProp('y', d3.scaleLinear())
    .addPropGet('type', 'area')
    .addPropFunctor('graphs', d => d)
    // graph props
    .addPropFunctor('tooltipGraph', d => d.tooltipGraph)
    .addPropFunctor('shift', null)
    .addPropFunctor('stackBy', null)
    .addPropFunctor('key', d => d.label)
    .addPropFunctor('values', d => d.values)
    .addPropFunctor('color', d => color(d.label))
    // points props
    .addPropFunctor('px', d => d.x)
    .addPropFunctor('py', d => d.y)
    // methods
    .addMethod('getComputedGraphs', context => {
      return (context.selection? context.selection() : context).data().map((d, i) => getGraphs(d, i));
    })
    .addMethod('getVisiblePoints', context => {
      const data = area.getComputedGraphs(context);
      return data.map(graphs => {
        const y0s = [].concat.apply([], graphs.map(graph => {
          return graph.values.map(v => {
            return {x: v.x, y: v.y0, graph};
          });
        }));
        const y1s = [].concat.apply([], graphs.map(graph => {
          return graph.values.map(v => {
            return {x: v.x, y: v.y1, graph};
          });
        }));
        return y0s.concat(y1s);
      })[0];
    });

  return area;
}
