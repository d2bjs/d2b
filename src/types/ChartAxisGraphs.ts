import { SymbolType } from "d3"
import { ChartAxisGeneralValueConfig, ChartAxisGeneralValueData, ChartAxisBoxPlotValueData, ChartAxisBoxPlotValueConfig, ChartAxisBubblePackValueConfig, ChartAxisBubblePackValueData } from "./ChartAxisValues"

/**
 * Axis chart graph annotation interface.
 */
interface Annotation {
  /**
   * Annotation x position.
   * @generators all
   */
  x: number | string

  /**
   * Annotation y position.
   * @generators all
   */
  y: number | string

  /**
   * Annotation x2 position.
   * @generators all
   */
  x2?: number | string

  /**
   * Annotation y2 position.
   * @generators all
   */
  y2?: number | string

  /**
   * Annotation z position.
   * @generators all
   * @default 'front'
   */
  z?: 'front' | 'back'

  /**
   * Additional attributes can be added to the annotation for reference.
   */
  [key: string]: any
}

/**
 * Axis chart shared graph config interface. (bar, area, line, scatter, boxPlot, bubblePack)
 */
interface ChartAxisSharedGraphConfig {
  /**
   * Initially hides this graph. This value will be modified internally when interacting with the chart legend.
   * @generators all
   */
  hidden?: boolean

  /**
   * The graph color. If undefined, the color will fall back to the chart's graphColor accessor.
   * @generators all
   */
  color?: string

  /**
   * The graph symbol if it's a scatter or bubble pack graph. If undefined, the symbol will fall back to the
   * generator's symbol property.
   * @generators scatter, bubblePack
   */
  symbol?: SymbolType

  /**
   * The graph group, should match the group's label. This is useful to group graphs together on the legend.
   * @generators all
   */
  group?: string

  /**
   * Legend icon symbol type. This can either be a font awesome character code
   * (e.g. '\uf111' for a circle), [d3 symbol](https://github.com/d3/d3-shape#symbols)
   * or [d2b symbol](https://docs.d2bjs.org/shape/symbols.html). If set, this will
   * override the legend's icon property.
   */
  legendIcon?: string | SymbolType

  /**
   * Graph annotations. Refer to the d3-annotation [docs](https://d3-annotation.susielu.com) for 
   * additional annotation configuration. 
   * @generators all
   */
  annotations?: Array<Annotation>
}

/**
 * Axis chart shared graph data interface. (bar, area, line, scatter, boxPlot, bubblePack)
 */
interface ChartAxisSharedGraphData extends ChartAxisSharedGraphConfig {
  /**
   * Graph label.
   * @generators all
   */
  label: string
}

/**
 * Axis chart general graph config interface. (bar, area, line, scatter)
 */
export interface ChartAxisGeneralGraphConfig extends ChartAxisSharedGraphConfig {
  /**
   * Graph values config.
   * @generators bar, area, line, scatter
   */
  values?: Array<ChartAxisGeneralValueConfig>

  /**
   * Html content to be displayed in the values tooltip row. A null value will disable the value's tooltip row.
   * @generators bar, area, line, scatter
   * @default (value, graph) => {
   *   return `${graph.label}: ${orEquals(value.y, value.y1, value.median)}`
   * }
   */
  tooltip?: null | string | ((data: ChartAxisGeneralValueData, graph: ChartAxisGeneralGraphData) => string | null)

  /**
   * Graph stack key. This can be used to stack graphs together in this set. Like stack values will be stacked together.
   * (e.g. if graphs 1 and 2 have a stack value is 'first' and graph 3 have a stack value of 'second' only graphs 1 and 2
   * will be stacked together). If undefined, the stacking will fall back to the generator's stack property.
   * @generators bar, area, line, scatter
   */
  stack?: number | string
}

/**
 * Axis chart general graph data interface. (bar, area, line, scatter)
 */
export interface ChartAxisGeneralGraphData extends ChartAxisGeneralGraphConfig, ChartAxisSharedGraphData {
  /**
   * Graph values data.
   * @generators bar, area, line, scatter
   */
  values: Array<ChartAxisGeneralValueData>
}

/**
 * Axis chart boxPlot graph config interface.
 */
export interface ChartAxisBoxPlotGraphConfig extends ChartAxisSharedGraphConfig {
  /**
   * boxPlot values config.
   * @generators boxPlot
   */
  values?: Array<ChartAxisBoxPlotValueConfig>

  /**
   * Html content to be displayed in the values tooltip row. A null value will disable the value's tooltip row.
   * @default (value, graph) => {
   *   return `${graph.label}: ${orEquals(value.y, value.y1, value.median)}`
   * }
   */
  tooltip?: null | string | ((data: ChartAxisBoxPlotValueData, graph: ChartAxisBoxPlotGraphData) => string | null)
}

/**
 * Axis chart boxPlot graph data interface.
 */
export interface ChartAxisBoxPlotGraphData extends ChartAxisBoxPlotGraphConfig, ChartAxisSharedGraphData {
  /**
   * Graph values data.
   * @generators boxPlot
   */
  values: Array<ChartAxisBoxPlotValueData>
}

/**
 * Axis chart bubblePack graph config interface.
 */
export interface ChartAxisBubblePackGraphConfig extends ChartAxisSharedGraphConfig {
  /**
   * BubblePack values config.
   * @generators bubblePack
   */
  values?: Array<ChartAxisBubblePackValueConfig>

  /**
   * Html content to be displayed in the values tooltip row. A null value will disable the value's tooltip row.
   * @default (value, graph) => {
   *   return `${graph.label}: ${orEquals(value.y, value.y1, value.median)}`
   * }
   */
  tooltip?: null | string | ((data: ChartAxisBubblePackValueData, graph: ChartAxisBubblePackGraphData) => string | null)
}

/**
 * Axis chart bubblePack graph data interface.
 */
export interface ChartAxisBubblePackGraphData extends ChartAxisBubblePackGraphConfig, ChartAxisSharedGraphData {
  /**
   * Graph values data.
   * @generators bubblePack
   */
  values: Array<ChartAxisBubblePackValueData>
}

/**
 * All axis chart graphs.
 */
export type ChartAxisGraphData = ChartAxisBubblePackGraphData | ChartAxisBoxPlotGraphData | ChartAxisGeneralGraphData