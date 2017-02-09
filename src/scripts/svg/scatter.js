import * as d3 from 'd3';

import {default as base} from '../model/base.js';
import {default as color} from '../util/color.js';
import {default as point} from '../svg/point.js';
import {default as stack} from '../util/stack.js';
import {default as id} from '../util/id.js';

// scatter svg generator
export default function () {
  const $$ = {};

  function getGraphs (d, i) {
    const graphs = $$.graphs(d, i).map((graph, i) => {
      const newGraph = {
        data:          graph,
        index:         i,
        x:             $$.x(graph, i),
        y:             $$.y(graph, i),
        tooltipGraph:  $$.tooltipGraph(graph, i),
        shift:         $$.shift(graph, i),
        stackBy:       $$.stackBy(graph, i),
        key:           $$.key(graph, i),
        color:         $$.color(graph, i),
        symbol:        $$.symbol(graph, i)
      };
      newGraph.values = $$.values(graph, i).map((point, i) => {
        return {
          data:   point,
          index:  i,
          graph:  newGraph,
          x:      $$.px(point, i),
          y:      $$.py(point, i),
          color:  $$.pcolor(point, i),
          symbol: $$.psymbol(point, i),
          key:    $$.pkey(point, i),
          size:   $$.psize(point, i)
        };
      });
      return newGraph;
    });

    stackNest.entries(graphs).forEach(sg => stacker(sg.values));

    return graphs;
  }

  /* Update Function */
  const scatter = function (context) {
    const selection = context.selection? context.selection() : context;

    const graph = selection.selectAll('.d2b-scatter-graph').data((d, i) => getGraphs(d, i), d => d.key);

    const graphEnter = graph.enter().append('g')
        .attr('class', 'd2b-scatter-graph d2b-graph')
        .style('opacity', 0);

    let graphUpdate = graph.merge(graphEnter).order(),
        graphExit = graph.exit();

    if (context !== selection) {
      graphUpdate = graphUpdate.transition(context);
      graphExit = graphExit.transition(context);
    }

    graphUpdate.style('opacity', 1);
    graphExit.style('opacity', 0).remove();

    graphUpdate.each( function (d) {
      const el = d3.select(this), x = d.x, y = d.y;

      let shift = d.shift;
      if (shift === null) shift = (x.bandwidth)? x.bandwidth() / 2 : 0;

      if (d.tooltipGraph) d.tooltipGraph
        .data(d.values)
        .x(p => x(p.x) + shift)
        .y(p => y(p.y))
        .color(p => p.color || d.color);

      $$.point
        .fill(p => p.color || d.color)
        .type(p => p.symbol || d.symbol)
        .size(p => p.size);

      const point = el.selectAll('.d2b-scatter-point')
          .data(d.values, p => p.key);
      const pointEnter = point.enter().append('g')
          .attr('class', 'd2b-scatter-point');

      let pointUpdate = point.merge(pointEnter).order(),
          pointExit = point.exit();

      if (context !== selection) {
        pointUpdate = pointUpdate.transition(context);
        pointExit = pointExit.transition(context);
      }

      pointEnter
          .style('opacity', 0)
          .call(pointTransform, x, y, shift);

      pointUpdate
          .style('opacity', 1)
          .call($$.point)
          .call(pointTransform, x, y, shift);

      pointExit
          .style('opacity', 0)
          .remove();

    });

    return scatter;
  };

  function pointTransform (transition, x, y, shift) {
    transition.attr('transform', p => {
      return `translate(${x(p.x) + shift}, ${y(p.y1)})`;
    });
  }

  const stacker = stack()
    .values(d => d.values)
    .y(d => d.y)
    .x(d => d.x);

  const stackNest = d3.nest().key(d => {
    const key = d.stackBy;
    return (key !== false && key !== null)? key : id();
  });

  /* Inherit from base model */
  base(scatter, $$)
    .addProp('point', point().active(true))
    .addPropFunctor('graphs', d => d)
    // graph props
    .addScaleFunctor('x', d3.scaleLinear())
    .addScaleFunctor('y', d3.scaleLinear())
    .addPropFunctor('tooltipGraph', d => d.tooltipGraph)
    .addPropFunctor('shift', null)
    .addPropFunctor('stackBy', null)
    .addPropFunctor('key', d => d.label)
    .addPropFunctor('values', d => d.values)
    .addPropFunctor('color', d => color(d.label))
    .addPropFunctor('symbol', () => d3.symbolCircle)
    // points props
    .addPropFunctor('px', d => d.x)
    .addPropFunctor('py', d => d.y)
    .addPropFunctor('pcolor', null)
    .addPropFunctor('psymbol', null)
    .addPropFunctor('pkey', (d, i) => i)
    .addPropFunctor('psize', 25)
    // methods
    .addMethod('getComputedGraphs', context => {
      return (context.selection? context.selection() : context).data().map((d, i) => getGraphs(d, i));
    })
    .addMethod('getVisiblePoints', context => {
      const data = scatter.getComputedGraphs(context);
      return data.map(graphs => {
        return [].concat.apply([], graphs.map(graph => {
          return graph.values.map(v => {
            return {x: v.x, y: v.y1, graph: graph};
          });
        }));
      });
    });

  return scatter;
}
