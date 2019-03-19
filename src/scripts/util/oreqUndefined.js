// Work around for JavaScripts ||= operator. Only undefined will be construed as falsy.

export default function (...args) {
  const truthy = v => v !== undefined;
  const val = args.filter(truthy)[0];
  return truthy(val) ? val : undefined;
}
