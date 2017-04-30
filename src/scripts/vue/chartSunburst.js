import chartSunburst from '../chart/sunburst';
import genMixin from './genMixin';

export default {
  mixins: [genMixin],
  template: '<div class = "d2b-vue-container d2b-vue-sunburst-chart"></div>',
  props: {
    generator: { default: () => chartSunburst() }
  }
};
