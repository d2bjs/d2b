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

```javascript
var sunburst = d2b.chartsunburst().donutRatio(0.5);

sunburst.chartFrame().size({height: 400});

var chart = d3.select('.sunburst-chart');

chart
    .datum([
      {label: 'arc 1', value: 23, empty: true},
      {label: 'arc 2', value: 31},
      {label: 'arc 3', value: 80},
      {label: 'arc 4', value: 8}
    ])
  .transition()
    .call(sunburst);
```

# {#chart_frame}
[#](#chart_frame) sunburst.**chartFrame**([*chartFrame*])

If *chartFrame* is specified, sets the *chartFrame* generator to the specified [d2b.chartFrame](../utils/chart_frame.md) and returns the sunburst-chart generator. If *chartFrame* is not specified, returns the current *chartFrame* generator, which defaults to `d2b.chartFrame().legendEnabled(true).breadcrumbsEnabled(false)`.

The *chartFrame* can be configured at will.

# {#legend}
[#](#legend) sunburst.**legend**([*legend*])

If *legend* is specified, sets the *legend* generator to the specified [d2b.legend](../utils/legend.md) and returns the sunburst-chart generator. If *legend* is not specified, returns the current *legend* generator, which defaults to `legend().clickable(true).dblclickable(true)`.

The *legend* can be configured at will, except for the [html](../utils/legend.md#html), [empty](../utils/legend.md#empty), [setEmpty](../utils/legend.md#set_empty), [color](../utils/legend.md#color), and [values](../utils/legend.md#values) properties which will be set automatically by the sunburst-chart.

# {#tooltip}
[#](#tooltip) sunburst.**tooltip**([*tooltip*])

If *tooltip* is specified, sets the *tooltip* generator to the specified [d2b.tooltip](../utils/tooltip.md) and returns the sunburst-chart generator. If *tooltip* is not specified, returns the current *tooltip* generator, which defaults to:

```javascript
tooltip()
  .followMouse(true)
  .html(d => `<b>${$$.label(d.data)}</b>: ${$$.value(d.data)} (${percent(d.__percent__)})`)
```

The *tooltip* can be configured at will, except for the [color](../utils/tooltip.md#color) property which will be set automatically by the sunburst-chart.

# {#sort}
[#](#sort) sunburst.**sort**([*sort*])

If *sort* is specified, will propagate the specified sort function to the [d3.sunburst's](https://github.com/d3/d3-shape/blob/master/README.md#sunburst) [sort](https://github.com/d3/d3-shape/blob/master/README.md#sunburst_sort) property. If *sort* is not specified, returns the current *sort* accessor, which defaults to `() => null`.

### Datum Level Accessors

When the d2b sunburst-chart generator is applied to a selection, the following properties will be invoked. The function will be passed the element's bound [datum](https://github.com/d3/d3-selection#selection_datum) `d`.

# {#duration}
[#](#duration) sunburst.**duration**([*duration*])

If *duration* is specified, sets the duration of the internal chart transitions to the specified accessor function or value and returns the sunburst-chart generator. If *duration* is not specified, returns the current *duration* accessor, which defaults to `() => 250`.

# {#donut_ratio}
[#](#donut_ratio) sunburst.**donutRatio**([*donutRatio*])

If *donutRatio* is specified, sets the *donutRatio* to the specified accessor function or value and returns the sunburst-chart generator. If *donutRatio* is not specified, returns the current *donutRatio* accessor, which defaults to `() => 0`.

# {#start_angle}
[#](#start_angle) sunburst.**startAngle**([*startAngle*])

If *startAngle* is specified, sets the sunburst-chart start angle to the specified accessor function or angle in radians and returns the sunburst-chart generator. If *startAngle* is not specified, returns the current *startAngle* accessor, which defaults to `() => 0`.

# {#end_angle}
[#](#end_angle) sunburst.**endAngle**([*endAngle*])

If *endAngle* is specified, sets the sunburst-chart end angle to the specified accessor function or angle in radians and returns the sunburst-chart generator. If *endAngle* is not specified, returns the current *endAngle* accessor, which defaults to `() => 2 * Math.PI`.

# {#radius}
[#](#radius) sunburst.**radius**([*radius*])

If *radius* is specified, sets the sunburst-chart radius to the specified accessor function or value in pixels and returns the sunburst-chart generator. If *radius* is not specified, returns the current *radius* accessor, which defaults to:

```javascript
function (d, w, h) {
  return Math.min(w, h) / 2;
}
```

In addition to the element datum `d`, the *radius* accessor function is also provided with the chart width `w` and height `h`.

# {#at}
[#](#at) sunburst.**at**([*at*])

If *at* is specified, sets the sunburst-chart "at" location description to the specified accessor function, object, or string and returns the sunburst-chart generator. If *at* is not specified, returns the current *at* accessor, which defaults to `() => 'center center'`.

If *at* is a string it should be formatted like `'top left'`, `'at right'`, ..  To describe where the sunburst chart should fit within its frame.

If *at* is an object it should be formatted like `{x : w / 2, y: h / 2}`, where the x and y coordinates position the center of the sunburst chart within its frame.

In addition to the element datum `d`, the *at* accessor function is also provided with the chart width `w` and height `h`, as well as the sunburst radius `r`. These could be used to dynamically position the sunburst-chart like in the example below:

```javascript
function (d, w, h, r) {
  return { x: w / 2, y: h / 2 };
}
```

# {#values}
[#](#values) sunburst.**values**([*values*])

If *values* is specified, sets the *values* array to the specified accessor function or array and returns the sunburst-chart generator. If *values* is not specified, returns the current *values* accessor, which defaults to:

```javascript
function (d) {
  return d;
}
```

### Value Level Accessors

When the d2b sunburst-chart generator is applied to a selection, the following properties will be invoked for each element in the [values](#values) array. The function will be passed the value data `d` and the index position within the [values](#bubble_pack_children) array `i`.

```javascript
function (d) {
  // d => {
  //   label: 'Apples',
  //   value: 120
  // }
}
```

# {#color}
[#](#color) sunburst.**color**([*color*])

If *color* is specified, sets the *color* accessor to the specified accessor function and returns the sunburst generator. If *color* is not specified, returns the current *color* accessor, which defaults to:

```javascript
// define d3 color scale that will be used in the accessor
var color = d3.scaleOrdinal(d3.schemeCategory10);

function (d) {
  return color(d.label);
}
```

# {#key}
[#](#key) sunburst.**key**([*key*])

If *key* is specified, sets the *key* accessor to the specified accessor function and returns the sunburst generator. If *key* is not specified, returns the current *key* accessor, which defaults to:

```javascript
function (d) {
  return d.label;
}
```

If transitioning between data sets, the [key](#key) may be used to be sure that the matching sunburst arcs transition properly.
