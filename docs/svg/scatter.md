> [d2b](../README.md) › **SVG Scatter**

![Local Image](../gifs/scatter-svg-transition.gif)

# {#generator}
[#](#generator) d2b.**svgScatter**()

Constructs a new scatter generator with the default settings. The purpose of this module is to provide a common graph API used in other types of graphs (e.g. scatter, line, bar).

When using the d2b-scatter generator you can draw multiple scatter graphs onto each element in the selection. This is shown in the data example below.

# {#apply}
[#](#apply) *scatter*(*context*)

Render the scatter(s) to the given *context*, which may be either a [d3-selection](https://github.com/d3/d3-selection) of SVG containers (either SVG or G elements) or a corresponding [d3-transition](https://github.com/d3/d3-transition).

Before applying the d2b-scatter generator, you should join the data to the selected element(s) using [selection.data](https://github.com/d3/d3-selection#selection_data) or [selection.datum](https://github.com/d3/d3-selection#selection_datum). Here is the default data format.

```javascript
var scatter = d2b.svgScatter();

var datum = {
  graphs: [
    {
      label: 'Scatter Graph 1',
      values: [
        {x: 1, y: 18},
        {x: 2, y: 10},
        {x: 3, y: 26},
        {x: 4, y: 35},
        {x: 5, y: 14},
      ]
    },
    {
      label: 'Scatter Graph 2',
      values: [
        {x: 1, y: 13},
        {x: 2, y: 26},
        {x: 3, y: 41},
        {x: 4, y: 14},
        {x: 5, y: 36},
      ]
    }
  ]
};

d3.select('.chart')
    .datum(datum)
    .call(scatter);  
```

# {#type}
[#](#type) scatter.**type**()

Returns the string `scatter`.

# {#stack}
[#](#stack) scatter.**stack**([*d3-stack*])

If *d3-stack* is specified, sets the *d3-stack* generator to the specified [d3-stack](https://github.com/d3/d3-shape/blob/master/README.md#stack) and returns the scatter generator. If *d3-stack* is not specified, returns the current *d3-stack* generator, which defaults to [d3.stack()](https://github.com/d3/d3-shape/blob/master/README.md#stack).

The *d3-stack* can be configured at will, except for the [keys](https://github.com/d3/d3-shape/blob/master/README.md#stack_keys) and [values](https://github.com/d3/d3-shape/blob/master/README.md#stack_value) properties which will be set automatically by the scatter generator.

Usually scatter graphs are not stacked by themselves, but if they are used to overlay on a stacked area graph then stacking should be used to make sure they are aligned.

# {#x}
[#](#x) scatter.**x**([*x*])

If *x* is specified, sets the *x* scale to the specified [d3-scale](https://github.com/d3/d3-scale) and returns the scatter generator. If *x* is not specified, returns the current *x* scale, which defaults to a [d3.scaleLinear()](https://github.com/d3/d3-scale#scaleLinear).

# {#y}
[#](#y) scatter.**y**([*y*])

If *y* is specified, sets the *y* scale to the specified [d3-scale](https://github.com/d3/d3-scale) and returns the area generator. If *y* is not specified, returns the current *y* scale, which defaults to a [d3.scaleLinear()](https://github.com/d3/d3-scale#scaleLinear).

### Datum Level Accessors

When the d2b scatter generator is applied to a selection, the following properties will be invoked. The function will be passed the element's bound [datum](https://github.com/d3/d3-selection#selection_datum) `d` and the corresponding element index `i`.

# {#graphs}
[#](#graphs) scatter.**graphs**([*graphs*])

If *graphs* is specified, sets the *graphs* array to the specified accessor function or array and returns the scatter generator. If *graphs* is not specified, returns the current *graphs* accessor, which defaults to:

```javascript
function (d) {
  return d.graphs;
}
```

### Graph Level Accessors

When the d2b scatter generator is applied to a selection, the following properties will be invoked for each graph in the [graphs](#graphs) array. The function will be passed the graph data `d` and the corresponding graph index `i`.

```javascript
function (d) {
  // Here is what d might contain
  // d => {
  //   label: 'Scatter Graph 1',
  //   values: [
  //     {x: 1, y: 18},
  //     {x: 2, y: 10},
  //     {x: 3, y: 26},
  //     {x: 4, y: 35},
  //     {x: 5, y: 14},
  //   ]
  // }
}
```

# {#tooltip_graph}
[#](#tooltip_graph) scatter.**tooltipGraph**([*tooltip_graph*])

If *tooltip_graph* is specified, sets the *tooltip_graph* to the specified accessor function and returns the scatter generator. If *tooltip_graph* is not specified, returns the current *tooltip_graph* accessor, which defaults to:

```javascript
  function (d) {
    return d.tooltipGraph;
  }
```

# {#shift}
[#](#shift) scatter.**shift**([*shift*])

If *shift* is specified, sets the horizontal *shift* to the specified accessor function or value and returns the scatter generator. If *shift* is not specified, returns the current *shift* accessor, which defaults to `() => null`.

If a `null` accessor is used this shift will be computed dynamically based on the type of [d3-scale](https://github.com/d3/d3-scale) being used. If a band scale is used then the shift will be set to half of the scales bandwidth.

# {#stack_by}
[#](#stack_by) scatter.**stackBy**([*stack_by*])

If *stack_by* is specified, sets the *stack_by* accessor to the specified accessor function and returns the scatter generator. If *stack_by* is not specified, returns the current *stack_by* accessor, which defaults to `() => null`.

If the accessor returns `falsy` then no graph stacking will be performed. If the accessor returns `truthy` then all graphs in a `datum` set will be stacked together. A more advanced method of stacking allows to stack specific graphs together, this can be done by using a stack property on the graph and setting the [stackBy](#stack_by) accessor accordingly. In the example below there will be two graphs stacked together under the key `1`, two graphs stacked together under the key `2`, and one other graph that is denoted as stack `3`.

```javascript
scatter.stackBy(function (d) {
  return d.stack;
});

data = {
  graphs: [
    {
      label: 'Scatter Graph 1',
      stack: 1,
      values: []
    },
    {
      label: 'Scatter Graph 2',
      stack: 1,
      values: []
    },
    {
      label: 'Scatter Graph 3',
      stack: 2,
      values: []
    },
    {
      label: 'Scatter Graph 4',
      stack: 2,
      values: []
    },
    {
      label: 'Scatter Graph 5',
      stack: 3,
      values: []
    }
  ]
}
```

# {#symbol}
[#](#symbol) scatter.**symbol**([*symbol*])

If *symbol* is specified, sets the graph *symbol* accessor to the specified accessor function and returns the scatter generator. If *symbol* is not specified, returns the current *symbol* accessor, which defaults to `(d) => d3.symbolCircle`.

This property should be set to one of the preset or custom [d3 symbols](https://github.com/d3/d3-shape#symbols). This symbol type will set the default symbol type for an entire graph.

# {#key}
[#](#key) scatter.**key**([*key*])

If *key* is specified, sets the graph *key* accessor to the specified accessor function and returns the scatter generator. If *key* is not specified, returns the current *key* accessor, which defaults to `(d) => d.label`.

If you are transitioning from one data set to another the key function is useful in making sure the proper graphs get updated to their corresponding values.

# {#color}
[#](#color) scatter.**color**([*color*])

If *color* is specified, sets the *color* accessor to the specified accessor function and returns the scatter generator. If *color* is not specified, returns the current *color* accessor, which defaults to:

```javascript
// define d3 color scale that will be used in the accessor
var color = d3.scaleOrdinal(d3.schemeCategory10);

function (d) {
  return color(d.label);
}
```

If you are transitioning from one data set to another the key function is useful in making sure the proper graphs get updated to their corresponding values.

# {#values}
[#](#values) scatter.**values**([*values*])

If *values* is specified, sets the *values* array to the specified accessor function or array and returns the scatter generator. If *values* is not specified, returns the current *values* accessor, which defaults to:

```javascript
function (d) {
  return d.values;
}
```

### Value Level Accessors

When the d2b scatter generator is applied to a selection, the following properties will be invoked for each element in the [values](#values) array. The function will be passed the value data `d` and the index position within the [values](#bubble_pack_children) array `i`.

```javascript
function (d) {
  // d => {
  //   x: 1,
  //   y: 18
  // }
}
```

# {#px}
[#](#px) scatter.**px**([*px*])

If *px* is specified, sets the *px* accessor to the specified accessor function and returns the scatter generator. If *px* is not specified, returns the current *px* accessor, which defaults to:

```javascript
function (d) {
  return d.x;
}
```

# {#py}
[#](#py) scatter.**py**([*py*])

If *py* is specified, sets the *py* accessor to the specified accessor function and returns the scatter generator. If *py* is not specified, returns the current *py* accessor, which defaults to:

```javascript
function (d) {
  return d.y;
}
```

# {#pcolor}
[#](#pcolor) scatter.**pcolor**([*color*])

If *color* is specified, sets the *color* accessor to the specified accessor function and returns the scatter generator. If *color* is not specified, returns the current *color* accessor, which defaults to `() => null`.

If *color* is null then the corresponding graph [color](#color) will be used.

# {#psymbol}
[#](#psymbol) scatter.**psymbol**([*symbol*])

If *symbol* is specified, sets the *symbol* accessor to the specified accessor function and returns the scatter generator. If *symbol* is not specified, returns the current *symbol* accessor, which defaults to `() => null`.

If *symbol* is `null` then the corresponding graph [symbol](#symbol) type will be used.

# {#psize}
[#](#psize) scatter.**psize**([*size*])

If *size* is specified, sets the *size* accessor to the specified accessor function and returns the scatter generator. If *size* is not specified, returns the current *size* accessor, which defaults to `() => 25`. The *size* is a numerical value corresponding to the pixel area of the defined symbol type.

# {#pkey}
[#](#pkey) scatter.**pkey**([*key*])

If *key* is specified, sets the *key* accessor to the specified accessor function and returns the scatter generator. If *key* is not specified, returns the current *key* accessor, which defaults to `(d, i) => i`.

If transitioning between data sets, the [key](#pkey) may be used to be sure that the matching scatter points transition properly.

### Other Methods

# {#get_computed_graphs}
[#](#get_computed_graphs) scatter.**getComputedGraphs**(*context*)

Returns the array of computed graphs for the context's datum. This is not the same as the graphs array provided in the datum. This is a constructed graphs array that invokes all of the accessors described above. Usually this is used internally by the [d2b.chartAxis](../charts/chart-axis.md) module.

# {#get_visible_points}
[#](#get_visible_points) scatter.**getVisiblePoints**(*context*)

Returns the array of visible points. This array will be formed by concatenating all of the graph values and invoking the [px](#px) and [py](#py) accessor for each. This is helpful when trying to dynamically update the scale domains based on the range of x and y values. Usually this is used internally by the [d2b.chartAxis](../charts/chart-axis.md) module.
