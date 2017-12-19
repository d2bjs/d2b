import { select, sum, scaleLinear, symbolCircle, symbol } from 'd3';
import { annotation } from 'd3-svg-annotation';

import functor from '../util/functor';
import base from '../model/base';
import color from '../util/color';
import point from '../svg/point';
import mean from '../math/mean';
import oreq from '../util/oreq';
import updateAnnotations from '../util/annotation';

// bubble pack svg generator
export default function () {
  const $$ = {};

  const indicatorSymbol = symbol().size(80);

  function getPoint (point, i, graph) {
    return {
      data:       point,
      index:      i,
      graph:      graph,
      x:          $$.px(point, i),
      y:          $$.py(point, i),
      color:      $$.pcolor(point, i) || graph.color,
      symbol:     $$.psymbol(point, i) || graph.symbol,
      key:        $$.pkey(point, i),
      size:       $$.psize(point, i),
      indicator:  $$.pindicator(point, i),
      annotation: $$.pannotation(point, i),
      children:   ($$.pchildren(point, i) || []).map((point, i) => getPoint(point, i, graph))
    };
  }

  function getGraphs (d, i) {
    const graphs = $$.graphs(d, i).map((graph, i) => {

      const newGraph = {
        data:          graph,
        index:         i,
        tendancy:      $$.tendancy(graph, i),
        tooltipGraph:  $$.tooltipGraph(graph, i),
        shift:         $$.shift(graph, i),
        key:           $$.key(graph, i),
        color:         $$.color(graph, i),
        symbol:        $$.symbol(graph, i)
      };

      newGraph.values = $$.values(graph, i).map((point, i) => getPoint(point, i, newGraph));

      return newGraph;
    });

    graphs.forEach(graph => graph.values.forEach(v => setStructure(v, graph.tendancy)));

    return graphs;
  }


  // bubble pack updater
  // The autoEnter flag will decide whether the entering bubbles will render
  // at their respective location or if they will expand from their parents
  // location. When the bubblePack is re-rendered upon clicking
  // on a parent bubble, this will be called with autoEnter = false to preserve
  // the flow of child bubbles flowing from their parents location to their
  // location.
  const bubblePack = function (context, autoEnter = true) {
    const transition = context.selection? context : null,
          selection = context.selection? context.selection() : context;

    let graphs = selection.selectAll('.d2b-bubble-pack-graphs').data(d => [d]);

    graphs = graphs.merge(graphs.enter().append('g').attr('class', 'd2b-bubble-pack-graphs'));

    const graph = graphs.selectAll('.d2b-bubble-pack-graph').data((d, i) => getGraphs(d, i), d => d.key);

    // enter graph
    const graphEnter = graph.enter().append('g').attr('class', 'd2b-bubble-pack-graph d2b-graph');

    let graphUpdate = graph.merge(graphEnter).order(),
        graphExit = graph.exit();

    if (transition) {
      graphUpdate = graphUpdate.transition(transition);
      graphExit = graphExit.transition(transition);
    }

    // update graph
    graphUpdate.style('opacity', 1);

    // exit graph
    graphExit.style('opacity', 0).remove();

    // iterate through each context element
    context.each(function (d, i) {
      const selection = select(this),
            duration = $$.duration(d, i),
            graph = selection.selectAll('.d2b-bubble-pack-graph'),
            graphsNode = selection.selectAll('.d2b-bubble-pack-graphs').node(),
            preX = graphsNode.__d2bPreserveScaleX__ || $$.x,
            preY = graphsNode.__d2bPreserveScaleY__ || $$.y;

      selection.on('change', function () {
        selection.transition().duration(duration).call(bubblePack, false);
      });

      let maxWidth = 0;

      // render the bubble packs for each graph
      graph.each( function (graph) {
        const el = select(this), xRange = $$.x.range();

        maxWidth = Math.max(maxWidth, Math.abs(xRange[0] - xRange[1]));

        let shift = graph.shift;
        if (shift === null) shift = ($$.x.bandwidth)? $$.x.bandwidth() / 2 : 0;

        $$.point
            .active(d => !!d.children.length)
            .fill(point => point.color)
            .type(point => point.symbol);

        const addTooltipPoint = graph.tooltipGraph?
            graph.tooltipGraph
                .clear()
                .x(point => $$.x(point.x) + shift)
                .y(point => $$.y(point.y))
                .color(point => point.color)
                .addPoint
              : null;

        renderPacks(
          el,
          graph.values,
          transition,
          $$.x,
          $$.y,
          preX,
          preY,
          shift,
          selection,
          addTooltipPoint,
          autoEnter
        );
      });
      positionIndicators(selection, maxWidth);
    });

    // Make a copy of the scales sticky on the 'graphs' node
    graphs.each(function () {
      this.__d2bPreserveScaleX__ = $$.x.copy();
      this.__d2bPreserveScaleY__ = $$.y.copy();
    });

    selection.dispatch('svg-bubble-pack-updated', {bubbles: true});

    return bubblePack;
  };

  // propagate expanded state to child tree
  function propagateExpanded(data, state) {
    data.data.expanded = state;
    data.children.forEach(child => propagateExpanded(child, state));
  }

  // Position all bubble indicators to be next to each other.
  function positionIndicators(selection, maxWidth) {
    let positionx = 5, positiony = 5;
    selection.selectAll('.d2b-bubble-indicator.d2b-active')
      .attr('transform', function () {
        const box = this.getBBox();

        if (box.width + positionx > maxWidth && positionx > 0) {
          positionx = 5;
          positiony += box.height + 5;
        }

        const translate = `translate(${positionx}, ${positiony})`;
        positionx += box.width + 5;
        return translate;
      });
  }

  /**
   * Renders bubble.
   * @param {d3.selection} el - bubble pack
   * @param {d3.transition or null} trans - transition if present
   * @param {d3.scale} x - x scale
   * @param {d3.scale} y - y scale
   * @param {Number} shift - horizontal pixel shift
   */
  function renderPoint(el, trans, x, y, shift) {
    el.each(function (d) {
      let el = select(this);

      const transform = el.attr('transform');

      if (!transform) {
        el.attr('transform', 'translate('+
          `${x(d.parent? d.parent.x : d.x) + shift},`+
          `${y(d.parent? d.parent.y : d.y)})`);
      }

      if (d.children.length && !d.data.expanded) {
        el
            .attr('cursor', 'pointer')
            .on('click', function () {
              select(this).dispatch('change', {bubbles: true, cancelable: true});
            })
            .on('change', d => d.data.expanded = !d.data.expanded);
      } else el.attr('cursor', '').on('click', null);

      if (trans) el = el.transition(trans);

      if (d.data.expanded) el.style('opacity', 0).selectAll('*').remove();
      else el.style('opacity', null).call($$.point);

      el.attr('transform', `translate(${x(d.x) + shift}, ${y(d.y)})`);

      // update annotations
      updateAnnotations(el, $$.annotation, 'd2b-bubble-annotation');
    });
  }

  /**
   * Renders bubble indicator.
   * @param {d3.selection} el - bubble pack
   * @param {d3.transition or null} trans - transition if present
   * @param {d3.scale} x - x scale
   * @param {d3.scale} y - y scale
   * @param {Number} shift - horizontal pixel shift
   */
  function renderIndicator(el) {
    el.each(function (d) {
      let el = select(this).classed('d2b-active', d.data.expanded);

      if (!d.data.expanded) return el.selectAll('rect, text, path').remove();

      let rect = el.select('rect'),
          text = el.select('text'),
          path = el.select('path');
      if (!rect.size()) rect = el.append('rect');
      if (!text.size()) text = el.append('text');
      if (!path.size()) path = el.append('path');

      text.text(d => d.indicator.substring(0,5)).attr('x', 20);
      const textBox = text.node().getBBox();
      text.attr('y', textBox.height / 1.35);
      rect
        .on('click', function () {
          select(this).dispatch('change', {bubbles: true, cancelable: true});
        })
        .on('change', d => {
          d.data.expanded = !d.data.expanded;
          if (!d.data.expanded) propagateExpanded(d, false);
        })
        .attr('width', textBox.width + 25)
        .attr('height', textBox.height)
        .style('fill', $$.point.fill())
        .style('stroke', $$.point.stroke());

      path
        .attr('d', d => indicatorSymbol.type(d.symbol)())
        .attr('transform', 'translate(10, 9.5)')
        .style('fill', $$.point.stroke());
    });
  }

  /**
   * Renders bubble packs recursively.
   * @param {d3.selection} el - packs container
   * @param {Array} data - packs data
   * @param {d3.transition or null} trans - transition if present
   * @param {d3.scale} x - x scale
   * @param {d3.scale} y - y scale
   * @param {Number} shift - horizontal pixel shift
   * @param {d3.selection} chart - master chart container
   * @param {function} addTooltipPoint - function to append a point to the tooltip component
   * @param {Number} depth - depth tracker
   */
  function renderPacks(el, data, trans, x, y, preX, preY, shift, chart, addTooltipPoint, autoEnter, depth = 0) {
    // set pack data
    const pack = el.selectAll(`.d2b-bubble-pack.d2b-depth-${depth}`)
              .data(data, d => d.key),
          packEnter = pack.enter().append('g')
              .attr('class', `d2b-bubble-pack d2b-depth-${depth}`),
          packUpdate = pack.merge(packEnter);

    const pointEnter = packEnter.append('g').attr('class', 'd2b-bubble-point');
    if (autoEnter) renderPoint(pointEnter, false, preX, preY, shift);
    pointEnter.style('opacity', 0);
    renderPoint(packUpdate.select('.d2b-bubble-point'), trans, x, y, shift);
    packEnter.append('g').attr('class', 'd2b-bubble-indicator');
    renderIndicator(packUpdate.select('.d2b-bubble-indicator'));

    // update children bubbles if expanded
    packUpdate.each(function (point) {
      const el = select(this);
      let subPacks = el.selectAll('.d2b-bubble-pack');
      subPacks = trans? subPacks.transition(trans) : subPacks;

      if (point.children.length && point.data.expanded) {
        renderPacks(el, point.children, trans, x, y, preX, preY, shift, chart, addTooltipPoint, autoEnter, depth + 1);
      } else {
        if (addTooltipPoint) addTooltipPoint(point);
        subPacks
            .remove()
          .select('.d2b-bubble-point')
            .style('opacity', 0)
            .attr('transform', `translate(${[x(point.x)+shift, y(point.y)]})`);
      }
    });

    let packExit = pack.exit();
    if (trans) packExit = packExit.transition(trans);
    packExit.remove();
  }

  // Recursively set the data structure starting at root node `d`
  function setStructure(d, tendancy, depth = 0) {
    d.children = d.children || [];
    d.leaves = d.children.length? [] : [d];
    d.depth = depth;
    if (d.children.length) {
      d.children.forEach(function (child) {
        setStructure(child, tendancy, depth + 1);
        child.parent = d;
        d.leaves = d.leaves.concat(child.leaves);
      });
    }

    d.size = oreq(d.size, sum(d.leaves, d => d.size));

    d.x = oreq(d.x, (tendancy.x || tendancy)(d.leaves, d => d.x, d => d.size));
    d.y = oreq(d.y, (tendancy.y || tendancy)(d.leaves, d => d.y, d => d.size));
  }

  /* Inherit from base model */
  base(bubblePack, $$)
    .addProp('point', point().size(d => d.size * 100))
    .addProp('x', scaleLinear())
    .addProp('y', scaleLinear())
    .addProp('annotation', annotation ? annotation() : null)
    .addPropGet('type', 'bubblePack')
    .addPropFunctor('duration', 250)
    .addPropFunctor('graphs', d => d)
    // graph props
    .addPropFunctor('tendancy', mean, function (_) {
      if (!arguments.length) return $$.tendancy;
      if (_ && _.tendancy) $$.tendancy = () => _;
      else $$.tendancy = functor(_);

      return bubblePack;
    })
    .addPropFunctor('tooltipGraph', d => d.tooltipGraph)
    .addPropFunctor('shift', null)
    .addPropFunctor('key', d => d.label)
    .addPropFunctor('values', d => d.values)
    .addPropFunctor('color', d => color(d.label))
    .addPropFunctor('symbol', () => symbolCircle)
    // point props
    .addPropFunctor('px', d => d.x)
    .addPropFunctor('py', d => d.y)
    .addPropFunctor('psize', d => d.size)
    .addPropFunctor('pchildren', d => d.children)
    .addPropFunctor('pcolor', null)
    .addPropFunctor('psymbol', null)
    .addPropFunctor('pindicator', d => d.label)
    .addPropFunctor('pkey', (d, i) => i)
    .addPropFunctor('pannotation', d => d.annotation)
    // methods
    .addMethod('getComputedGraphs', context => {
      return (context.selection? context.selection() : context).data().map((d, i) => getGraphs(d, i));
    })
    .addMethod('getVisiblePoints', context => {
      const data = bubblePack.getComputedGraphs(context);

      function addPoint(point, points, graph) {
        if (!point.data.expanded) {
          points.push({x: point.x, y: point.y, graph: graph});
        } else {
          point.children.forEach(point => addPoint(point, points, graph));
        }
      }

      return data.map(graphs => {
        return [].concat.apply([], graphs.map(graph => {
          const points = [];
          graph.values.forEach(point => addPoint(point, points, graph));
          return points;
        }));
      })[0];
    });

  return bubblePack;
}
