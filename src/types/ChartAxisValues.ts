import { SymbolType } from "d3"

/**
 * Axis chart x-value interface.
 */
interface X {
  /**
   * X-value
   * @generators all
   */
  x: number | string | Date
}

/**
 * Axis chart y-value interface.
 */
interface Y {
  /**
   * Y-value
   * @generators all
   */
  y: number | string | Date
}

/**
 * Axis chart value annotation interface.
 */
interface Annotation {
  /**
   * Annotation location for multi factor graphs. This defaults to 'y1' for area graphs and 'median' for box plot graphs.
   * @generators area, boxPlot
   */
  location?: 'y0' | 'y1' | 'maximum' | 'minimum' | 'median' | 'lowerQuartile' | 'upperQuartile'

  /**
   * Additional attributes can be added to the annotation for reference.
   */
  [key: string]: any
}

/**
 * Axis chart shared value config interface.
 */
interface ChartAxisSharedValueConfig {
  /**
   * Point symbol marker. If undefined will fall back to the graph's symbol.
   * @generators bubblePack, scatter
   */
  symbol?: SymbolType

  /**
   * Value's corresponding color. If undefined will fall back to the graph's color.
   * @generators bar, scatter, boxPlot, bubblePack
   */
  color?: string

  /**
   * Value's tooltip HTML content. If undefined will fall back to the graph's tooltip
   * accessor. If null will disable the tooltip for this value.
   * @generators all
   */
  tooltip?: string | null

  /**
   * Value's annotations. Area and box plot graphs are allowed to have multiple annotations per value, because each value has multiple factors. Refer to the d3-annotation [docs](https://d3-annotation.susielu.com) for 
   * additional annotation configuration. 
   * @generators area, boxPlot
   * @note Annotation(s) are only passed to the first generator described in the axis chart set.
   */
  annotations?: Array<Annotation>

  /**
   * Value's annotations. Bar, line, scatter, and bubble pack graphs have one annotation per value. Refer to the d3-annotation [docs](https://d3-annotation.susielu.com) for 
   * additional annotation configuration. 
   * @generators bar, line, scatter, bubblePack
   * @note Annotation(s) are only passed to the first generator described in the axis chart set.
   */
  annotation?: Annotation

  /**
   * Additional attributes can be added to the value for reference.
   */
  [key: string]: any
}

/**
 * Axis chart general value config interface. (bar, area, line, scatter)
 */
export interface ChartAxisGeneralValueConfig extends ChartAxisSharedValueConfig {
  /**
   * Forces bar chart bar centering. If undefined will fall back to the bar generator's
   * centered attribute.
   * @generators bar
   */
  centered?: boolean

  /**
   * Additional attributes can be added to the value for reference.
   */
  [key: string]: any
}

/**
 * Axis chart general value data interface. (bar, area, line, scatter) (extends all config properties)
 */
export interface ChartAxisGeneralValueData extends ChartAxisGeneralValueConfig, X, Y {
  /**
   * Y0-value
   * @generators area
   * @default 0
   */
  y0?: number | string
}

/**
 * Axis chart boxPlot value config interface.
 */
export interface ChartAxisBoxPlotValueConfig extends ChartAxisSharedValueConfig {
  /**
   * The pixel width for this value's box-plot. If undefined will fall back to the boxPlot generator's width attribute.
   * @generators boxPlot
   */
  width?: number
}

/**
 * Axis chart boxPlot shared value data interface. (extends all config properties)
 */
interface ChartAxisSharedBoxPlotValueData extends ChartAxisBoxPlotValueConfig {
  /**
   * Maximum-value
   * @generators boxPlot
   */
  maximum: number

  /**
   * Minimum-value
   * @generators boxPlot
   */
  minimum: number

  /**
   * Lower-quartile-value
   * @generators boxPlot
   */
  lowerQuartile: number

  /**
   * Upper-quartile-value
   * @generators boxPlot
   */
  upperQuartile: number

  /**
   * Median-value
   * @generators boxPlot
   */
  median: number

  /**
   * Outliers-values
   * @generators boxPlot
   */
  outliers?: Array<number>
}

/**
 * Axis chart boxPlot horizontal value data interface.
 */
interface ChartAxisHorizontalBoxPlotValueData extends ChartAxisSharedBoxPlotValueData, Y {}

/**
 * Axis chart boxPlot vertical value data interface.
 */
interface ChartAxisVerticalBoxPlotValueData extends ChartAxisSharedBoxPlotValueData, X {}

/**
 * Axis chart boxPlot value data interface.
 */
export type ChartAxisBoxPlotValueData = ChartAxisHorizontalBoxPlotValueData | ChartAxisVerticalBoxPlotValueData

/**
 * Axis chart bubblePack value config interface.
 */
export type ChartAxisBubblePackValueConfig = ChartAxisSharedValueConfig

/**
 * Axis chart bubblePack leaf value data interface. (extends all config properties)
 */
interface ChartAxisBubblePackLeafValueData extends ChartAxisBubblePackValueConfig, X, Y {
  /**
   * Bubble size
   * @generators bubblePack
   */
  size: number
}

/**
 * Axis chart bubblePack parent value data interface. (extends all config properties)
 */
interface ChartAxisBubblePackParentValueData extends ChartAxisBubblePackValueConfig {
  /**
   * Bubble children.
   * @generators bubblePack
   */
  children: Array<ChartAxisBubblePackLeafValueData | ChartAxisBubblePackParentValueData>

  /**
   * Bubble size. This is optional for parent bubbles, if not provided the value will be aggrigated from leaf node sizes.
   * @generators bubblePack
   */
  size?: number

  /**
   * X-value
   * @generators bubblePack
   */
  x?: number | string | Date

  /**
   * Y-value
   * @generators bubblePack
   */
  y?: number | string | Date
}

/**
 * Axis chart bubblePack value data interface. (extends all config properties)
 */
export type ChartAxisBubblePackValueData = ChartAxisBubblePackLeafValueData | ChartAxisBubblePackParentValueData

/**
 * Axis chart value data interface.
 */
export type ChartAxisValueData = ChartAxisBubblePackValueData | ChartAxisBoxPlotValueData | ChartAxisGeneralValueData