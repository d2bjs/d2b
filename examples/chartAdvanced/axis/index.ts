import { ChartAxisData } from '../../..';

import { select, scaleBand, axisTop, scaleLinear, scaleTime, format, curveLinear } from 'd3';
import { chartAxis } from '../../../dist/d2b.cjs.js';
import { annotationBadge } from 'd3-svg-annotation';

const axis = chartAxis();

// The axis chart data creation type checked with the ChartAxisData interface.
const datum: ChartAxisData = {
  // sets: (required) [{generators: array, graphs: array}]
  // Array of graph sets to be rendered.
  sets: [
    {
      // This set is an example of stacked bars:

      // yType: (optional) either 'y' or 'y2'
      // The y axis in which the graphs will be associated with. 'y' is the left side vertical axis, and 'y2' is the right side virtical axis.
      // default: 'y'
      yType: 'y2',

      // xType: (optional) either 'x' or 'x2'
      // The x axis in which the graphs will be associated with. 'x' is the left side vertical axis, and 'x2' is the right side virtical axis.
      // default: 'x'
      xType: 'x2',

      // generators: (required) array
      // The svg generators use to render the graphs.
      generators: [
        // Generators can either be in the form of a preconfigured d2b svg generator:
        // (e.g. one of svgBar, svgLine, svgArea, svgScatter, svgBubblePack, svgBoxPlot)
        // d2b.svgBar().stackBy(true),

        // Or the generators can be described by an object:
        {
          // type: (type OR types required) one of 'line', 'bar', 'area', 'scatter', 'boxPlot', 'bubblePack'
          // The generator type.
          type: 'scatter',

          // types: (type OR types required) array of strings with the following possible options 'line', 'bar', 'area', 'scatter', 'boxPlot', 'bubblePack'
          // The generator types.
          // types: ['scatter', 'line', 'area'],

          // stack: (optional) boolean
          // Only used for bar, area, line, and scatter generators.
          // default: null (if null will defer to the set's stack property)
          // stack: true,

          // padding: (optional) number between 0 and 1
          // Only used for bar generator. Describes the padding "between" bar groups.
          // default: 0.5
          padding: 0.2,

          // groupPadding: (optional) number between 0 and 0.5
          // Only used for bar generator. Describes the padding "within" bar groups.
          // default: 0
          groupPadding: 0.05,
          // curve: curveLinear,
          // stackOffset: (optional) one of d3.stackOffsetExpand, d3.stackOffsetDiverging, d3.stackOffsetNone, d3.stackOffsetSilhouette, d3.stackOffsetWiggle
          // Only used for area, line, and scatter generators.
          // default: d3.stackOffsetNone
          // stackOffset: d3.stackOffsetExpand,

          // stackOrder: (optional) one of d3.stackOrderAppearance, d3.stackOrderAscending, d3.stackOrderDescending, d3.stackOrderInsideOut, d3.stackOrderNone, d3.stackOrderReverse
          // Only used for area, line, and scatter generators.
          // default: d3.stackOrderNone
          // stackOrder: d3.stackOrderAscending,

          // orient: (optional) one of 'horizontal' or 'vertical'
          // Only used for bar and boxPlot generators.
          // default: 'vertical'
          // orient: 'horizontal',

          // curve: (optional) one of d3 curves: https://github.com/d3/d3-shape#curves
          // Only used for area and line generators.
          // default: d3.curveLinear
          // curve: d3.curveBasis,

          // align: (optional) 'y0' or 'y1'
          // Only used for scatter and line generators. If stacking is enabled, this specifies if the line or points will be aligned at the y0 or y1 position of the data stack.
          // default: 'y1'
          // align: 'y0',

          // size: (optional) number
          // Only used for scatter and bubblePack generators. Specifies the area size of the points. In regards to the bubblePack generator, the size will be a multiplier of the computed bubble size.
          // default: 25 (scatter) 100 (bubblePack)
          // size: (d) => d.y * 20,

          // tendancy: (optional) One of d2b.mean, d2b.median, d2b.mode, d2b.midpoint
          // Only used for bubblePack generator. Specifies how the size of the parent bubbles are computed relative to their leaf nodes.
          // default: d2b.mean
          // tendancy: d2b.median,

          // valueFormat: (optional) function (d)
          // Only used for boxPlot generator. Specifies the box plot values (maximum, upperQuartile, median, lowerQuartile, minimum) should be formated.
          // default: d3.format(',')
          // valueFormat: d3.format('%'),

          // centered: (optional) boolean
          // Only used for bar generator. Forces bars to be centered instead of being aligned according to their group siblings.
          // default: false
          // centered: true,

          // width: (optional) number
          // Only used for boxPlot generator. Sets the box plot pixel width.
          // default: 20
          // width: 30,

          // symbol: (optional) One of https://github.com/d3/d3-shape#symbols or https://docs.d2bjs.org/shape/symbols.html
          // Only used for scatter and bubblePack generators. Defines the point symbol type.
          // default: d3.symbolCircle
          // symbol: d3.symbolSquare,
        }
      ],

      // graphs: (required) [{label: string, ...}]
      // Array of graphs to be rendered with the set generators.
      graphs: [
        {
          // label: (required) string
          // The graph label.
          label: 'bar 1',

          // tooltip: (optional) null, string, or function (d, graph)
          // The graph value tooltip accessor (returns html). If undefined the tooltip will fallback to the charts tooltip.row config. If null tooltips will be disabled for this graph.
          // default: undefined
          // tooltip: (d, graph) => `<b>${graph.label}</b>: ${d.y}`,

          // hidden: (optional) boolean
          // Initially hides this graph. This value will be modified internally when interacting with the chart legend.
          // default: false
          // hidden: true,

          // color: (optional) string
          // The graph color. If undefined, the color will fall back to the chart's graphColor accessor.
          // default: undefined
          color: 'red',
          stack: 1,
          
          // symbol: (optional) One of https://github.com/d3/d3-shape#symbols or https://docs.d2bjs.org/shape/symbols.html
          // The graph symbol. If undefined, the symbol will fall back to the generator's symbol.
          // default: undefined
          // symbol: d3.symbolStar,

          // group: (required) string
          // The graph group, should match the group's label. This is useful to group graphs together on the legend
          // group: 'Bar Group',

          // values: (required) array
          // The graph values.
          values: [
            {x: 1, y: 25},
            {x: 2, y: 38},
            {x: 3, y: 24},
            {x: 4, y: 60},
            {x: 5, y: 22}
          ]
        },
        {
          label: 'bar 2',
          stack: 1,
          values: [
            {x: 3, y: 45},
            {x: 5, y: 31},
          ]
        },
        {
          label: 'bar 3',
          values: [
            {x: 2, y: 25},
            {x: 3, y: 15},
            {x: 4, y: 35},
            {x: 5, y: 25},
            {x: 6, y: 18},
          ]
        }
      ]
    },
    {
      // area graphs
      generators: [{
        types: ['area', 'line', 'scatter']
      }],
      graphs: [
        {
          label: 'area 1',
          // hidden: true,
          values: [
            {x: 1, y: 25,
              annotations: [{
                // type: d3.annotationBadge,
                subject: {
                  text: 'A'
                }
              }]
            },
            {x: 2, y: 38},
            {x: 3, y: 24},
            {x: 4, y: 60},
            {x: 5, y: 22}
          ]
        },
        {
          label: 'area 2',
          // hidden: true,
          values: [
            {x: 3, y: 45},
            {x: 5, y: 31},
          ]
        }
      ]
    },
    {
      // box plot graphs
      generators: [{
        types: ['boxPlot']
      }],
      graphs: [
        {
          label: 'box plot 1',
          group: 'Box Group',
          values: [
            // Example value format for boxPlot generator
            {
              // x: (required for vertical boxPlots) number (or string for band scales)
              // x-value
              x: 1,

              // y: (required for horizontal boxPlots) number (or string for band scales)
              // y-value
              y: 1,
              
              // maximum: (required) number
              // maximum-value
              maximum: 10,
              
              // minimum: (required) number
              // minimum-value  
              minimum: 1,
              
              // upperQuartile: (required) number
              // upper-quartile-value
              upperQuartile: 7.5,
              
              // lowerQuartile: (required) number
              // lower-quartile-value 
              lowerQuartile: 2.8,
              
              // median: (required) number
              // median-value
              median: 5.4,
              
              // outliers: (required) [number]
              // Array of outliers-values
              outliers: [0.5, 12, 13.3],
              
              // width: (optional) number
              // The pixel width for this value's box-plot. If undefined will fall back to the boxPlot generator's width attribute.
              // default: undefined
              width: 50
            },
            {x: 2, maximum: 12,   minimum: 3,   upperQuartile: 9,     lowerQuartile: 5.8, median: 7},
            {x: 3, maximum: 15,   minimum: 4.5, upperQuartile: 12.8,  lowerQuartile: 6.2, median: 7.3}
          ]
        },
        {
          label: 'box-plot 2',
          group: 'Box Group',
          values: [
            {x: 4, maximum: 6,    minimum: 0,   upperQuartile: 5,     lowerQuartile: 1.4, median: 3.8},
            {x: 5, maximum: 8.2,  minimum: 1.2, upperQuartile: 7,     lowerQuartile: 2.8, median: 5.5, outliers: [1, 11.1, 14.5]},
            {x: 6, maximum: 12.8, minimum: 4.2, upperQuartile: 11,    lowerQuartile: 4.8, median: 6.4}
          ]
        }
      ]
    },
    {
      // bubble pack graphs
      generators: [{
        type: 'bubblePack'
      }],
      graphs: [
        {
          label: 'bubble pack 1',
          values: [
            // Example value format for bubblePack generator
            {
              size:100,
              // label: (required) string
              // Unique label for this bubble.
              label: 'one',
              annotation: {
                dy: -50,
                dx: 70,
                // location: 'y',
                type: annotationBadge,
                note: {
                  title: 'Important Point',
                  label: 'This point represents something important that happened.',
                  wrap: 150
                },
                subject: {
                  radius: 20,
                  radiusPadding: 5,
                },
                connector: {
                  end : "arrow"
                }
              },
              // annotations:[{
              //   location: 'y',
              //   // dy: -30,
              //   type: annotationCalloutCircle,
              //   // note: {
              //   //   title: 'Peak',
              //   //   label: 'Here is the peak of one of the area charts'
              //   // },
              //   // connector: {
              //   //   end: "dot"
              //   // },
              //   subject: {
              //     radius: 15,
              //     text: 'peak'
              //   }
              // }],
              // children: (required if bubble has children) array
              // Children of this bubble.
              children: [
                {
                  label: 'one-one',

                  // size: (required if bubble is a leaf node) number
                  // Size of this bubble.
                  size: 5,

                  // x: (required if bubble is a leaf node) number
                  // x-value
                  x: 7,

                  // y: (required if bubble is a leaf node) number
                  // y-value
                  y: 25
                }
              ]
            },
            {
              expanded: true,
              // symbol: d3.symbolDiamond,
              label: 'two',
              children: [
                {
                  label: 'two-one',
                  size: 5,
                  x: 3,
                  y: 15
                },
                {
                  label: 'two-two',
                  children: [
                    {
                      label: 'two-two-one',
                      size: 2,
                      x: 6,
                      y: 8
                    },
                    {
                      label: 'two-two-two',
                      size: 17,
                      x: 8,
                      y: 21
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ],

  // groups: (optional) [{label: string}]
  // Array of graph groups.
  groups: [
    {
      // label: (required) string
      // The graph label.
      label: 'Box Group',
      
      // color: (optional) string
      // The group color. If undefined, the color will fall back to the chart's groupColor accessor.
      // default: undefined
      color: 'purple'
    }
  ],

  // // Event hook for d2b charts. Will be fired whenever the chart is rendered either externally or internally.
  // // Note: Transitions may still occur after this lifecycle hook fires.
  // // updated (datum) {
  //   // console.log(datum) // event will be passed the chart datum
  //   // console.log(this) // context will be chart container DOM element
  // // },

  // // size: (optional) {height: number, width: number}
  // // The pixel size of the chart.
  // // default: width and height will size according to the container size if not provided
  // size: {
  //   height: 400
  // },
  
  // chartPadding: (optional) number or { top: number, left: number, right: number, bottom: number }
  // The inner chart padding (excluding the legend)
  // default: 10

  // padding: (optional) number or { top: number, left: number, right: number, bottom: number }
  // The outer chart padding (including the legend)
  // default: 10

  // planePadding: (optional) number or { top: number, left: number, right: number, bottom: number }
  // The chart's plane padding. If set to null the padding will be computed automatically based on the axis label and tick sizes.
  // default: null

  // planeMargin: (optional) number or { top: number, left: number, right: number, bottom: number }
  // The chart's plane margin. This is useful if additional space is required for axis labels or ticks.
  // default: 0

  // duration: (optional) number
  // The duration of internal chart transitions in miliseconds.
  // default: 250

  // graphColor: (optional) function (d)
  // Color accessor for graphs.
  // default: Colors dynamically based on the graph label
  // graphColor: function (d) {
    // return d3.scaleOrdinal(d3.schemeCategory20)(d.label)
  // },

  // groupColor: (optional) function (d)
  // Color accessor for groups.
  // default: Colors dynamically based on the group label
  // groupColor: function (d) {
  //   return d3.scaleOrdinal(d3.schemeCategory20)(d.label)
  // },

  // legend: (optional)
  // legend configuration options
  // legend: {
    // enabled: (optional) boolean
    // Enable or disable the legend
    // default: true

    // orient: (optional) one of 'left', 'right', 'top', 'bottom'
    // Orientation of the legend
    // default: 'bottom'

    // clickable: (optional) boolean
    // Whether the legend will hide / show graphs on click
    // default: true

    // dblclickable: (optional) boolean
    // Whether the legend will hide / show graphs on dblclick
    // default: true

    // icon: (optional) d3 symbol or font awesome character code
    // Legend item icon.
    // default: d3.symbolCircle
  // },

  tooltip: {
    // trackX: false,
    // trackY: false,
  //   title,
  //   row
  },

  x: {
    scale: {
      // type: scaleTime()
      // type: scaleBand().domain([1, 2])
      // forceBounds: {
      //   min: -10
      // }
    },
    // tickFormat: format('%'),
    // axis: axisTop(scaleLinear())
    // wrapLength: 1
    // tickFormat: () => 'This is a long tick',
    wrapLength: 1,
    showGrid: false,
    tickSize: 20,
    label: 'Test Label',
    labelOrient: 'inner end',
    linearPadding: [-0.5, 0.2],
    tickPadding: 20,
    ticks: 3,
    // tickValues: [1, 2, 3]
  }

  // (x, y, x2, y2): {
  //   scale: {
  //     type,
  //     domain,
  //     clamp,
  //     nice,
  //     exponent,
  //     base,
  //     constant,
  //     forceBounds: {
  //       min,
  //       max
  //     }
  //   },
  //   orient,
  //   wrapLength,
  //   tickSize,
  //   showGrid,
  //   label,
  //   labelOrient,
  //   linearPadding,
  //   tickPadding,
  //   ticks,
  //   tickFormat,
  //   tickValues,
  //   axis
  // }
};

const chart = select('.chart-axis').datum(datum);

chart.call(axis.advanced);