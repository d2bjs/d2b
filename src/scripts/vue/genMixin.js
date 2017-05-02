import * as d3 from 'd3';

export default {
  props: {
    data:         { default: () => {} },
    config:       { default: () => () => {} },
    duration:     { default: 500 }
  },
  data () {
    return {
      unwatch: null,
    };
  },
  computed: {
    properties () {
      return {
        generator: this.generator,
        data: this.data,
        config: this.config
      };
    }
  },
  destroyed () {
    d3.selectAll('.d2b-tooltip').remove();
    d3.select(window).on(`resize.${this.id}`, null);
  },
  mounted () {
    this.updateDefer();
    d3.select(window).on(`resize.${this.id}`, this.updateDefer);

    this.watcher();
  },
  methods: {
    watcher () {
      const handler = function () {
        if (this.unwatch) this.unwatch();
        this.update();
        this.watcher();
      };
      this.unwatch = this.$watch('properties', handler, {deep: true});
    },
    update (options = {}) {
      this.$emit('beforeRender', this.$el, this.generator);

      const data = this.data;

      this.config(this.generator);

      var el = d3.select(this.$el),
          elTransition = options.skipTransition? el : el.transition().duration(this.duration);

      el.datum(data);

      elTransition.call(this.generator);

      this.$emit('rendered', this.$el, this.generator);
    },
    updateNow () {
      this.update({skipTransition: true});
    },
    updateDefer () {
      setTimeout(this.updateNow, 0);
    }
  }
};
