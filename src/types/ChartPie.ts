import { SymbolType } from 'd3'
import { Padding, OrientCorner, Orient } from './General'

/**
 * Pie chart value config interface.
 */
export interface ChartPieValueConfig {
  /**
   * Arc color, if set, this will override the pie's arc color accessor.
   */
  color?: string

  /**
   * Arc tooltip content, if set, this will override the pie's arc tooltip accessor.
   * Use null to disable the tooltip for this arc.
   */
  tooltip?: string | null

  /**
   * Initial arc visibility state, this will be modified internally by the pie chart.
   */
  empty?: boolean

  /**
   * Legend icon symbol type. This can either be a font awesome character code
   * (e.g. '\uf111' for a circle), [d3 symbol](https://github.com/d3/d3-shape#symbols)
   * or [d2b symbol](https://docs.d2bjs.org/shape/symbols.html). If set, this will
   * override the legend's icon property.
   */
  legendIcon?: string | SymbolType

  /**
   * Additional attributes can be added to the pie value for reference.
   */
  [key: string]: any
}

/**
 * Pie chart value interface (extends all config properties).
 */
export interface ChartPieValueData extends ChartPieValueConfig {
  /**
   * Pie arc label.
   */
  label: string

  /**
   * Pie arc value.
   */
  value: number
}


/**
 * Pie chart config interface.
 */
export interface ChartPieConfig {
  /**
   * Array of pie values (arcs).
   */
  values?: Array<ChartPieValueConfig>

  /**
   * Event hook for d2b charts. Will be after the chart is rendered.
   * Note: Transitions may still occur after this lifecycle hook fires.
   */
  updated?: (this: HTMLElement, data: ChartPieData) => void

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
   * Pie chart start angle in radians.
   * @default 0
   */
  startAngle?: number

  /**
   * Pie chart end angle in radians.
   * @default 2 * Math.PI
   */
  endAngle?: number

  /**
   * Pie chart angle padding in radians.
   * @default 0
   */
  padAngle?: number

  /**
   * Corner radius of pie arcs in pixels.
   * @default 0
   */
  cornerRadius?: number

  /**
   * Pie arc color accessor function.
   * @default d => colorGenerator(d.label)
   */
  color?: string | ((data: ChartPieValueData) => string)

  /**
   * Pie arc sort comparator. Use null to order arcs according to the values array.
   * @default null
   */
  sort?: null | ((a: ChartPieValueData, b: ChartPieValueData) => number)

  /**
   * Ratio of the pie's inner radius to outer radius. Given as a decimal between 0 and 1.
   * @default 0
   */
  donutRatio?: number

  /**
   * Pie chart outer radius computator. Usually relative to the container height and width.
   * @default (width, height) => Math.min(width, height) / 2
   */
  radius?: (width: number, height: number) => number

  /**
   * This specifies where the pie chart will reside within the chart frame.
   * It can either be specified as a location descriptor or a center
   * position computator.
   * @default (width, height, radius) => { return { x: width / 2, y: height / 2 } }
   */
  at?: OrientCorner | ((width: number, height: number, radius: number) => number)

  /**
   * The chart's inner padding (excluding the legend) in pixels.
   * @default 10
   */
  chartPadding?: number | Padding

  /**
   * The chart's outer padding (including the legend) in pixels.
   * @default 10
   */
  padding?: number | Padding

  /**
   * Chart legend configuration options.
   */
  legend?: {
    /**
     * Enable or disable the legend.
     * @default true
     */
    enabled?: boolean

    /**
     * Legend orientation, relative to the chart.
     * @default 'bottom'
     */
    orient?: Orient

    /**
     * Whether the legend will hide / show arcs on click.
     * @default true
     */
    clickable?: boolean

    /**
     * Whether the legend will hide / show arcs on dblclick.
     * @default true
     */
    dblclickable?: boolean

    /**
     * Legend icon symbol type. This can either be a font awesome character code
     * (e.g. '\uf111' for a circle), [d3 symbol](https://github.com/d3/d3-shape#symbols)
     * or [d2b symbol](https://docs.d2bjs.org/shape/symbols.html). This can also be provided
     * as an accessor to the pie value.
     * @default d3.symbolCircle
     */
    icon?: string | SymbolType | ((data: ChartPieValueData) => string | SymbolType)
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
     * @default (d, percent) => `<b>${d.label}</b>: ${d.value} (${d3.format('.0%')(percent)})`
     */
    html?: null | string | ((data: ChartPieValueData, value: number, percent: number) => string | null)
  }
}

/**
 * Pie chart data interface (extends all config properties).
 */
export interface ChartPieData extends ChartPieConfig {
  /**
   * Array of pie values.
   */
  values: Array<ChartPieValueData>
}