// Work around for JavaScripts ||= operator. Only null, undefined, NaN, and false will be construed as falsy.

export default function (...args) {
  const truthy = v => v !== null && v !== undefined && v !== false;
  const val = args.filter(truthy)[0];
  return truthy(val) ? val : undefined;
}
