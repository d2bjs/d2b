export default function (path) {
  return !(path.includes('NaN') || path.includes('Inifnity'));
}
