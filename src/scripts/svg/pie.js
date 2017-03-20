import * as d3 from 'd3';

import {default as base} from '../model/base.js';
import {default as color} from '../util/color.js';
import {default as tweenArc} from '../util/tweenArc.js';

// pie svg generator
export default function () {

  const $$ = {};

  /* Update Function */
  const pie = function (context) {
    const selection = (context.selection)? context.selection() : context;

    $$.pie.value($$.value);

    $$.arc
      .startAngle(d => d.startAngle)
      .endAngle(d => d.endAngle)
      .padAngle(d => d.padAngle);

    let pieSvg = selection.selectAll('.d2b-pie').data(d => [$$.pie($$.values(d))]),
        pieSvgEnter = pieSvg.enter().append('g').attr('class', 'd2b-pie');

    pieSvg = pieSvg.merge(pieSvgEnter);

    pieSvg.each( function (values) {
      const el = d3.select(this);

      // select arc group and get their old data
      let arc = el.selectAll('.d2b-pie-arc');
      const oldData = arc.data();

      arc = arc.data(values, (d, i) => {
        d.key = $$.key(d.data, i);
        return d.key;
      });

      let arcEnter = arc.enter().append('g').attr('class', 'd2b-pie-arc'),
          arcExit = arc.exit(),
          arcUpdate = arc.merge(arcEnter).order();

      arcEnter.append('path')
          .attr('fill', function (d, i) {
            return $$.color.call(this, d.data, i);
          });

      // retrieve new data
      const newData = arcUpdate.data();

      // for new arcs, find and set the neighboring insertion point
      arcEnter.select('path')
          .each( function (d, i) {
            this.current = findNeighborArc(i, oldData, newData);
          });

      arcExit
        .datum(function(d, i) {
          const data = findNeighborArc(i, newData, oldData);
          data.data = d.data;
          data.innerRadius = d.innerRadius;
          data.outerRadius = d.outerRadius;
          return data;
        });

      // start transition for exiting and updating arcs
      if (context !== selection) {
        arcExit = arcExit.transition(context);
        arcUpdate = arcUpdate.transition(context);
      }

      // transition arc path
      arcUpdate
        .select('path')
          .call(tweenArc, $$.arc)
          .attr('fill', function (d, i) {
            return $$.color.call(this, d.data, i);
          });

      arcExit.remove().select('path').call(tweenArc, $$.arc);

    });

    return pie;
  };

  /* Inherit from base model */
  base(pie, $$)
    .addProp('arc', d3.arc())
    .addProp('pie', d3.pie().sort(null))
    .addPropFunctor('values', d => d)
    .addPropFunctor('key', d => d.label)
    .addPropFunctor('value', d => d.value)
    .addPropFunctor('color', d => color(d.label));


  function findNeighborArc (i, data0, data1) {
    let preceding = findPreceding(i, data0, data1),
        following = findFollowing(i, data0, data1);
    if (preceding) {
      return {startAngle: preceding.endAngle, endAngle: preceding.endAngle};
    } else if (following) {
      return {startAngle: following.startAngle, endAngle: following.startAngle};
    }
    return {startAngle: 0, endAngle: 0};
  }

	// Find the element in data0 that joins the highest preceding element in data1.
  function findPreceding (i, data0, data1) {
    const m = data0.length;
    while (--i >= 0) {
      const k = $$.key(data1[i].data, i);
      for (let j = 0; j < m; ++j) {
        if ($$.key(data0[j].data, j) === k) return data0[j];
      }
    }
  }

	// Find the element in data0 that joins the lowest following element in data1.
  function findFollowing (i, data0, data1) {
    const n = data1.length, m = data0.length;
    while (++i < n) {
      const k = $$.key(data1[i].data, i);
      for (let j = 0; j < m; ++j) {
        if ($$.key(data0[j].data, j) === k) return data0[j];
      }
    }
  }

  return pie;
}
