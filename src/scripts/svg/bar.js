// TODO: Clean up bar graph code flow it's a bit messy

import * as d3 from 'd3';

import {default as base} from '../model/base.js';
import {default as color} from '../util/color.js';
import {default as stack} from '../util/stack.js';

// bar svg generator
export default function () {
  const $$ = {};

  function getOrientMap(orient) {
    return orient === 'horizontal'?
      { rotate: true, px: 'py', py: 'px', x: 'y', y: 'x', w: 'height', h: 'width' } :
      { rotate: false, px: 'px', py: 'py', x: 'x', y: 'y', w: 'width', h: 'height' };
  }

  function getGraphs (d, i, orientMap = getOrientMap($$.orient(d, i))) {

    const graphs = $$.graphs(d, i).map((graph, i) => {

      const newGraph = {
        data:           graph,
        index:          i,
        tooltipGraph:   $$.tooltipGraph(graph, i),
        shift:          $$.shift(graph, i),
        stackBy:        $$.stackBy(graph, i),
        key:            $$.key(graph, i),
        color:          $$.color(graph, i)
      };
      newGraph.values = $$.values(graph, i).map((point, i) => {
        return {
          data:     point,
          index:    i,
          graph:    newGraph,
          key:      $$.pkey(point, i),
          x:        $$.px(point, i),
          y:        $$.py(point, i),
          centered: $$.pcentered(point, i),
          color:    $$.pcolor(point, i)
        };
      });
      return newGraph;

    });

    stacker.x(d => d[orientMap.x]).y(d => d[orientMap.y]);
    stackNest
      .entries(graphs)
      .forEach((sg, si) => {
        return stacker.out(buildOut(si))(sg.values);
      });

    modifyBaseline(graphs, $$.baseline(d, i));

    return graphs;
  }

  /* Update Function */
  const bar = function (context) {
    const selection = context.selection? context.selection() : context;

    const scales = {x: $$.x, y: $$.y};
    // iterate through each selection element
    selection.each(function (d, i) {
      const orient = $$.orient(d, i),
            orientMap = getOrientMap(orient),
            graphs = getGraphs(d, i, orientMap),
            x = scales[orientMap.x].copy(),
            y = scales[orientMap.y].copy();

      let padding = $$.padding(d, i),
          groupPadding = $$.groupPadding(d, i),
          bandwidth = $$.bandwidth(d, i);

      bandwidth = (1 - padding) * (bandwidth || getBandwidth(x, graphs, orientMap));

      const stacking = stackNest.entries(graphs);

      let barWidth = bandwidth / Math.max(1, stacking.length);

      groupPadding = barWidth * groupPadding;

      // get custom scales
      const base = getBaseScale (x, bandwidth, barWidth, groupPadding),
            extent = getExtentScale (y);

      barWidth -= groupPadding * 2;

      let graphsSVG = d3.select(this).selectAll('.d2b-bar-graphs').data(d => [d]);

      graphsSVG = graphsSVG.merge(graphsSVG.enter().append('g').attr('class', 'd2b-bar-graphs'));

      const graphsNode = graphsSVG.node(),
            preBase = graphsNode.__scaleBase || base,
            preY = graphsNode.__scaleY || y,
            preX = graphsNode.__scaleX || x,
            preBarWidth = graphsNode.__barWidth || barWidth;

      const graph = graphsSVG.selectAll('.d2b-bar-graph').data(graphs, d => d.key);

      const graphEnter = graph.enter().append('g')
          .attr('class', 'd2b-bar-graph d2b-graph');

      let graphUpdate = graph.merge(graphEnter).order(),
          graphExit = graph.exit();

      if (context !== selection) {
        graphUpdate = graphUpdate.transition(context);
        graphExit = graphExit.transition(context);

        graphExit
            .each(function (d) {
              let shift = d.shift;
              if (shift === null) shift = (x.bandwidth)? x.bandwidth() / 2 : 0;

              const barExit = d3.select(this)
                .selectAll('.d2b-bar-group')
                .transition(context);

              if (preX.bandwidth || preY.bandwidth || x.bandwidth || y.bandwidth) {
                // exit
                barExit.style('opacity', 0);
              } else {
                // exit
                barExit.call(updateBars, {
                  opacity: 0,
                  x: point => base(point, shift),
                  y: () => y(0),
                  width: barWidth,
                  height: 0,
                  graph: d,
                  orientMap: orientMap
                });
              }

            });

      }

      graphExit.remove();

      // iterate through graph containers
      graphUpdate.each(function (d) {
        const graph = d3.select(this);

        let shift = d.shift;
        if (shift === null) shift = (x.bandwidth)? x.bandwidth() / 2 : 0;

        // enter update exit bars
        const bar = graph.selectAll('.d2b-bar-group').data(d.values, v => v.key);
        const barEnter = bar.enter().append('g').attr('class', 'd2b-bar-group');
        barEnter.append('rect');
        let barUpdate = bar.merge(barEnter).order(),
            barExit = bar.exit();

        if (d.tooltipGraph) d.tooltipGraph
          .data(d.values)[orientMap.x](point => x(point.base) + shift)[orientMap.y](point => extent(point)[1])
          .color(point => point.color || d.color);

        if (context !== selection) {
          barUpdate = barUpdate.transition(context);
          barExit = barExit.transition(context);
        }

        barEnter.attr('class', 'd2b-bar-group');

        barExit.remove();

        if (preX.bandwidth || preY.bandwidth || x.bandwidth || y.bandwidth) {

          // enter
          barEnter.call(updateBars, {
            opacity: 0,
            x: point => base(point, shift),
            y: () => y(0),
            width: preBarWidth,
            height: 0,
            graph: d,
            orientMap: orientMap
          });

          // exit
          barExit.style('opacity', 0);

        } else {

          // enter
          barEnter.call(updateBars, {
            opacity: 0,
            x: point => preBase(point, shift),
            y: () => preY(0),
            width: preBarWidth,
            height: 0,
            graph: d,
            orientMap: orientMap
          });

          // exit
          barExit.call(updateBars, {
            opacity: 0,
            x: point => base(point, shift),
            y: () => y(0),
            width: barWidth,
            height: 0,
            graph: d,
            orientMap: orientMap
          });

        }

        // update
        barUpdate.call(updateBars, {
          opacity: 1,
          x: point => base(point, shift),
          y: point => extent.sorted(point)[0],
          width: barWidth,
          height: d => extent.sorted(d)[1] - extent.sorted(d)[0],
          graph: d,
          orientMap: orientMap
        });

      });

      // Make a copy of the scales sticky on the 'graphs' node
      graphsNode.__scaleY = y;
      graphsNode.__scaleX = x;
      graphsNode.__scaleBase = base;
      graphsNode.__barWidth = barWidth;


    });

    return bar;
  };

  const stacker = stack().values(d => d.values);

  const stackNest = d3.nest().key(d => d.stackBy);

  // custom stacker build out that separates the negative and possitive bars
  function buildOut(stackIndex) {
    const offsets = {};
    return function(d, y0, y1, x){
      const offset = offsets[x] = offsets[x] || [0, 0];

      d.dy = y1 - y0;
      d.stackIndex = stackIndex;
      d.base = x;
      if (d.dy > 0) d.extent = [offset[0], offset[0] += d.dy];
      else d.extent = [offset[1], offset[1] += d.dy];
    };
  }

  function updateBars (bars, options) {
    bars
        .style('opacity', options.opacity)
        .call(transformBar, options, options.orientMap)
      .select('rect')
        .attr('fill', point => point.color || options.graph.color)
        .attr(options.orientMap.w, options.width)
        .attr(options.orientMap.h, options.height);
  }

  // transform bar position
  function transformBar (transition, pos, orientMap) {
    transition.attr('transform', function (d) {
      var xPos = pos[orientMap.x](d), yPos = pos[orientMap.y](d);
      return `translate(${[xPos, yPos]})`;
    });
  }

  function getBaseScale (x, bandwidth, barWidth, groupPadding) {
    return function (point, shift) {
      var barShift = (point.centered)? shift - bandwidth / 4 : shift - bandwidth / 2 + point.stackIndex * barWidth + groupPadding;
      return x(point.base) + barShift;
    };
  }

  function getExtentScale (y) {
    var scale = function (point) {
      return [y(point.extent[0]), y(point.extent[1])];
    };

    scale.sorted = function (point) {
      return scale(point).slice().sort(d3.ascending);
    };

    return scale;
  }

  // find closes non equal point pixel distance on the base axis
  function getBandwidth (x, graphs, orientMap) {
    let xVals = [], bandwidth = Infinity;
    graphs.forEach( graph => {
      const values = graph.values,
            range = x.range();

      bandwidth = Math.min(bandwidth, Math.abs(range[1] - range[0]));

      values.forEach( point => {
        xVals.push(x(point[orientMap.x]));
      });
    });

    xVals.sort(d3.ascending);

    for (let i = 0; i < xVals.length-1; i++) {
      if (xVals[i+1] === xVals[i]) continue;
      bandwidth = Math.min(xVals[i+1] - xVals[i], bandwidth);
    }

    return bandwidth === Infinity ? 0 : bandwidth;
  }

  function modifyBaseline (graphs, baseline) {
    // if baseline is null find it dynamically
    if (baseline === null) {
      const values = [].concat.apply([], graphs.map(d => d.values));
      const range = d3.extent(values.map(d => d.extent[1]));

      if (range[1] < 0)       baseline = range[1];
      else if (range[0] > 0)  baseline = range[0];
      else                    baseline = 0;
    }

    graphs.forEach(graph => {
      graph.values.forEach(value => {
        if (Math.abs(value.extent[0]) < Math.abs(baseline)) {
          value.extent[0] = baseline;
        }
      });
    });
  }

  /* Inherit from base model */
  base(bar, $$)
    .addProp('x', d3.scaleLinear())
    .addProp('y', d3.scaleLinear())
    .addPropGet('type', 'bar')
    .addPropFunctor('graphs', d => d)
    .addPropFunctor('padding', 0.5)
    .addPropFunctor('groupPadding', 0)
    .addPropFunctor('bandwidth', null)
    .addPropFunctor('baseline', 0)
    // graph props
    .addPropFunctor('tooltipGraph', d => d.tooltipGraph)
    .addPropFunctor('orient', 'vertical')
    .addPropFunctor('shift', null)
    .addPropFunctor('stackBy', (d, i) => i)
    .addPropFunctor('key', d => d.label)
    .addPropFunctor('values', d => d.values, null)
    .addPropFunctor('color', d => color(d.label))
    // point props
    .addPropFunctor('px', d => d.x)
    .addPropFunctor('py', d => d.y)
    .addPropFunctor('pcentered', false)
    .addPropFunctor('pcolor', null)
    .addPropFunctor('pkey', (d, i) => i)
    // methods
    .addMethod('getComputedGraphs', context => {
      return (context.selection? context.selection() : context).data().map((d, i) => getGraphs(d, i));
    })
    .addMethod('getVisiblePoints', context => {
      return (context.selection? context.selection() : context).data().map((d, i) => {
        const orient = $$.orient(d, i),
              orientMap = getOrientMap(orient),
              graphs = getGraphs(d, i, orientMap);

        const extent0 = [].concat.apply([], graphs.map(graph => {
          return graph.values.map(v => {
            const point = {};
            point[`${orientMap.x}`] = v.base;
            point[`${orientMap.y}`] = v.extent[0];
            point.graph = graph;
            return point;
          });
        }));
        const extent1 = [].concat.apply([], graphs.map(graph => {
          return graph.values.map(v => {
            const point = {};
            point[`${orientMap.x}`] = v.base;
            point[`${orientMap.y}`] = v.extent[1];
            point.graph = graph;
            return point;
          });
        }));

        return extent0.concat(extent1);
      })[0];
    });

  return bar;
}

