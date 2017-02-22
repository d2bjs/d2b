import chartAxis from '../chart/axis.js';
import genMixin from './genMixin.js';

export default {
  mixins: [genMixin],
  template: '<div class = "d2b-vue-container d2b-vue-axis-chart"></div>',
  props: {
    generator: { default: () => chartAxis() }
  }
};
