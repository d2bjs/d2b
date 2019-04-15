import { annotation } from 'd3-svg-annotation';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import 'd3-transition';

import base from '../model/base';
import color from '../util/color';
import box from '../svg/box';
// import id from '../util/id';

// box-plot svg generator
export default function () {
  const $$ = {};

  function getGraphs (d, i) {
    const graphs = $$.graphs(d, i).map((graph, i) => {
      const newGraph = {
        data:          graph,
        index:         i,
        tooltipGraph:  $$.tooltipGraph(graph, i),
        shift:         $$.shift(graph, i),
        key:           $$.key(graph, i),
        color:         $$.color(graph, i),
        orient:        $$.orient(graph, i)
      };

      newGraph.values = $$.values(graph, i).map((point, i) => {
        return {
          data:           point,
          index:          i,
          graph:          newGraph,
          x:              $$.px(point, i),
          y:              $$.py(point, i),
          annotations:    $$.pannotations(point, i),
          median:         $$.box.median()(point, i)
        };
      });
      return newGraph;
    });

    return graphs;
  }

  /* Update Function */
  const boxPlot = function (context) {
    const selection = context.selection? context.selection() : context;

    let graphs = selection.selectAll('.d2b-box-plot-graphs').data(d => [d]);

    graphs = graphs.merge(graphs.enter().append('g').attr('class', 'd2b-box-plot-graphs'));

    const graph = graphs.selectAll('.d2b-box-plot-graph').data((d, i) => getGraphs(d, i), d => d.key);

    const graphEnter = graph.enter().append('g')
        .attr('class', 'd2b-box-plot-graph d2b-graph')
        .style('opacity', 0);

    let graphUpdate = graph.merge(graphEnter).order(),
        graphExit = graph.exit();

    $$.box
      .data(p => p.data)
      .annotation($$.annotation)
      .annotations($$.pannotations);

    if (context !== selection) {
      graphUpdate = graphUpdate.transition(context);
      graphExit = graphExit.transition(context);

      graphExit
          .style('opacity', 0)
          // boxes needs to be transitioned to where their new locations
          // "would be" if the graphs had been included
          .each(function (d) {
            const el = select(this),
                  vertical = d.orient === 'vertical',
                  orient = vertical ? {x: 'x', y: 'y'} : {x: 'y', y: 'x'},
                  x = $$[orient.x],
                  y = $$[orient.y];

            $$.box
              .scale(y)
              .orient(d.orient)
              .color((p, i) => $$.pcolor(p, i) || d.color);

            let boxSvgExit = el.selectAll('.d2b-box-plot-box');

            if (context !== selection) boxSvgExit = boxSvgExit.transition(context);

            let shift = d.shift;
            if (shift === null) shift = (x.bandwidth)? x.bandwidth() / 2 : 0;

            boxSvgExit
                .style('opacity', 0)
                .attr('transform', p => translateBox(x(p[orient.x]) + shift, vertical))
                .call($$.box)
                .remove();
          });
    }

    graphUpdate.style('opacity', 1);

    graphExit.remove();

    graphUpdate.each(function (d) {
      const el = select(this),
            vertical = d.orient === 'vertical',
            orient = vertical ? {x: 'x', y: 'y'} : {x: 'y', y: 'x'},
            x = $$[orient.x],
            y = $$[orient.y],
            graphsNode = this.parentNode,
            preScales = {x: graphsNode.__scaleX || x, y: graphsNode.__scaleY || y},
            preX = preScales[orient.x],
            preY = preScales[orient.y];

      let shift = d.shift;
      if (shift === null) shift = (x.bandwidth)? x.bandwidth() / 2 : 0;

      let preShift = shift;
      if (preShift === null) shift = (preX.bandwidth)? preX.bandwidth() / 2 : 0;

      if (d.tooltipGraph) d.tooltipGraph.data(d.values)[orient.x](p => x(p[orient.x]) + shift)[orient.y](p => y(p.median)).color((p, i) => $$.pcolor(p.data, i) || d.color);

      $$.box
        .scale(y)
        .enterScale(preY)
        .orient(d.orient)
        .color((p, i) => $$.pcolor(p, i) || d.color);

      const boxSvg = el.selectAll('.d2b-box-plot-box')
          .data(d.values, $$.pkey);
      const boxSvgEnter = boxSvg.enter().append('g')
          .attr('class', 'd2b-box-plot-box');

      let boxSvgUpdate = boxSvg.merge(boxSvgEnter).order(),
          boxSvgExit = boxSvg.exit();

      if (context !== selection) {
        boxSvgUpdate = boxSvgUpdate.transition(context);
        boxSvgExit = boxSvgExit.transition(context);
      }

      // if band scale is used enter boxes at their new location
      if (preX.bandwidth || preY.bandwidth || x.bandwidth || y.bandwidth) {
        $$.box.enterScale(y);
        boxSvgEnter.attr('transform', p => translateBox(x(p[orient.x]) + shift, vertical));
      } else {
        $$.box.enterScale(preY);
        boxSvgEnter.attr('transform', p => translateBox(preX(p[orient.x]) + shift, vertical));
      }

      boxSvgEnter
          .style('opacity', 0);

      boxSvgUpdate
          .attr('transform', p => translateBox(x(p[orient.x]) + shift, vertical))
          .style('opacity', 1)
          .call($$.box);

      boxSvgExit
          .attr('transform', p => translateBox(x(p[orient.x]) + shift, vertical))
          .style('opacity', 0)
          .call($$.box)
          .remove();
    });

    graphs.each(function () {
      this.__scaleX = $$.x.copy();
      this.__scaleY = $$.y.copy();
    });

    selection.dispatch('svg-box-updated', {bubbles: true});

    return boxPlot;
  };

  function translateBox(position, vertical) {
    return `translate(${vertical ? [position, 0] : [0, position]})`;
  }

  /* Inherit from base model */
  base(boxPlot, $$)
    .addProp('x', scaleLinear())
    .addProp('y', scaleLinear())
    .addProp('box', box())
    .addProp('annotation', annotation ? annotation() : null)
    .addPropGet('type', 'boxPlot')
    .addPropFunctor('graphs', d => d)
    // graph props
    .addPropFunctor('tooltipGraph', d => d.tooltipGraph)
    .addPropFunctor('shift', null)
    .addPropFunctor('key', d => d.label)
    .addPropFunctor('values', d => d.values)
    .addPropFunctor('color', d => color(d.label))
    .addPropFunctor('orient', 'vertical')
    // points props
    .addPropFunctor('px', d => d.x)
    .addPropFunctor('py', d => d.y)
    .addPropFunctor('pcolor', null)
    .addPropFunctor('pkey', (d, i) => i)
    .addPropFunctor('pannotations', d => d.annotations)
    // methods
    .addMethod('getComputedGraphs', context => {
      return (context.selection? context.selection() : context).data().map((d, i) => getGraphs(d, i));
    })
    .addMethod('getVisiblePoints', context => {
      const data = boxPlot.getComputedGraphs(context),
            points = [];
      data.forEach(graphs => {
        graphs.forEach(graph => {
          const orient = graph.orient === 'vertical' ? {x: 'x', y: 'y'} : {x: 'y', y: 'x'};
          graph.values.forEach((v, i) => {
            ['maximum', 'minimum', 'upperQuartile', 'lowerQuartile', 'median'].forEach(metric => {
              const point = { graph };
              point[orient.x] = v[orient.x];
              point[orient.y] = $$.box[metric]()(v.data, i);
              points.push(point);
            });

            ($$.box.outliers()(v.data, i) || []).forEach(outlier => {
              const point = { graph };
              point[orient.x] = v[orient.x];
              point[orient.y] = outlier;
              points.push(point);
            });
          });
        });
      });

      return points;
    });

  return boxPlot;
}
