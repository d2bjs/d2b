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
   * Set generator data.
   * @generators bar, area, line, scatter
   */
  generators?: Array<ChartAxisGeneralGeneratorConfig>

  /**
   * Set graph config.
   * @generators bar, area, line, scatter
   */
  graphs?: Array<ChartAxisGeneralGraphConfig>
}

export interface ChartAxisGeneralSetData extends ChartAxisSharedSetConfig {
  /**
   * Set generator data.
   * @generators bar, area, line, scatter
   */
  generators: Array<ChartAxisGeneralGeneratorData>

  /**
   * Set graph data.
   * @generators bar, area, line, scatter
   */
  graphs: Array<ChartAxisGeneralGraphData>
}

export interface ChartAxisBubblePackSetConfig extends ChartAxisSharedSetConfig {
  /**
   * Set generator config.
   * @generators bubblePack
   */
  generators?: Array<ChartAxisBubblePackGeneratorConfig>
  
  /**
   * Set graph config.
   * @generators bubblePack
   */
  graphs?: Array<ChartAxisBubblePackGraphConfig>
}

export interface ChartAxisBubblePackSetData extends ChartAxisSharedSetConfig {
  /**
   * Set generator data.
   * @generators bubblePack
   */
  generators: Array<ChartAxisBubblePackGeneratorData>

  /**
   * Set graph data.
   * @generators bubblePack
   */
  graphs: Array<ChartAxisBubblePackGraphData>
}

export interface ChartAxisBoxPlotSetConfig extends ChartAxisSharedSetConfig {
  /**
   * Set generator config.
   * @generators boxPlot
   */
  generators?: Array<ChartAxisBoxPlotGeneratorConfig>

  /**
   * Set graph config.
   * @generators boxPlot
   */
  graphs?: Array<ChartAxisBoxPlotGraphConfig>
}

export interface ChartAxisBoxPlotSetData extends ChartAxisSharedSetConfig {
  /**
   * Set generator data.
   * @generators boxPlot
   */
  generators: Array<ChartAxisBoxPlotGeneratorData>

  /**
   * Set graph data.
   * @generators boxPlot
   */
  graphs: Array<ChartAxisBoxPlotGraphData>
}