//original stacking function, might revert to this one instead of d3 stack layout in the future
// // create stack layout based on $$.stack key accessor
// const stacking = stackNest.entries(data);
// const bandwidth = (1 - $$.padding.call(this, data, i)) * ($$.bandwidth.call(this, data, i) || getBandwidth(data, orient));
// const barWidth = bandwidth / stacking.length;
// const groupPadding = barWidth * $$.groupPadding.call(this, data, i);
//
// stacking.forEach((stack, stackIndex) => {
//   // group values in this stack by positive 'sp' and negative 'sn' values
//   const sp = {}, sn = {};
//
//   stack.values.forEach((graph, graphIndex) => {
//     graphIndex = data.indexOf(graph);
//     const values = $$.values.call(data, graph, graphIndex),
//           x = $$[orient.x].call(data, graph, graphIndex),
//           y = $$[orient.y].call(data, graph, graphIndex),
//           offset = $$.offset.call(data, graph, graphIndex) || (x.rangeBand)? x.rangeBand() / 2 : 0;
//     values.forEach((d, i) => {
//       const px = $$[orient.px].call(graph, d, i),
//             py = $$[orient.py].call(graph, d, i),
//             barOffset = offset - bandwidth / 2 + stackIndex * barWidth + groupPadding;
//
//       d.base = x(px) + barOffset;
//       if (py > 0) d.extent = [y(sp[px] = sp[px] || 0), y(sp[px] = sp[px] + py)];
//       else d.extent = [y(sn[px] = sn[px] || 0), y(sn[px] = sn[px] + py)];
//       d.extent.sort(d3.ascending);
//     });
//   });
// });
