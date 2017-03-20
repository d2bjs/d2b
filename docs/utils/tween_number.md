> [d2b](../README.md) › **Tween Number**

![Local Image](../gifs/tween-number-utils.gif)

This function is used to tween a number from one value to another.

# {#function}
[#](#function) d2b.**tweenNumber**(*context*, [*number*, [*format*]])

Tween the *context* number from one value to another, which may be either a [d3-selection](https://github.com/d3/d3-selection) of html or svg text elements or a corresponding [d3-transition](https://github.com/d3/d3-transition).

A *number* accessor may be supplied as a function or value. This will be the target value for the tween. The previous value will be derived from the node's `this.current` "sticky" property.

Additionally, a *format* function may be supplied to format each tick of the tween.

```javascript

var div = d3.select('div'),
    format = d3.format(',.2f');

div.call(d2b.tweenNumber, 100, format);

setTimeout(function () {
  div
    .transition()
      .duration(1000)
      .call(d2b.tweenNumber, 122.8, format);
}, 2000);

```

For every tick of the tweening transition or the instantaneous update when no transition is used, the current state of the number will be saved on the node's `this.current` property. This means that only one d2b tween should be applied to a specific node. If multiple tweens are needed it is recommended to use nested containers each with their own tween.
