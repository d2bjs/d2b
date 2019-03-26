import { ChartAxisGeneralSetConfig, ChartAxisBoxPlotSetConfig, ChartAxisBubblePackSetConfig, ChartAxisGeneralSetData, ChartAxisBoxPlotSetData, ChartAxisBubblePackSetData } from "./ChartAxisSets"
import { Padding, Orient } from "./General"
import { ChartAxisGraphData } from "./ChartAxisGraphs"
import { SymbolType, Axis, AxisScale, AxisTimeInterval } from "d3"
import { ChartAxisValueData } from "./ChartAxisValues"

/**
 * Axis chart graph annotation interface.
 */
interface Annotation {
  /**
   * Annotation x position.
   */
  x: number | string

  /**
   * Annotation y position.
   */
  y: number | string

  /**
   * Annotation x2 position.
   */
  x2?: number | string

  /**
   * Annotation y2 position.
   */
  y2?: number | string

  /**
   * Annotation z position.
   * @default 'front'
   */
  z?: 'front' | 'back'

  /**
   * Annotation x type.
   * @default 'x'
   */
  xType?: 'x' | 'x2'

  /**
   * Annotation y type.
   * @default 'y'
   */
  yType?: 'y' | 'y2'

  /**
   * Additional attributes can be added to the annotation for reference.
   */
  [key: string]: any
}

/**
 * Possible domain values type.
 */
type DomainValues = Array<string | number | Date>

/**
 * Axis chart, axis config interface.
 */
interface AxisConfig {
  /**
   * Specify a configured [d3-axis](https://github.com/d3/d3-axis). It's usually better to use the
   * following axis configuration properties instead of setting your own.
   */
  axis?: Axis<any>

  /**
   * Axis orientation inside or outside the plane.
   * @default 'outer'
   */
  orient?: 'inner' | 'outer'

  /**
   * Axis tick wrap length.
   * @default Infinity
   */
  wrapLength?: number

  /**
   * See d3-axis [tickSize](https://github.com/d3/d3-axis#axis_tickSize)
   * @default 6
   */
  tickSize?: number

  /**
   * Enable or disable the grid for this axis.
   * @default true
   */
  showGrid?: boolean

  /**
   * Sets a label for this axis.
   */
  label?: string

  /**
   * Axis label orientation.
   */
  labelOrient?: 'outer start' | 'outer middle' | 'outer end' | 'inner start' | 'inner middle' | 'inner end'

  /**
   * Pad both sides of the continuous scale by a percent of the domain range. For example [-0.1, 0.2] will
   * pad the minimum scale domain by 10% and the upper end by 20%.
   */
  linearPadding?: [number, number]

  /**
   * Pad tick labels from the plan for this axis. See d3-axis [tickPadding](https://github.com/d3/d3-axis#axis_tickPadding)
   * @default 3
   */
  tickPadding?: number

  /**
   * Specify the tick count or axis time interval for the axis. See d3-axis [ticks](https://github.com/d3/d3-axis#axis_ticks)
   */
  ticks?: AxisTimeInterval | number

  /**
   * Specify the tick format. See d3-axis [tickFormat](https://github.com/d3/d3-axis#axis_tickFormat)
   */
  tickFormat?: (n: number | { valueOf(): number }) => string

  /**
   * Specify the tick values instead of automatically generating them. See d3-axis [tickValues](https://github.com/d3/d3-axis#axis_tickValues)
   */
  tickValues?: Array<any>

  /**
   * Axis' scale config interface.
   */
  scale?: {
    /**
     * D3 scale instance or descriptor string.
     */  
    type?: 'band' | 'point' | 'linear' | 'time' | 'pow' | 'log' | AxisScale<any>

    /**
     * See [d3-scale](https://github.com/d3/d3-scale) for different scale type domains.
     */        
    domain?: DomainValues | ((values: DomainValues) => DomainValues)

    /**
     * See d3-scale [continuous clamp](https://github.com/d3/d3-scale#continuous_clamp)
     * @default false
     */
    clamp?: boolean

    /**
     * See d3-scale [continuous nice](https://github.com/d3/d3-scale#continuous_nice)
     * @default false
     */
    nice?: boolean

    /**
     * See d3-scale [power exponent](https://github.com/d3/d3-scale#pow_exponent)
     * @default 1
     */
    exponent?: number

    /**
     * See d3-scale [log base](https://github.com/d3/d3-scale#log_base)
     * @default 10
     */
    base?: number

    /**
     * See d3-scale [symlog constant](https://github.com/d3/d3-scale#symlog_constant)
     * @default 1
     */
    constant?: number

    /**
     * Force domain bounds for [continuous scales](https://github.com/d3/d3-scale#_continuous).
     * This is useful if you want the domain min OR max to be automatic but the other to be fixed.
     */
    forceBounds?: {
      /**
       * Force minimum domain bound for [continuous scales](https://github.com/d3/d3-scale#_continuous)
       */
      min?: number

      /**
       * Force maximum domain bound for [continuous scales](https://github.com/d3/d3-scale#_continuous)
       */
      max?: number
    }
  }
}

