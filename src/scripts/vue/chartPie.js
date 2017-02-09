import chartPie from '../chart/pie.js';
import visMixin from './visMixin.js';

export default {
  mixins: [visMixin],
  template: '<div class = "d2b-vue-container d2b-vue-pie-chart"></div>',
  props: {
    generator: { default: () => chartPie() }
  }
};
