> [d2b](../README.md) › **Chart Sunburst**

![Local Image](../gifs/chart-sunburst.gif)

# {#generator}
[#](#generator) d2b.**chartSunburst**()

Constructs a new sunburst chart generator with the default settings.

When using the d2b-sunburst generator you can draw a sunburst chart onto each element in the selection.

# {#apply}
[#](#apply) *sunburst*(*context*)

Render the sunburst chart(s) to the given *context*, which may be either a [d3-selection](https://github.com/d3/d3-selection) of html containers (e.g. div) or a corresponding [d3-transition](https://github.com/d3/d3-transition).

Before applying the d2b-sunburst-chart generator, you should join the data to the selected element(s) using [selection.data](https://github.com/d3/d3-selection#selection_data) or [selection.datum](https://github.com/d3/d3-selection#selection_datum). Here is the default data format.

{% include "./sunburstProperties.md" %}