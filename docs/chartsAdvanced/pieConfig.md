> [d2b](../README.md) › **Chart Pie**

<!-- ![Local Image](../gifs/chart-pie.gif) -->


# {#generator}
[#](#generator) d2b.**chartPie**()

Constructs a new pie chart generator with the default settings.

When using the d2b-pie generator you can draw a pie chart onto each element in the selection.

# {#apply}
[#](#apply) pie.**advanced**(*context*)

Render the pie chart(s) to the given *context*, which may be either a [d3-selection](https://github.com/d3/d3-selection) of html containers (e.g. div) or a corresponding [d3-transition](https://github.com/d3/d3-transition).

Before applying the d2b-pie-chart generator, you should join the data to the selected element(s) using [selection.data](https://github.com/d3/d3-selection#selection_data) or [selection.datum](https://github.com/d3/d3-selection#selection_datum).

# {#basic}
### [#](#basic) Basic
Here is a live interactive demo of the pie chart with basic property configurations. Some of these configurations include color, legend icon visibility, and legend icon symbols.
<figure class="pie_basic">
    <iframe 
        src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/pie/basic?runonclick=1&codemirror=1&module=/index.js&view=preview" 
        frameborder="0" 
        allowfullscreen="true" 
        mozallowfullscreen="true" 
        webkitallowfullscreen="true"
    ></iframe>
</figure>

# {#legend}
### [#](#Legend) Legend
Here is a live interactive demo of the pie chart with legend property configurations. Some of these configurations include legend icon clickability, icon symbols, and orientation.
<figure class="pie_legend">
    <iframe
        src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/pie/legend?runonclick=1&codemirror=1&module=/index.js&view=preview" 
        frameborder="0" 
        allowfullscreen="true" 
        mozallowfullscreen="true" 
        webkitallowfullscreen="true"
    ></iframe>
</figure>

# {#pad_angle}
### [#](#pad_angle) Pad Angle
Here is a live interactive demo of the pie chart with pad angle property configurations.
<figure class="pie_pad_angle">
    <iframe
        src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/pie/pad-angle?runonclick=1&codemirror=1&module=/index.js&view=preview" 
        frameborder="0" 
        allowfullscreen="true" 
        mozallowfullscreen="true" 
        webkitallowfullscreen="true"
    ></iframe>
</figure>

# {#tooltip}
### [#](#tooltip) Tooltip
Here is a live interactive demo of the pie chart with tooltip property configurations. The tooltip is the textbox that appears when hovering over a pie slice. Each pie slice can have its own `tooltip` property. There is also a global `tooltip` object that gets applied to all the tooltips in the chart.
<figure class="pie_tooltip">
    <iframe 
        src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/pie/tooltip?runonclick=1&codemirror=1&module=/index.js&view=preview" 
        frameborder="0" 
        allowfullscreen="true" 
        mozallowfullscreen="true" 
        webkitallowfullscreen="true"
    ></iframe>
</figure>

# {#transition}
### [#](#transition) Transition
Here is a live interactive demo of the pie chart with a transition configuration. If the button "Change Data!" is clicked, the pie chart will toggle between different data to demonstrate the transition animations. `.transition()` is used on the chart and chained with the desired `.duration(2000)` of microseconds. 
<figure class="pie_tooltip">
    <iframe 
        src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/pie/transition?runonclick=1&codemirror=1&module=/index.js&view=preview" 
        frameborder="0" 
        allowfullscreen="true" 
        mozallowfullscreen="true" 
        webkitallowfullscreen="true"
    ></iframe>
</figure>

# {#typescript}
### [#](#typescript) Typescript
Here is a live interactive demo of the default pie chart without any extra configurations using typescript. Typescript ensures proper types and properties are used when creating objects, arrays, etc. 
<figure class="pie_typescript">
    <iframe 
        src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/pie/typescript?runonclick=1&codemirror=1&module=/index.ts&view=preview" 
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