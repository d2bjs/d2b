import { select, max, min, nest, scaleLinear, line as d3Line } from 'd3';
import { annotation } from 'd3-svg-annotation';
import { interpolatePath } from 'd3-interpolate-path';

import base from '../model/base';
import color from '../util/color';
import stack from '../util/stack';
import id from '../util/id';
import oreq from '../util/oreq';
import isFinitePath from '../util/isFinitePath';
import updateAnnotations from '../util/annotation';

// line svg generator
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
        stackBy:       oreq($$.stackBy(graph, i), i),
        key:           $$.key(graph, i),
        color:         $$.color(graph, i)
      };
      newGraph.values = $$.values(graph, i).map((point, i) => {
        const newPoint = {
          data:       point,
          index:      i,
          graph:      newGraph,
          key:        $$.pkey(point, i),
          x:          $$.px(point, i),
          y:          $$.py(point, i),
          color:      $$.pcolor(point, i) || newGraph.color,
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
  const line = function (context) {
    const selection = context.selection? context.selection() : context;

    let graphs = selection.selectAll('.d2b-line-graphs').data(d => [d]);

    graphs = graphs.merge(graphs.enter().append('g').attr('class', 'd2b-line-graphs'));

    const graph = graphs.selectAll('.d2b-line-graph').data((d, i) => getGraphs(d, i), d => d.key);

    const graphEnter = graph.enter().append('g')
        .attr('class', 'd2b-line-graph d2b-graph')
        .style('opacity', 0);

    graphEnter
      .append('path')
        .attr('class', 'd2b-line')
        .style('stroke', d => d.color)
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

    let lineUpdate = graphUpdate.select('.d2b-line');

    if (context !== selection) {
      graphUpdate = graphUpdate.transition(context);
      graphExit = graphExit.transition(context);
      lineUpdate = lineUpdate.transition(context);

      const lineExit = graphExit.style('opacity', 0).select('.d2b-line');
      const tweenD = function (d, setupTooltip = false) {
        const maxX = max(d.values, dd => dd.x);
        const minX = min(d.values, dd => dd.x);
        return interpolatePath(
          this.getAttribute('d'),
          getPath.call(this, d, $$.x, $$.y, setupTooltip),
          function (a) { return a.x == maxX || a.x == minX; }
        );
      };

      // use d3-interpolate-path if available
      if (typeof interpolatePath == "undefined") {
        lineExit.attr('d', function (d) { return getPath.call(this, d, $$.x, $$.y); });
        lineUpdate.attr('d', function (d) { return getPath.call(this, d, $$.x, $$.y, true); });
      } else {
        lineExit.attrTween('d', function (d) { return tweenD.call(this, d); });
        lineUpdate.attrTween('d', function (d) { return tweenD.call(this, d, true); });
      }
    } else {
      lineUpdate.attr('d', function (d) { return getPath.call(this, d, $$.x, $$.y, true); });
    }

    graphUpdate.style('opacity', 1);

    // update graph annotations
    graphUpdate
      .each(function (d) {
        const graphsNode = this.parentNode,
              graph = select(this),
              align = d.align,
              x = graphsNode.__scaleX || $$.x,
              y = graphsNode.__scaleY || $$.y,
              annotationValues = d.values.filter(v => v.annotation);

        const a = graph.selectAll('.d2b-line-annotation-group').data(annotationValues, v => v.key),
              aEnter = a.enter().append('g');

        aEnter
            .attr('class', 'd2b-line-annotation-group')
            .attr('transform', v => `translate(${x(v.x) + d.shift}, ${y(v[align])})`);

        let aUpdate = a.merge(aEnter),
            aExit = a.exit();

        if (context !== selection) {
          aUpdate = aUpdate.transition(context);
          aExit = aExit.transition(context);
        }

        aUpdate
            .style('opacity', 1)
            .attr('transform', v => `translate(${$$.x(v.x) + d.shift}, ${$$.y(v[align])})`)
            .call(updateAnnotations, $$.annotation, 'd2b-line-annotation');

        aExit
            .attr('transform', v => {
              // join the exiting annotation with the value if it still exists
              v = d.values.filter(ov => v.key === ov.key)[0] || v;
              return `translate(${$$.x(v.x) + d.shift}, ${$$.y(v[align])})`;
            })
            .style('opacity', 0)
            .remove();
      });

    graphExit
        .remove()
      .selectAll('.d2b-line-annotation-group')
        .attr('transform', v => `translate(${$$.x(v.x) + v.graph.shift}, ${$$.y(v[v.graph.align])})`);

    lineUpdate.style('stroke', d => d.color);

    // Make a copy of the scales sticky on the 'graphs' node
    const xCopy = $$.x.copy(), yCopy = $$.y.copy();

    graphs.each(function () {
      this.__scaleX = xCopy;
      this.__scaleY = yCopy;
    });

    selection.dispatch('svg-line-updated', {bubbles: true});

    return line;
  };

  const getPath = function (d, x, y, setupTooltip = false) {
    let shift = d.shift;
    if (shift === null) shift = (x.bandwidth)? x.bandwidth() / 2 : 0;

    if (d.tooltipGraph && setupTooltip) d.tooltipGraph
      .data(d.values)
      .x(dd => x(dd.x) + shift)
      .y(dd => y(dd[d.align]))
      .color(dd => dd.color);

    $$.line
      .x(dd => x(dd.x) + shift)
      .y(dd => y(dd[d.align]));


    const path = $$.line(d.values);

    return isFinitePath(path) ? path : this.getAttribute('d');
  };

  const stacker = stack()
    .values(d => d.values)
    .y(d => d.y)
    .x(d => d.x);

  const stackNest = nest().key(d => {
    const key = d.stackBy;
    return (key !== false && key !== null)? key : id();
  });

  /* Inherit from base model */
  base(line, $$)
    .addProp('line', d3Line())
    .addProp('stack', stacker.stack(), null, d => stacker.stack(d))
    .addProp('x', scaleLinear())
    .addProp('y', scaleLinear())
    .addProp('annotation', annotation ? annotation() : null)
    .addPropGet('type', 'line')
    .addPropFunctor('graphs', d => d)
    // graph props
    .addPropFunctor('align', 'y1')
    .addPropFunctor('tooltipGraph', d => d.tooltipGraph)
    .addPropFunctor('shift', null)
    .addPropFunctor('stackBy', null)
    .addPropFunctor('key', d => d.label)
    .addPropFunctor('values', d => d.values)
    .addPropFunctor('color', d => color(d.label))
    // points props
    .addPropFunctor('px', d => d.x)
    .addPropFunctor('py', d => d.y)
    .addPropFunctor('pcolor', null)
    .addPropFunctor('pkey', (d, i) => i)
    .addPropFunctor('pannotation', d => d.annotation)
    // methods
    .addMethod('getComputedGraphs', context => {
      return (context.selection? context.selection() : context).data().map((d, i) => getGraphs(d, i));
    })
    .addMethod('getVisiblePoints', context => {
      const data = line.getComputedGraphs(context);
      return data.map(graphs => {
        return [].concat.apply([], graphs.map(graph => {
          return graph.values.map(v => {
            return {x: v.x, y: v[graph.align], graph: graph};
          });
        }));
      })[0];
    });

  return line;
}
