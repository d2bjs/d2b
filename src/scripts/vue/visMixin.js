import * as d3 from 'd3';

export default {
  props: {
    data:         { default: () => {} },
    config:       { default: () => () => {} }
  },
  computed: {
    properties: function () {
      return {
        generator: this.generator,
        data: this.data,
        config: this.config
      };
    }
  },
  mounted: function () {
    this.updateDefer();
    window.addEventListener('resize', this.updateDefer);

    this.watcher();
  },
  methods: {
    watcher: function () {
      const unwatch = this.$watch('properties', {
        deep: true,
        handler: function () {
          unwatch();
          this.update();
          this.watcher();
        }
      });
    },
    update: function (options = {}) {
      const data = this.data;

      this.config(this.generator);

      var el = d3.select(this.$el),
          elTransition = options.skipTransition? el : el.transition().duration(500);

      el.datum(data);

      elTransition.call(this.generator);
    },
    updateNow: function () {
      var self = this;
      setTimeout(function () {
        self.update({skipTransition: true});
      }, 0);
    },
    updateDefer: function () {
      setTimeout(this.updateNow, 0);
    }
  }
};
