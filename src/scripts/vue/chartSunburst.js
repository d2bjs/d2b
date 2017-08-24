import chartSunburst from '../chart/sunburst';
import genMixin from './genMixin';

export default {
  mixins: [genMixin],
  props: {
    generator: { default: () => chartSunburst() }
  },
  data() {
    return { name: 'sunburst-chart' };
  }
};
