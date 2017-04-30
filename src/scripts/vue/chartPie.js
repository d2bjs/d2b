import chartPie from '../chart/pie';
import genMixin from './genMixin';

export default {
  mixins: [genMixin],
  template: '<div class = "d2b-vue-container d2b-vue-pie-chart"></div>',
  props: {
    generator: { default: () => chartPie() }
  }
};
