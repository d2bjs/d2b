> [d2b](../README.md) › **Breadcrumbs**

![Local Image](../gifs/breadcrumbs-utils-transition.gif)

The d2b breadcrumbs component is used to render vertical or horizontal breadcrumbs.

# {#generator}
[#](#breadcrumbs) d2b.**breadcrumbs**()

Constructs a new breadcrumbs generator.

# {#apply}
[#](#apply) *breadcrumbs*(*context*)

Render the breadcrumbs set(s) to the given *context*, which may be either a [d3-selection](https://github.com/d3/d3-selection) of HTML containers (e.g. `div`) or a corresponding [d3-transition](https://github.com/d3/d3-transition).

Before applying the d2b-breadcrumbs generator, you should join the data to the selected element(s) using [selection.data](https://github.com/d3/d3-selection#selection_data) or [selection.datum](https://github.com/d3/d3-selection#selection_datum). Here is the default data format.

```javascript
var color = d3.scaleOrdinal(d3.schemeCategory10);
var breadcrumbs = d2b.breadcrumbs();

breadcrumbs
  .vertical(false)
  .color(function (d, i) { return color(i); });

d3.select('div.breadcrumbs')
  .datum([
    { html: 'First' },
    { html: 'Second' },
    { html: 'Third' },
    { html: 'Fourth' },
  ])
  .call(breadcrumbs);
```

### Datum Level Accessors

When the d2b breadcrumbs generator is applied to a selection, the following properties will be invoked. The function will be passed the element's bound [datum](https://github.com/d3/d3-selection#selection_datum) `d` and the corresponding element index `i`.

# {#vertical}
[#](#vertical) breadcrumbs.**vertical**([*vertical*])

If *vertical* is specified, sets the *vertical* array to the specified accessor function or boolean and returns the breadcrumbs generator. If *vertical* is not specified, returns the current *vertical* accessor, which defaults to:

```javascript
function (d) {
  return true;
}
```

# {#values}
[#](#values) breadcrumbs.**values**([*values*])

If *values* is specified, sets the *values* array to the specified accessor function or array and returns the breadcrumbs generator. If *values* is not specified, returns the current *values* accessor, which defaults to:

```javascript
function (d) {
  return d;
}
```

### Value Level Accessors

When the d2b breadcrumbs generator is applied to a selection, the following properties will be invoked for each value in the [values](#values) array. The function will be passed the value data `d` and the corresponding index `i`.

```javascript
function (d) {
  // Here is what d might contain
  // d => { html: 'First' }
}
```

# {#key}
[#](#key) breadcrumbs.**key**([*key*])

If *key* is specified, sets the *key* function to the specified accessor function and returns the breadcrumbs generator. If *key* is not specified, returns the current *key* accessor, which defaults to:

```javascript
function (d, i) {
  return i;
}
```

# {#color}
[#](#color) breadcrumbs.**color**([*color*])

If *color* is specified, sets the *color* function to the specified accessor function or color and returns the breadcrumbs generator. If *color* is not specified, returns the current *color* accessor, which defaults to:

```javascript
function (d, i) {
  return 'blue';
}
```

# {#html}
[#](#html) breadcrumbs.**html**([*html*])

If *html* is specified, sets the *html* function to the specified accessor function and returns the breadcrumbs generator. If *html* is not specified, returns the current *html* accessor, which defaults to:

```javascript
function (d, i) {
  return d.html;
}
```

# {#styles}
### Styles

If using a *vertical* breadcrumb orientation you may want to set the width of the container.

```html
<div class = 'breadcrumbs' style = 'width: 200px;'></div>

<script>
  // ...
  d3.select('div.breadcrumbs').call(breadcrumbs);
</script>
```

Breadcrumb wrapping is disabled by default with the *horizontal* orientation. to enable this you must override the css style on the d2b-breadcrumbs class.

```css
.d2b-breadcrumbs {
  white-space: normal !important;
}
```
