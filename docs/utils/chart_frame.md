> [d2b](../README.md) › **Chart Frame**

The d2b chartFrame component is used to render and insert several containers commonly used in a chart (e.g. breadcrumbs container, chartFrame container, chart container).

# {#generator}
[#](chart_frame) d2b.**chartFrame**()

Constructs a new chartFrame generator.

# {#apply}
[#](#apply) *chartFrame*(*context*)

Render the chartFrame(s) to the given *context*, which may be either a [d3-selection](https://github.com/d3/d3-selection) of HTML containers (e.g. `div`) or a corresponding [d3-transition](https://github.com/d3/d3-transition).

Before applying the d2b-chartFrame generator, you may join the data to the selected element(s) using [selection.data](https://github.com/d3/d3-selection#selection_data) or [selection.datum](https://github.com/d3/d3-selection#selection_datum). By default, no properties are derived from the bound datum. Here is a basic implementation of the *chartFrame*.

After the chartFrame has been applied to a context, then a `g.d2b-chart-container` will be inserted and can be used for rendering the chart content.

```html
<div class = 'chart'></div>

<script>

  var chartFrame = d2b.chartFrame();

  chartFrame
    .breadcrumbsEnabled(true)
    .breadcrumbsEnabled(true);

  var chart = d3.select('div.chart');

  chart.call(chartFrame);

  // set some breadcrumbs

  var breadcrumbs = d2b.breadcrumbs();

  breadcrumbs
    .color('steelblue');

  var breadcrumbsContainer = chart.select('.d2b-breadcrumbs-container');

  breadcrumbsContainer
    .datum([
      { html: 'First' },
      { html: 'Second' },
      { html: 'Third' },
      { html: 'Fourth' },
    ])
    .call(breadcrumbs);

  // set some breadcrumbs

  var breadcrumbs = d2b.breadcrumbs();

  breadcrumbs
    .vertical(false)
    .clickable(true)
    .dblclickable(true)
    .color('steelblue');

  var breadcrumbsContainer = chart.select('.d2b-breadcrumbs-container');

  breadcrumbsContainer
    .datum([
      { html: 'First' },
      { html: 'Second' },
      { html: 'Third' },
      { html: 'Fourth' },
    ])
    .call(breadcrumbs);

  // add something to the chart that corresponds to the inner __size__

  var chartContainer = chart.select('.d2b-chart-container');

  var innerSize = chartContainer.node().__size__;

  chartContainer
    .append('rect')
      .style('fill', 'steelblue')
      .attr('width', innerSize.width)
      .attr('height', innerSize.height)

  // update as needed..

</script>
```

### Datum Level Accessors

When the d2b chartFrame generator is applied to a selection, the following properties will be invoked. The function will be passed the element's bound [datum](https://github.com/d3/d3-selection#selection_datum) `d` and the corresponding element index `i`.

# {#size}
[#](#size) chartFrame.**size**([*size*])

If *size* is specified, sets the *size* array to the specified accessor function or object and returns the chartFrame generator. If *size* is not specified, returns the current *size* accessor, which defaults to, `() => null`.

If a `null` size is used, then it will be derived dynamically by using the the [getBoundingClientRect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) function on the context node.

# {#legend_enabled}
[#](#legend_enabled) chartFrame.**legendEnabled**([*enabled*])

If *enabled* is specified, sets the *enabled* array to the specified accessor function or boolean and returns the chartFrame generator. If *enabled* is not specified, returns the current *enabled* accessor, which defaults to `() => true`.

If the legend is enabled then a `div.d2b-legend-container` container will be available for inserting a legend, usually with the [d2b.legend](legend.md) component. This component will have a fixed width and height based on it's default styles and the size of the outer container.

# {#legend_orient}
[#](#legend_orient) chartFrame.**legendOrient**([*orient*])

If *orient* is specified, sets the *orient* array to the specified accessor function or string and returns the chartFrame generator. If *orient* is not specified, returns the current *orient* accessor, which defaults to `() => bottom`. The *orient* should be one of `right`, `left`, `bottom`, `top`.

# {#breadcrumbs_enabled}
[#](#breadcrumbs_enabled) chartFrame.**breadcrumbsEnabled**([*enabled*])

If *enabled* is specified, sets the *enabled* array to the specified accessor function or boolean and returns the chartFrame generator. If *enabled* is not specified, returns the current *enabled* accessor, which defaults to `() => false`.

If the breadcrumbs is enabled then a `div.d2b-breadcrumbs-container` container will be available for inserting a breadcrumbs, usually with the [d2b.breadcrumbs](breadcrumbs.md) component. This component will have a fixed width and height based on it's default styles and the size of the outer container.

# {#breadcrumbs_orient}
[#](#breadcrumbs_orient) chartFrame.**breadcrumbsOrient**([*orient*])

If *orient* is specified, sets the *orient* array to the specified accessor function or string and returns the chartFrame generator. If *orient* is not specified, returns the current *orient* accessor, which defaults to `() => 'right'`. The *orient* should be one of `right`, `left`, `bottom`, `top`.

# {#chart_padding}
[#](#chart_padding) chartFrame.**chartPadding**([*padding*])

If *padding* is specified, sets the *padding* array to the specified accessor function, value, or object and returns the chartFrame generator. If *padding* is not specified, returns the current *padding* accessor, which defaults to `() => 10`. This padding is applied to the outer chart container.

The *padding* can be specified in the following formats:

```
  // If a value is given then this will be the padding on all sides of the
  // plane. (e.g. top, bottom, right, left will all be 0)
  chartFrame.chartPadding(0);
```

```
  // If an object is given then the padding for each side should be specified.
  chartFrame.chartPadding({ top: 10, bottom: 50, left: 50, right: 10 });
```

```
  // If null is given then the padding will be computed dynamically. this
  // is the default setting.
  chartFrame.chartPadding(null);
```

# {#padding}
[#](#padding) chartFrame.**padding**([*padding*])

If *padding* is specified, sets the *padding* array to the specified accessor function, value, or object and returns the chartFrame generator. If *padding* is not specified, returns the current *padding* accessor, which defaults to `() => 10`. This padding is applied to the inner chart container.

The *padding* can be specified in the following formats:

```
  // If a value is given then this will be the padding on all sides of the
  // plane. (e.g. top, bottom, right, left will all be 0)
  chartFrame.padding(0);
```

```
  // If an object is given then the padding for each side should be specified.
  chartFrame.padding({ top: 10, bottom: 50, left: 50, right: 10 });
```

```
  // If null is given then the padding will be computed dynamically. this
  // is the default setting.
  chartFrame.padding(null);
```
