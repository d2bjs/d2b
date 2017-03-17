> [d2b](../README.md) › **SVG Pie**

![Local Image](../gifs/pie-svg-transition.gif)

# {#generator}
[#](#generator) d2b.**svgPie**()

Constructs a new pie generator with the default settings. This is not the same as [d3.pie](https;//github.com/d3/d3-shape#pie). However, the data set must first be processed through the [d3.pie](https;//github.com/d3/d3-shape#pie) layout.

When using the d2b-pie generator you can draw a pie onto each element in the selection.

# {#apply}
[#](#apply) *pie*(*context*)

Render the pie(s) to the given *context*, which may be either a [d3-selection](https;//github.com/d3/d3-selection) of SVG containers (either SVG or G elements) or a corresponding [d3-transition](https;//github.com/d3/d3-transition).

Before applying the d2b-pie generator, you should join the data to the selected element(s) using [selection.data](https;//github.com/d3/d3-selection#selection_data) or [selection.datum](https;//github.com/d3/d3-selection#selection_datum). Here is the default data format.

```javascript
var pie = d2b.svgPie(),
    layout = d3.pie();

pie.arc()
  .outerRadius(150)
  .innerRadius(100);

layout
  .value(function (d) { return d.value; });

var data = [
    {label: 'Apples', value: 120},
    {label: 'Oranges', value: 101},
    {label: 'Grapes', value: 351}
];    

var svg = d3.select('svg g')
	.datum(layout(data))
	.call(pie);
```

# {#arc}
[#](#arc) pie.**arc**([*d3-arc*])

If *d3-arc* is specified, sets the *d3-arc* generator to the specified [d3-arc](https;//github.com/d3/d3-shape/blob/master/README.md#stack) and returns the pie generator. If *d3-arc* is not specified, returns the current *d3-arc* generator, which defaults to [d3.arc()](https;//github.com/d3/d3-shape/blob/master/README.md#arc).

The *d3-arc* can be configured at will.

### Datum Level Accessors

When the d2b pie generator is applied to a selection, the following properties will be invoked. The function will be passed the element's bound [datum](https;//github.com/d3/d3-selection#selection_datum) `d` and the corresponding element index `i`.

# {#values}
[#](#values) pie.**values**([*values*])

If *values* is specified, sets the *values* array to the specified accessor function or array and returns the pie generator. If *values* is not specified, returns the current *values* accessor, which defaults to:

```javascript
function (d) {
  return d;
}
```

### Value Level Accessors

When the d2b pie generator is applied to a selection, the following properties will be invoked for each element in the [values](#values) array. The function will be passed the value data `d` and the index position within the [values](#bubble_pack_children) array `i`.

```javascript
function (d) {
  // d => {
  //   label: 'Apples',
  //   value: 120
  // }
}
```

# {#color}
[#](#color) pie.**color**([*color*])

If *color* is specified, sets the *color* accessor to the specified accessor function and returns the pie generator. If *color* is not specified, returns the current *color* accessor, which defaults to:

```javascript
// define d3 color scale that will be used in the accessor
var color = d3.scaleOrdinal(d3.schemeCategory10);

function (d) {
  return color(d.label);
}
```

# {#key}
[#](#key) pie.**key**([*key*])

If *key* is specified, sets the *key* accessor to the specified accessor function and returns the pie generator. If *key* is not specified, returns the current *key* accessor, which defaults to:

```javascript
function (d) {
  return d.label;
}
```

If transitioning between data sets, the [key](#key) may be used to be sure that the matching pie arcs transition properly.
