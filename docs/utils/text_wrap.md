> [d2b](../README.md) › **Text Wrap**

This function is used to wrap svg text based on a threshold character count width. This function uses d3's enter-update-exit process and is based on a character count threshold, and is therefore less destructive than [d2b.textWrapPX](text_wrap_px.md). Unlike the other text wrap function, this one uses a datum accessor to get the text content rather than getting it from the text already rendered inside the element.

# {#function}
[#](#function) d2b.**textWrap**(*context*, [*text*, [*width*, [*anchor*]]])

Wrap the *context* text, which may be either a [d3-selection](https;//github.com/d3/d3-selection) of svg text elements or a corresponding [d3-transition](https;//github.com/d3/d3-transition).

If *text* is provided, it will be used to set the text accessor function. The *text* accessor defaults to `d => d.label`.

If *width* is provided, it will be used to set the character width threshold where text wrapping should occur. The default *width* is `Infinity`.

If *anchor* is provided, it will be used to vertically position the wrapped text based on it's origin. Should be one of 'start', 'middle', 'end'. The default *anchor* is 'end'.

```javascript
d3.select('svg text')
    .attr('y', 15)
    .datum({label: 'A really really long label that needs to be wrapped.'})
    .call(d2b.textWrap, function (d) { return d.label; }, 15);
```
