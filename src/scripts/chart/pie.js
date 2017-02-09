import * as d3 from 'd3';

import {default as base} from '../model/base.js';
import {default as chartFrame} from '../util/chartFrame.js';
import {default as legend} from '../util/legend.js';
import {default as tooltip} from '../util/tooltip.js';
import {default as tweenArc} from '../util/tweenArc.js';
import {default as tweenCentroid} from '../util/tweenCentroid.js';
import {default as tweenNumber} from '../util/tweenNumber.js';
import {default as svgPie} from '../svg/pie.js';
import {default as color} from '../util/color.js';

/**
 * d2b.chartPie() returns a d2b
 * pie chart generator
 */
export default function () {

  const $$ = {};

  const chart = function (context) {
    context.call($$.chartFrame);

    const selection = (context.selection)? context.selection() : context;

    selection.each(function (datum) {
      update.call(this, datum, context !== selection ? context : null);
    });

    return chart;
  };

  // pie data layout
  const layout = d3.pie().sort(null);

  // arc generator
  const arc = d3.arc()
			.outerRadius(d => d.outerRadius)
			.innerRadius(d => d.innerRadius);

	// d2b pie generator
  const pie = svgPie().arc(arc);

	// percent formater
  const percent = d3.format('.0%');

	// configure model properties
  base(chart, $$)
    .addProp('chartFrame', chartFrame().legendEnabled(true).breadcrumbsEnabled(false))
    .addProp('legend', legend().clickable(true).dblclickable(true))
    .addProp('key', d => d.label, null, d => {
      $$.legend.key(d);
      pie.key(d);
    })
    .addProp('tooltip',
      tooltip()
        .followMouse(true)
        .html(d => `<b>${$$.label(d.data)}</b>: ${$$.value(d.data)} (${percent(d.__percent__)})`)
    )
    .addPropFunctor('duration', 250)
    .addPropFunctor('values', d => d)
    .addPropFunctor('donutRatio', 0)
    .addPropFunctor('startAngle', 0)
    .addPropFunctor('endAngle', 2 * Math.PI)
    .addPropFunctor('at', 'center center')
    .addPropFunctor('showPercent', (d, total) => $$.value(d) / total > 0.03)
    .addPropFunctor('center', null)
    .addPropFunctor('radius', (d, w, h) => Math.min(w, h) / 2)
    .addPropFunctor('sort', null)
    .addPropFunctor('color', d => color(d.label), null, (d) => {
      $$.tooltip.color(dd => d3.rgb(d(dd.data)).darker(0.3));
      $$.legend.color(d);
      pie.color(d);
    })
    .addPropFunctor('value', d => d.value, null, d => layout.value(d))
    .addPropFunctor('label', d => d.label);

	// update chart
  function update (datum, transition) {
    const el = d3.select(this),
          selection = el.select('.d2b-chart-container'),
          size = selection.node().__size__,
          radius = $$.radius(datum, size.width, size.height),
          startAngle = $$.startAngle(datum),
          endAngle = $$.endAngle(datum),
          donutRatio = $$.donutRatio(datum),
          legendEmpty = $$.legend.empty(),
          values = $$.values(datum).filter(d => !legendEmpty(d));

    $$.legend.html($$.label);

		// legend functionality
    el
      .select('.d2b-legend-container')
        .call($$.legend)
        .on('change', () => el.transition($$.duration(datum)).call(chart))
      .selectAll('.d2b-legend-item')
        .on('mouseover', function (d) { arcGrow.call(this, el, d); })
        .on('mouseout', function (d) { arcShrink.call(this, el, d); });

		// Filter and sort for current data.
		// const total = d3.sum(values, (d, i) => d.__value__ = $$.value(d, i));
    const total = d3.sum(values, d => $$.value(d));

		// Select and enter pie chart 'g' element.
    let chartGroup = selection.selectAll('.d2b-pie-chart').data([values]);
    const chartGroupEnter = chartGroup.enter()
			.append('g')
				.attr('class', 'd2b-pie-chart');

    const getDatum = d => {
      d = layout.startAngle(startAngle).endAngle(endAngle)(d);
      d.forEach(dd => {
        dd.outerRadius = radius;
        dd.innerRadius = radius * donutRatio;
      });
      return d;
    };

    chartGroup = chartGroup.merge(chartGroupEnter).datum(getDatum);

    if (transition) chartGroup = chartGroup.transition(transition);

    chartGroup.call(pie);

		// For each arc in the pie chart assert the transitioning flag and store
		// the element node in data. Also setup hover and tooltip events;
    let arcGroup = selection
			.selectAll('.d2b-pie-arc')
        .each(function (d) {
          this.__outerRadius__ = d.outerRadius;
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
				.call(tweenCentroid, arc)
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
  // 'top center', ..). Unless a `$$.center` function is specified by the user
  // to return the {x: , y:} coordinates of the pie chart center.
  function chartCoords (datum, radius, size) {
    let coords = $$.center(datum, size.width, size.height, radius),
        at = $$.at(datum, size.width, size.height).split(' ');

    if (!coords) {
      at = {x: at[1], y: at[0]};
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
    if (this.transitioning) return;
    el.selectAll('.d2b-pie-arc')
      .filter(dd => dd.data === d)
        .each(function (dd) { dd.outerRadius = this.__outerRadius__ * 1.03; })
      .select('path')
      .transition()
        .duration(100)
        .call(tweenArc, arc);
  }

  function arcShrink (el, d) {
    if (this.transitioning) return;
    el.selectAll('.d2b-pie-arc')
      .filter(dd => dd.data === d)
        .each(function (dd) { dd.outerRadius = this.__outerRadius__; })
      .select('path')
      .transition()
        .duration(100)
        .call(tweenArc, arc);
  }

  return chart;
}
