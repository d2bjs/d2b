import chartSankey from '../chart/sankey';
import genMixin from './genMixin';

export default {
  mixins: [genMixin],
  props: {
    generator: { default: () => chartSankey() }
  },
  data() {
    return { name: 'sankey-chart' };
  }
};
