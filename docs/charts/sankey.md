> [d2b](../README.md) › **Chart Sankey**

![Local Image](../gifs/chart-sankey.gif)

# {#generator}
[#](#generator) d2b.**chartSankey**()

Constructs a new sankey chart generator with the default settings.

When using the d2b-sankey generator you can draw a sankey chart onto each element in the selection.

# {#apply}
[#](#apply) *sankey*(*context*)

Render the sankey chart(s) to the given *context*, which may be either a [d3-selection](https://github.com/d3/d3-selection) of html containers (e.g. div) or a corresponding [d3-transition](https://github.com/d3/d3-transition).

Before applying the d2b-sankey-chart generator, you should join the data to the selected element(s) using [selection.data](https://github.com/d3/d3-selection#selection_data) or [selection.datum](https://github.com/d3/d3-selection#selection_datum). Here is the default data format.

```javascript
var sankey = d2b.chartSankey();

sankey.chartFrame().size({height: 500});

var chart = d3.select('.sankey-chart');

chart
    .datum({
      nodes: [
        {name: 'Node A'},
        {name: 'Node B'},
        {name: 'Node C'},
        {name: 'Node D'},
        {name: 'Node E'},
      ],
      links: [
        {source: 'Node A', target: 'Node E', value: 2},
        {source: 'Node A', target: 'Node C', value: 2},
        {source: 'Node B', target: 'Node C', value: 2},
        {source: 'Node B', target: 'Node D', value: 2},
        {source: 'Node C', target: 'Node D', value: 2},
        {source: 'Node C', target: 'Node E', value: 2},
        {source: 'Node D', target: 'Node E', value: 4},
      ]
    })
  .transition()
    .call(sankey);
```

# {#chart_frame}
[#](#chart_frame) sankey.**chartFrame**([*chartFrame*])

If *chartFrame* is specified, sets the *chartFrame* generator to the specified [d2b.chartFrame](../utils/chart_frame.md) and returns the sankey-chart generator. If *chartFrame* is not specified, returns the current *chartFrame* generator, which defaults to `d2b.chartFrame().legendEnabled(false).breadcrumbsEnabled(false)`.

The *chartFrame* can be configured at will.

# {#sankey}
[#](#sankey) sankey.**sankey**([*svgSankey*])

If *svgSankey* is specified, sets the *svgSankey* generator to the specified [d2b.svgSankey](../svg/sankey.md) and returns the sankey-chart generator. If *svgSankey* is not specified, returns the current *svgSankey* generator, which defaults to `d2b.sankey()`.

The *svgSankey* can be configured at will, except for the [size](../svg/sankey.md#size) property which will be set automatically by the sankey-chart.

# {#node_tooltip}
[#](#node_tooltip) sankey.**nodeTooltip**([*tooltip*])

If *tooltip* is specified, sets the *tooltip* generator to the specified [d2b.tooltip](../utils/tooltip.md) and returns the sankey-chart generator. If *tooltip* is not specified, returns the current *tooltip* generator, which defaults to:

```javascript
d2b.tooltip()
  .html(d => `<b>${d.key}</b>: ${d.value}`)
  .color(d => d.color)
  .followMouse(true);
```

The *tooltip* can be configured at will.

# {#link_tooltip}
[#](#link_tooltip) sankey.**linkTooltip**([*tooltip*])

If *tooltip* is specified, sets the *tooltip* generator to the specified [d2b.tooltip](../utils/tooltip.md) and returns the sankey-chart generator. If *tooltip* is not specified, returns the current *tooltip* generator, which defaults to:

```javascript
d2b.tooltip()
  .html(d => `<b>${d.key}</b>: ${d.value}`)
  .color(d => d.color)
  .followMouse(true);
```

The *tooltip* can be configured at will.
