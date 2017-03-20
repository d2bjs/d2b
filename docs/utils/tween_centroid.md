> [d2b](../README.md) › **Tween Centroid**

![Local Image](../gifs/tween-centroid-utils.gif)

This function is used to tween a centroid from one position to another.

# {#function}
[#](#function) d2b.**tweenCentroid**(*context*, *arc*, [*rotate*])

Tween the *context* centroid position, which may be either a [d3-selection](https://github.com/d3/d3-selection) of svg path elements or a corresponding [d3-transition](https://github.com/d3/d3-transition).

The previous centroid will be derived from the node's `this.current` "sticky" property.

The *arc* should be a [d3-arc](https://github.com/d3/d3-shape#arc). This will help the tween function locate the centroid properties (e.g. innerRadius, outerRadius, startAngle, endAngle).

Additionally, a *rotate* accessor may be supplied as a function or degree value. This will be used to decide the rotation transformation to be used in tweening the *context*.

```javascript

var arc = d3.arc();

arc
  .innerRadius(function (d) { return d.innerRadius; })
  .outerRadius(function (d) { return d.outerRadius; })
  .startAngle(function (d) { return d.startAngle; })
  .endAngle(function (d) { return d.endAngle; });

var path = d3.select('path'),
    text = d3.select('text');

var datum = {
  innerRadius: 140,
  outerRadius: 150,
  startAngle: 0,
  endAngle: Math.PI / 2
};

path
    .datum(datum)
    .call(d2b.tweenArc, arc);

text
    .datum(datum)
    .call(d2b.tweenCentroid, arc);

```

Every tick of the tweening transition or the instantaneous update when no transition is used, the current state of the centroid position will be saved on the node's `this.current` property. This means that only one d2b tween should be applied to a specific node. If multiple tweens are needed it is recommended to use nested svg `g` containers.
