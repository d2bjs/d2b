import { Padding, Orient, OrientCorner } from './General'

/**
 * Sankey chart node config interface.
 */
export interface ChartSankeyNodeConfig {
  /**
   * Node color, if set, this will override the sankey's node.color accessor.
   */
  color?: string

  /**
   * Node tooltip content, if set, this will override the sankey's node.tooltip accessor.
   * Use null to disable the tooltip for this node.
   */
  tooltip?: string | null

  /**
   * Additional attributes can be added to the sankey node for reference.
   */
  [key: string]: any
}

/**
 * Sankey chart node data interface (extends all config properties).
 */
export interface ChartSankeyNodeData extends ChartSankeyNodeConfig {
  /**
   * Node name.
   */
  name: string
}

/**
 * Sankey chart link config interface.
 */
export interface ChartSankeyLinkConfig {
  /**
   * Link source color, if set, this will override the sankey's link.sourceColor accessor.
   */
  sourceColor?: string

  /**
   * Link target color, if set, this will override the sankey's link.targetColor accessor.
   */
  targetColor?: string

  /**
   * Link tooltip content, if set, this will override the sankey's link.tooltip accessor.
   * Use null to disable the tooltip for this link.
   */
  tooltip?: string | null

  /**
   * Additional attributes can be added to the sankey link for reference.
   */
  [key: string]: any
}

/**
 * Sankey chart value interface (extends all config properties).
 */
export interface ChartSankeyLinkData extends ChartSankeyLinkConfig {
  /**
   * Link source name. Should refer to the source node's name.
   */
  source: string

  /**
   * Link target name. Should refer to the target node's name.
   */
  target: string

  /**
   * Link value.
   */
  value: number
}


/**
 * Sankey chart config interface.
 */
export interface ChartSankeyConfig {
  /**
   * Array of sankey nodes.
   */
  nodes?: Array<ChartSankeyNodeConfig>

  /**
   * Array of sankey links.
   */
  links?: Array<ChartSankeyLinkConfig>

  /**
   * Event hook for d2b charts. Will be after the chart is rendered.
   * Note: Transitions may still occur after this lifecycle hook fires.
   */
  updated?: (this: HTMLElement, data: ChartSankeyData) => void

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
   * Number of relaxation iterations used while generating the sankey layout.
   * @default 6
   */
  iterations?: number

  /**
   * The chart's outer padding in pixels.
   * @default 10
   */
  padding?: number | Padding

  /**
   * Sankey node configuration options.
   */
  node?: {
    /**
     * How to align sankey nodes.
     * @default 'justify'
     */
    align?: 'left' | 'right' | 'center' | 'justify'

    /**
     * Vertical separation between nodes.
     * @default 8
     */
    padding?: number
  
    /**
     * Sort comparator for sankey node columns. Use null to order nodes according to
     * the nodes array. If undefined, the nodes will be sorted according to the layout.
     * @default undefined
     */
    sort?: undefined | null | ((a: ChartSankeyNodeData, b: ChartSankeyNodeData) => number)
  
    /**
     * The number of characters to start wrapping the node label.
     * @default Infinity
     */
    labelWrapLength?: number

    /**
     * Enable / disable node dragging in the horizontal direction.
     * @default false
     */
    draggableX?: boolean

    /**
     * Enable / disable node dragging in the vertical direction.
     * @default false
     */
    draggableY?: boolean

    /**
     * Sankey node color accessor function.
     * @default data => colorGenerator(data.name)
     */
    color?: string | ((data: ChartSankeyNodeData, key: string | number) => string)

    /**
     * Node tooltip configuration options.
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
       * Html content to be displayed in the node's tooltip.
       * @default (data, value) => `<b>${data.name}</b>: ${value}`
       */
      html?: string | ((data: ChartSankeyNodeData, value: number) => string)
    }
  }

  /**
   * Sankey link configuration options.
   */
  link?: {
    /**
     * Sankey link source color accessor function.
     * @default (data, sourceColor) => sourceColor
     */
    sourceColor?: string | ((data: ChartSankeyLinkData, sourceColor: string) => string)

    /**
     * Sankey link target color accessor function.
     * @default (data, targetColor) => targetColor
     */
    targetColor?: string | ((data: ChartSankeyLinkData, targetColor: string) => string)

    /**
     * Link tooltip configuration options.
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
       * Html content to be displayed in the link's tooltip.
       * @default function (data, source, target) { 
       *   return `
       *     <b>${source.name}</b>
       *     <i class='fa fa-arrow-right d2b-sankey-link-arrow' aria-hidden='true'></i>
       *     <b>${target.name}</b>:
       *     ${data.value}
       *   `
       * }
       */
      html?: string | ((data: ChartSankeyLinkData, source: ChartSankeyNodeData, target: ChartSankeyNodeData) => string)
    }
  }
}

/**
 * Sankey chart data interface (extends all config properties).
 */
export interface ChartSankeyData extends ChartSankeyConfig {
  /**
   * Array of sankey nodes.
   */
  nodes: Array<ChartSankeyNodeData>

  /**
   * Array of sankey links.
   */
  links: Array<ChartSankeyLinkData>
}