import chartSankey from '../chart/sankey';
import genMixin from './genMixin';

export default {
  mixins: [genMixin],
  template: '<div class = "d2b-vue-container d2b-vue-sankey-chart"></div>',
  props: {
    generator: { default: () => chartSankey() }
  }
};
