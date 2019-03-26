import functor from '../util/functor';
import { scalePow } from 'd3';

/**
 * d2b.chartSankeyAdvanced(chart, datum) configures the input chart and formats a returned datum set
 */
export default function (chart, datum) {
  const breadcrumbsConfig = datum.breadcrumbs || {};
  const tooltipConfig = datum.tooltip || {};

  // Chart Config
  chart
    .label(d => d.label)
    .outerRadius.conditionally(datum.outerRadius, (d, w, h) => functor(datum.outerRadius)(w, h))
    .innerRadius.conditionally(datum.innerRadius, (d, w, h) => functor(datum.innerRadius)(w, h))
    .color.proxy(d => d.color || functor(datum.color)(d));

  // Chart Frame Config
  chart.chartFrame()
    .size.conditionally(datum.size)
    .padding.conditionally(datum.padding)
    .chartPadding.conditionally(datum.chartPadding)
    .breadcrumbsEnabled.conditionally(breadcrumbsConfig.enabled)
    .breadcrumbsOrient.conditionally(breadcrumbsConfig.orient);

  // Breadcrumbs Config
  chart.breadcrumbs()
    .html.proxy(d => {
      const data = d.data;
      const value = d.value;
      const percent = d.value / d.selected.value;
      if (data.breadcrumb !== undefined) {
        return data.breadcrumb;
      } else if (breadcrumbsConfig.html !== undefined) {
        return functor(breadcrumbsConfig.html)(data, value, percent);
      }
    });

  // Tooltip Config
  chart.tooltip()
    .followMouse.conditionally(tooltipConfig.followMouse)
    .my.conditionally(tooltipConfig.my)
    .at.conditionally(tooltipConfig.at)
    .html.proxy(d => {
      const data = d.data;
      const value = d.value;
      const percent = d.value / d.selected.value;
      if (data.tooltip !== undefined) {
        return data.tooltip;
      } else if (tooltipConfig.html !== undefined) {
        return functor(tooltipConfig.html)(data, value, percent);
      }
    });

  // Sunburst Config
  const sunburst = chart.sunburst()
    .root(d => d.root)
    .size(d => d.size)
    .duration.conditionally(datum.duration)
    .ancestorPadding.conditionally(datum.ancestorPadding)
    .ancestorRatio.conditionally(datum.ancestorRatio)
    .descendantLevels.conditionally(datum.descendantLevels)
    .startAngle.conditionally(datum.startAngle)
    .endAngle.conditionally(datum.endAngle)
    .showLabels.conditionally(datum.showLabels)
    .zoomable.conditionally(datum.zoomable)
    .highlight.conditionally(datum.highlight)
    .ancestorBanding.conditionally(datum.ancestorBandingExponent, scalePow().exponent(datum.ancestorBandingExponent))
    .descendantBanding.conditionally(datum.descendantBandingExponent, scalePow().exponent(datum.descendantBandingExponent));

  // D3 Pie Config
  const d3Pie = sunburst.pie();
  if (datum.padAngle !== undefined) d3Pie.padAngle(datum.padAngle);
  if (datum.sort !== undefined) d3Pie.sort(datum.sort === null ? null : (a, b) => datum.sort(a.data, b.data));

  // D3 Arc Config
  const d3Arc = sunburst.arc();
  if (datum.cornerRadius !== undefined) d3Arc.cornerRadius(datum.cornerRadius, 0);

  return datum;
}
