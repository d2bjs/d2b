import * as d3 from 'd3';

export default function (context, arc) {
  function getProperties(d) {
    return {
      innerRadius: arc.innerRadius()(d),
      outerRadius: arc.outerRadius()(d),
      startAngle: arc.startAngle()(d),
      endAngle: arc.endAngle()(d),
    };
  }

	// if context is not a transition just render the arc and update current
  if (!context.selection) {
    return context
        .attr('d', function (d) {
          this.current = getProperties(d);
          return arc(d);
        });
  }

  // if context is a transition tween the 'd' attribute
  context.attrTween('d', function (d) {
    // omit data attribute incase of a pie chart with nested associations
    d = getProperties(d);
    this.current = this.current || d;
    const i = d3.interpolate(this.current, d);
    return t => {
      this.current = i(t);
      return arc(this.current);
    };
  });
}
