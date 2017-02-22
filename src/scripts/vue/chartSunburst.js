import chartSunburst from '../chart/sunburst.js';
import genMixin from './genMixin.js';

export default {
  mixins: [genMixin],
  template: '<div class = "d2b-vue-container d2b-vue-sunburst-chart"></div>',
  props: {
    generator: { default: () => chartSunburst() }
  }
};
