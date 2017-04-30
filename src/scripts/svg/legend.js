import * as d3 from 'd3';

import base from '../model/base';
import color from '../util/color';
import textWrap from '../util/textWrap';
import svgPoint from '../svg/point';

export default function () {
  const $$ = {};

  const legend = function (context) {

    context.each(function (data, index) {
      const selection = d3.select(this),
            itemSize = $$.itemSize.call(this, data, index),
            size = $$.size.call(this, data, index),
            orient = $$.orient.call(this, data, index).split(' '),
            orient1 = orient[0],
            maxTextLength = $$.maxTextLength.call(this, data, index),
            items = $$.items.call(this, data, index);

      // Set point size and stroke width for.
      point
          .size(1.5 * Math.pow(itemSize / 2, 2))
          .strokeWidth(itemSize * 0.1);

      // enter d2b-legend container
      let g = selection.selectAll('.d2b-legend').data([items]),
          gEnter = g.enter().append('g').attr('class', 'd2b-legend');
      g = g.merge(gEnter);

      // enter d2b-legend-items
      let item = g.selectAll('.d2b-legend-item').data(d => d.sort($$.order), $$.key);

      let itemEnter = item.enter()
        .append('g')
          .attr('class', 'd2b-legend-item')
          .style('opacity', 0);

      itemEnter.append('g').append('text');

      // exit d2b-legend-items
      let itemExit = item.exit();

      // merge enter and update items
      item = item.merge(itemEnter)
          .style('cursor', function (d, i) {
            const clickable = $$.clickable.call(this, d, i),
                  dblclickable = $$.dblclickable.call(this, d, i);
            return (clickable || dblclickable)? 'pointer' : 'auto';
          });

      // bind item events for each selection
      selection.call(bindEvents, index);

      // select item wrapper
      let wrap = item.select('g')
          .attr('transform', `translate(${itemSize / 2}, ${itemSize / 2})`);

      // select item text
      let text = item.select('text')
          .attr('transform', `translate(${itemSize / 1.5}, ${itemSize / 3})`)
          .style('font-size', `${itemSize}px`)
          .call(textWrap, $$.label, maxTextLength);

      // init transitions if context is a transition
      if (context.selection) {
        itemExit = itemExit.transition(context).style('opacity', 0);
        item = item.transition(context);
        wrap = wrap.transition(context);
        text = text.transition(context);
        g = g.transition(context);
      }

      // remove exiting items
      itemExit.remove();

      // wrap update
      wrap.call(point);

      // find max item width
      let maxWidth = 0;
      text.each(function () {
        maxWidth = Math.max(maxWidth, this.getBBox().width);
      });
      maxWidth += itemSize;

      // inital item padding
      const pad = {x: itemSize, y: 5};

      // entering items will be positioned immediately
      itemEnter.call(positionItems[orient1], {}, pad, itemSize, size, maxWidth);

      // Initialize computed box dimensions of the legend to 0. These are
      // attached as attributes to the legend selection node.
      this.__box__ = {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      };

      // update item position and opacity
      item
          .style('opacity', 1)
          .call(positionItems[orient1], this.__box__, pad, itemSize, size, maxWidth);

      // postiion legend
      gEnter.call(positionLegend, this.__box__, size, orient);
      g.call(positionLegend, this.__box__, size, orient);
    });

    return legend;
  };



  // Bind events and dispatchers to all legend items within selection. Use the
  // 'd2b-legend' namespace.
  function bindEvents (selection, index) {
    selection.selectAll('.d2b-legend-item')
        .on('click', function (d, i) {
          click.call(this, d, i, selection, index);
        })
        .on('dblclick', function (d, i) {
          dblclick.call(this, d, i, selection, index);
        });
  }

  // On legend item click decide and perform any necessary actions.
  function click (d, i, selection, index) {
    const clickable = $$.clickable.call(this, d, i),
          allowEmptied = $$.allowEmptied.call(selection.node(), selection.datum(), index);

    if (!clickable) return;

    $$.setEmpty(d, i, !$$.empty(d, i));

    const el = d3.select(this),
          items = selection.selectAll('.d2b-legend-item');

    let allEmpty = true;
    items.each( (d, i) => allEmpty = ($$.empty(d, i))? allEmpty : false );

    if (allEmpty && !allowEmptied) {
      items.each((d, i) => $$.setEmpty(d, i, false)).transition().duration(100).call(point);
      items.filter(dd => dd != d).dispatch('change');
    } else {
      el.transition().duration(100).call(point);
    }

    el.dispatch('change', {bubbles: true});
  }

  // On legend item dblclick decide and perform any necessary actions.
  function dblclick (d, i, selection) {
    const dblclickable = $$.dblclickable.call(this, d, i);

    if (!dblclickable) return;

    const items = selection.selectAll('.d2b-legend-item');

    items.each((d, i) => $$.setEmpty(d, i, true));
    $$.setEmpty(d, i, false);

    items.transition().duration(100).call(point);
    items.filter(dd => dd != d).dispatch('change');
    d3.select(this).dispatch('change', {bubbles: true});
  }

  // Initialize new d2b point.
  const point = svgPoint();

  // Position legend according the the box width/height
  function positionLegend (ctx, box, size, orient) {
    let x = 0, y = 0;
    switch(orient[1]) {
      case 'center':
      case 'middle':
        y = size.height / 2 - box.height / 2;
        break;
      case 'bottom':
        y = size.height - box.height;
        break;
      case 'top':
      default:
        y = 0;
    }
    switch(orient[2]) {
      case 'center':
      case 'middle':
        x = size.width / 2 - box.width / 2;
        break;
      case 'right':
        x = size.width - box.width;
        break;
      case 'left':
      default:
        x = 0;
    }
    box.left = x;
    box.right = size.width - x + box.width;
    box.top = y;
    box.bottom = size.height - y + box.height;

    ctx.attr('transform', `translate(${x}, ${y})`);
  }

  // Position legend items either horizontally or vertically.
  const positionItems = {
    // ctx - d3 context for legend items that need to be positioned
    // legendNode - svg node for the current legend (to set compute dimensions)
    // pad - item padding
    // itemSize - legend 'itemSize', usually the height of each legend item
    // size - object with 'width' and 'height' attributes to bound either the vertical or horizontal legend
    // maxWidth - maximum width of all legend items
    horizontal: (ctx, legendBox, pad, itemSize, size, maxWidth) => {
      let x = 0, y = 0, maxHeight = 0;

      ctx
        .attr('transform', function () {
          const el = d3.select(this),
                boxHeight = itemSize * el.selectAll('tspan').size(),
                boxWidth = el.select('text').node().getBBox().width;

          if (x + maxWidth > size.width) {
            x = 0;
            y += maxHeight + pad.y;
            maxHeight = 0;
          }
          const translate = `translate(${x}, ${y})`;
          maxHeight = Math.max(maxHeight, boxHeight);
          legendBox.width = Math.max(legendBox.width, x + boxWidth + 1.5 * itemSize);
          x += maxWidth + pad.x;
          return translate;
        });
      legendBox.height = y + maxHeight;
    },
    vertical: (ctx, legendBox, pad, itemSize, size) => {
      let x = 0, y = 0, maxWidth = 0;
      ctx
        .attr('transform', function () {
          const el = d3.select(this),
                boxHeight = itemSize * el.selectAll('tspan').size(),
                boxWidth = el.select('text').node().getBBox().width;

          if (y + boxHeight > size.height){
            x += maxWidth + pad.x + itemSize;
            y = 0;
            maxWidth = 0;
          }
          const translate = `translate(${x}, ${y})`;
          maxWidth = Math.max(maxWidth, boxWidth);
          legendBox.height = Math.max(legendBox.height, y + boxHeight);
          y += boxHeight + pad.y;
          return translate;
        });
      legendBox.width = x + maxWidth + 1.5 * itemSize;
    }
  };

  /* Inherit from base model */
  base(legend, $$)
    // legend level functors
    .addPropFunctor('items', d => d)
    .addPropFunctor('itemSize', 12)
    .addPropFunctor('size', {width: 960, height: 500})
    .addPropFunctor('orient', 'vertical center right')
    .addPropFunctor('maxTextLength', Infinity)
    .addPropFunctor('allowEmptied', false)
    .addPropFunctor('order', (a, b) => d3.ascending($$.label(a), $$.label(b)))
    // legend item level functors
    .addPropFunctor('key', (d, i) => i)
    .addPropFunctor('clickable', false)
    .addPropFunctor('dblclickable', false)
    .addPropFunctor('label', d => d.label)
    .addPropFunctor('empty', d => d.empty, null, _ => point.empty(_))
    .addPropFunctor('setEmpty', (d, i, state) => {
      d.empty = state;
    })
    // legend item point functors
    .addPropFunctor('active', false, null, _ => point.active(_) )
    .addPropFunctor('symbol', d3.symbolCircle, null, _ => point.type(_) )
    .addPropFunctor('color', d => color(d.label), null, _ => point.fill(_))
    // Method to get the computed box of a specific legend container. This
    // method should be used after the legend has been rendered. Either the
    // legend SVG node or a d3 selection of the node may be specified.
    .addMethod('box', (_) => {
      const node = (_.node)? _.node() : _;
      if (!node) return null;
      return node.__box__;
    });

  return legend;
}
