import { Padding, Orient, OrientCorner } from './General'

/**
 * Sunburst node config interface.
 */
export interface ChartSunburstNodeConfig {
  /**
   * Arc color, if set, this will override the sunburst's arc color accessor.
   */
  color?: string

  /**
   * Arc tooltip content, if set, this will override the sunburst's tooltip accessor.
   * Use null to disable the tooltip for this arc.
   */
  tooltip?: string | null

  /**
   * Arc breadcrumb content, if set, this will override the sunburst's breadcrumb accessor.
   * Use null to disable the breadcrumb for this arc.
   */
  breadcrumb?: string | null

  /**
   * Initial arc zoom state, Only one arc may be selected at a time.
   * @default false
   */
  selected?: boolean

  /**
   * Additional attributes can be added to the sunburst node for reference.
   */
  [key: string]: any
}

/**
 * Sunburst node data interface (extends all config properties).
 */
export interface ChartSunburstNodeSharedData extends ChartSunburstNodeConfig {
  /**
   * Sunburst node label.
   */
  label: string
}

/**
 * Sunburst leaf-node data interface (extends all node data).
 */
export interface ChartSunburstLeafNodeData extends ChartSunburstNodeSharedData {
  /**
   * Sunburst node size.
   */
  size: number
}

/**
 * Sunburst parent-node data interface (extends all node data).
 */
export interface ChartSunburstParentNodeData extends ChartSunburstNodeSharedData {
  /**
   * Sunburst node children.
   */
  children: Array<ChartSunburstParentNodeData | ChartSunburstLeafNodeData>

  /**
   * Sunburst node size. If a parent has a node size, it will override the automatic leaf
   * node size aggrigate function. This is useful to oversize a parent node to indicate it
   * is not completely resolved by it's children.
   */
  size?: number
}

export type ChartSunburstNodeData = ChartSunburstParentNodeData | ChartSunburstLeafNodeData

/**
 * Sunburst chart config interface.
 */
export interface ChartSunburstConfig {
  /**
   * The sunburst root node config.
   */
  root?: ChartSunburstNodeConfig

  /**
   * Event hook for d2b charts. Will be after the chart is rendered.
   * Note: Transitions may still occur after this lifecycle hook fires.
   */
  updated?: (this: HTMLElement, data: ChartSunburstNodeData) => void

  /**
   * The pixel size of the chart.
   */
  size?: {
    /**
     * The pixel width of the chart. If not given, the container width will be used.
     */
    width?: number,

    /**
     * The pixel height of the chart. If not given, the container height will be used.
     */
    height?: number
  }

  /**
   * The internal chart duration in miliseconds.
   * @default 250
   */
  duration?: number

  /**
   * Sunburst chart start angle in radians.
   * @default 0
   */
  startAngle?: number

  /**
   * Sunburst chart end angle in radians.
   * @default 2 * Math.PI
   */
  endAngle?: number

  /**
   * Sunburst chart angle padding in radians.
   * @default 0
   */
  padAngle?: number

  /**
   * Corner radius of sunburst arcs in pixels.
   * @default 0
   */
  cornerRadius?: number

  /**
   * Sunburst arc color accessor function.
   * @default d => colorGenerator(d.label)
   */
  color?: string | ((data: ChartSunburstNodeData) => string)

  /**
   * Sunburst arc sort comparator. Use null to order arcs according to the children array.
   * @default null
   */
  sort?: null | ((a: ChartSunburstNodeData, b: ChartSunburstNodeData) => number)

  /**
   * The chart's inner padding (excluding the breadcrumbs) in pixels.
   * @default 10
   */
  chartPadding?: number | Padding

  /**
   * The chart's outer padding (including the breadcrumbs) in pixels.
   * @default 10
   */
  padding?: number | Padding

  /**
   * Defines the pixel distance between the ancestor (inner) and descendant (outer) bands.
   * @default 10
   */
  ancestorPadding?: number

