> [d2b](../README.md) › **Chart Pie**

![Local Image](../gifs/chart-pie.gif)

# {#generator}
[#](#generator) d2b.**chartPie**()

Constructs a new pie chart generator with the default settings.

When using the d2b-pie generator you can draw a pie chart onto each element in the selection.

# {#apply}
[#](#apply) pie.**advanced**(*context*)

Render the pie chart(s) to the given *context*, which may be either a [d3-selection](https://github.com/d3/d3-selection) of html containers (e.g. div) or a corresponding [d3-transition](https://github.com/d3/d3-transition).

Before applying the d2b-pie-chart generator, you should join the data to the selected element(s) using [selection.data](https://github.com/d3/d3-selection#selection_data) or [selection.datum](https://github.com/d3/d3-selection#selection_datum).

{% include "./pieProperties.md" %}