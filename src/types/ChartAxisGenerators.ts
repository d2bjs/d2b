import { Series, CurveFactory, SymbolType } from "d3"
import { ChartAxisGeneralValueData, ChartAxisBoxPlotValueData } from "./ChartAxisValues";

type GeneralType = 'bar' | 'area' | 'line' | 'scatter'

/**
 * Axis chart general generator config.
 * @generators bar, area, line, scatter
 */
export interface ChartAxisGeneralGeneratorConfig {
  /**
   * Enable or disable graph stacking.
   * @generators bar, area, line, scatter
   */
  stack?: boolean

  /**
   * The padding "between" bar groups.
   * @generators bar
   * @default 0.5
   */
  padding?: number

  /**
   * The padding "within" bar groups (or between individual bars within a group).
   * @generators bar
   * @default 0
   */
  groupPadding?: number

  /**
   * Stack offset for area line and scatter graphs. See d3-shape's [stack offsets](https://github.com/d3/d3-shape#stack-offsets) for more information.
   * @generators area, line, scatter
   * @default d3.stackOffsetNone
   */
  stackOffset?: (series: Series<any, any>, order: Array<number>) => void

  /**
   * Stack order for area line and scatter graphs. See d3-shape's [stack orders](https://github.com/d3/d3-shape#stack-orders) for more information.
   * @generators area, line, scatter
   * @default d3.stackOrderNone
   */
  stackOrder?: (series: Series<any, any>) => Array<number>

  /**
   * Element orientation for bars.
   * @generators bar
   * @default 'vertical'
   */
  orient?: 'vertical' | 'horizontal'

  /**
   * Curve factory for area and line graphs. See d3-shape's [curves](https://github.com/d3/d3-shape#curves) for more information.
   * @generators area, line
   * @default d3.curveLinear
   */
  curve?: CurveFactory

  /**
   * Align line or scatter graphs according to their y1 or y0 stack orientation. This is useful if you want to have 2 line graphs 
   * outlining the top and bottom of an area chart.
   * @generators scatter, line
   * @default 'y1'
   */
  align?: 'y1' | 'y0'

  /**
   * Forces bar chart bars to the center of their respective group position.
   * @generators bar
   * @default false
   */
  centered?: boolean

  /**
   * Sets the symbol type for the scatter graphs.
   * @generators scatter
   * @default d3.symbolCircle
   */
  symbol?: SymbolType
}

interface ChartAxisSharedGeneralGeneratorData extends ChartAxisGeneralGeneratorConfig {}

interface ChartAxisTypeGeneralGeneratorData extends ChartAxisSharedGeneralGeneratorData {
  /**
   * The generator type, either this or the generator "types" must be provided.
   */
  type: GeneralType
}

interface ChartAxisTypesGeneralGeneratorData extends ChartAxisSharedGeneralGeneratorData {
  /**
   * The generator types, either this or the generator "type" must be provided.
   */
  types: Array<GeneralType>
}


/**
 * Axis chart general generator data.
 * @generators bar, area, line, scatter
 */
export type ChartAxisGeneralGeneratorData = ChartAxisTypeGeneralGeneratorData | ChartAxisTypesGeneralGeneratorData

/**
 * Axis chart bubble pack generator config.
 * @generators bubblePack
 */
export interface ChartAxisBubblePackGeneratorConfig {
  /**
   * Pixel size multiplier for bubbles.
   * @generators bubblePack, scatter
   * @default 100
   */
  size?: number

  /**
   * How the parent bubble size, x, and y values should be computed. (e.g. as a mean / median / midpoint.. of their leaf nodes)
   * @generators tendancy
   * @default d2b.mean
   */
  tendancy?: (values: Array<any>, value: ((v: any) => number), weight?: ((v: any) => number)) => number

  /**
   * Sets the symbol type for the bubble pack graphs.
   * @generators bubblePack
   * @default d3.symbolCircle
   */
  symbol?: SymbolType
}

interface ChartAxisSharedBubblePackGeneratorData extends ChartAxisBubblePackGeneratorConfig {}

interface ChartAxisTypeBubblePackGeneratorData extends ChartAxisSharedBubblePackGeneratorData {
  /**
   * The generator type, either this or the generator "types" must be provided.
   */
  type: 'bubblePack'
}

interface ChartAxisTypesBubblePackGeneratorData extends ChartAxisSharedBubblePackGeneratorData {
  // /**
  //  * The generator types, either this or the generator "type" must be provided.
  //  */
  // types: ['bubblePack']
}

/**
 * Axis chart bubble pack generator data.
 * @generators bubblePack
 */
export type ChartAxisBubblePackGeneratorData = ChartAxisTypeBubblePackGeneratorData | ChartAxisTypesBubblePackGeneratorData

/**
 * Axis chart box plot generator config.
 * @generators boxPlot
 */
export interface ChartAxisBoxPlotGeneratorConfig {
  /**
   * Element orientation for boxes.
   * @generators boxPlot
   * @default 'vertical'
   */
  orient?: 'vertical' | 'horizontal'

  /**
   * Value format for various box plot metrics (e.g. maximum, minimum, median, ..)
   * @generators boxPlot
   * @default d3.format(',')
   */
  valueFormat?: (n: number | { valueOf(): number }) => string

  /**
   * Box pixel width.
   * @generators boxPlot
   * @default 20
   */
  width?: number
}

interface ChartAxisSharedBoxPlotGeneratorData extends ChartAxisBoxPlotGeneratorConfig {}

interface ChartAxisTypeBoxPlotGeneratorData extends ChartAxisSharedBoxPlotGeneratorData {
  /**
   * The generator type, either this or the generator "types" must be provided.
   */
  type: 'boxPlot'
}

interface ChartAxisTypesBoxPlotGeneratorData extends ChartAxisSharedBoxPlotGeneratorData {
  // /**
  //  * The generator types, either this or the generator "type" must be provided.
  //  */
  // types: ['boxPlot']
}

/**
 * Axis chart box plot generator data.
 * @generators boxPlot
 */
export type ChartAxisBoxPlotGeneratorData = ChartAxisTypeBoxPlotGeneratorData | ChartAxisTypesBoxPlotGeneratorData