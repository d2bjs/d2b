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



# {#donut}
### [#](#donut) Donut Chart
Here is a live interactive demo of the default donut chart without any extra configurations. It is almost identical to the default donut chart; however, the only difference when instantiating the chart, the `.donutRatio()` function is also called. 
<figure class="pie_default_donut">
    <iframe 
        src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/pie/default-donut?runonclick=1&codemirror=1&module=/index.js&view=preview"
    ></iframe>
</figure>

# {#pie_default}
### [#](#pie_default) Default Pie Chart
Here is a live interactive demo of the default pie chart without any extra configurations. Unlike the axis charts, pie charts do not need any generators since it is always going to be one type of chart. Each element in the `datum` array holds the information of each pie slice, such as the `label` (name) and `value` (size) of the slice.
<figure class="pie_default">
    <iframe 
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/pie/default?runonclick=1&codemirror=1&module=/index.js&view=preview" 
    ></iframe>
</figure>

# {#properties}
### [#](#properties) Properties

This is a complete list of properties may be supplied to the axis chart datum. **Bold** properties are required.

{% include "./axisProperties.md" %}