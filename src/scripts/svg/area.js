import { select, max, min, nest, scaleLinear, area as d3Area } from 'd3';
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
          key:         $$.pkey(point, i),
          x:           $$.px(point, i),
          y:           $$.py(point, i),
          y0:          $$.py0(point, i),
          color:       $$.pcolor(point, i) || newGraph.color,
          annotations: $$.pannotations(point, i)
        };
        // initialize y1 and y0 (these will be overwritten by the stack if stacking applies)
        newPoint.y1 = newPoint.y;
        newPoint.y0 = oreq(newPoint.y0, 0);

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

      const areaExit = graphExit.style('opacity', 0).select('.d2b-area');
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
        areaExit.attr('d', function (d) { return getPath.call(this, d, $$.x, $$.y); });
        areaUpdate.attr('d', function (d) { return getPath.call(this, d, $$.x, $$.y, true); });
      } else {
        areaExit.attrTween('d', function (d) { return tweenD.call(this, d); });
        areaUpdate.attrTween('d', function (d) { return tweenD.call(this, d, true); });
      }
    } else {
      areaUpdate.attr('d', function (d) { return getPath.call(this, d, $$.x, $$.y, true); });
    }

    graphUpdate.style('opacity', 1);

    // update graph annotations
    graphUpdate
      .each(function (d) {
        const graphsNode = this.parentNode,
              graph = select(this),
              x = graphsNode.__scaleX || $$.x,
              y = graphsNode.__scaleY || $$.y;

        ['y0', 'y1'].forEach(function (align) {
          const annotationValues = d.values.filter(v => (v.annotations || []).filter(a => a.location === align).length);

          const a = graph.selectAll('.d2b-area-annotation-group-' + align).data(annotationValues, v => v.key),
                aEnter = a.enter().append('g');

          aEnter
              .attr('class', 'd2b-area-annotation-group-' + align)
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
              .call(updateAnnotations, $$.annotation, 'd2b-area-annotation', v => {
                return v.annotations.filter(a => a.location === align);
              });

          aExit
              .attr('transform', v => {
                // join the exiting annotation with the value if it still exists
                v = d.values.filter(ov => v.key === ov.key)[0] || v;
                return `translate(${$$.x(v.x) + d.shift}, ${$$.y(v[align])})`;
              })
              .style('opacity', 0)
              .remove();
        });
      });

    graphExit.remove();

    graphExit
      .selectAll('.d2b-area-annotation-group-y0')
        .attr('transform', v => `translate(${$$.x(v.x) + v.graph.shift}, ${$$.y(v.y0)})`);

    graphExit
      .selectAll('.d2b-area-annotation-group-y1')
        .attr('transform', v => `translate(${$$.x(v.x) + v.graph.shift}, ${$$.y(v.y1)})`);

    areaUpdate.style('fill', d => d.color);

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
      .x(p => x(p.x) + shift)
      .y(p => y(p.y1))
      .color(p => p.color);

    $$.area
      .x(p => x(p.x) + shift)
      .y0(p => y(p.y0))
      .y1(p => y(p.y1));

    const path = $$.area(d.values);

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
  base(area, $$)
    .addProp('area', d3Area())
    .addProp('stack', stacker.stack(), null, d => stacker.stack(d))
    .addProp('x', scaleLinear())
    .addProp('y', scaleLinear())
    .addProp('annotation', annotation ? annotation() : null)
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
    .addPropFunctor('py0', d => d.y0)
    .addPropFunctor('pcolor', null)
    .addPropFunctor('pkey', (d, i) => i)
    .addPropFunctor('pannotations', d => d.annotations)
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
