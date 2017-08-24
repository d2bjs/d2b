import * as d3 from 'd3';

import base from '../model/base';
import color from '../util/color';

export default function () {
  const $$ = {};

  const symbol = d3.symbol().size(80);

  const legend = function (context) {
    const selection = context.selection? context.selection() : context;

    let leg = selection.selectAll('.d2b-legend').data(d => [d]);

    const legEnter = leg.enter()
      .append('div')
        .attr('class', 'd2b-legend');

    leg = leg.merge(legEnter).classed('d2b-vertical', $$.vertical);

    let legItem = leg.selectAll('.d2b-legend-item').data($$.values, $$.key),
        legItemExit = legItem.exit();

    const legItemEnter = legItem.enter()
      .append('div')
        .attr('class', 'd2b-legend-item')
        .style('opacity', 0);

    legItemEnter.append('div').attr('class', 'd2b-legend-icon');
    legItemEnter.append('div').attr('class', 'd2b-legend-content');

    legItem = legItem.merge(legItemEnter).order();

    legItem.select('.d2b-legend-content').html($$.html);

    if (context !== selection) {
      legItem = legItem.transition(context);
      legItemExit = legItemExit.transition(context).style('opacity', 0);
    }

    legItem
        .style('opacity', 1)
        .each(function (d, i) {
          // legend item customization
          const item      = d3.select(this),
                color     = $$.color(d, i),
                empty     = $$.empty(d, i);

          item
              .style('border-color', color);

          // legend icon customization
          const icon      = $$.icon(d, i),
                iconDiv   = item.select('.d2b-legend-icon'),
                fa        = [],
                shape     = [],
                rect      = iconDiv.node().getBoundingClientRect(),
                size      = { width: rect.width, height: rect.height },
                center    = { x: size.width / 2, y: size.height / 2};

          if (typeof icon === 'string') fa.push(icon);
          else shape.push(icon);

          let svgIcon = iconDiv.selectAll('.d2b-legend-svg-icon').data(d => [d]);

          const svgIconEnter = svgIcon.enter().append('svg');
          svgIconEnter
              .attr('class', 'd2b-legend-svg-icon')
              .attr('width', size.width)
              .attr('height', size.height);

          svgIcon = svgIcon.merge(svgIconEnter);

          let svgFa = svgIcon.selectAll('text').data(fa),
              svgFaEnter = svgFa.enter().append('text');
          svgFa.exit().remove();
          svgFaEnter.append('tspan');
          svgFa = svgFa.merge(svgFaEnter);
          svgFa
              .style('stroke', color)
              .style('fill', empty? 'white' : color)
              .attr('transform', `translate(${center.x},${center.y * 1.65})`)
            .select('tspan')
              .text(d => d);

          let svgShape = svgIcon.selectAll('path').data(shape);
          svgShape.exit().remove();
          svgShape = svgShape.merge(svgShape.enter().append('path'));
          svgShape
              .style('stroke', color)
              .style('fill', empty? 'white' : color)
              .attr('d', d => symbol.type(d)())
              .attr('transform', `translate(${center.x},${center.y})`);

        });

    // bind events
    leg.each(function (d, i) {
      const allowEmptied  = $$.allowEmptied(d, i),
            items         = d3.select(this).selectAll('.d2b-legend-item'),
            setAllEmpty   = function (state) {
              items.each(function(dd, ii) {
                $$.setEmpty(dd, ii, state);
              });
            },
            allEmpty      = function () {
              let allEmpty = true;

              items.each(function (dd, ii) {
                if (!$$.empty(dd, ii)) allEmpty = false;
              });

              return allEmpty;
            },
            click         = function (d, i) {
              $$.setEmpty(d, i, !$$.empty(d, i));
              if (!allowEmptied && allEmpty()) setAllEmpty(false);
              selection.call(legend);
              d3.select(this.parentNode).dispatch('change', {bubbles: true});
            },
            dblclick      = function (d, i) {
              setAllEmpty(true);
              $$.setEmpty(d, i, false);
              selection.call(legend);
              d3.select(this.parentNode).dispatch('change', {bubbles: true});
            };

      items.each(function (d, i) {
        const clickable     = $$.clickable(d, i),
              dblclickable  = $$.dblclickable(d, i);

        d3.select(this)
            .on('click', clickable? click: null)
            .on('dblclick', dblclickable? dblclick: null);
      });

    });

    selection.dispatch('legend-updated', {bubbles: true});

    legItemExit.remove();
  };

  /* Inherit from base model */
  base(legend, $$)
    .addPropFunctor('values', d => d)
    .addPropFunctor('key', (d, i) => i)
    .addPropFunctor('color', d => color(d.html))
    .addPropFunctor('html', d => d.html)
    .addPropFunctor('icon', '\uf111')
    .addPropFunctor('vertical', false)
    .addPropFunctor('allowEmptied', false)
    .addPropFunctor('clickable', false)
    .addPropFunctor('dblclickable', false)
    .addPropFunctor('empty', d => d.empty)
    .addPropFunctor('setEmpty', (d, i, state) => d.empty = state);

  return legend;
}