/**
 * Axis chart group config interface.
 */

export interface ChartAxisGroupConfig {
  /**
   * The group label, should match the corresponding graph's group property.
   */
  label: string

  /**
   * The group color property. By default this will defer to the graph color.
   */
  color?: string

  /**
   * Legend icon symbol type. This can either be a font awesome character code
   * (e.g. '\uf111' for a circle), [d3 symbol](https://github.com/d3/d3-shape#symbols)
   * or [d2b symbol](https://docs.d2bjs.org/shape/symbols.html). If set, this will
   * override the legend's icon property.
   */
  legendIcon?: string | SymbolType

  /**
   * Initially hides this group. This value will be modified internally when interacting with the chart legend.
   */
  hidden?: boolean
}

/**
 * Chart axis config interface.
 */
export interface ChartAxisConfig {
  /**
   * Chart annotations. Refer to the d3-annotation [docs](https://d3-annotation.susielu.com) for 
   * additional annotation configuration. 
   */
  annotations?: Array<Annotation>

  /**
   * Axis chart groups. Groups are used to group multiple graph's together on the legend.
   */
  groups?: Array<ChartAxisGroupConfig>

  /**
   * Event hook for d2b charts. Will be after the chart is rendered.
   * Note: Transitions may still occur after this lifecycle hook fires.
   */
  updated?: (this: HTMLElement, data: ChartAxisData) => void

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
   * Chart axis group color or accessor function.
   * @default d => colorGenerator(d.label)
   */
  groupColor?: string | ((data: ChartAxisGraphData) => string)

  /**
   * Chart axis graph color or accessor function.
   * @default d => colorGenerator(d.label)
   */
  graphColor?: string | ((data: ChartAxisGroupConfig) => string)

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
   * The chart's plane padding. If set to null the padding will be computed automatically based on the axis label and tick sizes.
   * @default null
   */
  planePadding?: null | number | Padding

  /**
   * The chart's plane margin. This is useful if additional space is required for axis labels or ticks.
   * @default 10
   */
  planeMargin?: number | Padding

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
     * as an accessor function to the graph / group data.
     * @default d3.symbolCircle
     */
    icon?: string | SymbolType | ((data: ChartAxisGraphData | ChartAxisGroupConfig) => string | SymbolType)
  }

  /**
   * Chart tooltip configuration options.
   */
  tooltip?: {
    /**
     * Tooltip will show values near the horizontal position of the cursor.
     * @default true
     */
    trackX?: boolean

    /**
     * Tooltip will show values near the vertical position of the cursor. (useful for horizontally oriented graphs or
     * charts that have a lot of y values stacked on the same discrete x values)
     * @default false
     */
    trackY?: boolean

    /**
     * The tooltip threshold for the cursor distant to the nearest axis chart value.
     * @default 50
     */
    threshold?: number

    /**
     * Html content to be displayed in the tooltip's title.
     * @default (values) => {
     *   const first = values[0].value
     *   return `${first.x, first.x1, first.median}`
     * }
     */
    title?: null | string | ((values: Array<{value: ChartAxisValueData, graph: ChartAxisGraphData}>) => string | null)

    /**
     * Html content to be displayed in each of the tooltip's rows.
     * @default (value, graph) => {
     *   return `${graph.label}: ${orEquals(value.y, value.y1, value.median)}`
     * }
     */
    row?: null | string | ((value: ChartAxisValueData, graph: ChartAxisGraphData) => string | null)
  }

  /**
   * X-axis (bottom) config
   */
  x?: AxisConfig

  /**
   * Y-axis (left) config
   */
  y?: AxisConfig

  /**
   * X2-axis (top) config
   */
  x2?: AxisConfig

  /**
   * Y2-axis (right) config
   */
  y2?: AxisConfig

  /**
   * Axis chart graph set configuration.
   */
  sets?: Array<ChartAxisGeneralSetConfig | ChartAxisBoxPlotSetConfig | ChartAxisBubblePackSetConfig>
}

/**
 * Chart axis data interface.
 */
export interface ChartAxisData extends ChartAxisConfig {
  /**
   * Axis chart graph set data.
   */
  sets: Array<ChartAxisGeneralSetData | ChartAxisBoxPlotSetData | ChartAxisBubblePackSetData>
}