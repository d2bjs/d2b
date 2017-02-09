import * as d3 from 'd3';

import {default as functor} from '../util/functor.js';
import {default as number} from '../util/number.js';
import {default as mean} from './mean.js';

function median(arr, value, weight){
  weight = functor(weight || 1);
  value = functor(value || function(d){return d;});

  var medians = [], midWeight;

  var newArray = arr
    .filter(function(a){
      return weight(a) !== 0 && !isNaN(number(weight(a))) && !isNaN(number(value(a)));
    })
    .sort(function(a,b){
      return d3.ascending(value(a), value(b));
    });

  midWeight = Math.round(d3.sum(newArray, function(item){return weight(item);})/2 * 1e12) / 1e12;

  var currentPosition = 0;
  var getNext = false;

  newArray.forEach(function(item){
    if(getNext){
      medians.push(value(item));
      getNext = false;
    }

    currentPosition += weight(item);

    if(currentPosition === midWeight){
      medians.push(value(item));
      getNext = true;
    }

    if(currentPosition > midWeight && medians.length === 0){
      medians.push(value(item));
    }
  });

  if(arr.length) return mean(medians);
}

median.tendancy = 'median';

export default median;
