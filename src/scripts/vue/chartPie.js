import chartPie from '../chart/pie.js';
import genMixin from './genMixin.js';

export default {
  mixins: [genMixin],
  template: '<div class = "d2b-vue-container d2b-vue-pie-chart"></div>',
  props: {
    generator: { default: () => chartPie() }
  }
};
