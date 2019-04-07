import { extent } from 'd3-array';

import functor from '../util/functor';

function range(arr, value) {
  value = functor(value || function(d){return d;});
  var valueExtent = extent(arr, value);
  if(arr.length) return valueExtent[1] - valueExtent[0];
}

range.tendancy = 'range';

export default range;
