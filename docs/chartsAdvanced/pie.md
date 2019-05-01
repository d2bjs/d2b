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

# {#pie_default}
### [#](#pie_default) Default Pie Chart
Here is a live interactive demo of the default pie chart without any extra configurations. Unlike the axis charts, pie charts do not need any generators since it is always going to be one type of chart. Each element in the datum array holds the information of each pie slice, such as the label (name) and value (size) of the slice.
<figure class="pie_default">
    <iframe 
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/pie/default?runonclick=1&codemirror=1&module=/index.js&view=preview" 
    frameborder="0" 
    allowfullscreen="true" 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true"></iframe>
</figure>

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

# {#donut}
### [#](#donut) Donut Chart
Here is a live interactive demo of the default donut chart without any extra configurations. It is almost identical to the default donut chart; however, the only difference when instantiating the chart, the `.donutRatio()` function is also called. 
<figure class="pie_default_donut">
    <iframe 
        src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/pie/default-donut?runonclick=1&codemirror=1&module=/index.js&view=preview"
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

# {#tooltip}
### [#](#tooltip) Tooltip
Here is a live interactive demo of the pie chart with tooltip property configurations. The tooltip is the textbox that appears when hovering over a pie slice. Each pie slice can have its own tooltip and there is also a global tooltip object that gets applied to all the tooltips in the chart.
<figure class="pie_tooltip">
    <iframe 
        src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/pie/tooltip?runonclick=1&codemirror=1&module=/index.js&view=preview" 
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
        src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/pie/typescript?runonclick=1&codemirror=1&module=/index.js&view=preview" 
        frameborder="0" 
        allowfullscreen="true" 
        mozallowfullscreen="true" 
        webkitallowfullscreen="true"
    ></iframe>
</figure>

# {#properties}
# [#](#properties) Properties

This is a complete list of properties that may be supplied to the axis chart datum. **Bold** properties are required.

{% include "./pieProperties.md" %}