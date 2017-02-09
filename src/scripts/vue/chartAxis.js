import chartAxis from '../chart/axis.js';
import visMixin from './visMixin.js';

export default {
  mixins: [visMixin],
  template: '<div class = "d2b-vue-container d2b-vue-axis-chart"></div>',
  props: {
    generator: { default: () => chartAxis() }
  }
};
