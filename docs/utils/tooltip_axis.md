> [d2b](../README.md) › **Tooltip Axis**

The d2b tooltip-axis component allows for a tooltip to be added to an axis chart based on a set of data points. Unlike most other d2b components, tooltip-axis is limited to 1 chart per generator. Here is a simple example using the tooltip axis for two "graphs".

```javascript
var svg = d3.select('svg');

// construct a graph of circles

var circleData = [
  {x: 100, y: 100, color: 'red'},
  {x: 200, y: 200, color: 'purple'},
  {x: 300, y: 300, color: 'blue'},
  {x: 400, y: 400, color: 'green'},
]

var circle = svg.selectAll('circle').data(circleData);

circle.enter()
  .append('circle')
    .attr('r', 10)
    .style('fill', function (d) { return d.color; })
    .attr('cx', function (d) { return d.x; })
    .attr('cy', function (d) { return d.y; });

// construct a graph of rects

var rectData = [
  {x: 100, y: 320, color: 'orange'},
  {x: 200, y: 36, color: 'gray'},
  {x: 300, y: 450, color: 'steelblue'},
  {x: 400, y: 310, color: 'black'},
]

var rect = svg.selectAll('rect').data(rectData);

rect.enter()
  .append('rect')
    .attr('width', 10)
    .attr('height', 10)
    .style('fill', function (d) { return d.color; })
    .attr('x', function (d) { return d.x - 5; })
    .attr('y', function (d) { return d.y - 5; });


// configure the tooltip-axis

var tooltipAxis = d2b.tooltipAxis();

tooltipAxis
  // svg container to know where to add grid markers
  .svgContainer(svg)
  // size of the axis
  .size({width: 500, height: 500})
  // title or header accessor for the tooltip
  .title(function (d) { return d[0].x; })
  // row accessor for the tooltip
  .row(function (d) { return d.y; })
  // row-color accessor for the tooltip
  .color(function (d) { return d.color; })
  // max distance that a tooltip will be generated for a set of points
  .threshold(100)
  // container where the mouse events will be bound
  .tracker(svg);

// create circle tooltip graph and supply data
tooltipAxis.graph('circle').data(circleData);

// create rect tooltip graph and supply data
tooltipAxis.graph('rect').data(rectData);
```

