import * as d3 from 'd3';

import base from '../model/base';
import chartFrame from '../util/chartFrame';
import legend from '../util/legend';
import tooltip from '../util/tooltip';
import tweenArc from '../util/tweenArc';
import tweenCentroid from '../util/tweenCentroid';
import tweenNumber from '../util/tweenNumber';
import svgPie from '../svg/pie';
import color from '../util/color';

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

    $$.tooltip.color(d => d3.rgb($$.color(d.data)).darker(0.3));

    const selection = (context.selection)? context.selection() : context;

    selection.each(function (datum) {
      update.call(this, datum, context !== selection ? context : null);
    });

    selection.dispatch('chart-pie-updated', {bubbles: true});

    return chart;
  };

	// percent formater
  const percent = d3.format('.0%');

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
    .addPropFunctor('label', d => d.label);

	// update chart
  function update (datum, transition) {
    const el = d3.select(this),
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
    el
      .select('.d2b-legend-container')
        .call($$.legend)
        .on('change', () => el.transition($$.duration(datum)).call(chart))
      .selectAll('.d2b-legend-item')
        .on('mouseover', function (d) { arcGrow.call(this, el, d); })
        .on('mouseout', function (d) { arcShrink.call(this, el, d); });

		// get pie total
    const total = d3.sum(filtered, d => $$.value(d));

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
        .on('mouseover', function (d) { arcGrow.call(this, el, d.data); })
        .on('mouseout', function (d) { arcShrink.call(this, el, d.data); })
        .call($$.tooltip);

    let arcPercent = arcGroup.selectAll('.d2b-pie-arc-percent').data(d => [d]);

    arcPercent.enter()
			.append('g')
				.attr('class', 'd2b-pie-arc-percent')
			.append('text')
				.attr('y', 6);

    arcGroup
        .each(function () {
          const elem = d3.select(this),
                current = elem.select('.d2b-pie-arc path').node().current,
                percentGroup = elem.select('.d2b-pie-arc-percent'),
                percentText = percentGroup.select('text').node();
          percentGroup.node().current = current;
          percentText.current = percentText.current || 0;
        });

    if (transition) {
      arcGroup = arcGroup
          .each(function () {this.transitioning = true;})
        .transition(transition)
          .on('end', function () {this.transitioning = false;});
    }


    arcGroup
			.select('.d2b-pie-arc-percent')
				.call(tweenCentroid, $$.pie.arc())
			.select('text')
				.call(tweenNumber, d => $$.value(d.data) / total, percent)
        .style('opacity', function (d) {
          return $$.showPercent.call(this, d.data, total)? 1 : 0;
        });

    const coords = chartCoords(datum, radius, size);
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

  function arcGrow (el, d) {
    const arc = $$.pie.arc();

    arc
      .outerRadius(d => d.outerRadius)
      .innerRadius(d => d.innerRadius);

    el.selectAll('.d2b-pie-arc')
      .filter(dd => dd.data === d)
        .each(function (d) {
          d.outerRadius = d.__outerRadius__ * 1.03;
          d.innerRadius = d.__innerRadius__;
        })
      .select('path')
      .transition()
        .duration(100)
        .call(tweenArc, arc);
  }

  function arcShrink (el, d) {
    const arc = $$.pie.arc();

    arc
      .outerRadius(d => d.outerRadius)
      .innerRadius(d => d.innerRadius);

    el.selectAll('.d2b-pie-arc')
      .filter(dd => dd.data === d)
        .each(function (d) {
          d.outerRadius = d.__outerRadius__;
          d.innerRadius = d.__innerRadius__;
        })
      .select('path')
      .transition()
        .duration(100)
        .call(tweenArc, arc);
  }

  return chart;
}
