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
        x:              $$.x(graph, i),
        y:              $$.y(graph, i),
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
    // iterate through each selection element
    selection.each(function (d, i) {
      const orient = $$.orient(d, i),
            orientMap = getOrientMap(orient),
            graphs = getGraphs(d, i, orientMap);

      let padding = $$.padding(d, i),
          groupPadding = $$.groupPadding(d, i),
          bandwidth = $$.bandwidth(d, i);

      bandwidth = (1 - padding) * (bandwidth || getBandwidth(graphs, orientMap));

      const stacking = stackNest.entries(graphs),
            barWidth = bandwidth / stacking.length;

      groupPadding = barWidth * groupPadding;

      // enter update exit bar graph container
      const graph = d3.select(this).selectAll('.d2b-bar-graph').data(graphs, d => d.key);

      const graphEnter = graph.enter().append('g')
          .attr('class', 'd2b-bar-graph d2b-graph')
          .style('opacity', 0);

      let graphUpdate = graph.merge(graphEnter).order(),
          graphExit = graph.exit();

      if (context !== selection) {
        graphUpdate = graphUpdate.transition(context);
        graphExit = graphExit.transition(context);
      }

      graphUpdate.style('opacity', 1);
      graphExit.style('opacity', 0).remove();

      // iterate through graph containers
      graphUpdate.each(function (d) {
        const graph = d3.select(this), scales = {x: d.x, y: d.y};
        const x = scales[orientMap.x], y = scales[orientMap.y];

        let shift = d.shift;
        if (shift === null) shift = (x.bandwidth)? x.bandwidth() / 2 : 0;

        // enter update exit bars
        const bar = graph.selectAll('.d2b-bar-group').data(d.values, v => v.key);
        const barEnter = bar.enter().append('g').attr('class', 'd2b-bar-group');
        barEnter.append('rect');
        let barUpdate = bar.merge(barEnter).order(),
            barExit = bar.exit();

        barUpdate.each(point => {
          const barShift = (point.centered)? shift - bandwidth / 4 : shift - bandwidth / 2 + point.stackIndex * barWidth + groupPadding;
          point.basepx = x(point.base) + barShift;
          point.extentpx = [y(point.extent[0]), y(point.extent[1])];
          point.extentpxSorted = point.extentpx.slice().sort(d3.ascending);
        });

        if (d.tooltipGraph) d.tooltipGraph
          .data(d.values)[orientMap.x](point => d[orientMap.x](point.base) + shift)[orientMap.y](point => point.extentpx[1])
          .color(point => point.color || d.color);

        if (context !== selection) {
          barUpdate = barUpdate.transition(context);
          barExit = barExit.transition(context);
        }

        barEnter
            .attr('class', 'd2b-bar-group')
            .style('opacity', 0)
            .call(transformBar, {x: point => point.basepx, y: () => y(0)}, orientMap)
          .select('rect')
            .attr('fill', point => point.color || d.color)
            .attr(orientMap.w, barWidth - groupPadding * 2)
            .attr(orientMap.h, 0);

        barUpdate
            .style('opacity', 1)
            .call(transformBar, {x: point => point.basepx, y: point => point.extentpxSorted[0]}, orientMap)
          .select('rect')
            .attr('fill', point => point.color || d.color)
            .attr(orientMap.w, barWidth - groupPadding * 2)
            .attr(orientMap.h, d => d.extentpxSorted[1] - d.extentpxSorted[0]);

        barExit.style('opacity', 0).remove();

      });
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

  // transform bar position
  function transformBar (transition, pos, orientMap) {
    transition.attr('transform', d => {
      return `translate(${[pos[orientMap.x](d), pos[orientMap.y](d)]})`;
    });
  }

  // find closes non equal point pixel distance on the base axis
  function getBandwidth (graphs, orientMap) {
    let xVals = [], bandwidth = Infinity;
    graphs.forEach( graph => {
      const x = graph[orientMap.x],
            values = graph.values,
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

    return bandwidth;
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
    .addPropGet('type', 'bar')
    .addPropFunctor('graphs', d => d)
    .addPropFunctor('padding', 0.5)
    .addPropFunctor('groupPadding', 0)
    .addPropFunctor('bandwidth', null)
    .addPropFunctor('baseline', 0)
    // graph props
    .addScaleFunctor('x', d3.scaleLinear())
    .addScaleFunctor('y', d3.scaleLinear())
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
      });
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
