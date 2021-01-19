import functor from '../util/functor';
import sanitize from '../util/sanitize';


/**
 * d2b.chartPieAdvanced(chart, datum) configures the input chart and formats a returned datum set
 */
export default function (chart, datum) {
  const legendConfig = datum.legend || {};
  const tooltipConfig = datum.tooltip || {};

  // Chart Config
  chart
    .label(d => sanitize(d.label))
    .value(d => d.value)
    .duration.conditionally(datum.duration)
    .donutRatio.conditionally(datum.donutRatio)
    .radius.conditionally(datum.radius, (d, w, h) => datum.radius(w, h))
    .at.conditionally(datum.at, (d, w, h, r) => functor(datum.at)(w, h, r))
    .color.proxy(d => d.color || functor(datum.color)(d))
    .values.proxy(d => Array.isArray(d.values) ? d.values : undefined);

  // Chart Frame Config
  chart.chartFrame()
    .size.conditionally(datum.size)
    .chartPadding.conditionally(datum.chartPadding)
    .padding.conditionally(datum.padding)
    .legendEnabled.conditionally(legendConfig.enabled)
    .legendOrient.conditionally(legendConfig.orient);

  // Legend Config
  chart.legend()
    .vertical.conditionally(legendConfig.orient, ['right', 'left'].includes(legendConfig.orient))
    .clickable.conditionally(legendConfig.clickable)
    .dblclickable.conditionally(legendConfig.dblclickable)
    .allowEmptied.conditionally(legendConfig.allowEmptied)
    .icon.proxy(d => d.legendIcon || functor(legendConfig.icon)(d));

  // Tooltip Config
  // const percentFormat = format('.0%');
  chart.tooltip()
    .followMouse.conditionally(tooltipConfig.followMouse)
    .my.conditionally(tooltipConfig.my)
    .at.conditionally(tooltipConfig.at)
    .html.proxy(d => {
      const data = d.data;
      const percent = d.__percent__;
      if (data.tooltip !== undefined) {
        return data.tooltip;
      } else if (tooltipConfig.html !== undefined) {
        return functor(tooltipConfig.html)(data, percent);
      }
    });
  
  // Pie Config
  const pie = chart.pie();

  // D3 Arc Config
  const d3Arc = pie.arc();
  if (datum.cornerRadius !== undefined) d3Arc.cornerRadius(datum.cornerRadius, 0);
  
  // D3 Pie Config
  const d3Pie = pie.pie();
  if (datum.startAngle !== undefined) d3Pie.startAngle(datum.startAngle);
  if (datum.endAngle !== undefined) d3Pie.endAngle(datum.endAngle);
  if (datum.padAngle !== undefined) d3Pie.padAngle(datum.padAngle);
  if (datum.sort !== undefined) d3Pie.sort(datum.sort === null ? null : (a, b) => datum.slice(0).sort(a.data, b.data));

  return datum;
}
