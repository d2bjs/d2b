import { mean, extent } from 'd3-array';

import functor from '../util/functor';

function midpoint(arr, value) {
  value = functor(value || function(d){return d;});
  if(arr.length) return mean(extent(arr, value));
}

midpoint.tendancy = 'midpoint';

export default midpoint;
