import * as d3 from 'd3';

import base from '../model/base';
import oreq from '../util/oreq';
import oreqUndefined from './oreqUndefined';

export default function () {
  const $$ = {};

  const tooltip = {};

  // Position markers relative to selected points and axes
  const positionMarker = function (marker, info, type) {
    if (type === 'y') {
      if (info.y === Infinity) return marker.style('opacity', 0);
      marker
          .style('opacity', 1)
          .attr('transform', `translate(0, ${info.y})`)
          .attr('y1', 0).attr('y2', 0).attr('x1', 0).attr('x2', $$.size.width);
    } else {
      if (info.x === Infinity) return marker.style('opacity', 0);
      marker
          .style('opacity', 1)
          .attr('transform', `translate(${info.x}, 0)`)
          .attr('x1', 0).attr('x2', 0).attr('y1', 0).attr('y2', $$.size.height);
    }
  };

  // Position tooltip relative to selected points and axes
  const positionTooltip = function (tooltip, info, base) {
    const node = tooltip.node();
    if (!node) return;
    const tooltipBox = tooltip.node().getBoundingClientRect();
    let x = base.x, y = base.y, pad = 10;

    if ($$.trackY) {
      if (info.y > $$.size.height / 2) {
        y += info.y - pad - tooltipBox.height;
      } else {
        y += info.y + pad;
      }
    } else {
      if (d3.event.clientY - base.y > $$.size.height / 2) {
        y = d3.event.clientY - pad - tooltipBox.height;
      } else {
        y = d3.event.clientY + pad;
      }
    }

    if ($$.trackX) {
      if (info.x > $$.size.width / 2) {
        x += info.x - pad - tooltipBox.width;
      } else {
        x += info.x + pad;
      }
    } else {
      if (d3.event.clientX - base.x > $$.size.width / 2) {
        x = d3.event.clientX - pad - tooltipBox.width;
      } else {
        x = d3.event.clientX + pad;
      }
    }

    x += window.pageXOffset;
    y += window.pageYOffset;

    tooltip.style('left', x+'px').style('top', y+'px');
  };

  // Populate tooltip with point rows
  const populateTooltip = function (tooltip, info) {
    const title = $$.title(info.points.map(d => d.data));

    tooltip.select('.d2b-tooltip-title')
      .style('display', title? 'block' : 'none')
      .html(title);

    const content = tooltip.select('.d2b-tooltip-content');

    let row = content.selectAll('.d2b-tooltip-row').data(info.points);
    const rowEnter = row.enter().append('div').attr('class', 'd2b-tooltip-row');

    row.exit().remove();

    row = row.merge(rowEnter)
      .html(d => d.row)
      .style('border-left-color', d => d.color || 'transparent');
  };

  // Finds the x, y coordinates associated with the points 'closest' to the cursor.
  // Also returns the set of points that meet the 'closest' configuration.
  const findPointInfo = function (base) {
    const cursor = {x: d3.event.clientX - base.x, y: d3.event.clientY - base.y};
    let x = Infinity, y = Infinity, points = [];
    for (let groupName in groups) {
      if (!groups.hasOwnProperty(groupName)) continue;
      const group = groups[groupName];
      for (let graphName in group) {
        if(!group.hasOwnProperty(graphName)) continue;
        const graph = group[graphName];
        let newPoints = [];
        graph.config.data.forEach((d, i) => {
          const item = {
            data: d,
            x: oreq(graph.config.x(d, i), $$.x(d, i)),
            y: oreq(graph.config.y(d, i), $$.y(d, i)),
            color: oreq(graph.config.color(d, i), $$.color(d, i)),
            row: oreqUndefined(graph.config.row(d, i), $$.row(d, i))
          };

          if ($$.trackX && $$.trackY) {
            if (item.x === x && item.y === y) return newPoints.push(item);

            const od = Math.sqrt(Math.pow(x - cursor.x, 2) + Math.pow(y - cursor.y, 2));
            const nd = Math.sqrt(Math.pow(item.x - cursor.x, 2) + Math.pow(item.y - cursor.y, 2));

            if (nd < od && nd < $$.threshold) {
              x = item.x;
              y = item.y;
              points = [];
              newPoints = [item];
            }
          } else if ($$.trackX) {
            if (item.x === x) return newPoints.push(item);

            const od = Math.abs(x - cursor.x);
            const nd = Math.abs(item.x - cursor.x);

            if (nd < od && nd < $$.threshold) {
              x = item.x;
              points = [];
              newPoints = [item];
            }
          } else if ($$.trackY) {
            if (item.y === y) return newPoints.push(item);

            const od = Math.abs(y - cursor.y);
            const nd = Math.abs(item.y - cursor.y);

            if (nd < od && nd < $$.threshold) {
              y = item.y;
              points = [];
              newPoints = [item];
            }
          }
        });

        points = points.concat(newPoints);
      }
    }

    points = points.sort((a, b) => {
      return d3.ascending(a.x, b.x) || d3.ascending(a.y, b.y);
    });

    return {x: x, y: y, points: points};
  };

  // Exit tooltip element.
  const exitElement = function (el) {
    el.transition().duration(50).style('opacity', 0).remove();
  };

  // Enter tooltip element.
  const enterElement = function (el) {
    el.transition().duration(50).style('opacity', 1);
  };

  // Enter tooltip components.
  const enter = function (d, i) {
    const markerX = $$.svgContainer.selectAll('.d2b-tooltip-marker-x').data($$.trackX? [tooltip] : []);
    const markerXEnter = markerX.enter()
      .append('line')
        .attr('class', 'd2b-tooltip-marker-x d2b-tooltip-marker');

    const markerY = $$.svgContainer.selectAll('.d2b-tooltip-marker-y').data($$.trackY? [tooltip] : []);
    const markerYEnter = markerY.enter()
      .append('line')
        .attr('class', 'd2b-tooltip-marker-y d2b-tooltip-marker');

    const tooltipEl = $$.htmlContainer.selectAll('.d2b-tooltip').data([tooltip]);

    const tooltipEnter = tooltipEl.enter()
      .append('div')
        .attr('class', 'd2b-tooltip d2b-tooltip-axis');

    tooltipEnter.merge(tooltipEl).call(enterElement);
    markerY.merge(markerYEnter).call(enterElement);
    markerX.merge(markerXEnter).call(enterElement);

    tooltipEnter.append('div').attr('class', 'd2b-tooltip-title');
    tooltipEnter.append('div').attr('class', 'd2b-tooltip-content');

    $$.dispatch.call('insert', $$.tooltip, d, i);
  };

  // Exit tooltip components.
  const exit = function () {
    $$.svgContainer.selectAll('.d2b-tooltip-marker-x').data([]).exit().call(exitElement);
    $$.svgContainer.selectAll('.d2b-tooltip-marker-y').data([]).exit().call(exitElement);
    $$.htmlContainer.selectAll('.d2b-tooltip').data([]).exit().call(exitElement);
  };

  // Tracker mousemove event.
  const mousemove = function (d, i) {
    let base = $$.svgContainer.selectAll('.d2b-tooltip-base').data([d]);
    base = base.merge(base.enter().append('rect').attr('class', 'd2b-tooltip-base'));
    let baseBox = base.node().getBoundingClientRect();
    baseBox = {x: baseBox.left, y: baseBox.top};

    const pointInfo = findPointInfo(baseBox);

    if (pointInfo.points.length) enter();
    else return exit();

    $$.svgContainer
      .select('.d2b-tooltip-marker-x')
        .call(positionMarker, pointInfo, 'x');

    $$.svgContainer
      .select('.d2b-tooltip-marker-y')
        .call(positionMarker, pointInfo, 'y');

    $$.htmlContainer
      .select('.d2b-tooltip')
        .call(populateTooltip, pointInfo)
        .call(positionTooltip, pointInfo, baseBox);

    $$.dispatch.call('move', $$.tooltip, d, i);
  };

  // Tracker mouseout event.
  const mouseout = function (d, i) {
    exit();

    $$.dispatch.call('remove', $$.tooltip, d, i);
  };

  // Event key builder.
  const event = (listener) => {
    return `${listener}.d2b-tooltip-axis`;
  };

  // update mouse event tracker
  const updateTracker = (n, o) => {
    if (o) {
      o
          .on(event('mouseout'), null)
          .on(event('mousemove'), null);
    }
    if (n) {
      n
          .on(event('mouseout'), mouseout)
          .on(event('mousemove'), mousemove);
    }
  };

  // setup tooltip model
  base(tooltip, $$)
    .addProp('htmlContainer', d3.select('body'))
    .addProp('svgContainer', null)
    .addProp('tracker', d3.select('body'), null, updateTracker)
    .addProp('size', {height: 0, width: 0})
    .addProp('trackX', true)
    .addProp('trackY', false)
    .addProp('threshold', Infinity)
    .addMethod('clear', function (groupName, graphName) {
      if (arguments.length === 0) groups = {};
      else if (arguments.length === 1) delete groups[groupName];
      else if (arguments.length >= 2) delete groups[groupName][graphName];

      return tooltip;
    })
    .addPropFunctor('title', null)
    .addPropFunctor('x', d => d.x)
    .addPropFunctor('y', d => d.y)
    .addPropFunctor('color', null)
    .addPropFunctor('row', null)
    .addDispatcher(['move', 'insert', 'remove']);


  // construct an interface for each graph that is initialized
  let groups = {};
  tooltip.graph = function (groupName = null, graphName = null) {
    const graphs = groups[groupName] = groups[groupName] || {};
    let graph = graphs[graphName];

    if (!graph) {
      graph = graphs[graphName] = {interface: {},config: {}};
      const graphModel = base(graph.interface, graph.config);

      graphModel
        .addProp('data', [])
        .addMethod('clear', () => {
          graph.config.data = [];
          return graph.interface;
        })
        .addMethod('addPoint', p => {
          graph.config.data.push(p);
          return graph.interface;
        })
        .addPropFunctor('x', null)
        .addPropFunctor('y', null)
        .addPropFunctor('color', null)
        .addPropFunctor('row', () => undefined);
    }

    return graph.interface;
  };

  return tooltip;
}
