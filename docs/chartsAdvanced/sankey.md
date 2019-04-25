> [d2b](../README.md) › **Chart Sankey**

<!-- ![Local Image](../gifs/chart-sankey.gif) -->

# {#generator}
[#](#generator) d2b.**chartSankey**()

Constructs a new sankey chart generator with the default settings.

When using the d2b-sankey generator you can draw a sankey chart onto each element in the selection.

# {#apply}
[#](#apply) *sankey*(*context*)

Render the sankey chart(s) to the given *context*, which may be either a [d3-selection](https://github.com/d3/d3-selection) of html containers (e.g. div) or a corresponding [d3-transition](https://github.com/d3/d3-transition).

Before applying the d2b-sankey-chart generator, you should join the data to the selected element(s) using [selection.data](https://github.com/d3/d3-selection#selection_data) or [selection.datum](https://github.com/d3/d3-selection#selection_datum). Here is the default data format.


# {#sankey_default}
### [#](#sankey_default) Default Sankey Chart

<figure class="sankey_default">
    <iframe 
        src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/sankey/default?runonclick=1" 
        frameborder="0" 
        allowfullscreen="true" 
        mozallowfullscreen="true" 
        webkitallowfullscreen="true"
    ></iframe>
</figure>

# {#links_nodes}
### [#](#links_nodes) Links and Nodes

<figure class="sankey_links_nodes">
    <iframe
        src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/sankey/links_nodes?runonclick=1" frameborder="0" 
        allowfullscreen="true" 
        mozallowfullscreen="true" 
        webkitallowfullscreen="true"
    ></iframe>
</figure>

# {#typescript}
### [#](#typescript) Typescript

<figure class="sankey_typescript">
    <iframe 
        src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/sankey/typescript?runonclick=1" frameborder="0" 
        allowfullscreen="true" 
        mozallowfullscreen="true" 
        webkitallowfullscreen="true"
    ></iframe>
</figure>


# {#properties}
# [#](#properties) Properties

This is a complete list of properties that may be supplied to the axis chart datum. **Bold** properties are required.

{% include "./sankeyProperties.md" %}