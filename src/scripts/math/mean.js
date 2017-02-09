import {default as functor} from '../util/functor.js';
import {default as number} from '../util/number.js';

function mean(arr, value, weight) {
  var totalWeight = 0, contribution = 0;
  weight = functor(weight || 1);
  value = functor(value || function(d){return d;});
  arr
    .filter(function(a){
      return !isNaN(number(weight(a))) && !isNaN(number(value(a)));
    })
    .forEach(function(item){
      var w = weight(item), v = value(item);
      totalWeight += w;
      contribution += v * w;
    });
  if(arr.length && totalWeight) return contribution / totalWeight;
}

mean.tendancy = 'mean';

export default mean;
