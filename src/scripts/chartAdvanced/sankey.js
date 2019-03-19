import functor from '../util/functor';

import { sankeyLeft, sankeyRight, sankeyCenter, sankeyJustify } from 'd3-sankey';

/**
 * d2b.chartSankeyAdvanced(chart, datum) configures the input chart and formats a returned datum set
 */
export default function (chart, datum) {
  const nodeConfig = datum.node || {};
  const linkConfig = datum.link || {};
  const nodeTooltipConfig = nodeConfig.tooltip || {};
  const linkTooltipConfig = linkConfig.tooltip || {};

  // Chart Frame Config
  chart.chartFrame()
    .chartPadding(0)
    .size.conditionally(datum.size)
    .padding.conditionally(datum.padding);

  // Node Tooltip Config
  chart.nodeTooltip()
    .followMouse.conditionally(nodeTooltipConfig.followMouse)
    .my.conditionally(nodeTooltipConfig.my)
    .at.conditionally(nodeTooltipConfig.at)
    .html.proxy(d => {
      const data = d.data;
      const value = d.value;
      if (data.tooltip !== undefined) {
        return data.tooltip;
      } else if (nodeTooltipConfig.html !== undefined) {
        return functor(nodeTooltipConfig.html)(data, value);
      }
    });

  // Link Tooltip Config
  chart.linkTooltip()
    .followMouse.conditionally(linkTooltipConfig.followMouse)
    .my.conditionally(linkTooltipConfig.my)
    .at.conditionally(linkTooltipConfig.at)
    .html.proxy(d => {
      const data = d.data;
      const source = d.source.data;
      const target = d.target.data;
      if (data.tooltip !== undefined) {
        return data.tooltip;
      } else if (linkTooltipConfig.html !== undefined) {
        return functor(linkTooltipConfig.html)(data, source, target);
      }
    });
  
  // Sankey Config
  const sankey = chart.sankey()
    .nodeLabel(d => d.name)
    .linkValue(d => d.value)
    .nodeLabelWrapLength.conditionally(nodeConfig.labelWrapLength)
    .nodeDraggableX.conditionally(nodeConfig.draggableX)
    .nodeDraggableY.conditionally(nodeConfig.draggableY)
    .nodeColor.proxy((d, i, k) => d.color || (nodeConfig.color ? nodeConfig.color(d, k) : undefined))
    .linkSourceColor.proxy((d, i, s) => d.sourceColor || (linkConfig.sourceColor ? linkConfig.sourceColor(d, s) : undefined))
    .linkTargetColor.proxy((d, i, t) => d.targetColor || (linkConfig.targetColor ? linkConfig.targetColor(d, t) : undefined));

  // D3 Sankey Config
  const d3Sankey = sankey.sankey();
  if (nodeConfig.align !== undefined) {
    let nodeAlign = typeof nodeConfig.align === 'function' ? nodeConfig.align : sankeyJustify;
    switch (nodeConfig.align) {
      case 'left':
        nodeAlign = sankeyLeft;
        break;
      case 'right':
        nodeAlign = sankeyRight;
        break;
      case 'center':
        nodeAlign = sankeyCenter;
        break;
    }
    d3Sankey.nodeAlign(nodeAlign);
  }
  if (datum.iterations !== undefined) d3Sankey.iterations(datum.iterations);
  if (nodeConfig.padding !== undefined) d3Sankey.nodePadding(nodeConfig.padding);
  if (nodeConfig.sort !== undefined) d3Sankey.nodeSort(nodeConfig.sort === null ? null : (a, b) => nodeConfig.sort(a.data, b.data));

  return datum;
}
