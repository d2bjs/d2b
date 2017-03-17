> [d2b](../README.md) › **Tooltip**

The d2b tooltip component allows for a simple tooltip to be added to DOM elements.

If you want a tooltip generator geared towards axis-charts then you might want to check out [d2b.tooltipAxis](axis.md)

# {#generator}
[#](#tooltip) d2b.**tooltip**()

Constructs a new tooltip generator.

# {#apply}
[#](#apply) *tooltip*(*context*)

Apply the tooltip to a [d3-selection](https;//github.com/d3/d3-selection). Bind `mouseover`, `mousemove`, and `mouseout` tooltip events for the specified selection of elements. For example:

```javascript
var circleData = [
  {x: 100, y: 100, color: 'red'},
  {x: 200, y: 200, color: 'purple'},
  {x: 300, y: 300, color: 'blue'},
  {x: 400, y: 400, color: 'green'},
]

var circle = d3.select('svg').selectAll('circle').data(circleData);

// construct a new tooltip generator
var tooltip = d2b.tooltip();

// configure the tooltip to use the proper html and color accessors
tooltip
  .html(function (d) { return 'x: ' + d.x + ' y: ' + d.y; })
  .color(function (d) { return d.color; });

circle.enter()
  .append('circle')
    .attr('r', 10)
    .style('fill', function (d) { return d.color; })
    .attr('cx', function (d) { return d.x; })
    .attr('cy', function (d) { return d.y; })
    // this is where the tooltip is applied to the selection context
    .call(tooltip);
```

# {#container}
[#](#container) tooltip.**container**([*selection*])

If *selection* is specified, the container will be set. Newly created tooltips will be placed within this container. If *selection* is not specified, returns the current tooltip selection, which defaults to `d3.select('body')`.

# {#clear}
[#](#clear) tooltip.**clear**([*selection*])

Clears the tooltip events for the *selection*.

```javascript
var tooltip = d2b.tooltip();

// bind tooltip events
d3.selectAll('.node').call(tooltip);

// clear tooltip events
d3.selectAll('.node').call(tooltip.clear);
```

### Tooltip Accessors

Each of the following accessor properties will be invoked whenever one or both of a `mouseover` or `mousemove` event occurs on the applied element. The accessor function will be passed the element's bound datum `d`, index `i`, and the DOM element context `this`.

# {#follow_mouse}
[#](#follow_mouse) tooltip.**followMouse**([*boolean*])

If *boolean* is specified, sets the follow-mouse-accessor to the specified function or boolean. If *boolean* is not specified, returns the current follow-mouse-accessor, which defaults to `() => false`.

The *boolean* decides whether or not the tooltip for the current node will follow the mouse or be positioned by the `at` accessor.

# {#color}
[#](#color) tooltip.**color**([*color*])

If *color* is specified, sets the color-accessor to the specified function or string. If *color* is not specified, returns the current color-accessor, which defaults to:

```javascript
// define d3 color scale that will be used in the accessor
var color = d3.scaleOrdinal(d3.schemeCategory10);

function (d) {
  return color(d.label);
}
```

# {#my}
[#](#my) tooltip.**my**([*orient*])

If *orient* is specified, sets the my-accessor to the specified function or string. If *orient* is not specified, returns the current my-accessor. This will decide the orientation of the current tooltip and should correspond to one of the following (`right`, `left`, `bottom`, `top`). By default or if the accessor returns `falsy`, the orientation will shift from left to right as the cursor's x-position exceeds half of the window width.

# {#at}
[#](#at) tooltip.**at**([*position*])

If *position* is specified, sets the at-accessor to the specified function or string. If *position* is not specified, returns the current at-accessor. This will decide where the tooltip points to on the target element (e.g. `top right`, `center left`, `bottom center`, ..) By default or if the accessor returns `falsy`, the at position will shift from `center left` to `center right` as the cursor's x-position exceeds half of the window width.

# {#html}
[#](#html) tooltip.**html**([*html*])

If *html* is specified, sets the html-accessor to the specified function or string. If *html* is not specified, returns the current html-accessor, which defaults to `() => null`. This is the html that will be rendered within the current tooltip container.

# {#target}
[#](#target) tooltip.**target**([*selection*])

If *selection* is specified, sets the target-accessor to the specified function or [d3-selection](https;//github.com/d3/d3-selection). If *target* is not specified, returns the current target-accessor, which defaults to `() => null`. Target represents to the element at which the tooltip will point. This defaults to the applied element, but in some cases it may be necessary to set it dynamically. This is helpful when you have a larger parent element that you want to trigger a tooltip, but once triggered you want the tooltip pointing at a specific child element within that parent.

### Events

# {#on}
[#](#on) tooltip.**on**([*type*[, *listener*]])

Registers the *specified* listener to receive events of the specified *type* from the tooltip behavior. (see d3's [dispatch](https://github.com/mbostock/d3/wiki/Internals#d3_dispatch) for additional details.) The following events are supported:

- *insert*  - when a tooltip is inserted
- *move*    - when a tooltip is moved
- *remove*  - when a tooltip is removed

Each listener will be supplied with the tooltip selection `this` and input arguments for the current node, data `d`, and selection index `i`.
