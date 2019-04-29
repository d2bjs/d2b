> [d2b](../README.md) › **Chart Axis**

<!-- ![Local Image](../gifs/chart-axis.gif) -->

# {#generator}
[#](#generator) d2b.**chartAxis**()

Constructs a new axis chart generator with the default settings.

When using the d2b-axis generator you can draw an axis chart onto each element in the selection.

# {#apply}
[#](#apply) *axis.advanced*(*context*)

Render the axis chart(s) to the given *context*, which may be either a [d3-selection](https://github.com/d3/d3-selection) of html containers (e.g. div) or a corresponding [d3-transition](https://github.com/d3/d3-transition). 

> Note: The *advanced* mode is new in d2b > 1.0.0. In *advanced* mode all of axis chart [configuration properties](#properties) will be available with the input datum.

 # {#basic_line}
### [#](#basic_line) Line Chart

<figure class="axis_basic">
  <iframe
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/basic-line?runonclick=0&codemirror=1&module=/index.js" 
    view="split"
    frameborder="110" 
  ></iframe>
</figure>

# {#annotation}
### [#](#annotation) Annotation

<figure class="axis_annotation">
  <iframe 
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/annotation?runonclick=1&codemirror=1&module=/index.js" 
    frameborder="0" 
    allowfullscreen="true" 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true"
  ></iframe>
</figure>

# {#basic}
### [#](#basic) Basic

<figure class="axis_basic">
  <iframe 
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/area-basic?runonclick=1&codemirror=1&module=/index.js" 
    frameborder="0" 
    allowfullscreen="true" 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true"
  ></iframe>
</figure>

# {#Bar}
### [#](#bar) Bar

<figure class="axis_bar">
  <iframe 
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/default-bar?runonclick=1&codemirror=1&module=/index.js" 
    frameborder="0" 
    allowfullscreen="true" 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true"
  ></iframe>
</figure>

# {#boxplot}
### [#](#boxplot) Boxplot

<figure class="axis_boxplot">
  <iframe 
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/default-boxplot?runonclick=1&codemirror=1&module=/index.js" 
    frameborder="0" 
    allowfullscreen="true" 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true"
  ></iframe>
</figure>

# {#bubble}
### [#](#bubble) Bubble

<figure class="axis_bubble">
  <iframe 
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/default-bubble?runonclick=1&codemirror=1&module=/index.js" 
    frameborder="0" 
    allowfullscreen="true" 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true"
  ></iframe>
</figure>

# {#groups}
### [#](#groups) Groups

<figure class="axis_groups">
  <iframe 
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/groups?runonclick=1&codemirror=1&module=/index.js" 
    frameborder="0" 
    allowfullscreen="true" 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true"
  ></iframe>
</figure>

# {#legend}
### [#](#legend) Legend

<figure class="axis_legend">
  <iframe 
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/legend?runonclick=1&codemirror=1&module=/index.js" 
    frameborder="0" 
    allowf    
    mozall    
    webkit    
  ></ifram    
</figure>

# {#padding
### [#](#padding) Padding

<figure class="axis_padding>   
  <iframe     
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/basic-line?runonclick=1&codemirror=1&module=/index.js" 
    frameborder="0" 
    allowfullscreen="true" 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true"
  ></iframe>
</figure>

# {#scale}
### [#](#scale) Scale

<figure class="axis_scale">
  <iframe 
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/area-scale?runonclick=1&codemirror=1&module=/index.js" 
    frameborder="0" 
    allowfullscreen="true" 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true"
  ></iframe>
</figure>

# {#scatter}
### [#](#scatter) Scatter

<figure class="axis_scatter">
  <iframe 
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/default-scatter?runonclick=1&codemirror=1&module=/index.js" 
    frameborder="0" 
    allowfullscreen="true" 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true"
  ></iframe>
</figure>

# {#scatter_sizes}
### [#](#scatter_sizes) Scatter Varying Sizes

<figure class="axis_scatter_sizes">
  <iframe 
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/default-scatter-sizes?runonclick=1&codemirror=1&module=/index.js" 
    frameborder="10" 
    allowfullscreen="true" 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true"
  ></iframe>
</figure>

<!-- # {#typescript}
### [#](#typescript) Typescript

<figure class="axis_typescript">
  <iframe 
    src="https://codesandbox.io/embed/github/d2bjs/demos/tree/master/charts/axis/typescript?runonclick=1&codemirror=1&module=/index.js" 
    frameborder="0" 
    allowfullscreen="true" 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true"
  ></iframe>
</figure> -->

# {#properties}
### [#](#properties) Properties

This is a complete list of properties that may be supplied to the axis chart datum. **Bold** properties are required.

{% include "./axisProperties.md" %}