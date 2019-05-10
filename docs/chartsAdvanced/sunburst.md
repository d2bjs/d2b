> [d2b](../README.md) › **Chart Sunburst**

<!-- ![Local Image](../gifs/chart-sunburst.gif) -->

# {#generator}
[#](#generator) d2b.**chartSunburst**()

Constructs a new sunburst chart generator with the default settings.

When using the d2b-sunburst generator you can draw a sunburst chart onto each element in the selection.

# {#apply}
[#](#apply) *sunburst*(*context*)

Render the sunburst chart(s) to the given *context*, which may be either a [d3-selection](https://github.com/d3/d3-selection) of html containers (e.g. div) or a corresponding [d3-transition](https://github.com/d3/d3-transition).

Before applying the d2b-sunburst-chart generator, you should join the data to the selected element(s) using [selection.data](https://github.com/d3/d3-selection#selection_data) or [selection.datum](https://github.com/d3/d3-selection#selection_datum). Here is the default data format.

# {#sunburst_default}
### [#](#sunburst_default) Default Sunburst Chart
Here is a live interactive demo of the default sunburst chart without any extra configurations. A sunburst chart is very similar to a tree data structure. It starts off with a `root` and branches out into its `children` until it reaches the leaf nodes. Each ring around the center represents a level of the sunburst (or tree), the most inner ring representing the root. Each ring is instatiated with the `children` array. Each segment of a ring represents a child, which is instatiated with the `label` and if the `child` is a node, then it also has the `size` properties. The `child`'s ancestors retrieve their `size` data by adding all the `size`s of their childrend.
<figure class="sunburst_default">
    <iframe 
        src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/sunburst/default?runonclick=0&codemirror=1&module=/index.js&view=preview" 
    ></iframe>
</figure>

# {#basic}
### [#](#basic) Basic
Here is a live interactive demo of the sunburst chart with basic property configurations. Some of these configurations include angles, ring sizes, and colors.
<figure class="sunburst_basic">
    <iframe 
        src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/sunburst/basic?runonclick=1&codemirror=1&module=/index.js&view=preview" 
    ></iframe>
</figure>

# {#breadcrumbs}
### [#](#breadcrumbs) Breadcrumbs
Here is a live interactive demo of the sunburst chart with breadcrumb property configurations. A breadcrumb is an expandable list of sunburst chart data. The root of the breadcrumb is visible (by default) and hovering over each ring expands this list to clearly display the details of that and its previous rings. Some of the breadcrumb configurations include visibility, orientation, and the html generated.
<figure class="sunburst_breadcrumbs">
    <iframe 
        src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/sunburst/breadcrumbs?runonclick=1&codemirror=1&module=/index.js&view=preview"
    ></iframe>
</figure>

# {#Padding}
### [#](#Padding) Padding
Here is a live interactive demo of the sunburst chart with padding property configurations. These configurations pad the rings in the sunburst as well as the sunburst chart (without the legend) as a whole. 
<figure class="sunburst_padding">
    <iframe 
        src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/sunburst/padding?runonclick=1&codemirror=1&module=/index.js&view=preview" 
    ></iframe>
</figure>

# {#Radius}
### [#](#Radius) Radius
Here is a live interactive demo of the sunburst chart with radius property configurations. These configurations affect the appearance of the rings' roundness and thickness.
<figure class="sunburst_radius">
    <iframe 
        src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/sunburst/radius?runonclick=1&codemirror=1&module=/index.js&view=preview" 
    ></iframe>
</figure>


# {#Root}
### [#](#root) Root
Here is a live interactive demo of the sunburst chart with root property configurations. As previosuly mentioned, the root is the top-most node of the tree with child branches. The properties set in the root object can change the `color`, `breadcrumb`, `label`, and all of its `children`. Within the children array of objects, in addition to the root properities, the `tooltip` and `selected` are properties a child can have. If the child is a leaf node, it can also have the `size` property. 
<figure class="sunburst_root">
    <iframe 
        src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/sunburst/root?runonclick=1&codemirror=1&module=/index.js&view=preview" 
    ></iframe>
</figure>

# {#sort}
### [#](#sort) Sort
Here is a live interactive demo of the sunburst chart with sort property configurations. Changes to these configuration (an accessor function) reorient the order of how the data in the sunburst is displayed.
<figure class="sunburst_sort">
    <iframe 
        src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/sunburst/sort?runonclick=1&codemirror=1&module=/index.js&view=preview" 
    ></iframe>
</figure>


# {#tooltip}
### [#](#tooltip) Tooltip
Here is a live interactive demo of the sunburst chart with tooltip property configurations. The tooltip is the textbox that appears when hovering over a sunburst ring. Each ring can have its own `tooltip` property and there is also a global tooltip object that gets applied to all the tooltips in the chart.
<figure class="sunburst_tooltip">
    <iframe 
        src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/sunburst/tooltip?runonclick=1&codemirror=1&module=/index.js&view=preview" 
    ></iframe>
</figure>


# {#transition}
### [#](#transition) Transition
Here is a live interactive demo of the sunburst chart with a transition configuration. If the button "Change Data!" is clicked, the sunburst chart will toggle between different data to demonstrate the transition animations. `.transition()` is used on the chart and chained with the desired `.duration(2000)` of microseconds. 
<figure class="pie_tooltip">
    <iframe 
        src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/sunburst/transition?runonclick=1&codemirror=1&module=/index.js&view=preview" 
    ></iframe>
</figure>

# {#typescript}
### [#](#typescript) Typescript
Here is a live interactive demo of the default sunburst chart without any extra configurations using typescript. Typescript ensures proper types and properties are used when creating objects, arrays, etc.
<figure class="sunburst_typescript">
    <iframe 
        src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/sunburst/typescript?runonclick=1&codemirror=1&module=/index.ts&view=preview" 
    ></iframe>
</figure>


# {#properties}
# [#](#properties) Properties

This is a complete list of properties that may be supplied to the axis chart datum. **Bold** properties are required.

{% include "./sunburstProperties.md" %}