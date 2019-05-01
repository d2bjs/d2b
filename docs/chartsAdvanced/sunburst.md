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
Here is a live interactive demo of the default sunburst chart without any extra configurations. A sunburst chart is very similar to a tree data structure. It starts off with a `root` and branches out into its `children` until it reaches the leaf nodes. Each ring around the center represents a level of the sunburst (or tree), the most inner ring representing the root. Each ring is instatiated with the `children` array. Each segment of a ring represents a child, which is instatiated with the `label` and the `size` properties.
<figure class="sunburst_default">
    <iframe 
        src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/sunburst/default?runonclick=1&codemirror=1&module=/index.js&view=preview" 
        frameborder="0" 
        allowfullscreen="true" 
        mozallowfullscreen="true" 
        webkitallowfullscreen="true"
    ></iframe>
</figure>

# {#basic}
### [#](#basic) Basic
Here is a live interactive demo of the sunburst chart with basic property configurations. Some of these configurations include angles, ring sizes, and colors.
<figure class="sunburst_basic">
    <iframe 
        src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/sunburst/basic?runonclick=1&codemirror=1&module=/index.js&view=preview" 
        frameborder="0" 
        allowfullscreen="true" 
        mozallowfullscreen="true" 
        webkitallowfullscreen="true"
    ></iframe>
</figure>

# {#breadcrumbs}
### [#](#breadcrumbs) Breadcrumbs
Here is a live interactive demo of the default sunburst chart with breadcrumb property configurations. A breadcrumb is an expandable list of sunburst chart data. The root of the breadcrumb is visible (by default) and hovering over each ring expands this list to clearly display the details of that ring. Some of the breadcrumb configurations include the visibility, orientation, and the html generated.
<figure class="sunburst_breadcrumbs">
    <iframe 
        src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/sunburst/breadcrumbs?runonclick=1&codemirror=1&module=/index.js&view=preview"
        frameborder="0" 
        allowfullscreen="true" 
        mozallowfullscreen="true" 
        webkitallowfullscreen="true"
    ></iframe>
</figure>

# {#Padding}
### [#](#Padding) Padding
Here is a live interactive demo of the default sunburst chart with padding property configurations.
<figure class="sunburst_padding">
    <iframe 
        src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/sunburst/padding?runonclick=1&codemirror=1&module=/index.js&view=preview" 
        frameborder="0"
        allowfullscreen="true" 
        mozallowfullscreen="true" 
        webkitallowfullscreen="true"
    ></iframe>
</figure>

# {#Radius}
### [#](#Radius) Radius

<figure class="sunburst_radius">
    <iframe 
        src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/sunburst/radius?runonclick=1&codemirror=1&module=/index.js&view=preview" 
        frameborder="0" 
        allowfullscreen="true" 
        mozallowfullscreen="true" 
        webkitallowfullscreen="true"
    ></iframe>
</figure>


# {#Root}
### [#](#root) Root

<figure class="sunburst_root">
    <iframe 
        src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/sunburst/root?runonclick=1&codemirror=1&module=/index.js&view=preview" 
        frameborder="0" 
        allowfullscreen="true" 
        mozallowfullscreen="true" 
        webkitallowfullscreen="true"
    ></iframe>
</figure>

# {#sort}
### [#](#sort) Sort

<figure class="sunburst_sort">
    <iframe 
        src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/sunburst/sort?runonclick=1&codemirror=1&module=/index.js&view=preview" 
        frameborder="0" 
        allowfullscreen="true" 
        mozallowfullscreen="true" 
        webkitallowfullscreen="true"
    ></iframe>
</figure>


# {#tooltip}
### [#](#tooltip) Tooltip

<figure class="sunburst_tooltip">
    <iframe 
        src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/sunburst/tooltip?runonclick=1&codemirror=1&module=/index.js&view=preview" 
        frameborder="0" 
        allowfullscreen="true" 
        mozallowfullscreen="true" 
        webkitallowfullscreen="true"
    ></iframe>
</figure>


# {#typescript}
### [#](#typescript) Typescript
Here is a live interactive demo of the default sunburst chart without any extra configurations using typescript. Typescript ensures proper types and properties are used when creating objects, arrays, etc.
<figure class="sunburst_typescript">
    <iframe 
        src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/sunburst/typescript?runonclick=1&codemirror=1&module=/index.js&view=preview" 
        frameborder="0" 
        allowfullscreen="true" 
        mozallowfullscreen="true" 
        webkitallowfullscreen="true"
    ></iframe>
</figure>


# {#properties}
# [#](#properties) Properties

This is a complete list of properties that may be supplied to the axis chart datum. **Bold** properties are required.

{% include "./sunburstProperties.md" %}