// Returns the specified object, omit the properties with keys matching
// those in the specified keys array.

function omit (obj, keys) {
  const newObj = {};
  for (let k in obj){
    if (typeof obj[k] !== 'function') {
      if(keys.indexOf(k) < 0) newObj[k] = obj[k];
    }
  }
  return newObj;
}

export {omit};
