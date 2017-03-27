> [d2b](../README.md) › **Chart Pie**

![Local Image](../gifs/chart-pie.gif)

# {#generator}
[#](#generator) d2b.**chartPie**()

Constructs a new pie chart generator with the default settings.

When using the d2b-pie generator you can draw a pie chart onto each element in the selection.

# {#apply}
[#](#apply) *pie*(*context*)

Render the pie chart(s) to the given *context*, which may be either a [d3-selection](https://github.com/d3/d3-selection) of html containers (e.g. div) or a corresponding [d3-transition](https://github.com/d3/d3-transition).

Before applying the d2b-pie-chart generator, you should join the data to the selected element(s) using [selection.data](https://github.com/d3/d3-selection#selection_data) or [selection.datum](https://github.com/d3/d3-selection#selection_datum). Here is the default data format.

```javascript
var pie = d2b.chartPie().donutRatio(0.5);

pie.chartFrame().size({height: 400});

var chart = d3.select('.pie-chart');

chart
    .datum([
      {label: 'arc 1', value: 23, empty: true},
      {label: 'arc 2', value: 31},
      {label: 'arc 3', value: 80},
      {label: 'arc 4', value: 8}
    ])
  .transition()
    .call(pie);
```

# {#chart_frame}
[#](#chart_frame) pie.**chartFrame**([*chartFrame*])

If *chartFrame* is specified, sets the *chartFrame* generator to the specified [d2b.chartFrame](../utils/chart_frame.md) and returns the pie-chart generator. If *chartFrame* is not specified, returns the current *chartFrame* generator, which defaults to `d2b.chartFrame().legendEnabled(true).breadcrumbsEnabled(false)`.

The *chartFrame* can be configured at will.

# {#legend}
[#](#legend) pie.**legend**([*legend*])

If *legend* is specified, sets the *legend* generator to the specified [d2b.legend](../utils/legend.md) and returns the pie-chart generator. If *legend* is not specified, returns the current *legend* generator, which defaults to `d2b.legend().clickable(true).dblclickable(true)`.

The *legend* can be configured at will, except for the [html](../utils/legend.md#html), [color](../utils/legend.md#color), [key](../utils/legend.md#key), and [values](../utils/legend.md#values) properties which will be set automatically by the pie-chart.

# {#tooltip}
[#](#tooltip) pie.**tooltip**([*tooltip*])

If *tooltip* is specified, sets the *tooltip* generator to the specified [d2b.tooltip](../utils/tooltip.md) and returns the pie-chart generator. If *tooltip* is not specified, returns the current *tooltip* generator, which defaults to:

```javascript
  const percent = d3.format('.0%');
  d2b.tooltip()
    .followMouse(true)
    .html(d => `<b>${pie.label()(d.data)}</b>: ${pie.value()(d.data)} (${percent(d.__percent__)})`)
```

The *tooltip* can be configured at will, except for the [color](../utils/tooltip.md#color) property which will be set automatically by the pie-chart.

# {#pie}
[#](#pie) pie.**pie**([*d2b-pie*])

If *d2b-pie* is specified, sets the *d2b-pie* generator to the specified [d2b.svgPie](../svg/pie.md) and returns the pie-chart generator. If *d2b-pie* is not specified, returns the current *d2b-pie* generator, which defaults to `() => d2b.svgPie()`.

The *d2b-pie* generator can be configured at will, except for the [value](../svg/pie.md#value), [color](../svg/pie.md#color), [key](../svg/pie.md#key), and [values](../svg/pie.md#values) properties which will be set automatically by the pie-chart.

### Datum Level Accessors

When the d2b pie-chart generator is applied to a selection, the following properties will be invoked. The function will be passed the element's bound [datum](https://github.com/d3/d3-selection#selection_datum) `d`.

# {#duration}
[#](#duration) pie.**duration**([*duration*])

If *duration* is specified, sets the duration of the internal chart transitions to the specified accessor function or value and returns the pie-chart generator. If *duration* is not specified, returns the current *duration* accessor, which defaults to `() => 250`.

# {#donut_ratio}
[#](#donut_ratio) pie.**donutRatio**([*donutRatio*])

If *donutRatio* is specified, sets the *donutRatio* to the specified accessor function or value and returns the pie-chart generator. If *donutRatio* is not specified, returns the current *donutRatio* accessor, which defaults to `() => 0`.

# {#radius}
[#](#radius) pie.**radius**([*radius*])

If *radius* is specified, sets the pie-chart radius to the specified accessor function or value in pixels and returns the pie-chart generator. If *radius* is not specified, returns the current *radius* accessor, which defaults to:

```javascript
function (d, w, h) {
  return Math.min(w, h) / 2;
}
```

In addition to the element datum `d`, the *radius* accessor function is also provided with the chart width `w` and height `h`.

# {#at}
[#](#at) pie.**at**([*at*])

If *at* is specified, sets the pie-chart "at" location description to the specified accessor function, object, or string and returns the pie-chart generator. If *at* is not specified, returns the current *at* accessor, which defaults to `() => 'center center'`.

If *at* is a string it should be formatted like `'top left'`, `'at right'`, ..  To describe where the pie chart should fit within its frame.

If *at* is an object it should be formatted like `{x : w / 2, y: h / 2}`, where the x and y coordinates position the center of the pie chart within its frame.

In addition to the element datum `d`, the *at* accessor function is also provided with the chart width `w` and height `h`, as well as the pie radius `r`. These could be used to dynamically position the pie-chart like in the example below:

```javascript
function (d, w, h, r) {
  return { x: w / 2, y: h / 2 };
}
```

# {#values}
[#](#values) pie.**values**([*values*])

If *values* is specified, sets the *values* array to the specified accessor function or array and returns the pie-chart generator. If *values* is not specified, returns the current *values* accessor, which defaults to:

```javascript
function (d) {
  return d;
}
```

### Value Level Accessors

When the d2b pie-chart generator is applied to a selection, the following properties will be invoked for each element in the [values](#values) array. The function will be passed the value data `d`.

```javascript
function (d) {
  // d => {
  //   label: 'Apples',
  //   value: 120
  // }
}
```

# {#value}
[#](#value) pie.**value**([*value*])

If *value* is specified, sets the *value* accessor to the specified accessor function and returns the pie-chart generator. If *value* is not specified, returns the current *value* accessor, which defaults to:

```javascript
function (d) {
  return d.value;
}
```

# {#color}
[#](#color) pie.**color**([*color*])

If *color* is specified, sets the *color* accessor to the specified accessor function and returns the pie-chart generator. If *color* is not specified, returns the current *color* accessor, which defaults to:

```javascript
// define d3 color scale that will be used in the accessor
var color = d3.scaleOrdinal(d3.schemeCategory10);

function (d) {
  return color(d.label);
}
```

# {#key}
[#](#key) pie.**key**([*key*])

If *key* is specified, sets the *key* accessor to the specified accessor function and returns the pie-chart generator. If *key* is not specified, returns the current *key* accessor, which defaults to:

```javascript
function (d) {
  return d.label;
}
```

If transitioning between data sets, the [key](#key) may be used to be sure that the matching pie arcs transition properly.

# {#label}
[#](#label) pie.**label**([*label*])

If *label* is specified, sets the *label* accessor to the specified accessor function and returns the pie-chart generator. If *label* is not specified, returns the current *label* accessor, which defaults to:

```javascript
function (d) {
  return d.label;
}
```

Label is used to populate the legend and default tooltip contents.
