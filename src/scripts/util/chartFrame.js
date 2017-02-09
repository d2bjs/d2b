import * as d3 from 'd3';

import {default as base} from '../model/base.js';

export default function () {

  // Padding can either be a constant or an object containing any of the
  // attributes (left, right, top, bottom). cleanPadding returns an object
  // with (left, right, top, bottom) attributes.
  function cleanPadding (pad) {
    const padding = {top: 0, left: 0, right: 0, bottom: 0};
    if (typeof(pad) === 'number') return {top: pad, left: pad, right: pad, bottom: pad};
    ['top', 'bottm', 'right', 'left'].forEach( d => {
      if (pad[d]) padding[d] == pad[d];
    });
    return padding;
  }

  // Size can contain width or height attibutes. If either are unset the
  // size is derived from the bounding client rectangle.
  function cleanSize (s, box) {
    return {
      width: (s && s.width > 0) ? s.width : box.width,
      height: (s && s.height > 0) ? s.height : box.height
    };
  }

  const $$ = {};

  const chartFrame = function (context) {
    const selection = context.selection? context.selection() : context;

    let frame = selection.selectAll('.d2b-chart-frame').data(d => [d]),
        frameEnter = frame.enter()
          .append('div')
            .attr('class', 'd2b-chart-frame');

    frame = frame.merge(frameEnter);

    selection.each(function (d) {
      let frame = d3.select(this).select('.d2b-chart-frame'),
          frameUpdate = frame,
          padding = cleanPadding($$.padding(d)),
          chartPadding = cleanPadding($$.chartPadding(d)),
          size = cleanSize($$.size(d), this.getBoundingClientRect());

      enterUpdate(frame, frameUpdate, d => {
        d
            .style('width', size.width + 'px')
            .style('height', size.height + 'px');
      });

      size.width -= padding.left + padding.right;
      size.height -= padding.top + padding.bottom;

      const legendDatum = $$.legendEnabled(d) ? [d] : [];

      let legend = frame.selectAll('.d2b-legend-frame').data(legendDatum),
          legendEnter = legend.enter()
            .append('div')
              .attr('class', 'd2b-legend-frame'),
          legendExit = legend.exit();

      legendExit.remove();

      legendEnter.append('div').attr('class', 'd2b-legend-container');

      legend = legend.merge(legendEnter);

      let legendUpdate = legend;

      const breadcrumbsDatum = $$.breadcrumbsEnabled(d) ? [d] : [];

      let breadcrumbs = frame.selectAll('.d2b-breadcrumbs-frame').data(breadcrumbsDatum),
          breadcrumbsEnter = breadcrumbs.enter()
            .append('div')
              .attr('class', 'd2b-breadcrumbs-frame'),
          breadcrumbsExit = breadcrumbs.exit();

      breadcrumbsExit.remove();

      breadcrumbsEnter.append('div').attr('class', 'd2b-breadcrumbs-container');

      breadcrumbs = breadcrumbs.merge(breadcrumbsEnter);

      let breadcrumbsUpdate = breadcrumbs;

      let chart = frame.selectAll('.d2b-chart').data(d => [d]),
          chartEnter = chart.enter()
            .append('svg')
              .attr('class', 'd2b-chart');

      chartEnter.append('g').attr('class', 'd2b-chart-container');

      chart = chart.merge(chartEnter);

      let chartUpdate = chart;

      if (context !== selection) {
        frameUpdate = frameUpdate.transition(context);
        legendUpdate = legendUpdate.transition(context);
        breadcrumbsUpdate = breadcrumbsUpdate.transition(context);
        chartUpdate = chartUpdate.transition(context);
      }

      placeComponent(breadcrumbs, breadcrumbsEnter, breadcrumbsUpdate, $$.breadcrumbsOrient(d), padding, size);
      placeComponent(legend, legendEnter, legendUpdate, $$.legendOrient(d), padding, size);

      enterUpdate(chartEnter, chartUpdate, d => {
        d
            .style('left', padding.left + 'px')
            .style('top', padding.top + 'px')
            .style('width', size.width + 'px')
            .style('height', size.height + 'px');

        d.select('.d2b-chart-container')
            .attr('transform', 'translate('+[chartPadding.left, chartPadding.top]+')');
      });

      size.width -= chartPadding.left + chartPadding.right;
      size.height -= chartPadding.top + chartPadding.bottom;

      // Store the chart size on the node so that the chart itself can get the
      // true size instead of the transitioning size.
      chart.select('.d2b-chart-container').node().__size__ = size;

    });

    return chartFrame;
  };

  function enterUpdate(enter, update, fn) {
    fn(enter);
    fn(update);
  }

  function placeComponent(el, enter, update, orient, padding, size) {
    let node = el.node();
    if (node) {
      update
          .style('top', '')
          .style('left', '')
          .style('right', '')
          .style('bottom', '')
          .style('width', '')
          .style('height', '');

      let box;

      if (orient === 'right' || orient === 'left') {
        el.classed('d2b-vertical', true);
        box = node.getBoundingClientRect();

        enterUpdate(enter, update, d => {
          d
              .style(orient, padding[orient] + 'px')
              .style('top', padding.top + 'px')
              .style('height', size.height + 'px');
        });

        padding[orient] += box.width;
        size.width -= box.width;
      } else if (orient === 'top' || orient === 'bottom') {
        el.classed('d2b-vertical', false);
        box = node.getBoundingClientRect();


        enterUpdate(enter, update, d => {
          d
              .style(orient, padding[orient] + 'px')
              .style('left', padding.left + 'px')
              .style('width', size.width + 'px');
        });

        padding[orient] += box.height;
        size.height -= box.height;
      } else {
        el.classed('d2b-vertical', false);
      }
    }
  }

  /* Inherit from base model */
  base(chartFrame, $$)
      .addPropFunctor('size', null)
      .addPropFunctor('legendEnabled', true)
      .addPropFunctor('legendOrient', 'bottom')
      .addPropFunctor('breadcrumbsEnabled', false)
      .addPropFunctor('breadcrumbsOrient', 'right')
      .addPropFunctor('chartPadding', 10)
      .addPropFunctor('padding', 10);

  return chartFrame;
}
