import { select } from 'd3';
import { annotation } from 'd3-svg-annotation';

import functor from './functor';

// copy d3.annotation instance for single use cases

export const copy = function (_annotation) {
  return annotation()
    .disable(_annotation.disable())
    .textWrap(_annotation.textWrap())
    .notePadding(_annotation.notePadding())
    .type(_annotation.type())
    .accessors(_annotation.accessors())
    .accessorsInverse(_annotation.accessorsInverse())
    .ids(_annotation.ids())
    .editMode(_annotation.editMode())
    .collection(_annotation.collection());
};

// Update some annotations based on:
/**
 * @param {d3 transition or selection}    context
 * @param {d3 annotation}                 annotation
 * @param {string}                        selectorClass
 * @param {accessor}                      getData             get annotation data array from context datum
 * @param {accessor (d, a) => {}}         getColor            get annotation color from from context datum and annotation datum
 * @param {accessor (d, a) => {}}         getTransform        get annotation transform from context datum and annotation datum
 * @param {accessor (d, a) => {}}         getTransformEnter   get annotation entrance transform from context datum and annotation datum
 */

export const update = function (
  context,
  annotation,
  selectorClass,
  getData = d => d.annotation ? [d.annotation] : [],
  getColor = d => d.color,
  getTransform = 'translate(0, 0)',
  getTransformEnter = 'translate(0, 0)'
) {

  const selection = context.selection? context.selection() : context;

  context.each(function (d) {
    const el = select(this),
          data = functor(getData)(d),
          annotationSvg = el.selectAll('g.' + selectorClass).data(data),
          annotationEnter = annotationSvg.enter().append('g');

    let annotationUpdate = annotationSvg.merge(annotationEnter),
        annotationExit = annotationSvg.exit();

    annotationEnter
        .attr('class', selectorClass)
        .attr('transform', a => functor(getTransformEnter)(d, a))
        .style('opacity', 0);

    data.forEach(a => {
      a.x = 0;
      a.y = 0;
      a.color = functor(getColor)(d, a);
    });

    if (data.length && annotation) {
      annotationUpdate.selectAll('*').remove();
      annotationUpdate.call(copy(annotation).annotations(data));
    }

    // handle annotation transitions and exiting
    if (context !== selection) {
      annotationUpdate = annotationUpdate.transition(context);
      annotationExit = annotationExit.transition(context);
    }

    annotationUpdate
        .attr('transform', a => functor(getTransform)(d, a))
        .style('opacity', 1);

    annotationExit
        .attr('transform', a => functor(getTransform)(d, a))
        .style('opacity', 0)
        .remove();
  });
};

export default update;
