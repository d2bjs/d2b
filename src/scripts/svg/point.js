import * as d3 from 'd3';

import base from '../model/base';

// point svg generator
export default function () {
  const $$ = {};

  /* Update Function */
  const point = function (context) {
    const selection = context.selection? context.selection() : context;

    // point background
    let back = selection.selectAll('path.d2b-point-back').data(d => [d]);

    back.enter()
      .append('path')
        .attr('class', 'd2b-point-back')
        .attr('d', symbolNormal)
        .style('fill-opacity', 0)
        .style('stroke', $$.stroke)
        .style('stroke-width', $$.strokeWidth);

    if (context !== selection) {
      back = back.transition(context);
    }

    back
        .attr('d', symbolNormal)
        .style('stroke', $$.stroke)
        .style('stroke-width', $$.strokeWidth);

    // point foreground
    let front = selection.selectAll('path.d2b-point-front').data(d => [d]);

    front.enter()
      .append('path')
        .attr('class', 'd2b-point-front')
        .attr('d', symbolSmall)
        .style('opacity', frontOpacity)
        .style('fill', $$.fill)
        .style('stroke', $$.stroke)
        .style('stroke-width', $$.strokeWidth);

    if (context !== selection) {
      front = front.transition(context);
    }

    front
        .attr('d', symbolSmall)
        .style('opacity', frontOpacity)
        .style('fill', $$.fill)
        .style('stroke', $$.stroke)
        .style('stroke-width', $$.strokeWidth);

    // set mouse events if active
    selection
      .each(function (d, i) {
        const active = $$.active.call(this, d, i);
        d3.select(this)
          .on('mouseover.d2b-point', (active)? mouseover : null )
          .on('mouseout.d2b-point', (active)? mouseout : null );
      });

    selection.dispatch('point-updated', {bubbles: true});

    return point;
  };

  const symbol = d3.symbol();

  /* Inherit from base model */
  base(point, $$)
    .addPropFunctor('size', 150, null, d => symbol.size(d))
    .addPropFunctor('type', d3.symbolCircle, null, d => symbol.type(d))
    .addPropFunctor('active', false)
    .addPropFunctor('empty', false)
    .addPropFunctor('fill', 'steelblue')
    .addPropFunctor('stroke', function (d, i) {
      return d3.rgb($$.fill.call(this, d, i)).darker(0.3);
    })
    .addPropFunctor('strokeWidth', '1px');


  function frontOpacity (d, i) {
    return ($$.empty.call(this, d, i))? 0 : 1;
  }

  function symbolBig (d, i) {
    const size = $$.size.call(this, d, i),
          empty = $$.empty.call(this, d, i);
    return symbol.size(empty? size : 2.5 * size).call(this, d, i);
  }

  function symbolSmall (d, i) {
    const size = $$.size.call(this, d, i),
          empty = $$.empty.call(this, d, i);
    return symbol.size(empty? size / 3 : size).call(this, d, i);
  }

  function symbolNormal (d, i) {
    const size = $$.size.call(this, d, i);
    return symbol.size(size).call(this, d, i);
  }

  function mouseover (d, i) {
    const empty = $$.empty.call(this, d, i);

    d3.select(this).select('path.d2b-point-back')
      .transition()
        .duration(100)
        .attr('d', symbolBig);

    d3.select(this).select('path.d2b-point-front')
      .transition()
        .duration(100)
        .style('opacity', (empty)? 0.5 : 1)
        .attr('d', symbolSmall);
  }

  function mouseout(d, i) {
    const empty = $$.empty.call(this, d, i);

    d3.select(this).select('path.d2b-point-back')
      .transition()
        .duration(100)
        .attr('d', symbolNormal);

    d3.select(this).select('path.d2b-point-front')
      .transition()
        .duration(100)
        .style('opacity', (empty)? 0 : 1)
        .attr('d', symbolSmall);
  }

  return point;
}