  /**
   * The maximum number of descendant (outer) bands to show at a time. Deeper bands will be drawn when zooming.
   * @default Infinity
   */
  descendantLevels?: number

  /**
   * Enable or disable the sunburst labels.
   * @default false
   */
  showLabels?: boolean

  /**
   * Enable or disable the sunburst click to zoom.
   * @default true
   */
  zoomable?: boolean

  /**
   * Enable or disable the sunburst hover to highlight.
   * @default true
   */
  highlight?: boolean

  /**
   * Ancestor (inner) band sizing exponent. An exponent of 1 will make the bands equal size.
   * @default 1
   */
  ancestorBandingExponent?: number

  /**
   * Descendant (outer) band sizing exponent. An exponent of 1 will make the bands equal size.
   * @default 1
   */
  descendantBandingExponent?: number

  /**
   * The pixel inner radius of the sunburst chart. Usually relative to the width / height of the container.
   * @default (width, height) => Math.min(width, height) / 2
   */
  innerRadius?: number | ((width: number, height: number) => number)

  /**
   * The pixel outer radius of the sunburst chart. Usually relative to the width / height of the container.
   * @default (width, height) => Math.min(50, Math.min(width, height) / 4)
   */
  outerRadius?: number | ((width: number, height: number) => number)

  /**
   * Chart breadcrumbs configuration options.
   */
  breadcrumbs?: {
    /**
     * Enable or disable the breadcrumbs.
     * @default true
     */
    enabled?: boolean

    /**
     * Breadcrumbs orientation, relative to the chart.
     * @default 'right'
     */
    orient?: Orient

    /**
     * Html content to be displayed in the arc's breadcrumb. A null value will disable the arc's breadcrumb.
     * @default function (data, value, percent) {
     *   return `
     *     <div class = 'd2b-sunburst-breadcrumb'>
     *       <div class = 'd2b-sunburst-label'>
     *         ${data.label}
     *       </div>
     *       <div class = 'd2b-sunburst-value'>
     *         ${value}
     *         ${percent > 1 ? '' : `<div class = 'd2b-sunburst-percent'> ${d3.format('.0%')(percent)} </div>`}
     *       </div>
     *     </div>
     *   `
     * }
     */
    html?: null | string | ((data: ChartSunburstNodeData, value: number, percent: number) => string | null)
  }

  /**
   * Chart tooltip configuration options.
   */
  tooltip?: {
    /**
     * Tooltip will follow the mouse instead of being placed in a static position 
     * relative to the hovered element.
     * @default true
     */
    followMouse?: boolean

    /**
     * Orientation of the tooltip. By default, this will alternate between 'left' and
     * 'right' depending on the position of the cursor relative to the viewport.
     */
    my?: Orient

    /**
     * This specifies where the tooltip will be positioned relative to the hovered
     * item. By default, this will alternate between 'center left' and 'center right'
     * depending on the position of the cursor relative to the viewport.
     */
    at?: OrientCorner
    
    /**
     * Html content to be displayed in the arc's tooltip. A null value will disable the arc's tooltip.
     * @default function (data, value, percent) {
     *   return `
     *     <div class = 'd2b-sunburst-tooltip'>
     *       <div class = 'd2b-sunburst-label'>
     *         ${data.label}
     *       </div>
     *       <div class = 'd2b-sunburst-value'>
     *         ${value}
     *         ${percent > 1 ? '' : `<div class = 'd2b-sunburst-percent'> ${d3.format('.0%')(percent)} </div>`}
     *       </div>
     *     </div>
     *   `
     * }
     */
    html?: null | string | ((data: ChartSunburstNodeData, value: number, percent: number) => string | null)
  }
}

/**
 * Sunburst chart data interface (extends all config properties).
 */
export interface ChartSunburstData extends ChartSunburstConfig {
  /**
   * The sunburst root node data.
   */
  root: ChartSunburstNodeData
}