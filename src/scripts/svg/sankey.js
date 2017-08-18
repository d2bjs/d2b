import * as d3 from 'd3';

import base from '../model/base';
import color from '../util/color';

// sankey svg generator
export default function () {

  const $$ = {};

  /* Update Function */
  const sankey = function (context) {
    const selection = (context.selection)? context.selection() : context;

    selection.each (function (datum) {
      const transition = context === selection ? null : context;

      const el = d3.select(this),
            size = $$.size(datum),
            sankeyLink = d3.sankeyLinkHorizontal();

      // map node data wrapper
      const nodesData = $$.nodes(datum).map((d, i) => {
        const key = $$.nodeKey(d);

        return {
          key: key,
          color: $$.nodeColor(d, key),
          draggableX: $$.nodeDraggableX(d),
          draggableY: $$.nodeDraggableY(d),
          preserveDragging: $$.nodePreserveDragging(d),
          data: d,
          index: i,
        };
      });

      // map link data wrapper
      const linksData = $$.links(datum).map((d, i) => {
        const source = $$.linkSource(d, i),
              target = $$.linkTarget(d, i);

        const sourceKey = typeof source === 'object' ? $$.nodeKey(source) : source,
              targetKey = typeof target === 'object' ? $$.nodeKey(target) : target;

        const key = $$.linkKey(d, i, sourceKey, targetKey);

        return {
          sourceKey: sourceKey,
          targetKey: targetKey,
          key: key,
          keyTrim: key.replace(/ /g, ''),
          sourceColor: $$.linkSourceColor(d, i, sourceKey),
          targetColor: $$.linkTargetColor(d, i, targetKey),
          value: $$.linkValue(d, i),
          source: source,
          target: target,
          data: d,
          index: i,
        };
      });

      // config sankey
      $$.sankey
          .size([size.width, size.height])
          .nodeId(d => d.key)
          .nodes(nodesData)
          .links(linksData);

      const nodeWidth = $$.sankey.nodeWidth();

      // get sankey graph layout
      const graph = $$.sankey();

      // render link gradients
      let linkDefs = el.selectAll('.d2b-sankey-link-defs').data([graph.links]),
          linksDefsEnter = linkDefs.enter().append('defs').attr('class', 'd2b-sankey-link-defs');

      linkDefs = linkDefs.merge(linksDefsEnter);

      let linkGradient = linkDefs.selectAll('.d2b-def-gradient').data(d => d, d => d.keyTrim),
          linkGradientEnter = linkGradient.enter().append('linearGradient').attr('class', 'd2b-def-gradient'),
          linkGradientExit = linkGradient.exit();

      linkGradientEnter.append('stop')
          .attr('class', 'd2b-gradient-from')
          .attr('offset', '0%');

      linkGradientEnter.append('stop')
          .attr('class', 'd2b-gradient-to')
          .attr('offset', '100%');

      linkGradient = linkGradient.merge(linkGradientEnter);

      if (transition) {
        linkGradientExit = linkGradientExit.transition(transition);
        linkGradient = linkGradient.transition(transition);
      }

      linkGradientExit.remove();

      linkGradient
          .attr('id', d => d.keyTrim);

      linkGradient.select('.d2b-gradient-from')
          .attr('stop-color', d => d.sourceColor);

      linkGradient.select('.d2b-gradient-to')
          .attr('stop-color', d => d.targetColor);

      // render links
      let links = el.selectAll('.d2b-sankey-links').data([graph.links]),
          linksEnter = links.enter().append('g').attr('class', 'd2b-sankey-links');

      links = links.merge(linksEnter);

      let link = links.selectAll('.d2b-sankey-link').data(d => d, d => d.key),
          linkEnter = link.enter().append('g').attr('class', 'd2b-sankey-link'),
          linkExit = link.exit();

      const linkStatic = link = link.merge(linkEnter);

      if (transition) {
        link = link.transition(transition);
        linkExit = linkExit.transition(transition);
      }

      // render nodes
      let nodes = el.selectAll('.d2b-sankey-nodes').data([graph.nodes]),
          nodesEnter = nodes.enter().append('g').attr('class', 'd2b-sankey-nodes');

      nodes = nodes.merge(nodesEnter);

      let node = nodes.selectAll('.d2b-sankey-node').data(d => d, d => d.key),
          nodeEnter = node.enter().append('g').attr('class', 'd2b-sankey-node'),
          nodeExit = node.exit();

      const nodeStatic = node = node.merge(nodeEnter);

      if (transition) {
        node = node.transition(transition);
        nodeExit = nodeExit.transition(transition);
      }

      // setup node dragging and preserve previous dragging
      node.each(function (d) {
        if (d.draggableX || d.draggableY) {
          d3.select(this)
            .classed('d2b-draggable', true)
            .call(d3.drag().on('drag', drag));
        } else {
          d3.select(this)
            .classed('d2b-draggable', false)
            .on('.drag', null);
        }

        if (d.preserveDragging) {
          if (this.__dragX0 !== undefined) {
            d.x0 = this.__dragX0 * size.width;
            d.x1 = d.x0 + nodeWidth;
          }

          if (this.__dragY0 !== undefined) {
            const height = d.y1 - d.y0;
            d.y0 = this.__dragY0 * size.height;
            d.y1 = d.y0 + height;
          }
        }
      });

      $$.sankey.update(graph);

      linkEnter
          .style('opacity', 0)
        .append('path')
          .attr('d', sankeyLink)
          .style('stroke', d => `url(#${d.keyTrim})`)
          .style('stroke-width', d => `${d.width}px`);

      linkExit
          .style('opacity', 0)
          .remove();

      nodeEnter
          .style('opacity', 0)
          .append('rect')
          .attr('width', Math.max(0, nodeWidth))
          .attr('height', d => Math.max(0, d.y1 - d.y0))
          .attr('x', d => d.x0)
          .attr('y', d => d.y0);

      nodeExit
          .style('opacity', 0)
          .remove();

      updater(transition);

      function drag(d) {
        if (d.draggableX) {
          d.x0 = Math.max(0, Math.min(size.width - nodeWidth, d.x0 + d3.event.dx));
          d.x1 = d.x0 + nodeWidth;
          this.__dragX0 = d.x0 / size.width; // save drag position as a percent of the width
        }
        if (d.draggableY) {
          const height = d.y1 - d.y0;
          d.y0 = Math.max(0, Math.min(size.height - (d.y1 - d.y0), d.y0 + d3.event.dy));
          d.y1 = d.y0 + height;
          this.__dragY0 = d.y0 / size.height; // save drag position as a percent of the height
        }
        $$.sankey.update(graph);
        updater();
      }

      function updater(transition = false) {
        const l = transition ? link : linkStatic,
              n = transition ? node : nodeStatic;

        l
            .style('opacity', 1)
          .select('path')
            .attr('d', sankeyLink)
            .style('stroke', d => `url(#${d.keyTrim})`)
            .style('stroke-width', d => `${d.width}px`);

        // fix for rectangular link gradients
        l.each(function(d) {
          const l = d3.select(this);

          // special case draw a rect
          if (Math.abs(d.y1 - d.y0) < 0.00001) {
            let rect = l.selectAll('rect').data([d]),
                rectEnter = rect.enter().append('rect'),
                width = d.target.x0 - d.source.x1;

            rect = rect.merge(rectEnter);

            if (transition) rect = rect.transition(transition);

            rect
                .attr('x', d.source.x1 + Math.min(0, width))
                .attr('y', d.y0 - d.width / 2)
                .attr('height', Math.max(0, d.width))
                .attr('width', Math.abs(d.target.x0 - d.source.x1))
                .style('fill', `url(#${d.keyTrim})`);

            l.select('path').style('display', 'none');
          } else {
            l.select('rect').remove();
            l.select('path').style('display', '');
          }
        });

        n
            .style('opacity', 1)
          .select('rect')
            .attr('width', Math.max(0, nodeWidth))
            .attr('height', d => Math.max(0, d.y1 - d.y0))
            .attr('x', d => d.x0)
            .attr('y', d => d.y0)
            .style('fill', d => d.color);
      }
    });

    selection.dispatch('svg-sankey-updated', {bubbles: true});

    return sankey;
  };

  /* Inherit from base model */
  base(sankey, $$)
    .addProp('sankey', d3.sankey())
    .addPropFunctor('size', {width: 960, height: 500})
    .addPropFunctor('nodes', d => d.nodes)
    .addPropFunctor('nodeKey', d => d.name)
    .addPropFunctor('nodeDraggableX', false)
    .addPropFunctor('nodeDraggableY', false)
    .addPropFunctor('nodePreserveDragging', true)
    .addPropFunctor('nodeColor', (d, key) => color(key))
    .addPropFunctor('links', d => d.links)
    .addPropFunctor('linkSource', d => d.source)
    .addPropFunctor('linkSourceColor', (d, i, sourceKey) => {
      return color(sourceKey);
    })
    .addPropFunctor('linkTarget', d => d.target)
    .addPropFunctor('linkTargetColor', (d, i, targetKey) => {
      return color(targetKey);
    })
    .addPropFunctor('linkKey', (d, i, sourceKey, targetKey) => {
      return `${sourceKey}-${targetKey}`;
    })
    .addPropFunctor('linkValue', d => d.value);

  return sankey;
}
