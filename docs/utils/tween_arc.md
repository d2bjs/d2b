> [d2b](../README.md) › **Tween Arc**

![Local Image](../gifs/tween-arc-utils.gif)

This function is used to tween a [d3.arc](https://github.com/d3/d3-shape#arc) from one position to another.

# {#function}
[#](#function) d2b.**tweenArc**(*context*, *arc*)

Tween the *context* arc, which may be either a [d3-selection](https://github.com/d3/d3-selection) of svg path elements or a corresponding [d3-transition](https://github.com/d3/d3-transition).

The previous arc will be derived from the node's `this.current` "sticky" property.

The *arc* should be a [d3-arc](https://github.com/d3/d3-shape#arc). This will help the tween function locate the arc properties (e.g. innerRadius, outerRadius, startAngle, endAngle).

```javascript

var arc = d3.arc();

arc
  .innerRadius(function (d) { return d.innerRadius; })
  .outerRadius(function (d) { return d.outerRadius; })
  .startAngle(function (d) { return d.startAngle; })
  .endAngle(function (d) { return d.endAngle; });

var path = d3.select('path');

path
    .datum({
      innerRadius: 140,
      outerRadius: 150,
      startAngle: 0,
      endAngle: Math.PI / 2
    })
    .call(d2b.tweenArc, arc);

setTimeout(function () {
  path
      .datum({
        innerRadius: 30,
        outerRadius: 150,
        startAngle: Math.PI / 3,
        endAngle: Math.PI * 2
      })
    .transition()
      .duration(1000)
      .call(d2b.tweenArc, arc);
}, 2000);

```

For every tick of the tweening transition or the instantaneous update when no transition is used, the current state of the arc will be saved on the node's `this.current` property. This means that only one d2b tween should be applied to a specific node. If multiple tweens are needed it is recommended to use nested containers each with their own tween.
