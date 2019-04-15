import { select } from 'd3-selection';
import 'd3-transition';

import base from '../model/base';
import textWrap from '../util/textWrap';
import id from '../util/id';
import oreq from '../util/oreq';

// TODO: Clean up text wrapping with transition udpates
// TODO: Clean up plane build workflow

// plane svg generator
export default function () {

  const $$ = {}, labelPad = 5;

  /* Update Function */
  const plane = function (context) {
    const selection = context.selection? context.selection() : context;

    selection.each(function (d, i) {
      // get plane props
      const size = $$.size.call(this, d, i) || {width: 960, height: 500},
            margin = makeMargin($$.margin.call(this, d, i)),
            x = $$.x.call(this, d, i),
            x2 = $$.x2.call(this, d, i),
            y = $$.y.call(this, d, i),
            y2 = $$.y2.call(this, d, i),
            el = select(this),
            axes = {
              x: {type: 'x', data: x},
              x2: {type: 'x2', data: x2},
              y: {type: 'y', data: y},
              y2: {type: 'y2', data: y2}
            };

      // check if user defined padding
      let padding = makePadding($$.padding.call(this, d, i));

      // enter plane svg group
      let planeUpdate = el.selectAll('.d2b-plane').data([d]),
          planeEnter = planeUpdate.enter().append('g').attr('class', 'd2b-plane'),
          plane = planeUpdate.merge(planeEnter);

      const clipID = this.__clipID = this.__clipID || `d2b-clip-plane-${(id())}`;

      planeEnter
        .append('defs')
        .append('clipPath')
          .attr('id', clipID)
          .attr('class', 'd2b-clip-plane')
        .append('rect');

      const transCtx = context !== selection? context : null;

      setupAxis (axes.x, i, plane, size.width, transCtx);
      setupAxis (axes.x2, i, plane, size.width, transCtx);
      setupAxis (axes.y, i, plane, size.height, transCtx);
      setupAxis (axes.y2, i, plane, size.height, transCtx);

      // if padding is not set, find it dynamically
      if (!padding) padding = dynamicPadding(axes);

      // define plane box properties
      const planeBox = {
        top: padding.top + margin.top,
        bottom: padding.bottom + margin.bottom,
        left: padding.left + margin.left,
        right: padding.right + margin.right,
      };
      planeBox.width = size.width - planeBox.left - planeBox.right;
      planeBox.height = size.height - planeBox.top - planeBox.bottom;

      // store plane box on the node
      this.__box__ = planeBox;

      if (transCtx) planeUpdate = planeUpdate.transition(transCtx);

      // position plane
      planeEnter.attr('transform', `translate(${planeBox.left}, ${planeBox.top})`);
      planeUpdate.attr('transform', `translate(${planeBox.left}, ${planeBox.top})`);

      updateAxis (axes.x, planeBox.width, 0, planeBox.height);
      updateAxis (axes.x2, planeBox.width, 0, 0);
      updateAxis (axes.y, planeBox.height, 0, 0);
      updateAxis (axes.y2, planeBox.height, planeBox.width, 0);

      updateGrid (axes.x, planeBox.width, planeBox.height);
      updateGrid (axes.x2, planeBox.width, planeBox.height);
      updateGrid (axes.y, planeBox.height, planeBox.width);
      updateGrid (axes.y2, planeBox.height, planeBox.width);

      updateLabel (axes.x, planeBox.width);
      updateLabel (axes.x2, planeBox.width);
      updateLabel (axes.y, - planeBox.height);
      updateLabel (axes.y2, - planeBox.height);

      plane
        .select('.d2b-clip-plane')
        .select('rect')
          .attr('width', planeBox.width + 1)
          .attr('height', planeBox.height + 1);

      plane
        .selectAll('.d2b-grid')
          .attr('clip-path', `url(#${clipID})`);
    });

    selection.dispatch('plane-updated', {bubbles: true});

    return plane;
  };

  /* Inherit from base model */
  base(plane, $$)
    // plane level functors
    .addPropFunctor('size', d => d.size)
    .addPropFunctor('padding', null)
    .addPropFunctor('margin', 0)
    .addPropFunctor('x', d => d.x)
    .addPropFunctor('x2', d => d.x2)
    .addPropFunctor('y', d => d.y)
    .addPropFunctor('y2', d => d.y2)
    // axis level functors
    .addPropFunctor('axis', d => d.axis)
    .addPropFunctor('orient', d => d.orient || 'outer')
    .addPropFunctor('wrapLength', d => oreq(d.wrapLength, Infinity))
    .addPropFunctor('tickSize', d => oreq(d.tickSize, 6))
    .addPropFunctor('showGrid', d => d.showGrid !== false)
    .addPropFunctor('label', d => d.label)
    .addPropFunctor('labelOrient', d => d.labelOrient || 'outer middle')
    // Method to get the computed box of a specific plane container. This
    // method should be used after the plane has been rendered. Either the
    // legend SVG node or a d3 selection of the node may be specified.
    .addMethod('box', (_) => {
      const node = (_.node)? _.node() : _;
      if (!node) return null;
      return node.__box__;
    });

  return plane;

  function setupAxis(axis, index, plane, extent, transCtx) {
    let axisData = [], gridData = [], data = axis.data;

    if (data) {
      setAxisInfo(axis, data, index, plane, extent);
      axisData = [data];
      if (axis.info.showGrid) gridData = [data];
    }

    // enter new axis container
    axis.update = plane.selectAll(`.d2b-${axis.type}-axis`).data(axisData);
    axis.enter = axis.update.enter().append('g')
        .attr('class', `d2b-axis d2b-${axis.type}-axis`);

    // enter label container
    axis.labelEnter = axis.enter.append('text').attr('class', 'd2b-axis-label');

    // merge axis svg container
    axis.svg = axis.enter.merge(axis.update);

    // fetch axis label
    axis.label = axis.svg.select('.d2b-axis-label');

    // exit axis
    axis.update.exit().remove();

    // set axis grid data
    axis.gridUpdate = plane.selectAll(`.d2b-${axis.type}-grid`).data(gridData);

    // enter axis grid
    axis.gridEnter = axis.gridUpdate.enter().append('g')
        .attr('class', `d2b-grid d2b-${axis.type}-grid`);

    // exit axis grid
    axis.gridUpdate.exit().remove();

    // merge axis grid
    axis.grid = axis.gridEnter.merge(axis.gridUpdate);

    if (transCtx) {
      axis.svg = axis.svg.transition(transCtx);
      axis.update = axis.update.transition(transCtx);
      axis.grid = axis.grid.transition(transCtx);
      axis.gridUpdate = axis.gridUpdate.transition(transCtx);
      axis.label = axis.label.transition(transCtx);
    }

  }

  function updateAxis(axis, extent, x, y) {
    if (!axis.data) return;
    setAxisTickSize(axis);
    setAxisRange(axis, extent);

    axis.enter
      .call(axis.info.axis)
      .attr('transform', `translate(${x}, ${y})`);
    axis.update
      .call(axis.info.axis)
      .attr('transform', `translate(${x}, ${y})`);

    axis.svg
      .call(wrapTicks, axis)
      .on('end', function () {
        axis.svg.call(wrapTicks, axis);
      });

  }

  function updateGrid(axis, extentRange, extentGrid) {
    if (!axis.data) return;
    setGridTickSize(axis, extentGrid);
    setAxisRange(axis, extentRange);

    axis.gridUpdate
      .call(axis.info.axis)
      .selectAll('.tick text').remove();

    axis.gridEnter
      .call(axis.info.axis)
      .selectAll('.tick text').remove();
  }

  function updateLabel(axis, extent) {
    if (!axis.data) return;
    axis.labelEnter
      .text(axis.info.label)
      .attr('x', labelX(axis, extent))
      .attr('y', labelY(axis))
      .attr('text-anchor', labelAnchor(axis));
    axis.label
      .text(axis.info.label)
      .attr('x', labelX(axis, extent))
      .attr('y', labelY(axis))
      .attr('text-anchor', labelAnchor(axis));
  }

  function setGridTickSize(axis, extent) {
    if (!axis.data) return;
    switch(axis.type) {
      case 'x':
        return axis.info.axis
          .tickSize(axis.info.orient === 'inner'? - extent : extent);
      case 'x2':
        return axis.info.axis
          .tickSize(axis.info.orient === 'inner'? extent : - extent);
      case 'y':
        return axis.info.axis
          .tickSize(axis.info.orient === 'inner'? extent : - extent);
      case 'y2':
        return axis.info.axis
          .tickSize(axis.info.orient === 'inner'? - extent : extent);
    }
  }

  function setAxisTickSize(axis) {
    if (!axis.data) return;
    axis.info.axis.tickSizeOuter(0).tickSizeInner(axis.info.tickSize);
  }

  function setAxisRange(axis, extent) {
    if (!axis.data) return;
    if (['y', 'y2'].indexOf(axis.type) > -1) {
      axis.info.axis.scale().range([extent, 0]);
    } else {
      axis.info.axis.scale().range([0, extent]);
    }
  }

  // insert and remove dummy ticks and labels to pad axes accordingly
  function setAxisInfo(axis, d, i, cont, extent) {
    if (!axis.data) return;
    const info = axis.info = {};

    info.axis = $$.axis(d, i);
    info.orient = $$.orient(d, i);
    info.wrapLength = $$.wrapLength(d, i);
    info.label = oreq($$.label(d, i), '');
    info.labelOrient = $$.labelOrient(d, i);
    info.tickSize = $$.tickSize(d, i);
    info.showGrid = $$.showGrid(d, i);
    info.labelOrient1 = info.labelOrient.split(' ')[0];
    info.labelOrient2 = info.labelOrient.split(' ')[1];

    info.wrapAnchor = wrapAnchor(axis);

    setAxisTickSize(axis);
    setAxisRange(axis, extent);

    const dummyAxis = cont.append('g')
        .attr('class', `d2b-axis d2b-${axis.type}-axis`)
        .call(info.axis)
        .call(wrapTicks, axis);
    info.axisBox = dummyAxis.node().getBBox();

    const dummyLabel = dummyAxis.append('text')
        .attr('class', `d2b-axis-label d2b-${axis.type}-label`)
        .text(info.label);
    info.labelBox = dummyLabel.node().getBBox();

    dummyAxis.remove();
  }

  function labelAnchor(axis) {
    if (!axis.data) return;
    const info = axis.info,
          vert = ['y', 'y2'].indexOf(axis.type) > -1;
    return (info.labelOrient2 === 'start' && vert)? 'end' :
           (info.labelOrient2 === 'end' && !vert)? 'end' :
           (info.labelOrient2 === 'middle')? 'middle' :
           'start';
  }

  function wrapAnchor (axis) {
    if (!axis.data) return;
    switch(axis.type) {
      case 'x':
        return axis.info.orient==='inner'? 'end' : 'start';
      case 'x2':
        return axis.info.orient==='outer'? 'end' : 'start';
      case 'y':
      case 'y2':
        return 'middle';
      default:
        return 'start';
    }
  }

  function labelY (axis) {
    if (!axis.data) return;
    const info = axis.info;

    switch(`${axis.type} ${info.orient} ${info.labelOrient1}`) {
      case 'x inner inner':
      case 'x2 outer outer':
        return -info.axisBox.height - labelPad;
      case 'x inner outer':
      case 'x2 outer inner':
        return info.labelBox.height + labelPad;
      case 'x outer inner':
      case 'x2 inner outer':
      case 'y inner outer':
      case 'y2 outer inner':
        return - labelPad;
      case 'x outer outer':
      case 'x2 inner inner':
        return info.labelBox.height + info.axisBox.height + labelPad;
      case 'y inner inner':
      case 'y2 outer outer':
        return info.labelBox.height + info.axisBox.width + labelPad;
      case 'y outer inner':
      case 'y2 inner outer':
        return info.labelBox.height + labelPad;
      case 'y outer outer':
      case 'y2 inner inner':
        return - info.axisBox.width - labelPad;
    }
  }

  function labelX(axis, extent) {
    if (!axis.data) return;
    return (axis.info.labelOrient2 === 'start')? 0 :
           (axis.info.labelOrient2 === 'middle')? extent / 2 :
           extent;
  }

  function dynamicPadding(axes) {
    const padding = {top: 0, left: 0, right: 0, bottom: 0};

    if (axes.x.data) {
      if (axes.x.info.orient === 'outer')
        padding.bottom += axes.x.info.axisBox.height;
      if (axes.x.info.labelOrient1 === 'outer')
        padding.bottom += axes.x.info.labelBox.height + labelPad;
    }

    if (axes.x2.data) {
      if (axes.x2.info.orient === 'outer')
        padding.top += axes.x2.info.axisBox.height;
      if (axes.x2.info.labelOrient1 === 'outer')
        padding.top += axes.x2.info.labelBox.height;
    }

    if (axes.y.data) {
      if (axes.y.info.orient === 'outer')
        padding.left += axes.y.info.axisBox.width;
      if (axes.y.info.labelOrient1 === 'outer')
        padding.left += axes.y.info.labelBox.height;
    }

    if (axes.y2.data) {
      if (axes.y2.info.orient === 'outer')
        padding.right += axes.y2.info.axisBox.width;
      if (axes.y2.info.labelOrient1 === 'outer')
        padding.right += axes.y2.info.labelBox.height + labelPad;
    }

    padding.top = Math.max(padding.top, 10);
    padding.bottom = Math.max(padding.bottom, 10);
    padding.left = Math.max(padding.left, 10);
    padding.right = Math.max(padding.right, 10);

    return padding;
  }

  function wrapTicks(el, axis) {
    if (!axis.data) return;
    const length = axis.info.wrapLength,
          anchor = axis.info.wrapAnchor;
    el.selectAll('.tick text')
      .each(function () {
        const tick = select(this);
        if ((oreq(tick.html(), '')).indexOf('tspan') === -1) this.storeText = tick.text();
        tick.text('');
      })
      .call(textWrap, function () { return this.storeText; }, length, anchor);
  }

  // create padding from number or object
  function makePadding(p) {
    return (typeof p === 'number')? {top: p, left: p, right: p, bottom: p} : p;
  }

  // create margin same as padding but default as 0
  function makeMargin(m) {
    return makePadding(m || 0);
  }
}
