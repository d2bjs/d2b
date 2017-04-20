> [d2b](../README.md) › **SVG Sunburst**

![Local Image](../gifs/sunburst-svg-transition.gif)

# {#generator}
[#](#generator) d2b.**svgSunburst**()

Constructs a new sunburst generator with the default settings.

# {#apply}
[#](#apply) *sunburst*(*context*)

Render the sunburst(s) to the given *context*, which may be either a [d3-selection](https://github.com/d3/d3-selection) of SVG containers (either SVG or G elements) or a corresponding [d3-transition](https://github.com/d3/d3-transition).

Before applying the d2b-sunburst generator, you should join the data to the selected element(s) using [selection.data](https://github.com/d3/d3-selection#selection_data) or [selection.datum](https://github.com/d3/d3-selection#selection_datum). Here is the default data format.

```javascript
var sunburst= d2b.svgSunburst();

// use d3 to select the svg, set the datum, and apply the sunburst generator
var svg = d3.select('svg g')
  .datum({
    label: 'top level',
    children: [
      {
        label: 'one',
        children: [
          { label: 'one-one', size: 5 }
        ]
      },
      {
        selected: true,
        label: 'two',
        children: [
          { label: 'two-one', size: 5 },
          {
            label: 'two-two',
            children: [
              { label: 'two-two-one', size: 2 },
              { label: 'two-two-two', size: 17 }
            ]
          }
        ]
      }
    ]
  })
  .call(sunburst);
```

# {#pie}
[#](#pie) sunburst.**pie**([*d3-pie*])

If *d3-pie* is specified, sets the *d3-pie* generator to the specified [d3-pie](https://github.com/d3/d3-shape#pie) and returns the sunburst generator. If *d3-pie* is not specified, returns the current *d3-pie* generator, which defaults to `d3.pie().sort(null)`.

The *d3-pie* can be configured at will, except for the [startAngle](https://github.com/d3/d3-shape#pie_startAngle), [endAngle](https://github.com/d3/d3-shape#pie_endAngle) and [value]([startAngle](https://github.com/d3/d3-shape#pie_value)) properties which will be set automatically by the sunburst generator.

# {#ancestor_banding}
[#](#ancestor_banding) sunburst.**ancestorBanding**([*bandingScale*])

If *bandingScale* is specified, sets the *bandingScale* scale to the specified [d3-scale](https://github.com/d3/d3-scale) and returns the sunburst generator. If *bandingScale* is not specified, returns the current *bandingScale* scale, which defaults to a [d3.scaleLinear()](https://github.com/d3/d3-scale#scaleLinear).

The ancestor *bandingScale* will decide how the inner rings of the sunburst are distributed. Usually a [continuous scale](https://github.com/d3/d3-scale#continuous-scales) should be used.

# {#descendant_banding}
[#](#descendant_banding) sunburst.**descendantBanding**([*bandingScale*])

If *bandingScale* is specified, sets the *bandingScale* scale to the specified [d3-scale](https://github.com/d3/d3-scale) and returns the sunburst generator. If *bandingScale* is not specified, returns the current *bandingScale* scale, which defaults to a [d3.scalePow().exponent(0.85)](https://github.com/d3/d3-scale#scalePow)

The descendant *bandingScale* will decide how the outer rings of the sunburst are distributed. Usually a [continuous scale](https://github.com/d3/d3-scale#continuous-scales) should be used.

### Datum Level Accessors

When the d2b sunburst generator is applied to a selection, the following properties will be invoked. The function will be passed the element's bound [datum](https://github.com/d3/d3-selection#selection_datum) `d` and the corresponding element index `i`.

# {#duration}
[#](#duration) sunburst.**duration**([*duration*])

If *duration* is specified, sets the duration-accessor to the specified function or value in milliseconds. If *duration* is not specified, returns the current duration-accessor, which defaults to `() => 250`.

The duration will be used for internal chart transitions. In the case of the sunburst this is usually used when an arc is "zoomed" into, causing the chart to transition to it's new state.

For external transitions, the duration should still be set manually if desired. E.g. `d3.select('svg').transition().duration(500).call(sunburst)`.

# {#inner_radius}
[#](#inner_radius) sunburst.**innerRadius**([*innerRadius*])

If *innerRadius* is specified, sets the inner-radius-accessor to the specified function or value in pixels. If *innerRadius* is not specified, returns the current inner-radius-accessor, which defaults to `() => 30`.

# {#outer_radius}
[#](#outer_radius) sunburst.**outerRadius**([*outerRadius*])

If *outerRadius* is specified, sets the outer-radius-accessor to the specified function or value in pixels. If *outerRadius* is not specified, returns the current outer-radius-accessor, which defaults to `() => 200`.

# {#ancestor_padding}
[#](#ancestor_padding) sunburst.**ancestorPadding**([*ancestorPadding*])

If *ancestorPadding* is specified, sets the ancestor-padding-accessor to the specified function or value in pixels. If *ancestorPadding* is not specified, returns the current ancestor-padding-accessor, which defaults to `() => 10`.

This *value* will decide how many pixels should be between the ancestor and descendant banding.

# {#ancestor_ratio}
[#](#ancestor_ratio) sunburst.**ancestorRatio**([*ancestorRatio*])

If *ancestorRatio* is specified, sets the ancestor-ratio-accessor to the specified function or value. If *ancestorRatio* is not specified, returns the current ancestor-ratio-accessor, which defaults to `() => 0.2`.

This *ancestorRatio* will decide how the bands are distributed between ancestors and descendants. The default `0.2` indicates that 20% of the banding will be used for ancestors and the remaining 80% for descendants.

# {#descendant_levels}
[#](#descendant_levels) sunburst.**descendantLevels**([*descendantLevels*])

If *descendantLevels* is specified, sets the descendant-levels-accessor to the specified function or value. If *descendantLevels* is not specified, returns the current descendant-levels-accessor, which defaults to `() => Infinity`.

This *descendantLevels* will decide how many descendant tiers should be shown at one time. As the sunburst is zoomed into you will always be able to see this many levels from the current position.

# {#start_angle}
[#](#start_angle) sunburst.**startAngle**([*startAngle*])

If *startAngle* is specified, sets the start-angle-accessor to the specified function or value in radians. If *startAngle* is not specified, returns the current start-angle-accessor, which defaults to `() => 0`.

# {#end_angle}
[#](#end_angle) sunburst.**endAngle**([*endAngle*])

If *endAngle* is specified, sets the end-angle-accessor to the specified function or value in radians. If *endAngle* is not specified, returns the current end-angle-accessor, which defaults to `() => 2 * Math.PI`.

# {#show_labels}
[#](#show_labels) sunburst.**showLabels**([*showLabels*])

If *showLabels* is specified, sets the show-labels-accessor to the specified function or bool. If *showLabels* is not specified, returns the current show-labels-accessor, which defaults to `() => false`.

# {#zoomable}
[#](#zoomable) sunburst.**zoomable**([*zoomable*])

If *zoomable* is specified, sets the zoomable-accessor to the specified function or bool. If *zoomable* is not specified, returns the current zoomable-accessor, which defaults to `() => true`. This boolean will decide whether the click-to-zoom feature is available on the rendered sunburst.

# {#highlight}
[#](#highlight) sunburst.**highlight**([*highlight*])

If *highlight* is specified, sets the highlight-accessor to the specified function or bool. If *highlight* is not specified, returns the current highlight-accessor, which defaults to `() => true`. This boolean will decide whether the mouseover-highlight feature is available on the rendered sunburst.

### Node Level Accessors

When the d2b sunburst generator is applied to a selection, the following properties will be invoked for each node in the hierarchy. The function will be passed the node data `d`.

```javascript
function (d) {
  // Here is what d might contain
  // d => { label: 'one-one', size: 5 }
}
```

# {#key}
[#](#key) sunburst.**key**([*key*])

If *key* is specified, sets the arc-key-accessor to the specified function. If *key* is not specified, returns the current arc-key-accessor, which defaults to `() => $$.label(d)`. The arcs are entered in hierarchical order, so that arcs with the same keys do not conflict with one another unless they are direct siblings.

Note: By default, the key will be retrieved by invoking the current sunburst label accessor. This means that as the label accessor is changed the key will automatically reflect this change. Unless a different key accessor is provided.

# {#label}
[#](#label) sunburst.**label**([*label*])

If *label* is specified, sets the label-accessor to the specified function. If *label* is not specified, returns the current arc-label-accessor, which defaults to `() => d.label`.

# {#color}
[#](#color) sunburst.**color**([*color*])

If *color* is specified, sets the color-accessor to the specified function. If *color* is not specified, returns the current color-accessor, which defaults to:

```javascript
// define d3 color scale that will be used in the accessor
var color = d3.scaleOrdinal(d3.schemeCategory10);

function (d) {
  return color($$.label(d));
}
```

Note: By default, the color will be retrieved by invoking the current sunburst label accessor. This means that as the label accessor is changed the color will automatically reflect this change. Unless a different color accessor is provided.

# {#children}
[#](#children) sunburst.**children**([*children*])

If *children* is specified, sets the children-accessor to the specified function. If *children* is not specified, returns the current children-accessor, which defaults to `() => d.children`.

# {#size}
[#](#size) sunburst.**size**([*size*])

If *size* is specified, sets the size-accessor to the specified function. If *size* is not specified, returns the current size-accessor, which defaults to `() => d.size`. Only the leaf nodes of the hierarchy need to have a size.
