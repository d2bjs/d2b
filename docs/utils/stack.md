> [d2b](../README.md) › **Stack**

The d2b stack component is a wrapper for [d3.stack](https://github.com/d3/d3-shape#stack) making it easier to stack d2b [graph](../svg/graphs.md) components.

# {#generator}
[#](#stack) d2b.**stack**()

Constructs a new stack generator.

# {#apply}
[#](#apply) *stack*(*data*)

```javascript
var data = [
  [
    {x: 100, y: 20},
    {x: 200, y: 410},
    {x: 300, y: 45},
    {x: 400, y: 90},
  ],
  [
    {x: 100, y: 200},
    {x: 200, y: 120},
    {x: 300, y: 310},
    {x: 400, y: 330},
  ]
];

var stacker = d2b.stack();

// retrive the d3.stack component and reconfigure the offset type
stacker.stack().offset(d3.stackOffsetExpand);

// stack the data
stacker(data);

// now each point object will have it's y0 and y1 property set
console.log(data)
```

### Datum Level Accessors

When the d2b stack generator is applied to a selection, the following properties will be invoked. The function will be passed the element's bound [datum](https;//github.com/d3/d3-selection#selection_datum) `d` and the corresponding element index `i`.

# {#values}
[#](#values) stack.**values**([*values*])

If *values* is specified, sets the *values* array to the specified accessor function or array and returns the stack generator. If *values* is not specified, returns the current *values* accessor, which defaults to:

```javascript
function (d) {
  return d;
}
```

The *values* array should be formatted like:

```javascript
[
  [/*values for the first set*/],
  [/*values for the second set*/],
  [/*values for the third set*/],
  // ...
]
```

### Value Level Accessors

When the d2b stack generator is applied to a selection, the following properties will be invoked for each element in the [values](#values) array. The function will be passed the value data `d` and the index position within the [values](#bubble_pack_children) array `i`.

```javascript
function (d, i) {
  // d => {
  //   x: 1,
  //   y: 18
  // }
}
```

# {#x}
[#](#x) stack.**x**([*x*])

If *x* is specified, sets the *x* accessor to the specified accessor function and returns the stack generator. If *x* is not specified, returns the current *x* accessor, which defaults to `d => d.x`.

# {#y}
[#](#y) stack.**y**([*y*])

If *y* is specified, sets the *y* accessor to the specified accessor function and returns the stack generator. If *y* is not specified, returns the current *y* accessor, which defaults to `d => d.y`.

### Other Methods

# {#out}
[#](#out) stack.**out**([*out*])

If *out* is specified, sets the *out* function and returns the stack generator. If *out* is not specified, returns the current *out* function, which defaults to:

```javascript
function (d, y0, y1) {
  d.y0 = y0;
  d.y1 = y1;
}
```

The *out* is used to specify how the `y0` and `y1` will be written to each value.
