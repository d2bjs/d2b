import {default as functor} from '../util/functor.js';
import {default as number} from '../util/number.js';
import {default as mean} from './mean.js';

function mode(arr, value, weight){
  weight = functor(weight || 1);
  value = functor(value || function(d){return d;});

  var modes = [], maxFrequency = 0, frequencies = {};

  arr.forEach(function(item){
    var val = number(value(item));
    if(isNaN(value(item))) return;
    frequencies[val] = frequencies[val] || 0;
    frequencies[val] += weight(item);

    if(frequencies[val] > maxFrequency){
      maxFrequency = frequencies[value(item)];
      modes = [value(item)];
    }else if(frequencies[value(item)] == maxFrequency){
      modes.push(value(item));
    }
  });

  if(arr.length) return mean(modes);
}

mode.tendancy = 'mode';

export default mode;
