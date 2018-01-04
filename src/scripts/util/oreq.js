// Work around for JavaScripts ||= operator. Only null, undefined, NaN, and false will be construed as falsy.

export default function (...args) {
  let val = args[0];
  args.forEach(function (a) {
    if (val === null || val === undefined || val === false) val = a;
  });
  return val;
}
