export default function (x, def = 0) {
  if (isNaN(x) || x === null) return def;
  return x;
}
