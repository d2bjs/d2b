> [d2b](../README.md) › **SVG Point**

# {#point}
[#](point.md#point) d2b.**point**()

Constructs a new point generator with the default settings.

When using the d2b-point generator you can draw a point onto each element in the selection.

# {#point_apply}
[#](point.md#point_apply) *point*(*context*)

Render the point(s) to the given *context*, which may be either a [d3-selection](https;//github.com/d3/d3-selection) of SVG containers (either SVG or G elements) or a corresponding [d3-transition](https;//github.com/d3/d3-transition).

Before applying the d2b-point generator, you should join the data to the selected element(s) using [selection.data](https;//github.com/d3/d3-selection#selection_data) or [selection.datum](https;//github.com/d3/d3-selection#selection_datum). Here is the default data format.

```javascript
var point = d2b.point();

point.size(function (d) {return d.size;});

d3.select('body').append('svg')
    .datum({ size: 120 })
    .call(point);
```

# {#point_size}
[#](point.md#point_size) point.**size**([*size*])

If *size* is specified, sets the size-accessor to the specified function or value in pixels. If *size* is not specified, returns the current size-accessor. The points are sized by a pixel area value.

# {#point_type}
[#](point.md#point_type) point.**type**([*type*])

If *type* is specified, sets the type-accessor to the specified function or string. If *type* is not specified, returns the current type-accessor. Refer to [symbol types](../shape/symbols.md) for the complete list of supported types.

# {#point_fill}
[#](point.md#point_fill) point.**fill**([*fill*])

If *fill* is specified, sets the fill-accessor to the specified function or constant color. If *fill* is not specified, returns the current fill-accessor, which defaults to `() => 'steelblue'`.

# {#point_stroke}
[#](point.md#point_stroke) point.**stroke**([*stroke*])

If *stroke* is specified, sets the stroke-accessor to the specified function or constant color. If *stroke* is not specified, returns the current stroke-accessor. The stroke by default will be a slightly darker shade of the *fill*.

# {#point_stroke_width}
[#](point.md#point_stroke_width) point.**strokeWidth**([*strokeWidth*])

If *strokeWidth* is specified, sets the strokeWidth-accessor to the specified function or constant in pixels. If *strokeWidth* is not specified, returns the current strokeWidth-accessor, which defaults to `() => '1px'`

# {#point_active}
[#](point.md#point_active) point.**active**([*boolean*])

If *boolean* is specified, sets the active-accessor to the specified function or bool. If *boolean* is not specified, returns the current boolean-accessor, which defaults to `false`. The active state will decide whether the point will transition with mouseover/mouseout activity.

# {#point_empty}
[#](point.md#point_empty) point.**empty**([*boolean*])

If *boolean* is specified, sets the boolean-accessor to the specified function or bool. If *boolean* is not specified, returns the current boolean-accessor. The empty state will decide whether the point is drawn without a fill and carries a variant of the mouse event transition.
