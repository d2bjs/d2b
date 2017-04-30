export const isTouchDevice = function() {
  return 'ontouchstart' in window || window.navigator.msPointerEnabled;
};
