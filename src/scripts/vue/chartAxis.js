import chartAxis from '../chart/axis';
import genMixin from './genMixin';

export default {
  mixins: [genMixin],
  template: '<div class = "d2b-vue-container d2b-vue-axis-chart"></div>',
  props: {
    generator: { default: () => chartAxis() }
  }
};
