import { ChartAxisGeneralGeneratorConfig, ChartAxisGeneralGeneratorData, ChartAxisBubblePackGeneratorConfig, ChartAxisBubblePackGeneratorData, ChartAxisBoxPlotGeneratorConfig, ChartAxisBoxPlotGeneratorData } from "./ChartAxisGenerators"
import { ChartAxisGeneralGraphConfig, ChartAxisGeneralGraphData, ChartAxisBubblePackGraphConfig, ChartAxisBubblePackGraphData, ChartAxisBoxPlotGraphConfig, ChartAxisBoxPlotGraphData } from "./ChartAxisGraphs"

interface ChartAxisSharedSetConfig {
  /**
   * Set yType. If set to y2, the graphs in this set will use the right vertical axis.
   * @default 'y'
   */
  yType?: 'y' | 'y2'

  /**
   * Set xType. If set to x2, the graphs in this set will use the top horizontal axis.
   * @default 'x'
   */
  xType?: 'x' | 'x2'
}

export interface ChartAxisGeneralSetConfig extends ChartAxisSharedSetConfig {
  /**
   * General generators data.
   * @generators bar, area, line, scatter
   */
  generators?: Array<ChartAxisGeneralGeneratorConfig>

  /**
   * General graphs config.
   * @generators bar, area, line, scatter
   */
  graphs?: Array<ChartAxisGeneralGraphConfig>
}

export interface ChartAxisGeneralSetData extends ChartAxisSharedSetConfig {
  /**
   * General generators data.
   * @generators bar, area, line, scatter
   */
  generators: Array<ChartAxisGeneralGeneratorData>

  /**
   * General graphs data.
   * @generators bar, area, line, scatter
   */
  graphs: Array<ChartAxisGeneralGraphData>
}

export interface ChartAxisBubblePackSetConfig extends ChartAxisSharedSetConfig {
  /**
   * Bubble pack generators config.
   * @generators bubblePack
   */
  generators?: Array<ChartAxisBubblePackGeneratorConfig>
  
  /**
   * Bubble pack graphs config.
   * @generators bubblePack
   */
  graphs?: Array<ChartAxisBubblePackGraphConfig>
}

export interface ChartAxisBubblePackSetData extends ChartAxisSharedSetConfig {
  /**
   * Bubble pack generators data.
   * @generators bubblePack
   */
  generators: Array<ChartAxisBubblePackGeneratorData>

  /**
   * Bubble pack graphs data.
   * @generators bubblePack
   */
  graphs: Array<ChartAxisBubblePackGraphData>
}

export interface ChartAxisBoxPlotSetConfig extends ChartAxisSharedSetConfig {
  /**
   * Box plot generators config.
   * @generators boxPlot
   */
  generators?: Array<ChartAxisBoxPlotGeneratorConfig>

  /**
   * Box plot graphs config.
   * @generators boxPlot
   */
  graphs?: Array<ChartAxisBoxPlotGraphConfig>
}

export interface ChartAxisBoxPlotSetData extends ChartAxisSharedSetConfig {
  /**
   * Box plot generators data.
   * @generators boxPlot
   */
  generators: Array<ChartAxisBoxPlotGeneratorData>

  /**
   * Box plot graphs data.
   * @generators boxPlot
   */
  graphs: Array<ChartAxisBoxPlotGraphData>
}