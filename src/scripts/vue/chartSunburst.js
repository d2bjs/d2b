import chartSunburst from '../chart/sunburst.js';
import visMixin from './visMixin.js';

export default {
  mixins: [visMixin],
  template: '<div class = "d2b-vue-container d2b-vue-sunburst-chart"></div>',
  props: {
    generator: { default: () => chartSunburst() }
  }
};
