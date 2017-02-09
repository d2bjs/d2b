// Work around for JavaScripts ||= operator. Only null, undefined, and false will be construed ad falsy. 

export default function (...args) {
  let val = args[0];
  args.forEach(function (a) {
    if (val === null || val === undefined || val === false) val = a;
  });
  return val;
}
