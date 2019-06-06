import { interpolate } from 'd3-interpolate';

export default function (context, arc, reform = true) {
  // Reform the arc config methods so that they will first look at the arc datum
  // for the config property and otherwise they will fallback to the arcs methods
  // original callback
  if (reform) {
    ['cornerRadius', 'innerRadius', 'outerRadius', 'startAngle', 'endAngle', 'cornerRadius', 'padAngle'].forEach(method => {
      const methodSave = arc[method]();
      if (methodSave && !methodSave.reformed) {
        const methodReformed = d => d[method] || methodSave(d);
        methodReformed.reformed = true;
        arc[method](methodReformed);
      }
    });
  }

  function getProperties(d) {
    return {
      innerRadius: arc.innerRadius()(d),
      outerRadius: arc.outerRadius()(d),
      startAngle: arc.startAngle()(d),
      endAngle: arc.endAngle()(d),
      cornerRadius: arc.cornerRadius()(d),
      padAngle: arc.padAngle()(d),
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
    const i = interpolate(this.current, d);
    return t => {
      this.current = i(t);
      return arc(this.current);
    };
  });
}
