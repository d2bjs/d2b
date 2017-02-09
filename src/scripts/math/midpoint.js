import * as d3 from 'd3';

import {default as functor} from '../util/functor.js';

function midpoint(arr, value) {
  value = functor(value || function(d){return d;});
  if(arr.length) return d3.mean(d3.extent(arr, value));
}

midpoint.tendancy = 'midpoint';

export default midpoint;
