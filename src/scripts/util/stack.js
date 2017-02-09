import * as d3 from 'd3';

import {default as base} from '../model/base.js';
// d2b.stack will stack the x and y values in place for
// some datum and d3.stack configuration.
export default function () {
  const $$ = {};

  const stack = function (datum) {
    const original = datum;

    // for simplicity map datum to just array of values arrays
    datum = datum.map($$.values);

    // format values to be in the form
    // [
    //   {x_1: y_1, x_2: y_2, .. },
    //   {x_1: y_1, x_2: y_2, .. },
    //   ..
    // ]
    let xset = [];

    let vals = datum.map(d => {
      const nodes = {};
      d.forEach((d, i) => {
        const x = $$.x.call(this, d, i);
        xset.push(x);
        nodes[x] = $$.y.call(this, d, i);
      });
      return nodes;
    });

    // find unique set of x values
    xset = d3.set(xset).values();

    // value => index mapping of x values
    let xmap = xset.reduce(function(o, v, i) {
      o[v] = i;
      return o;
    }, {});

    // graph keys (just use index)
    let keys = d3.range(0, datum.length);

    // transpose values for d3.stack
    let tvals = xset.map(col => vals.map(row => row[col] || 0));

    // stack transposed values
    $$.stack
        .keys(keys)
        .value((d, k) => d[k] || 0);
    let stacking = $$.stack(tvals);

    // reassociate the stacked values with the original datum
    datum.forEach((d, i) => {
      d.forEach((val, ind) => {
        const x = $$.x.call(this, val, ind);
        const ys = stacking[i][xmap[x]];
        $$.out.call(this, val, ys[0], ys[1], x);
      });
    });

    return original;
  };

  /* Inherit from base model */
  base(stack, $$)
    .addProp('stack', d3.stack())
    .addPropFunctor('values', d => d)
    .addPropFunctor('x', d => d.x)
    .addPropFunctor('y', d => d.y)
    .addPropFunctor('out', (d, y0, y1) => {
      d.y0 = y0;
      d.y1 = y1;
    });

  return stack;
}
