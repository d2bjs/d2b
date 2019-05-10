> [d2b](../README.md) › **Chart Axis Basic**

<!-- ![Local Image](../gifs/chart-axis.gif) -->

# {#generator}
[#](#generator) d2b.**chartAxis**()

Constructs a new axis chart generator with the default settings.

When using the d2b-axis generator you can draw an axis chart onto each element in the selection.

# {#apply}
[#](#apply) *axis.advanced*(*context*)

Render the axis chart(s) to the given *context*, which may be either a [d3-selection](https://github.com/d3/d3-selection) of html containers (e.g. div) or a corresponding [d3-transition](https://github.com/d3/d3-transition). 

> Note: The *advanced* mode is new in d2b > 1.0.0. In *advanced* mode all of axis chart [configuration properties](#properties) will be available with the input datum.

# {#area_default}
### [#](#area_default) Area Chart
Here is a live interactive demo of the default area axis chart without any extra configurations. There is a generator to create the type of chart needed, in this case an area chart. The graph object includes a label or the name of that graph and an array of values needed to create that graph. You can create more graph objects within the graph array to have a chart displaying multiple graphs.
<figure class="axis_area_default">
  <iframe 
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/default-area?runonclick=1&codemirror=1&module=/index.js&view=preview" 
  ></iframe>
</figure>


# {#Bar}
### [#](#bar) Bar
Here is a live interactive demo of the default bar axis chart without any extra configurations. There is a generator to create the type of chart needed, in this case a bar chart. The x-axis object requires a scale object in order to ensure the boundaries of the graph stay within the chart, but it can be adjusted. The graph object includes a label or the name of that graph and an array of values needed to create that graph. You can create more graph objects within the graph array to have a chart displaying multiple graphs.
<figure class="axis_bar">
  <iframe 
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/default-bar?runonclick=1&codemirror=1&module=/index.js&view=preview" 
  ></iframe>
</figure>


# {#boxplot}
### [#](#boxplot) Boxplot
Here is a live interactive demo of the default boxplot axis chart without any extra configurations. There is a generator to create the type of chart needed, in this case a boxplot chart. The `x`- and `y`-axis each have linear padding to ensure the boundaries of the graph stay within the chart, but it can be adjusted. The graph object includes a label or the name of that graph and an array of values needed to create that graph. You can create more graph objects within the `graphs` array to have a chart displaying multiple graphs.
<figure class="axis_boxplot">
  <iframe 
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/default-boxplot?runonclick=1&codemirror=1&module=/index.js&view=preview" 
  ></iframe>
</figure>


# {#bubble}
### [#](#bubble) Bubble
Here is a live interactive demo of the default bubble axis chart without any extra configurations. This is similar to the sunburst chart where there is a root node and children nodes. Clicking on the bubbles will toggle it to collapse and group bubbles into one bigger bubble or expand one bigger bubble into multiple smaller bubbles. There is a generator to create the type of chart needed, in this case a bubble chart. The graph object includes a label or the name of that graph and an array of values needed to create that graph. You can create more graph objects within the graph array to have a chart displaying multiple graphs.
<figure class="axis_bubble">
  <iframe 
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/default-bubble?runonclick=1&codemirror=1&module=/index.js&view=preview" 
  ></iframe>
</figure>


 # {#line_default}
### [#](#line_default) Line Chart
Here is a live interactive demo of the default line axis chart without any extra configurations. 
<figure class="line_default">
  <iframe
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/basic-line?runonclick=0&codemirror=1&module=/index.js&view=preview" 
  ></iframe>
</figure>

# {#scatter}
### [#](#scatter) Scatter
Here is a live interactive demo of the default scatter axis chart without any extra configurations. There is a `generators` object to create the type of chart needed, in this case a scatter chart. The graph object includes a `label` (name) of that graph and an array of `values` needed to create that graph. You can create more graph objects within the `graphs` array to have a chart displaying multiple graphs.
<figure class="axis_scatter">
  <iframe 
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/default-scatter?runonclick=1&codemirror=1&module=/index.js&view=preview" 
  ></iframe>
</figure>

# {#properties}
### [#](#properties) Properties

This is a complete list of properties may be supplied to the axis chart datum. **Bold** properties are required.

{% include "./axisProperties.md" %}