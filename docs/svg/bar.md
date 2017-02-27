> [d2b](../README.md) › **SVG Bar**

# {#bar}
[#](bar.md#bar) d2b.**svgBar**()

Constructs a new bar generator with the default settings. The purpose of this module is to provide a common graph interface used in other types of graphs (e.g. area, line, bar).

When using the d2b-bar generator you can draw multiple bar graphs onto each element in the selection. This is shown in the data example below.

# {#bar_apply}
[#](bar.md#bar_apply) *bar*(*context*)

Render the bar(s) to the given *context*, which may be either a [d3-selection](https://github.com/d3/d3-selection) of SVG containers (either SVG or G elements) or a corresponding [d3-transition](https://github.com/d3/d3-transition).

Before applying the d2b-bar generator, you should join the data to the selected element(s) using [selection.data](https://github.com/d3/d3-selection#selection_data) or [selection.datum](https://github.com/d3/d3-selection#selection_datum). Here is the default data format.

```javascript
var bar = d2b.svgBar();

var datum = {
  graphs: [
    {
      label: 'Bar Graph 1',
      values: [
        {x: 1, y: 18},
        {x: 2, y: 10},
        {x: 3, y: 26},
        {x: 4, y: 35},
        {x: 5, y: 14},
      ]
    },
    {
      label: 'Bar Graph 2',
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
    .call(bar);  
```

# {#bar_type}
[#](bar.md#bar_type) bar.**type**()

Returns the string `bar`.

### Datum Level Accessors

When the d2b bar generator is applied to a selection, the following properties will be invoked. The function will be passed the element's bound [datum](https://github.com/d3/d3-selection#selection_datum) `d` and the corresponding element index `i`.

# {#bar_graphs}
[#](bar.md#bar_graphs) bar.**graphs**([*graphs*])

If *graphs* is specified, sets the *graphs* array to the specified accessor function or array and returns the bar generator. If *graphs* is not specified, returns the current *graphs* accessor, which defaults to:

```javascript
function (d) {
  return d.graphs;
}
```

### Graph Level Accessors

When the d2b bar generator is applied to a selection, the following properties will be invoked for each graph in the [graphs](#bar_graphs) array. The function will be passed the graph data `d` and the corresponding graph index `i`.

```javascript
function (d) {
  // Here is what d might contain
  // d => {
  //   label: 'Bar Graph 1',
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

# {#bar_x}
[#](bar.md#bar_x) bar.**x**([*x*])

If *x* is specified, sets the *x* scale to the specified accessor function or [d3-scale](https://github.com/d3/d3-scale) and returns the bar generator. If *x* is not specified, returns the current *x* scale accessor, which defaults to a [d3.scaleLinear()](https://github.com/d3/d3-scale#scaleLinear).

# {#bar_y}
[#](bar.md#bar_y) bar.**y**([*y*])

If *y* is specified, sets the *y* scale to the specified accessor function or [d3-scale](https://github.com/d3/d3-scale) and returns the bar generator. If *y* is not specified, returns the current *y* scale accessor, which defaults to [d3.scaleLinear()](https://github.com/d3/d3-scale#scaleLinear).

# {#bar_tooltip_graph}
[#](bar.md#bar_tooltip_graph) bar.**tooltipGraph**([*tooltip_graph*])

If *tooltip_graph* is specified, sets the *tooltip_graph* to the specified accessor function and returns the bar generator. If *tooltip_graph* is not specified, returns the current *tooltip_graph* accessor, which defaults to:

```javascript
  function (d) {
    return d.tooltipGraph;
  }
```

# {#bar_shift}
[#](bar.md#bar_shift) bar.**shift**([*shift*])

If *shift* is specified, sets the horizontal *shift* to the specified accessor function or value and returns the bar generator. If *shift* is not specified, returns the current *shift* accessor, which defaults to `() => null`.

If a `null` accessor is used this shift will be computed dynamically based on the type of [d3-scale](https://github.com/d3/d3-scale) being used. If a band scale is used then the shift will be set to half of the scales bandwidth.

# {#bar_stack_by}
[#](bar.md#bar_stack_by) bar.**stackBy**([*stack_by*])

If *stack_by* is specified, sets the *stack_by* accessor to the specified accessor function and returns the bar generator. If *stack_by* is not specified, returns the current *stack_by* accessor, which defaults to `() => null`.

If the accessor returns `falsy` then no graph stacking will be performed. If the accessor returns `truthy` then all graphs in a `datum` set will be stacked together. A more advanced method of stacking allows to stack specific graphs together, this can be done by using a stack property on the graph and setting the [stackBy](#bar_stack_by) accessor accordingly. In the example below there will be two graphs stacked together under the key `1`, two graphs stacked together under the key `2`, and one other graph that is denoted as stack `3`.

```javascript
bar.stackBy(function (d) {
  return d.stack;
});

data = {
  graphs: [
    {
      label: 'Bar Graph 1',
      stack: 1,
      values: []
    },
    {
      label: 'Bar Graph 2',
      stack: 1,
      values: []
    },
    {
      label: 'Bar Graph 3',
      stack: 2,
      values: []
    },
    {
      label: 'Bar Graph 4',
      stack: 2,
      values: []
    },
    {
      label: 'Bar Graph 5',
      stack: 3,
      values: []
    }
  ]
}
```

# {#bar_key}
[#](bar.md#bar_key) bar.**key**([*key*])

If *key* is specified, sets the graph *key* accessor to the specified accessor function and returns the bar generator. If *key* is not specified, returns the current *key* accessor, which defaults to `(d) => d.label`.

If you are transitioning from one data set to another the key function is useful in making sure the proper graphs get updated to their corresponding values.

# {#bar_color}
[#](bar.md#bar_color) bar.**color**([*color*])

If *color* is specified, sets the *color* accessor to the specified accessor function and returns the bar generator. If *color* is not specified, returns the current *color* accessor, which defaults to:

```javascript
// define d3 color scale that will be used in the accessor
var color = d3.scaleOrdinal(d3.schemeCategory10);

function (d) {
  return color(d.label);
}
```

If you are transitioning from one data set to another the key function is useful in making sure the proper graphs get updated to their corresponding values.

# {#bar_values}
[#](bar.md#bar_values) bar.**values**([*values*])

If *values* is specified, sets the *values* array to the specified accessor function or array and returns the bar generator. If *values* is not specified, returns the current *values* accessor, which defaults to:

```javascript
function (d) {
  return d.values;
}
```

### Value Level Accessors

When the d2b bar generator is applied to a selection, the following properties will be invoked for each element in the [values](#bar_values) array. The function will be passed the value data `d` and the index position within the [values](#bubble_pack_children) array `i`.

```javascript
function (d) {
  // d => {
  //   x: 1,
  //   y: 18
  // }
}
```

# {#bar_px}
[#](bar.md#bar_px) bar.**px**([*px*])

If *px* is specified, sets the *px* accessor to the specified accessor function and returns the bar generator. If *px* is not specified, returns the current *px* accessor, which defaults to:

```javascript
function (d) {
  return d.x;
}
```

# {#bar_py}
[#](bar.md#bar_py) bar.**py**([*py*])

If *py* is specified, sets the *py* accessor to the specified accessor function and returns the bar generator. If *py* is not specified, returns the current *py* accessor, which defaults to:

```javascript
function (d) {
  return d.y;
}
```

# {#bar_pcolor}
[#](bar.md#bar_pcolor) bar.**pcolor**([*color*])

If *color* is specified, sets the *color* accessor to the specified accessor function and returns the bar generator. If *color* is not specified, returns the current *color* accessor, which defaults to `() => null`.

If *color* is null then the corresponding graph [color](#bar_color) will be used.

# {#bar_pkey}
[#](bar.md#bar_pkey) bar.**pkey**([*key*])

If *key* is specified, sets the *key* accessor to the specified accessor function and returns the bar generator. If *key* is not specified, returns the current *key* accessor, which defaults to `(d, i) => i`.

If transitioning between data sets, the [key](#bar_pkey) may be used to be sure that the matching bar points transition properly.

### Other Methods

# {#bar_get_computed_graphs}
[#](bar.md#bar_get_computed_graphs) bar.**getComputedGraphs**(*context*)

Returns the array of computed graphs for the context's datum. This is not the same as the graphs array provided in the datum. This is a constructed graphs array that invokes all of the accessors described above. Usually this is used internally by the [d2b.chartAxis](../charts/chart-axis.md) module.

# {#bar_get_visible_points}
[#](bar.md#bar_get_visible_points) bar.**getVisiblePoints**(*context*)

Returns the array of visible points. This array will be formed by concatenating all of the graph values and invoking the [px](#bar_px) and [py](#bar_py) accessor for each. This is helpful when trying to dynamically update the scale domains based on the range of x and y values. Usually this is used internally by the [d2b.chartAxis](../charts/chart-axis.md) module.
