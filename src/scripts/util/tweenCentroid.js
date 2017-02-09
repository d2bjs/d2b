import * as d3 from 'd3';

import {omit} from './object.js';

export default function (context, arc, options = { omit: ['data'] }) {
  // if context is not a transition just render the centroid and update current
  if (!context.selection) {
    return context
        .attr('transform', function (d) {
          this.current = omit(d, options.omit);
          return `translate(${arc.centroid(this.current)})`;
        });
  }

  context.attrTween('transform', function (d) {
    // omit data attribute incase of a pie chart with nested associations
    d = omit(d, options.omit);
    this.current = this.current || d;
    // console.log(this.current, d)
    const i = d3.interpolate(this.current, d);
    return t => {
      this.current = i(t);
      return `translate(${arc.centroid(this.current)}) `+
             `rotate(${this.current.rotate || 0})`;
    };
  });
}
