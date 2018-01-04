import { select, interpolateObject } from 'd3';
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

// Update a set of annotations, should only be used for point oriented annotations. (e.g. not rectangles / thresholds)
/**
 * @param {d3 transition or selection}    context             annotation container context
 * @param {d3 annotation}                 annotation          annotation generator
 * @param {string}                        selectorClass       class by which to select the annotations
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

// quick implementation of shallow object clone

function clone(obj) {
  if (null == obj || "object" != typeof obj) return obj;
  const copy = obj.constructor();
  for (let attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}

// Transform x, y, x2, y2 into d3.annotation pixel attributes and update axis annotations accordingly
/**
 * @param {d3 transition or selection}    context             annotation container context
 * @param {d3 annotation}                 annotation          annotation generator
 * @param {accessor}                      data                annotation data array
 * @param {object}                        scales              annotation scales { x, y, x2, y2 }
 */

export const updateAxis = function (context, annotation, data, scales) {

  const selection = context.selection ? context.selection() : context,
        node = selection.node(),
        preScales = node.__scales || scales;

  const getTransform = function (a, scales) {
    const x = scales[a.xType],
          y = scales[a.yType],
          xVal = a.x === Infinity ? x.range()[0] : x(a.x),
          yVal = a.y === Infinity ? y.range()[0] : y(a.y),
          x2Val = a.x2 === Infinity ? x.range()[1] : x(a.x2),
          y2Val = a.y2 === Infinity ? y.range()[1] : y(a.y2);

    return `translate(${[
      isNaN(x2Val) ? xVal : Math.min(xVal, x2Val),
      isNaN(y2Val) ? yVal : Math.min(yVal, y2Val)
    ]})`;
  };

  const getSubject = function (a, scales) {
    const subjectCopy = clone(a.data.subject) || {},
          x = scales[a.xType],
          y = scales[a.yType],
          xVal = a.x === Infinity ? x.range()[0] : x(a.x),
          yVal = a.y === Infinity ? y.range()[0] : y(a.y),
          x2Val = a.x2 === Infinity ? x.range()[1] : x(a.x2),
          y2Val = a.y2 === Infinity ? y.range()[1] : y(a.y2),
          width = a.x2 ? Math.abs(xVal - x2Val) : 0,
          height = a.y2 ? Math.abs(yVal - y2Val) : 0;

    if (a.x2 && a.y2) {
      subjectCopy.width = width;
      subjectCopy.height = height;
    } else if (a.x2) {
      subjectCopy.x1 = 0;
      subjectCopy.x2 = width;
    } else if (a.y2) {
      subjectCopy.y1 = 0;
      subjectCopy.y2 = height;
    }

    subjectCopy.dx = subjectCopy.dx * width;
    subjectCopy.dy = subjectCopy.dy * height;

    return subjectCopy;
  };

  node.__scales = {
    x: scales.x.copy(),
    y: scales.y.copy(),
    x2: scales.x2.copy(),
    y2: scales.y2.copy()
  };

  let aSvg = selection.selectAll('.d2b-axis-annotation').data(data, d => d.key),
      aEnter = aSvg.enter().append('g'),
      aExit = aSvg.exit();

  // clear out the annotaiton before updating in case of a change in annotation type
  aSvg.selectAll('*').remove();

  aSvg = aSvg.merge(aEnter);

  aEnter
      .attr('class', 'd2b-axis-annotation')
      .attr('transform', a => getTransform(a, preScales))
      .style('opacity', 0);

  if (context !== selection) {
    aSvg = aSvg.transition(context);
    aExit = aExit.transition(context);
  }

  aSvg
      .attr('transform', a => getTransform(a, scales))
      .style('opacity', 1);

  aExit
      .attr('transform', a => getTransform(a, scales))
      .style('opacity', 0)
      .remove();

  aSvg.each(function (a) {
    const aCopy = clone(a.data),
          aSvg = select(this),
          annotationCopy = copy(annotation);

    aCopy.x = 0;
    aCopy.y = 0;
    aCopy.color = a.color;
    aCopy.subject = getSubject(a, scales);
    aCopy.dx = (aCopy.subject.dx || 0) + (a.data.dx || 0);
    aCopy.dy = (aCopy.subject.dy || 0) + (a.data.dy || 0);

    // if transitioning, custom tween the subject contents
    if (context !== selection) {
      aSvg.transition(context).tween('annotation-tween', function () {
        const i = interpolateObject(this.__subject || getSubject(a, scales), aCopy.subject);
        return t => {
          this.__subject = aCopy.subject = i(t);
          aCopy.dx = (aCopy.subject.dx || 0) + (a.data.dx || 0);
          aCopy.dy = (aCopy.subject.dy || 0) + (a.data.dy || 0);
          aSvg.call(annotationCopy.annotations([aCopy]));
        };
      });
    } else {
      aSvg.call(annotationCopy.annotations([aCopy]));
    }
  });
};

export default update;
