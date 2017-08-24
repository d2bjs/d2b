import chartAxis from '../chart/axis';
import genMixin from './genMixin';

export default {
  mixins: [genMixin],
  props: {
    generator: { default: () => chartAxis() }
  },
  data() {
    return { name: 'axis-chart' };
  }
};
