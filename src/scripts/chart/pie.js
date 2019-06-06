import { select } from 'd3-selection';
import { rgb } from 'd3-color';
import { sum } from 'd3-array';
import { format } from 'd3-format';
import 'd3-transition';

import base from '../model/base';
import chartFrame from '../util/chartFrame';
import legend from '../util/legend';
import tooltip from '../util/tooltip';
import tweenArc from '../util/tweenArc';
import tweenCentroid from '../util/tweenCentroid';
import tweenNumber from '../util/tweenNumber';
import svgPie from '../svg/pie';
import color from '../util/color';
import chartPieAdvanced from '../chartAdvanced/pie';

/**
 * d2b.chartPie() returns a d2b
 * pie chart generator
 */
export default function () {
  const $$ = {};

  const chart = function (context) {
    context.call($$.chartFrame);

    // make sure pie, arc, and legend accessors are defined properly
    $$.pie
      .value($$.value)
      .color($$.color)
      .key($$.key);

    $$.legend
      .html($$.label)
      .key($$.key)
      .color($$.color);

    $$.tooltip.color(d => rgb($$.color(d.data)).darker(0.3));

    const selection = (context.selection)? context.selection() : context;

    selection.each(function (datum) {
      update.call(this, datum, context !== selection ? context : null);
    });

    selection.dispatch('chart-pie-updated', {bubbles: true});
    selection.dispatch('chart-updated', {bubbles: true});

    return chart;
  };

  // percent formater
  const percent = format('.0%');

  // configure model properties
  base(chart, $$)
    .addProp('chartFrame', chartFrame().legendEnabled(true).breadcrumbsEnabled(false))
    .addProp('legend', legend().clickable(true).dblclickable(true))
    .addProp('key', d => d.label)
    .addProp('pie', svgPie())
    .addProp('tooltip',
      tooltip()
        .followMouse(true)
        .html(d => `<b>${$$.label(d.data)}</b>: ${$$.value(d.data)} (${percent(d.__percent__)})`)
    )
    .addPropFunctor('values', d => d)
    .addPropFunctor('duration', 250)
    .addPropFunctor('donutRatio', 0)
    .addPropFunctor('at', 'center center')
    .addPropFunctor('showPercent', (d, total) => $$.value(d) / total > 0.03)
    .addPropFunctor('radius', (d, w, h) => Math.min(w, h) / 2)
    .addPropFunctor('color', d => color(d.label))
    .addPropFunctor('value', d => d.value)
    .addPropFunctor('arcLabel', null)
    .addPropFunctor('label', d => d.label)
    .addAdvancedConfig(chartPieAdvanced);

  // // The advanced method is an alternative to calling the chart base method directly.
  // // The method will provide additional chart configuration before rendering through
  // // the `chartPieAdvanced` function.
  // chart.advanced = function (context) {
  //   const selection = (context.selection)? context.selection() : context;
  //   const transition = selection !== context;

  //   selection.each(function (datum) {
  //     if (datum.onChartUpdated) d3.select(this).on('chart-updated', datum.onChartUpdated);
  //     let el = d3.select(this).selectAll('.d2b-chart-advanced').data([chartPieAdvanced(chart, datum)]);
  //     const elEnter = el.enter().append('div').attr('class', 'd2b-chart-advanced');
  //     el = elEnter.merge(el);
  //     const elTransition = transition ? el.transition(context) : el;
  //     elTransition.call(chart);
  //   });
  // };

  // update chart
  function update (datum, transition) {
    const el = select(this),
          selection = el.select('.d2b-chart-container'),
          size = selection.node().__size__,
          radius = $$.radius(datum, size.width, size.height),
          donutRatio = $$.donutRatio(datum),
          legendEmpty = $$.legend.empty(),
          values = $$.values(datum),
          filtered = values.filter(d => !legendEmpty(d));

    $$.pie.values(filtered);
    $$.legend.values(values);

    // legend functionality
    const legend = el.select('.d2b-legend-container');
    
    (transition ? legend.transition(transition) : legend).call($$.legend);

    legend
        .on('change', () => el.transition().duration($$.duration(datum)).call(chart))
      .selectAll('.d2b-legend-item')
        .on('mouseover', function (d) { arcGrow.call(this, el, d, 1.03); })
        .on('mouseout', function (d) { arcGrow.call(this, el, d); });

    // get pie total
    const total = sum(filtered, d => $$.value(d));

    // select and enter pie chart 'g' element.
    let chartGroup = selection.selectAll('.d2b-pie-chart').data([filtered]);
    const chartGroupEnter = chartGroup.enter()
      .append('g')
        .attr('class', 'd2b-pie-chart');

    chartGroup = chartGroup.merge(chartGroupEnter);

    if (transition) chartGroup = chartGroup.transition(transition);

    $$.pie.arc()
      .innerRadius(radius * donutRatio)
      .outerRadius(radius);

    chartGroup.call($$.pie);

    let arcGroup = selection
      .selectAll('.d2b-pie-arc')
        .each(function (d) {
          // store inner and outer radii so that they can be used for hover
          // transitions
          d.__innerRadius__ = radius * donutRatio;
          d.__outerRadius__ = radius;

          // store percent for use with the tooltip
          d.__percent__ = d.value / total;
        })
        .on('mouseover', function (d) { arcGrow.call(this, el, d.data, 1.03); })
        .on('mouseout', function (d) { arcGrow.call(this, el, d.data); })
        .call($$.tooltip);

    let arcPercent = arcGroup.selectAll('.d2b-pie-arc-percent').data(d => [d]);

    arcPercent.enter()
      .append('g')
        .attr('class', 'd2b-pie-arc-percent')
      .append('text')
        .attr('y', 6);

    arcGroup
        .each(function () {
          const elem = select(this),
                current = elem.select('.d2b-pie-arc path').node().current,
                percentGroup = elem.select('.d2b-pie-arc-percent'),
                percentText = percentGroup.select('text').node();
          percentGroup.node().current = current;
          percentText.current = percentText.current || 0;
        });

    if (transition) {
      arcGroup = arcGroup
          .each(function (d) {d.transitioning = true;})
        .transition(transition)
          .on('end', function (d) {d.transitioning = false;});
    }


    const arcText = arcGroup
      .select('.d2b-pie-arc-percent')
        .call(tweenCentroid, $$.pie.arc())
      .select('text');

    arcText.each(function (d) {
      const arcLabel = $$.arcLabel(d.data);
      let text = select(this);

      if (transition) text = text.transition(transition);
      
      // if arc label is non-null use percents
      if (arcLabel) {
        text.text(arcLabel);
      } else {
        text
          .call(tweenNumber, $$.value(d.data) / total, percent)
          .style('opacity', function (d) {
            return $$.showPercent.call(this, d.data, total)? 1 : 0;
          });
      }
    });

    const coords = chartCoords(datum, radius, size);

    if (isNaN(coords.x) || isNaN(coords.y)) return;

    chartGroupEnter.attr('transform', `translate(${coords.x}, ${coords.y})`);
    chartGroup.attr('transform', `translate(${coords.x}, ${coords.y})`);
  }

  // Position the pie chart according to the 'at' string (e.g. 'center left',
  // 'top center', ..). Unless at is an object like {x: , y:}, then position
  // according to these coordinates.
  function chartCoords (datum, radius, size) {
    let coords = $$.at(datum, size.width, size.height, radius);

    if (typeof coords !== 'object') {
      coords = coords.split(' ');
      let at = {x: coords[1], y: coords[0]};
      coords = {};
      switch (at.x) {
        case 'left':
          coords.x = radius;
          break;
        case 'center':
        case 'middle':
          coords.x = size.width / 2;
          break;
        case 'right':
        default:
          coords.x = size.width - radius;
      }

      switch (at.y) {
        case 'bottom':
          coords.y = size.height - radius;
          break;
        case 'center':
        case 'middle':
          coords.y = size.height / 2;
          break;
        case 'top':
        default:
          coords.y = radius;
      }
    }

    return coords;
  }

  function arcGrow (el, d, multiplier = 1) {
    const arc = $$.pie.arc();
    let transitioning = false;

    const arcSvg = el.selectAll('.d2b-pie-arc')
      .filter(dd => dd.data === d)
        .each(function (d) {
          transitioning = transitioning || d.transitioning;
          d.outerRadius = d.__outerRadius__ * multiplier;
          d.innerRadius = d.__innerRadius__;
        });

    if (transitioning) return;

    arcSvg
      .select('path')
      .transition()
        .duration(100)
        .call(tweenArc, arc);
  }

  return chart;
}