# {#generator}
[#](#generator) d2b.**tooltipAxis**()

Constructs a new **tooltipAxis** generator.

# {#html_container}
[#](#html_container) tooltipAxis.**htmlContainer**([*selection*])

If *selection* is specified, the html container will be set. Newly created tooltips will be placed within this container. If *selection* is not specified, returns the current tooltip selection. The default selection is `d3.select('body')`.

# {#svg_container}
[#](#svg_container) tooltipAxis.**svgContainer**([*selection*])

If *selection* is specified, the svg container will be set. The svgContainer is used to insert grid markers to illustrate the closest axis-chart point(s). It is also used to identify the (0, 0) pixel position axis relative to the document. If *selection* is not specified, returns the current svg container.

- The svgContainer must be a svg or g element.
- The top left (0, 0) corner of the svgContainer must be exactly aligned with the top left corner of the axes.

# {#tracker}
[#](#tracker) tooltipAxis.**tracker**([*selection*])

If *selection* is specified, the event tracker element will be set. The tracker element is used to bind mouseover, mouseout, and mousemove tooltip events. These events are used for creating, updating, and destroying the tooltip components. If *selection* is not specified, returns the current tracker, which defaults to `d3.select('body')`.

# {#track_x}
[#](#track_x) tooltipAxis.**trackX**([*boolean*])

If *boolean* is specified, the x tracking will be enabled or disabled. If *boolean* is `true` the tooltip will search for points that are closest to the cursor in the horizontal direction. If *boolean* is `false` the tooltip will include the whole range of point x-values. At least one of trackX or trackY must be true. If *boolean* is not specified returns the current track-x *boolean*, which defaults to `true`.

# {#track_y}
[#](#track_y) tooltipAxis.**trackY**([*boolean*])

If *boolean* is specified, the y tracking will be enabled or disabled. If *boolean* is `true` the tooltip will search for points that are closest to the cursor in the vertical direction. If *boolean* is `false` the tooltip will include the whole range of point y-values. At least one of trackX or trackY must be true. If *boolean* is not specified returns the current track-x *boolean*, which defaults to `false`.

# {#size}
[#](#size) tooltipAxis.**size**([*size*])

If *size* is specified, sets the size of the axes. Size is used to properly determine the width / height of the tooltip grid-markers. Size should be an object in the format `{width: 960, height: 500}`. If *size* is not specified returns the current size.

# {#clear}
[#](#clear) tooltipAxis.**clear**([*groupName*[, *graphName*]])

If *groupName* and *graphName* are specified, clears the specific tooltip graph data. If *groupName* is specified but not *graphName* then the data for the entire group is cleared. If no arguments are supplied, then all tooltip data will be cleared.

# {#title}
[#](#title) tooltipAxis.**title**([*title*])

If *title* is specified, sets the title-accessor to the specified function or string. If *title* is not specified, returns the current title-accessor, which defaults to `() => null`. This accessor will determine what is set as the title of the tooltip when rendered. It is supplied with the set of points to be rendered as rows in the tooltip.

```javascript
tooltipAxis.title( function (rows) {
  // An appropriate title might be the common x-value,
  // assuming the tooltip is used for x-tracking.
  return rows[0].x;

  // The returned title can also be html. For example,
  // if the title needs to be in italics.
  return '<i>' + rows[0].x + '</i>';
});
```

### Tooltip Row Accessors

The following tooltip accessors will be invoked for each row in each of the supplied graphs. The accessors will be supplied with the point data `d` and index within their corresponding graph `i`.

# {#x}
[#](#x) tooltipAxis.**x**([*x*])

If *x* is specified, sets the x-accessor to the specified function or string. If *x* is not specified, returns the current x-accessor, which defaults to `() => d.x`. The x-accessor identifies the x *pixel* location of each point relative to the axes.

```javascript
var width = 960;
var x = d3.scaleLinear().domain([0, 100]).range([0, width]);

tooltipAxis.x( function (d) {
  return x(d.x);
});
```

# {#y}
[#](#y) tooltipAxis.**y**([*y*])

If *y* is specified, sets the y-accessor to the specified function or string. If *y* is not specified, returns the current y-accessor, which defaults to `() => d.y`. The y-accessor identifies the y *pixel* location of each point relative to the axes.

```javascript
var height = 500;
var y = d3.scaleLinear().domain([0, 50]).range([0, height]);

tooltipAxis.y( function (d) {
  return y(d.y);
});
```

# {#color}
[#](#color) tooltipAxis.**color**([*color*])

If *color* is specified, sets the color-accessor to the specified function or string. If *color* is not specified, returns the current color-accessor, which defaults to `null`. The color-accessor determines what color should be associated with each row in the rendered tooltip.

# {#row}
[#](#row) tooltipAxis.**row**([*row*])

If *row* is specified, sets the row-accessor to the specified function or string. If *row* is not specified, returns the current row-accessor, which defaults to `null`. This accessor will determine what is set for each row of the rendered tooltip.

```javascript
tooltipAxis.row( function (d) {
  // An appropriate title might be the y-value,
  // assuming the tooltip is used for x-tracking.
  return d.y;

  // The returned title can also be html. For example,
  // if the row needs to be bold.
  return '<b>' + d.y + '</b>';
});
```

# {#on}
[#](#on) tooltipAxis.**on**([*type*[, *listener*]])

Registers the specified listener to receive events of the specified type from the tooltip behavior. (see d3's [dispatch](https://github.com/mbostock/d3/wiki/Internals#d3_dispatch) for additional details.) The following events are supported:

- *insert*  - when a tooltip is inserted
- *move*    - when a tooltip is moved
- *remove*  - when a tooltip is removed

Each listener will be supplied with the tooltip selection `this`, and input arguments for the data and selection index.

### Tooltip Axis Graph

In order to populate the tooltip with point data you must specify one or more graphs.

# {#graph}
[#](#graph) tooltipAxis.**graph**([*groupName*[, *graphName*]])

Returns the current or creates a new tooltip graph that is identified by the supplied *groupName* and *graphName*. If either *groupName* or *graphName* are unspecified, `null` will be used.

```javascript
var graph = tooltipAxis.graph('bar', 'one');
```

# {#graph_add_point}
[#](#add_point) graph.**addPoint**(*point*)

Used to add an individual point to the graph data array.

```javascript
graph.addPoint({x: 10, y: 52});
```

# {#graph_data}
[#](#data) graph.**data**(*data*)

Used to set the graph data to the supplied array of points.

```javascript
graph.data([
  {x: 10, y: 52},
  {x: 20, y: 31},
  {x: 30, y: 86},
  {x: 40, y: 33},
]);
```

# {#graph_x}
[#](#graph_x) graph.**x**(*x*)

If *x* is specified, sets the x-accessor to the specified function or string. If *x* is not specified, returns the current x-accessor. The x-accessor identifies the x *pixel* location of each point relative to the axes. When this accessor returns non-null it will override the tooltip's [x-accessor](#x), thus allowing the user to have custom accessors for each graph.

```javascript
var width = 960;
var x = d3.scaleLinear().domain([0, 100]).range([0, width]);

graph.x( function (d) {
  return x(d.x);
});
```

# {#graph_y}
[#](#graph_y) graph.**y**(*y*)

If *y* is specified, sets the y-accessor to the specified function or string. If *y* is not specified, returns the current y-accessor. The y-accessor identifies the y *pixel* location of each point relative to the axes. When this accessor returns non-null it will override the tooltip's [y-accessor](#y), thus allowing the user to have custom accessors for each graph.

```javascript
var height = 500;
var y = d3.scaleLinear().domain([0, 100]).range([0, height]);

graph.y( function (d) {
  return y(d.y);
});
```

# {#graph_color}
[#](#graph_color) graph.**color**(*color*)

If *color* is specified, sets the color-accessor to the specified function or string. If *color* is not specified, returns the current [color-accessor](#color). The color-accessor determines what color should be associated with each row in the rendered tooltip. When this accessor returns non-null it will override the tooltip's color-accessor, thus allowing the user to have custom accessors for each graph.

# {#graph_row}
[#](#graph_row) graph.**row**(*row*)

If *row* is specified, sets the row-accessor to the specified function or string. If *row* is not specified, returns the current row-accessor. This accessor will determine what is set for each row of the rendered tooltip. When this accessor returns non-null it will override the tooltip's [row-accessor](#row), thus allowing the user to have custom accessors for each graph.

```javascript
graph.row( function (d) {
  // An appropriate title might be the y-value,
  // assuming the tooltip is used for x-tracking.
  return d.y;

  // The returned title can also be html. For example,
  // if the row needs to be bold.
  return '<b>' + d.y + '</b>';
});
```

# {#tooltip_axis_with_svg_graph}
### Using Tooltip Axis with a [d2b-graph](../svg/graphs.md)

All of the [d2b-graph](../svg/graphs.md) types can be configured to easily use the tooltip-axis. To do this simply supply each graph object with it's own [tooltipAxis.graph](#graph). The example below is for a line graph but this functionality extends to all graph types.

```javascript
var line = d2b.svgLine(),
    x = d3.scaleLinear().domain([1, 5]).range([0, 960]),
    y = d3.scaleLinear().domain([100, 0]).range([0, 500]);

line.x(x).y(y);

var svg = d3.select('svg');

// construct and confiture the tooltip axis
var tooltipAxis = d2b.tooltipAxis();

tooltipAxis
  .svgContainer(svg)
  .tracker(svg)
  .title(function (d) { return d[0].x; })
  .row(function (d) { return d.y; })
  .size({width: 960, height: 500});

svg
  .datum([
    {
      label: 'Line Graph 1',
      // add a tooltip graph for the first line graph
      tooltipGraph: tooltipAxis.graph('line', 'graph 1'),
      values: [
        { x: 1, y: 22 },
        { x: 2, y: 41 },
        { x: 3, y: 36 },
        { x: 4, y: 51 },
        { x: 5, y: 10 }
      ]
    },
    {
      label: 'Line Graph 2',
      // and for the second line graph
      tooltipGraph: tooltipAxis.graph('line', 'graph 2'),
      values: [
        { x: 1, y: 12 },
        { x: 2, y: 15 },
        { x: 3, y: 60 },
        { x: 4, y: 31 },
        { x: 5, y: 40 }
      ]
    }
  ])
  .call(line);  
```
