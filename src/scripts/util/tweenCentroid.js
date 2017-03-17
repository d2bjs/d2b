import * as d3 from 'd3';

import {default as functor} from '../util/functor.js';

export default function (context, arc, rotate = d => d.rotate) {
  rotate = functor(rotate);

  // get specific set of properties in case of recursive
  function getProperties(d) {
    return {
      innerRadius: arc.innerRadius()(d),
      outerRadius: arc.outerRadius()(d),
      startAngle: arc.startAngle()(d),
      endAngle: arc.endAngle()(d),
      rotate: rotate(d) || 0,
    };
  }

  // if context is not a transition just render the centroid and update current
  if (!context.selection) {
    return context
        .attr('transform', function (d) {
          this.current = getProperties(d);
          return `translate(${arc.centroid(this.current)})`+
                 `rotate(${this.current.rotate})`;
        });
  }

  context.attrTween('transform', function (d) {
    d = getProperties(d);
    this.current = this.current || d;
    const i = d3.interpolate(this.current, d);
    return t => {
      this.current = i(t);
      return `translate(${arc.centroid(this.current)}) `+
             `rotate(${this.current.rotate || 0})`;
    };
  });
}
