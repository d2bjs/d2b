import * as d3 from 'd3';

import {default as base} from '../model/base.js';
import {default as color} from '../util/color.js';
import {default as stack} from '../util/stack.js';
import {default as id} from '../util/id.js';

// line svg generator
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

    stackNest.entries(graphs).forEach(sg => {
      if (sg.values.length > 1) stacker(sg.values);
    });

    return graphs;
  }

  /* Update Function */
  const area = function (context) {
    const selection = context.selection? context.selection() : context;

    const graph = selection.selectAll('.d2b-area-graph').data((d, i) => getGraphs(d, i), d => d.key);

    const graphEnter = graph.enter().append('g')
        .attr('class', 'd2b-area-graph d2b-graph')
        .style('opacity', 0);

    graphEnter.append('path').attr('class', 'd2b-area');

    let graphUpdate = graph.merge(graphEnter).order(),
        graphExit = graph.exit();

    let areaUpdate = graphUpdate.select('.d2b-area');

    if (context !== selection) {
      graphUpdate = graphUpdate.transition(context);
      graphExit = graphExit.transition(context);
      areaUpdate = areaUpdate.transition(context);
    }

    graphUpdate.style('opacity', 1);
    graphExit.style('opacity', 0).remove();
    areaUpdate
        .style('fill', d => d.color)
        .attr('d', function (d) {
          const x = d.x, y = d.y;
          let shift = d.shift;
          if (shift === null) shift = (x.bandwidth)? x.bandwidth() / 2 : 0;

          if (d.tooltipGraph) d.tooltipGraph
            .data(d.values)
            .x(d => x(d.x) + shift)
            .y(d => y(d.y1))
            .color(d.color);

          $$.area
            .x(d => x(d.x) + shift)
            .y0(d => y(d.y0))
            .y1(d => y(d.y1));

          return $$.area(d.values);
        });

    return area;
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
    .addPropGet('type', 'area')
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
      });
    });

  return area;
}
