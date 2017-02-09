import * as d3 from 'd3';

import {default as base} from '../model/base.js';
import {default as d2bid} from '../util/id.js';

// tooltip with id in case of multiple d2b.tooltip generators
export default function (id = d2bid()) {
  const $$ = {};

  const tooltip = function (context) {
    ((context.selection)? context.selection() : context)
      .on(event('mouseover'), mouseover)
      .on(event('mouseout'), mouseout)
      .on(event('mousemove'), mousemove);

    return tooltip;
  };

  const getCoords = function (d, i) {
    const box = this.getBoundingClientRect();
    let coords = {};

    // construct at object, if null automatically set it based on cursor event position
    let at = ($$.at.call(this, d, i) || ((d3.event.clientX > window.innerWidth / 2)? 'center left' : 'center right')).split(' ');
    at = {x: at[1], y: at[0]};

    // switch for horizontal coordinate
    switch (at.x) {
      case 'left':
        coords.x = box.left;
        break;
      case 'center':
        coords.x = box.left + box.width / 2;
        break;
      default: // right
        coords.x = box.left + box.width;
    }

    // switch for vertical coordinate
    switch (at.y) {
      case 'bottom':
        coords.y = box.top + box.height;
        break;
      case 'center':
        coords.y = box.top + box.height / 2;
        break;
      default: // top
        coords.y = box.top;
    }
    return coords;
  };

  const mouseover = function (d, i) {
    let tooltipUpdate = $$.selection.selectAll('.d2b-tooltip').data(d => [d]);

    const newTooltip = tooltipUpdate.enter()
      .append('div')
        .style('opacity', 0)
        .attr('class', 'd2b-tooltip');

    newTooltip
      .append('div')
        .attr('class', 'd2b-tooltip-content');

    tooltipUpdate = tooltipUpdate.merge(newTooltip);

    tooltipUpdate
      .transition()
        .duration(100)
        .style('opacity', 1);

    $$.dispatch.call('insert', tooltipUpdate, this, d, i);
  };

  const mousemove = function (d, i) {
    const html = $$.html.call(this, d, i),
          target = $$.target.call(this, d, i),
          color = $$.color.call(this, d, i),
          targetNode = (target)? target.node() : this,
          coords = ($$.followMouse.call(this, d, i))?
                    {x: d3.event.clientX, y: d3.event.clientY} :
                    getCoords.call(targetNode, d, i);

    let tooltipUpdate = $$.selection.selectAll('.d2b-tooltip').data(d => [d]);

    let my = ($$.my.call(this, d, i) || ((d3.event.clientX > window.innerWidth / 2)? 'left' : 'right'));

    tooltipUpdate
        .attr('class', `d2b-tooltip d2b-tooltip-${my}`)
        .style('top', coords.y+'px')
        .style('left', coords.x+'px')
        .style('border-color', color)
      .select('.d2b-tooltip-content')
        .html(html);

    $$.dispatch.call('move', tooltipUpdate, this, d, i);
  };

  const mouseout = function (d, i) {
    let tooltipUpdate = $$.selection.selectAll('.d2b-tooltip').data(d => [d]);

    tooltipUpdate
      .transition()
        .duration(100)
        .style('opacity', 0)
        .remove();

    $$.dispatch.call('remove', tooltipUpdate, this, d, i);
  };

  const event = (listener) => {
    return `${listener}.d2b-tooltip`;
  };

  const updateContainer = (n, o) => {
    if (o) o.select(`.d2b-tooltip-area-${id}`).remove();
    if (!n) return;
    $$.selection = n.selectAll(`.d2b-tooltip-area-${id}`).data([tooltip]);
    $$.selection = $$.selection.merge(
      $$.selection.enter().append('div').attr('class', `d2b-tooltip-area-${id} d2b-tooltip-area`)
    );
  };

  /* Inherit from base model */
  base(tooltip, $$)
    .addProp('container', d3.select('body'), null, updateContainer)
    .addMethod('clear', function (context) {
      ((context.selection)? context.selection() : context)
        .on(event('mouseover'), null)
        .on(event('mouseout'), null)
        .on(event('mousemove'), null);

      return tooltip;
    })
    .addPropFunctor('followMouse', false)
    .addPropFunctor('color', null)
    .addPropFunctor('my', null)
    .addPropFunctor('at', null)
    .addPropFunctor('target', null)
    .addPropFunctor('html', null)
    .addDispatcher(['insert', 'move', 'remove']);

  return tooltip;
}
