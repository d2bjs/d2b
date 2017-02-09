import * as d3 from 'd3';

import {default as functor} from '../util/functor.js';

function range(arr, value) {
  value = functor(value || function(d){return d;});
  var extent = d3.extent(arr, value);
  if(arr.length) return extent[1] - extent[0];
}

range.tendancy = 'range';

export default range;
