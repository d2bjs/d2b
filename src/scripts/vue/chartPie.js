import chartPie from '../chart/pie';
import genMixin from './genMixin';

export default {
  mixins: [genMixin],
  props: {
    generator: { default: () => chartPie() }
  },
  data() {
    return { name: 'pie-chart' };
  }
};
