export default function (path) {
  return !(path.indexOf('NaN') > -1 || path.indexOf('Inifnity') > -1);
}
