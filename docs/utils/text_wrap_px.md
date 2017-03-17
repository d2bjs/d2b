> [d2b](../README.md) › **Text Wrap Pixels**

This function is used to wrap svg text based on a threshold pixel width. Based on this [block](https://bl.ocks.org/mbostock/7555321). This text wrap function is destructive on the internal tspan elements and thus causes problems when rebinding events on update like in the legend. For a less destructive function, see [d2b.textWrap()](text_wrap.md), which uses d3's enter-update-exit process and is based on a character count threshold.

# {#function}
[#](#function) d2b.**textWrapPX**(*context*, [*width*])

Wrap the *context* text, which may be either a [d3-selection](https;//github.com/d3/d3-selection) of svg text elements or a corresponding [d3-transition](https;//github.com/d3/d3-transition).

If *width* is provided, it will be used to set the pixel threshold where text wrapping should occur. The *width* defaults to `Infinity`.

```javascript
d3.select('svg text')
    .attr('y', 15)
    .text('A really really long label that needs to be wrapped.')
    .call(d2b.textWrapPX, 100);
```
