> [d2b](../README.md) › **Chart Axis**

<!-- ![Local Image](../gifs/chart-axis.gif) -->

# {#generator}
[#](#generator) d2b.**chartAxis**()

Constructs a new axis chart generator with the default settings.

When using the d2b-axis generator you can draw an axis chart onto each element in the selection.

# {#apply}
[#](#apply) *axis.advanced*(*context*)

Render the axis chart(s) to the given *context*, which may be either a [d3-selection](https://github.com/d3/d3-selection) of html containers (e.g. div) or a corresponding [d3-transition](https://github.com/d3/d3-transition). 

> Note: The *advanced* mode is new in d2b > 1.0.0. In *advanced* mode all of axis chart [configuration properties](#properties) will be available with the input datum.

 # {#multiple_chart}
### [#](multiple_chart) Multi Chart
Here is a live interactive demo of multiple default axis charts without any extra configurations. Simply add another `generators` object with the desired graph types and respective data to create a new chart. The charts created are displayed in a stack-like manner. For example, the area chart is created first, then the bar/line, and then the bubble pack. This puts the area chart on the first/lower layer, then the bar/line chart is stacked on top, and lastly the bubble pack is stacked of the previous one, making it the last/top layer.
<figure class="axis_annotation">
  <iframe 
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/multiple-charts?runonclick=0&codemirror=1&module=/index.js&view=preview" 
    frameborder="0" 
    allowfullscreen="true" 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true"
  ></iframe>
</figure>

<!--
 # {#annotation}
### [#](#annotation) Annotation
Here is a live interactive demo of the default area axis chart with annotations without any extra configurations. You can annotate different points within the graph by creating an annotation object and setting it to a point object within the values array. 
<figure class="axis_annotation">
  <iframe 
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/annotation?runonclick=1&codemirror=1&module=/index.js&view=preview" 
    frameborder="0" 
    allowfullscreen="true" 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true"
  ></iframe>
</figure>
-->

# {#area_basic}
### [#](#area_basic) Area Basic
Here is a live interactive demo of the default area axis chart with basic property configurations. Some of these configurations include axis labels, label orientations, label padding, tick mark sizes, and scaling. 
<figure class="area_basic">
  <iframe 
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/area-basic?runonclick=1&codemirror=1&module=/index.js&view=preview" 
    frameborder="0" 
    allowfullscreen="true" 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true"
  ></iframe>
</figure>

 # {#area_default}
### [#](#area_default) Area Chart
Here is a live interactive demo of the default area axis chart without any extra configurations. There is a generator to create the type of chart needed, in this case an area chart. The graph object includes a label or the name of that graph and an array of values needed to create that graph. You can create more graph objects within the graph array to have a chart displaying multiple graphs.
<figure class="axis_area_default">
  <iframe 
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/default-area?runonclick=1&codemirror=1&module=/index.js&view=preview" 
    frameborder="0" 
    allowfullscreen="true" 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true"
  ></iframe>
</figure>


# {#Bar}
### [#](#bar) Bar
Here is a live interactive demo of the default bar axis chart without any extra configurations. There is a generator to create the type of chart needed, in this case a bar chart. The x-axis object requires a scale object in order to ensure the boundaries of the graph stay within the chart, but it can be adjusted. The graph object includes a label or the name of that graph and an array of values needed to create that graph. You can create more graph objects within the graph array to have a chart displaying multiple graphs.
<figure class="axis_bar">
  <iframe 
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/default-bar?runonclick=1&codemirror=1&module=/index.js&view=preview" 
    frameborder="0" 
    allowfullscreen="true" 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true"
  ></iframe>
</figure>


# {#boxplot}
### [#](#boxplot) Boxplot
Here is a live interactive demo of the default boxplot axis chart without any extra configurations. There is a generator to create the type of chart needed, in this case a boxplot chart. The `x`- and `y`-axis each have linear padding to ensure the boundaries of the graph stay within the chart, but it can be adjusted. The graph object includes a label or the name of that graph and an array of values needed to create that graph. You can create more graph objects within the `graphs` array to have a chart displaying multiple graphs.
<figure class="axis_boxplot">
  <iframe 
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/default-boxplot?runonclick=1&codemirror=1&module=/index.js&view=preview" 
    frameborder="0" 
    allowfullscreen="true" 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true"
  ></iframe>
</figure>

<!--
# {#bubble}
### [#](#bubble) Bubble
Here is a live interactive demo of the default bubble axis chart without any extra configurations. This is similar to the sunburst chart where there is a root node and children nodes. Clicking on the bubbles will toggle it to collapse and group bubbles into one bigger bubble or expand one bigger bubble into multiple smaller bubbles. There is a generator to create the type of chart needed, in this case a bubble chart. The graph object includes a label or the name of that graph and an array of values needed to create that graph. You can create more graph objects within the graph array to have a chart displaying multiple graphs.
<figure class="axis_bubble">
  <iframe 
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/default-bubble?runonclick=1&codemirror=1&module=/index.js&view=preview" 
    frameborder="0" 
    allowfullscreen="true" 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true"
  ></iframe>
</figure>

# {#groups}
### [#](#groups) Groups
Here is a live interactive demo of the default area axis and line chart combo with group property configurations. You can assign multiple graphs into one group. Each group will share a color per graph, that way it is easier to see which graphs belong to which group. Additionally, multiple graph types can be included in a chart.
<figure class="axis_groups">
  <iframe 
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/groups?runonclick=1&codemirror=1&module=/index.js&view=preview" 
    frameborder="0" 
    allowfullscreen="true" 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true"
  ></iframe>
</figure>
-->

# {#horizontal_bar}
### [#](#horizontal_bar) Horizontal Bar
Here is a live interactive demo of the horizontal bar axis chart. It is similar in concept to the regular bar chart with a change to the `orient` property from `vertical` to `horizontal`.
<figure class="axis_legend">
  <iframe 
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/horizontal-bar?runonclick=1&codemirror=1&module=/index.js&view=preview" 
    frameborder="0" 
    allowfullscreen="true" 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true"  
  ></iframe>    
</figure>

<!--
# {#legend}
### [#](#legend) Legend
Here is a live interactive demo of the area axis chart combo with legend property configurations. Some of these configurations include legend icon clickability, orientation, and icon symbols.
<figure class="axis_legend">
  <iframe 
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/legend?runonclick=1&codemirror=1&module=/index.js&view=preview" 
    frameborder="0" 
    allowfullscreen="true" 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true"  
  ></iframe>    
</figure>


 # {#line_default}
### [#](#line_default) Line Chart
Here is a live interactive demo of the default line axis chart without any extra configurations. 
<figure class="line_default">
  <iframe
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/basic-line?runonclick=0&codemirror=1&module=/index.js&view=preview" 
    frameborder="0" 
    allowfullscreen="true" 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true"
  ></iframe>
</figure>


# {#padding}
### [#](#padding) Padding
Here is a live interactive demo of the default area axis chart with padding configurations. Some of these configurations include chart padding, plane padding, and margins. These properties makes the charts and graphs easier to look at if the graphs start to look clustered within the chart.
<figure class="axis_padding">   
  <iframe     
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/padding?runonclick=1&codemirror=1&module=/index.js&view=preview" 
    frameborder="0" 
    allowfullscreen="true" 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true"
  ></iframe>
</figure>
-->

# {#scale}
### [#](#scale) Scale
Here is a live interactive demo of the default area axis chart with axis scaling configurations. The scaling object is within the `x`-axis and/or the `y`-axis object. The type of axis declared will allow for different properties to be used. Certain properties are not interchangeable with all types. Like in the example below, a `type:"log"` axis is set and this allows the `base` property to be used. If `type:"log"` is set and a property from another type is used, for example the `exponent` property from `type:"pow"`, the graph will not render properly.
<figure class="axis_scale">
  <iframe 
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/area-scale?runonclick=1&codemirror=1&module=/index.js&view=preview" 
    frameborder="0" 
    allowfullscreen="true" 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true"
  ></iframe>
</figure>

# {#scatter}
### [#](#scatter) Scatter
Here is a live interactive demo of the default scatter axis chart without any extra configurations. There is a `generators` object to create the type of chart needed, in this case a scatter chart. The graph object includes a `label` (name) of that graph and an array of `values` needed to create that graph. You can create more graph objects within the `graphs` array to have a chart displaying multiple graphs.
<figure class="axis_scatter">
  <iframe 
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/default-scatter?runonclick=1&codemirror=1&module=/index.js&view=preview" 
    frameborder="0" 
    allowfullscreen="true" 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true"
  ></iframe>
</figure>

# {#scatter_sizes}
### [#](#scatter_sizes) Scatter Varying Sizes
Here is a live interactive demo of the default scatter axis chart with varying point size configurations. The `size` property inside the `generators` array is a multiplier for the size of all the points in the graph.
<figure class="axis_scatter_sizes">
  <iframe 
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/default-scatter-sizes?runonclick=1&codemirror=1&module=/index.js&view=preview" 
    frameborder="10" 
    allowfullscreen="true" 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true"
  ></iframe>
</figure>

 # {#typescript}
### [#](#typescript) Typescript
Here is a live interactive demo of the default area axis chart without any extra configurations using typescript. Typescript ensures proper types and properties are used when creating objects, arrays, etc.  
<figure class="axis_typescript">
  <iframe 
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/typescript?runonclick=1&codemirror=1&module=/index.ts&view=preview" 
    frameborder="0" 
    allowfullscreen="true" 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true"
  ></iframe>
</figure> 


# {#properties}
### [#](#properties) Properties

This is a complete list of properties may be supplied to the axis chart datum. **Bold** properties are required.

{% include "./axisProperties.md" %}