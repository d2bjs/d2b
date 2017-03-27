import * as d3 from 'd3';

import {default as base} from '../model/base.js';
import {default as chartFrame} from '../util/chartFrame.js';
import {default as tooltip} from '../util/tooltip.js';
import {default as breadcrumbs} from '../util/breadcrumbs.js';
import {default as svgSunburst} from '../svg/sunburst.js';
import {default as color} from '../util/color.js';

/**
 * d2b.chartSunburst() returns a d2b
 * sunburst chart generator
 */
export default function () {

  const $$ = {};

  // chart updater
  const chart = function (context) {
    context.call($$.chartFrame);

    // configure sunburst
    $$.sunburst.color($$.color);
    // configure breadcrumbs
    $$.breadcrumbs.color($$.color).key((d, i) => i);
    // configure tooltip
    $$.tooltip.color($$.color);

    const selection = (context.selection)? context.selection() : context;

    selection.each(function (datum) {
      update.call(this, datum, context !== selection ? context : null);
    });

    return chart;
  };

	// configure chart properties
  base(chart, $$)
		.addProp('chartFrame', chartFrame().legendEnabled(false).breadcrumbsEnabled(true))
		.addProp('sunburst', svgSunburst())
    .addProp('breadcrumbs', breadcrumbs().html(d => `<div class = 'd2b-sunburst-breadcrumb'>${tipTemplate(d)}</div>`))
		.addProp('tooltip', tooltip().followMouse(true).html(d => `<div class = 'd2b-sunburst-tooltip'>${tipTemplate(d)}</div>`))
    .addPropFunctor('color', d => color(d.label))
		.addPropFunctor('outerRadius', (d, w, h) => Math.min(w, h) / 2)
		.addPropFunctor('innerRadius', (d, w, h) => Math.min(50, Math.min(w, h) / 4));

  // helpers
  const format = d3.format(',.0f'),
        formatPercent = d3.format('.1%');

  const tipTemplate = function (d) {
    const percent = d.value / d.selected.value;
    const percentText = percent > 1 ?
      '' :
      `<div class = 'd2b-sunburst-percent'>
        ${formatPercent(d.value / d.selected.value)}
      </div>`;

    return `
      <div class = 'd2b-sunburst-label'>
        ${d.label}
      </div>
      <div class = 'd2b-sunburst-value'>
        ${format(d.value)}
        ${percentText}
      </div>
    `;
  };

  // update breadcrumbs
  function setBreadcrumbs (el, data) {
    el.select('.d2b-breadcrumbs-container')
        .datum(data)
      .transition('sunburst-breadcrumbs')
        .duration(100)
        .call($$.breadcrumbs);
  }

  // define mouseover and click events
  function defineEvents (el) {
    const sunburstChart = el.select('.d2b-sunburst-chart'),
          root = el.selectAll('.d2b-sunburst-arc.d2b-sunburst-level-0').datum(),
          selected = root.selected;

    setBreadcrumbs(el, [selected]);
    sunburstChart.selectAll('.d2b-sunburst-arc')
				.call($$.tooltip.clear)
				.call($$.tooltip)
        .on('mouseover.breadcrumbs', function (d) {
          let ancestors = d.ancestors();
          ancestors = ancestors.slice(0, ancestors. indexOf(selected) + 1);
          setBreadcrumbs(el, ancestors.reverse());
        })
				.on('mouseout.breadcrumbs', () => setBreadcrumbs(el, [selected]));

    sunburstChart
			.on('mouseout', () => defineEvents (el))
			.on('click', () => defineEvents (el));
  }

  // update sunburst
  function update (datum, transition) {
    const el = d3.select(this),
          selection = el.select('.d2b-chart-container'),
          size = selection.node().__size__,
          transform = `translate(${size.width / 2}, ${size.height / 2})`;

    let sunburstChart = selection.selectAll('.d2b-sunburst-chart').data(d => [d]),
        sunburstChartEnter = sunburstChart.enter()
          .append('g')
            .attr('transform', transform)
            .attr('class', 'd2b-sunburst-chart');

    sunburstChart = sunburstChart.merge(sunburstChartEnter);

    if (transition) {
      sunburstChart = sunburstChart.transition(transition);
    }

    $$.sunburst
      .outerRadius($$.outerRadius(datum, size.width, size.height))
      .innerRadius($$.innerRadius(datum, size.width, size.height));

    sunburstChart
      .attr('transform', transform)
      .call($$.sunburst);

    defineEvents(el);
  }

  return chart;
}
