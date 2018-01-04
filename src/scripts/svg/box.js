import { scaleLinear, format } from 'd3';
import { annotation } from 'd3-svg-annotation';

import base from '../model/base';
import updateAnnotations from '../util/annotation';

// creates a box and whisker set for box plots

// box svg generator
export default function () {
  const $$ = {};

  /* Update Function */
  const box = function (context) {
    const selection = context.selection? context.selection() : context,
          scale = $$.scale,
          enterScale = $$.enterScale || scale,
          valueFormat = $$.valueFormat,
          vertical = $$.orient === 'vertical',
          orient = vertical ?
            {x: 'x', y: 'y', x1: 'x1', x2: 'x2', y1: 'y1', y2: 'y2', width: 'width', height: 'height', cx: 'cx', cy: 'cy', translate: (x, y) => `translate(${x}, ${y})`} :
            {x: 'y', y: 'x', x1: 'y1', x2: 'y2', y1: 'x1', y2: 'x2', width: 'height', height: 'width', cx: 'cy', cy: 'cx', translate: (x, y) => `translate(${y}, ${x})`};

    // setup box-group and extract all necessary properties
    const group = selection.selectAll('.d2b-box').data((d, i) => {
      d = $$.data(d, i);

      const outliers = $$.outliers(d, i) || [],
            minimum = $$.minimum(d, i),
            maximum = $$.maximum(d, i);

      return [{
        data:           d,
        index:          i,
        median:         $$.median(d, i),
        upperQuartile:  $$.upperQuartile(d, i),
        lowerQuartile:  $$.lowerQuartile(d, i),
        minimum:        minimum,
        maximum:        maximum,
        outliers:       outliers,
        maxOutliers:    outliers.filter(d => d > maximum),
        minOutliers:    outliers.filter(d => d < minimum),
        color:          $$.color(d, i),
        width:          $$.width(d, i),
        annotations:    $$.annotations(d, i)
      }];
    });
    const groupEnter = group.enter().append('g')
        .attr('class', 'd2b-box');
    let groupUpdate = group.merge(groupEnter).order();

    // setup box-center
    const center = groupUpdate.selectAll('.d2b-box-center').data(d => [d]);
    const centerEnter = center.enter().append('line')
        .attr(orient.x1, 0)
        .attr(orient.x2, 0)
        .attr(orient.y1, d => enterScale(d.minimum))
        .attr(orient.y2, d => enterScale(d.maximum))
        .attr('class', 'd2b-box-center');
    let centerUpdate = center.merge(centerEnter);

    // setup box-rect
    const rect = groupUpdate.selectAll('.d2b-box-rect').data(d => [d]);
    const rectEnter = rect.enter().append('rect')
        .attr('class', 'd2b-box-rect')
        .attr(orient.width, d => d.width)
        .attr(orient.height, d => Math.abs(enterScale(d.upperQuartile) - enterScale(d.lowerQuartile)))
        .attr(orient.x, d => -d.width / 2)
        .attr(orient.y, d => Math.min(enterScale(d.upperQuartile), enterScale(d.lowerQuartile)));
    let rectUpdate = rect.merge(rectEnter);

    // enter, update, exit all outliers
    ['max', 'min']
      .forEach(outlierType => {
        const outlier = groupUpdate.selectAll(`.d2b-box-${outlierType}-outlier`)
            .data(d => {
              return d[`${outlierType}Outliers`].map(o => {
                return {
                  outlier: o,
                  box: d
                };
              });
            });
        const outlierEnter = outlier.enter().append('circle')
            .style('opacity', 0)
            .attr('r', d => d.box.width / 5)
            .attr(orient.cx, 0)
            .attr(orient.cy, d => enterScale(d.outlier))
            .attr('class', `d2b-box-outlier d2b-box-${outlierType}-outlier`);
        let outlierUpdate = outlier.merge(outlierEnter),
            outlierExit = outlier.exit();

        if (context !== selection) {
          outlierUpdate = outlierUpdate.transition(context);
          outlierExit = outlierExit.transition(context);
        }

        outlierUpdate
          .style('opacity', 1)
          .attr('stroke', d => d.box.color)
          .attr('r', d => d.box.width / 5)
          .attr(orient.cx, 0)
          .attr(orient.cy, d => scale(d.outlier));

        outlierExit
          .attr(orient.cx, 0)
          .attr(orient.cy, d => scale(d.outlier))
          .style('opacity', 0)
          .remove();
      });

    // enter, update all dashes
    ['maximum', 'median', 'minimum']
      .forEach(dashType => {
        const dash = groupUpdate.selectAll(`.d2b-box-dash-${dashType}`)
            .data(d => [d]);
        const dashEnter = dash.enter().append('line')
            .attr('class', `d2b-box-dash d2b-box-dash-${dashType}`)
            .attr(orient.x1, d => -d.width / 2)
            .attr(orient.x2, d => d.width / 2)
            .attr(orient.y1, d => enterScale(d[dashType]))
            .attr(orient.y2, d => enterScale(d[dashType]));
        let dashUpdate = dash.merge(dashEnter);

        if (context !== selection) dashUpdate = dashUpdate.transition(context);

        dashUpdate
          .attr('stroke', d => d.color)
          .attr(orient.x1, d => -d.width / 2)
          .attr(orient.x2, d => d.width / 2)
          .attr(orient.y1, d => scale(d[dashType]))
          .attr(orient.y2, d => scale(d[dashType]));
      });

    // enter, update all labels and annotations
    ['maximum', 'upperQuartile', 'median', 'lowerQuartile', 'minimum']
      .forEach((textType, i) => {
        const label = groupUpdate.selectAll(`.d2b-box-label-group-${textType}`)
            .data(d => [d]);
        const labelEnter = label.enter().append('g')
            .attr('class', `d2b-box-label-group d2b-box-label-group-${textType}`)
            .attr('transform', d => orient.translate(0, enterScale(d[textType])));

        labelEnter.append('text')
            .attr('class', 'd2b-box-label')
            .attr(orient.x, d => (3 + d.width / 2) * (i % 2 === 0 ? 1 : -1))
            .style('text-anchor', i % 2 === 0 ? 'start' : 'end');

        let labelUpdate = label.merge(labelEnter);

        if (context !== selection) labelUpdate = labelUpdate.transition(context);

        labelUpdate
            .attr('transform', d => orient.translate(0, scale(d[textType])))
            .call(updateAnnotations, $$.annotation, 'd2b-box-annotation', d => {
              return (d.annotations || []).filter(a => a.location === textType);
            });

        const labelText = labelUpdate
          .select('.d2b-box-label')
            .text(d => valueFormat(d[textType]));

        if (vertical) {
          labelText.select()
              .style('text-anchor', i % 2 === 0 ? 'start' : 'end')
              .style('dominant-baseline', 'middle')
              .attr(orient.x, d => (3 + d.width / 2) * (i % 2 === 0 ? 1 : -1));
        } else {
          labelText
              .style('text-anchor', 'middle')
              .style('dominant-baseline', i % 2 === 0 ? 'baseline' : 'hanging')
              .attr(orient.x, d => (3 + d.width / 2) * (i % 2 === 0 ? -1 : 1));
        }
      });

    if (context !== selection) {
      rectUpdate = rectUpdate.transition(context);
      centerUpdate = centerUpdate.transition(context);
    }

    rectUpdate
      .attr(orient.x, d => -d.width / 2)
      .attr(orient.y, d => Math.min(scale(d.upperQuartile), scale(d.lowerQuartile)))
      .attr(orient.width, d => d.width)
      .attr(orient.height, d => Math.abs(scale(d.upperQuartile) - scale(d.lowerQuartile)))
      .attr('stroke', d => d.color);

    centerUpdate
      .attr(orient.x1, 0)
      .attr(orient.x2, 0)
      .attr(orient.y1, d => scale(d.minimum))
      .attr(orient.y2, d => scale(d.maximum))
      .attr('stroke', d => d.color);

    selection.dispatch('box-updated', {bubbles: true});

    return box;
  };

  /* Inherit from base model */
  base(box, $$)
    .addProp('scale', scaleLinear())
    .addProp('enterScale', null)
    .addProp('valueFormat', format(','))
    .addProp('orient', 'vertical')
    .addProp('annotation', annotation ? annotation() : null)
    .addPropFunctor('data', d => d)
    .addPropFunctor('median', d => d.median)
    .addPropFunctor('upperQuartile', d => d.upperQuartile)
    .addPropFunctor('lowerQuartile', d => d.lowerQuartile)
    .addPropFunctor('minimum', d => d.minimum)
    .addPropFunctor('maximum', d => d.maximum)
    .addPropFunctor('outliers', d => d.outliers)
    .addPropFunctor('width', 20)
    .addPropFunctor('color', 'steelblue')
    .addPropFunctor('annotations', d => d.annotations);

  return box;
}
