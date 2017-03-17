// TODO : Clean up node updater code.
import * as d3 from 'd3';


import {default as base} from '../model/base.js';
import {default as color} from '../util/color.js';
import {default as tweenArc} from '../util/tweenArc.js';
import {default as tweenCentroid} from '../util/tweenCentroid.js';
import {default as toDegrees} from '../math/toDegrees.js';

// sunburst svg generator
export default function () {

  const $$ = {};

  const arc = d3.arc();

  /* Update Function */
  const sunburst = function (context) {
    const selection = (context.selection)? context.selection() : context;

    $$.pie.value(d => d.value);

    selection.each (function (d, i) {
      const el          = d3.select(this),
            zoomable    = $$.zoomable(d, i),
            highlight   = $$.highlight(d, i),
            innerRadius = $$.innerRadius(d, i),
            showLabels  = $$.showLabels(d, i),
            root        = getHierarchy(d);

      let selected = getSelected(root);
      setVisibility(selected, $$.descendantLevels(d, i) + selected.depth);

      root.each(d => d.selected = selected);

      const radii = getRadii(d, i, root, selected);

      updateNodes.call(this, [root], 'arc', 0, $$.startAngle(d, i), $$.endAngle(d, i), {
        transition:     (context !== selection)? context : null,
        oldRadii:       this.oldRadii || radii,
        radii:          radii,
        zoomable:       zoomable
      });

      updateNodes.call(this, showLabels? [root] : [], 'label', 0, $$.startAngle(d, i), $$.endAngle(d, i), {
        transition:     (context !== selection)? context : null,
        oldRadii:       this.oldRadii || radii,
        radii:          radii
      });

      // insert a center circle that is transparent, but whenever it is clicked
      // the selection will be passed to the current selection's parent
      let center = el.selectAll('.d2b-sunburst-center');

      center.data([selected])
        .enter().append('circle').attr('class', 'd2b-sunburst-center')
        .merge(center)
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('r', Math.max(0, innerRadius))
          .on('click', function (d) {
            if (!d.parent) return;
            d.data.selected = false;
            d.parent.data.selected = true;
            el.transition().duration($$.duration(d, i)).call(sunburst);
          });

      this.oldRadii = radii;

      el.selectAll('path.d2b-sunburst-arc')
          .on('click',
            zoomable?
            node => {
              root.each(d => d.data.selected = false);
              node.data.selected = true;
              el.transition().duration($$.duration(d, i)).call(sunburst);
            } : null
          )
          .on('mouseover',
            highlight?
            node => {
              const ancestors = node.ancestors();

              el.selectAll('.d2b-sunburst-arc')
                  .classed('d2b-transparent', function (d) {
                    return ancestors.indexOf(d) === -1;
                  });

              el.selectAll('.d2b-sunburst-label')
                  .classed('d2b-transparent', function (d) {
                    return ancestors.indexOf(d) === -1;
                  });
            } : null
          )
          .on('mouseout', function () {
            el.selectAll('.d2b-sunburst-arc').classed('d2b-transparent', false);
            el.selectAll('.d2b-sunburst-label').classed('d2b-transparent', false);
          });

    });

    return sunburst;
  };

  /* Inherit from base model */
  base(sunburst, $$)
    .addProp('pie', d3.pie().sort(null))
    .addProp('ancestorBanding', d3.scaleLinear())
    .addProp('descendantBanding', d3.scalePow().exponent(0.85))
    // Datum Level Accessors
    .addPropFunctor('duration', 250)
    .addPropFunctor('innerRadius', 30)
    .addPropFunctor('outerRadius', 200)
    .addPropFunctor('ancestorPadding', 10)
    .addPropFunctor('ancestorRatio', 0.2)
    .addPropFunctor('descendantLevels', Infinity)
    .addPropFunctor('startAngle', 0)
    .addPropFunctor('endAngle', 2 * Math.PI)
    .addPropFunctor('showLabels', false)
    .addPropFunctor('zoomable', true)
    .addPropFunctor('highlight', true)
    // Node Level Accessors
    .addPropFunctor('key', d => d.label)
    .addPropFunctor('label', d => d.label)
    .addPropFunctor('color', d => color(d.label))
    .addPropFunctor('children', d => d.children)
    .addPropFunctor('size', d => d.size);

  function getHierarchy (d) {
    return updateDescendants(d3.hierarchy(d, $$.children).sum($$.size));
  }

  function updateDescendants (node, i = 0) {
    node.key = $$.key(node.data, i);
    node.color = $$.color(node.data, i);
    node.label = $$.label(node.data, i);

    if (!node.children) return;

    node.children.forEach(updateDescendants);

    return node;
  }

  function getSelected (root) {
    let node = null;

    // find selected node
    root.each(function (d) {
      if (d.data.selected) node = d;
    });

    // if selected isn't defined set it to the root node
    if (!node) node = root;
    // if selected is a leaf (bottom) node give selected to the parent
    // else if ((!node.children || !node.children.length) && node.parent) {
    //   node.data.selected = false;
    //   node = node.parent;
    // }

    // make sure selected flag is still asserted
    node.data.selected = true;

    return node;
  }

  // set visibility flag for all nodes
  function setVisibility (d, maxDepth) {
    d.ancestors().concat(d.descendants())
      .filter(d => d.depth <= maxDepth && d.value > 0)
      .forEach(d => d.visible = true);
  }

  // returns a function used to find the inner/outer radii for an arc based
  // on it's depth
  function getRadii (d, i, root, selected) {
    const innerRadius       = $$.innerRadius(d, i),
          outerRadius       = $$.outerRadius(d, i),
          ancestorPadding   = $$.ancestorPadding(d, i),
          ancestorRatio     = $$.ancestorRatio(d, i);

    let height = 0;

    root.each(function (node) {
      if (node.visible) height = Math.max(height, node.depth);
    });

    const width       = (outerRadius - innerRadius - ancestorPadding),
          breakpoint  = innerRadius + width * ancestorRatio,
          // radii-inner-scale is used to position inner bands
          radiiInner = $$.ancestorBanding.copy()
                    .range([innerRadius, breakpoint])
                    .domain([0, selected.depth + 1]),
          // radii-outer-scale is used to position outer bands
          radiiOuter = $$.descendantBanding.copy()
                    .range([breakpoint + ancestorPadding, outerRadius])
                    .domain([selected.depth + 1, height + 1]);

    // fetch the { inner, outer } radii for an arc based on it's depth
    return function (depth) {
      let scale;
      if (depth <= selected.depth) scale = radiiInner;
      else scale = radiiOuter;
      return { inner: scale(depth), outer: scale(depth + 1) };
    };
  }

  function getLabelRotation(centerAngle) {
    if (centerAngle > Math.PI) return toDegrees(centerAngle) + 90;
    else return toDegrees(centerAngle) - 90;
  }

  function getLabelOffset(centerAngle, radii) {
    const offset = (radii.inner - radii.outer) / 2.2;
    if (centerAngle > Math.PI) return - offset;
    else return offset;
  }

  function getLabelAnchor (centerAngle) {
    if (centerAngle > Math.PI) return 'end';
    else return 'start';
  }

  function updateNodes (newData, type, depth, startAngle, endAngle, tools) {

    const tween = type === 'arc'? tweenArc : tweenCentroid;

    newData = newData.filter(d => d.visible);

    $$.pie
      .startAngle(startAngle)
      .endAngle(endAngle);

    $$.pie(newData)
      .forEach(function (d) {
        const radii = tools.radii(d.data.depth);

        d.data.startAngle  = d.startAngle;
        d.data.endAngle    = d.endAngle;
        d.data.padAngle    = d.padAngle;
        d.data.innerRadius = radii.inner;
        d.data.outerRadius = radii.outer;
        d.data.centerAngle = (d.startAngle + d.endAngle) / 2;

        d.data.rotate      = getLabelRotation(d.data.centerAngle);
        d.data.labelOffset = getLabelOffset(d.data.centerAngle, radii);
        d.data.labelAnchor = getLabelAnchor(d.data.centerAngle);
      });

    const el          = d3.select(this),
          levelClass  = `d2b-sunburst-level-${depth}`;

    let arcUpdate = el.selectAll(`.d2b-sunburst-${type}-group.${levelClass}`);

    const oldData = arcUpdate.data();

    arcUpdate = arcUpdate.data(newData, d => d.key);

    const arcEnter = arcUpdate.enter()
            .append('g')
              .attr('class', `d2b-sunburst-${type}-group ${levelClass}`),
          pathEnter = arcEnter
            .append(type === 'arc'? 'path' : 'text')
              .attr('class', `d2b-sunburst-${type} ${levelClass}`)
              .each(function (d, i) {
                const radii    = tools.oldRadii(d.depth),
                      neighbor = d.neighbor || findNeighborArc(i, oldData, newData);

                this.current = {
                  startAngle:   neighbor.startAngle,
                  endAngle:     neighbor.endAngle,
                  innerRadius:  radii.inner,
                  outerRadius:  radii.outer,
                  rotate:       getLabelRotation((neighbor.startAngle + neighbor.endAngle) / 2)
                };

                if (!d.children) return;

                d.children.forEach(dd => dd.neighbor = neighbor);
              });

    arcEnter
      .append('g')
        .attr('class', `d2b-sunburst-${type}-children ${levelClass}`);

    if (type === 'arc') pathEnter.style('fill', d => d.color);
    else pathEnter.style('opacity', 0).attr('y', 4);

    let arcExit = arcUpdate.exit();

    arcUpdate = arcUpdate.merge(arcEnter);

    arcUpdate.select(`.d2b-sunburst-${type}.${levelClass}`)
        .classed('d2b-sunburst-ancestor', d => d.depth < d.selected.depth);

    if (tools.transition) {

      arcExit
          .each(function (d, i) {
            const data = findNeighborArc(i, newData, oldData);
            const el = d3.select(this);

            const pathExit = el.selectAll(`.d2b-sunburst-${type}`)
                .datum(function (d) {
                  const radii = tools.radii(d.depth);
                  d.innerRadius = radii.inner;
                  d.outerRadius = radii.outer;
                  d.startAngle  = data.startAngle;
                  d.endAngle    = data.endAngle;
                  d.centerAngle = data.centerAngle;

                  d.rotate      = getLabelRotation(d.centerAngle);
                  d.labelOffset = getLabelOffset(d.centerAngle, radii);

                  return d;
                })
              .transition(tools.transition)
                .call(tween, arc);

            if (type === 'label') {
              pathExit
                  .style('opacity', 0)
                  .attr('x', d => d.labelOffset);
            }

          });

      arcExit = arcExit.transition(tools.transition);

      arcUpdate = arcUpdate.transition(tools.transition);

    }

    arcExit.remove();

    const pathUpdate = arcUpdate.select(`.d2b-sunburst-${type}.${levelClass}`)
        .call(tween, arc);

    if (type === 'arc') {
      pathUpdate.style('fill', d => d.color);
    } else {
      pathUpdate
          .text(d => d.depth >= d.selected.depth ? d.label : '')
          .style('opacity', 1)
          .attr('x', d => d.labelOffset)
          .style('text-anchor', d => d.labelAnchor);
    }

    arcUpdate.select(`.d2b-sunburst-${type}-children.${levelClass}`)
        .each(function (d) {
          const children = d.children || [];
          updateNodes.call(this, children, type, depth + 1, d.startAngle, d.endAngle, tools);
        });

  }

  function findNeighborArc (i, data0, data1) {
    let preceding = findPreceding(i, data0, data1),
        following = findFollowing(i, data0, data1);
    if (preceding) {
      return {startAngle: preceding.endAngle, endAngle: preceding.endAngle};
    } else if (following) {
      return {startAngle: following.startAngle, endAngle: following.startAngle};
    }
    return {startAngle: 0, endAngle: 0, centerAngle: 0};
  }

	// Find the element in data0 that joins the highest preceding element in data1.
  function findPreceding (i, data0, data1) {
    const m = data0.length;
    while (--i >= 0) {
      const k = data1[i].key;
      for (let j = 0; j < m; ++j) {
        if (data0[j].key === k) return data0[j];
      }
    }
  }

	// Find the element in data0 that joins the lowest following element in data1.
  function findFollowing (i, data0, data1) {
    const n = data1.length, m = data0.length;
    while (++i < n) {
      const k = data1[i].key;
      for (let j = 0; j < m; ++j) {
        if (data0[j].key === k) return data0[j];
      }
    }
  }

  return sunburst;
}
