import { select, nest, scaleLinear, symbolCircle } from 'd3';
import { annotation } from 'd3-svg-annotation';

import base from '../model/base';
import color from '../util/color';
import point from '../svg/point';
import stack from '../util/stack';
import id from '../util/id';
import updateAnnotations from '../util/annotation';

// scatter svg generator
export default function () {
  const $$ = {};

  function getGraphs (d, i) {
    const graphs = $$.graphs(d, i).map((graph, i) => {
      const newGraph = {
        data:          graph,
        index:         i,
        align:         $$.align(graph, i),
        tooltipGraph:  $$.tooltipGraph(graph, i),
        shift:         $$.shift(graph, i),
        stackBy:       $$.stackBy(graph, i),
        key:           $$.key(graph, i),
        color:         $$.color(graph, i),
        symbol:        $$.symbol(graph, i)
      };
      newGraph.values = $$.values(graph, i).map((point, i) => {
        const newPoint = {
          data:       point,
          index:      i,
          graph:      newGraph,
          x:          $$.px(point, i),
          y:          $$.py(point, i),
          color:      $$.pcolor(point, i) || newGraph.color,
          symbol:     $$.psymbol(point, i) || newGraph.symbol,
          key:        $$.pkey(point, i),
          size:       $$.psize(point, i),
          annotation: $$.pannotation(point, i)
        };
        // initialize y values (these will be overwritten by the stack if stacking applies)
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
  const scatter = function (context) {
    const selection = context.selection? context.selection() : context;

    let graphs = selection.selectAll('.d2b-scatter-graphs').data(d => [d]);

    graphs = graphs.merge(graphs.enter().append('g').attr('class', 'd2b-scatter-graphs'));

    const graph = graphs.selectAll('.d2b-scatter-graph').data((d, i) => getGraphs(d, i), d => d.key);

    const graphEnter = graph.enter().append('g')
        .attr('class', 'd2b-scatter-graph d2b-graph')
        .style('opacity', 0);

    let graphUpdate = graph.merge(graphEnter).order(),
        graphExit = graph.exit();

    if (context !== selection) {
      graphUpdate = graphUpdate.transition(context);
      graphExit = graphExit.transition(context);

      graphExit
          .style('opacity', 0)
          // points needs to be transitioned to where there new locations "would be"
          // if the graphs had been included
          .each(function (d) {
            const el = select(this),
                  x = $$.x,
                  y = $$.y;

            let pointExit = el.selectAll('.d2b-scatter-point');

            if (context !== selection) pointExit = pointExit.transition(context);

            let shift = d.shift;
            if (shift === null) shift = (x.bandwidth)? x.bandwidth() / 2 : 0;

            pointExit
                .style('opacity', 0)
                .call(pointTransform, x, y, shift, d.align)
                .remove();
          });
    }

    graphUpdate.style('opacity', 1);

    graphExit.remove();

    graphUpdate.each( function (d) {
      const el = select(this),
            x = $$.x,
            y = $$.y,
            graphsNode = this.parentNode,
            preX = graphsNode.__scaleX || x,
            preY = graphsNode.__scaleY || y;

      let shift = d.shift;
      if (shift === null) shift = (x.bandwidth)? x.bandwidth() / 2 : 0;

      let preShift = shift;
      if (preShift === null) shift = (preX.bandwidth)? preX.bandwidth() / 2 : 0;

      if (d.tooltipGraph) d.tooltipGraph
        .data(d.values)
        .x(p => x(p.x) + shift)
        .y(p => y(p.y))
        .color(p => p.color);

      $$.point
        .fill(p => p.color)
        .type(p => p.symbol)
        .size(p => p.size);

      const point = el.selectAll('.d2b-scatter-point')
          .data(d.values, p => p.key);
      const pointEnter = point.enter().append('g')
          .attr('class', 'd2b-scatter-point');

      let pointUpdate = point.merge(pointEnter).order(),
          pointExit = point.exit();

      // define transitions if the parent context was a transition
      if (context !== selection) {
        pointUpdate = pointUpdate.transition(context);
        pointExit = pointExit.transition(context);
      }

      // if band scale is used enter points at their new location
      if (preX.bandwidth || preY.bandwidth || x.bandwidth || y.bandwidth) {
        pointEnter.call(pointTransform, x, y, shift, d.align);
      } else {
        pointEnter.call(pointTransform, preX, preY, preShift, d.align);
      }

      // enter update exit point configuration
      pointEnter
          .style('opacity', 0);

      pointUpdate
          .style('opacity', 1)
          .call($$.point)
          .call(pointTransform, x, y, shift, d.align);

      pointExit
          .style('opacity', 0)
          .call(pointTransform, x, y, shift, d.align)
          .remove();

      // update annotations
      updateAnnotations(pointUpdate, $$.annotation, 'd2b-scatter-annotation');
    });

    // Make a copy of the scales sticky on the 'graphs' node
    graphs.each(function () {
      this.__scaleX = $$.x.copy();
      this.__scaleY = $$.y.copy();
    });

    selection.dispatch('svg-scatter-updated', {bubbles: true});

    return scatter;
  };

  function pointTransform (transition, x, y, shift, align) {
    transition.attr('transform', function (p) {
      const yPos = y(p[align]), xPos = x(p.x) + shift;
      return isFinite(xPos) && isFinite(yPos) ? `translate(${[xPos, yPos]})` : this.getAttribute('transform');
    });
  }

  const stacker = stack()
    .values(d => d.values)
    .y(d => d.y)
    .x(d => d.x);

  const stackNest = nest().key(d => {
    const key = d.stackBy;
    return (key !== false && key !== null)? key : id();
  });

  /* Inherit from base model */
  base(scatter, $$)
    .addProp('point', point().active(true))
    .addProp('stack', stacker.stack(), null, d => stacker.stack(d))
    .addProp('x', scaleLinear())
    .addProp('y', scaleLinear())
    .addProp('annotation', annotation ? annotation() : null)
    .addPropGet('type', 'scatter')
    .addPropFunctor('graphs', d => d)
    // graph props
    .addPropFunctor('align', 'y1')
    .addPropFunctor('tooltipGraph', d => d.tooltipGraph)
    .addPropFunctor('shift', null)
    .addPropFunctor('stackBy', null)
    .addPropFunctor('key', d => d.label)
    .addPropFunctor('values', d => d.values)
    .addPropFunctor('color', d => color(d.label))
    .addPropFunctor('symbol', () => symbolCircle)
    // points props
    .addPropFunctor('px', d => d.x)
    .addPropFunctor('py', d => d.y)
    .addPropFunctor('pcolor', null)
    .addPropFunctor('psymbol', null)
    .addPropFunctor('pkey', (d, i) => i)
    .addPropFunctor('psize', 25)
    .addPropFunctor('pannotation', d => d.annotation)
    // methods
    .addMethod('getComputedGraphs', context => {
      return (context.selection? context.selection() : context).data().map((d, i) => getGraphs(d, i));
    })
    .addMethod('getVisiblePoints', context => {
      const data = scatter.getComputedGraphs(context);
      return data.map(graphs => {
        return [].concat.apply([], graphs.map(graph => {
          return graph.values.map(v => {
            return {x: v.x, y: v[graph.align], graph: graph};
          });
        }));
      })[0];
    });

  return scatter;
}
