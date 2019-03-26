import functor from '../util/functor';
import * as d3 from 'd3';
import oreq from '../util/oreq';
import oreqUndefined from '../util/oreqUndefined';
import { svgBar, svgLine, svgBubblePack, svgBoxPlot, svgArea, svgScatter } from '../index';

/**
 * d2b.chartPieAdvanced(chart, datum) configures the input chart and formats a returned datum set
 */
export default function (chart, datum) {
  const legendConfig = datum.legend || {};
  const tooltipConfig = datum.tooltip || {};

  // Chart Config
  chart
    .duration.conditionally(datum.duration)
    .graphColor.proxy(graph => graph.color || functor(datum.graphColor)(graph))
    .groupColor.proxy(group => group.color || functor(datum.groupColor)(group));

  // Chart Frame Config
  chart.chartFrame()
    .size.conditionally(datum.size)
    .chartPadding.conditionally(datum.chartPadding)
    .padding.conditionally(datum.padding)
    .legendEnabled.conditionally(legendConfig.enabled)
    .legendOrient.conditionally(legendConfig.orient);

  // Plane Config
  chart.plane()
    .margin.conditionally(datum.planeMargin)
    .padding.conditionally(datum.planePadding);

  // Legend Config
  chart.legend()
    .clickable.conditionally(legendConfig.clickable)
    .dblclickable.conditionally(legendConfig.dblclickable)
    .allowEmptied.conditionally(legendConfig.allowEmptied)
    .icon.proxy(d => d.data.legendIcon || functor(legendConfig.icon)(d.data));

  // Tooltip Config
  chart.tooltipConfig(tooltipAxis => {
    tooltipAxis
      .trackX.conditionally(tooltipConfig.trackX)
      .trackY.conditionally(tooltipConfig.trackY)
      .threshold.conditionally(tooltipConfig.threshold)
      .title.conditionally(tooltipConfig.title, rows => {
        return tooltipConfig.title(rows.map(row => {
          return { value: row.data, graph: row.graph.data };
        }));
      });
  });

  // Tooltip Row Config
  chart.graphTooltipConfig(graph => {
    return tooltipGraph => {
      tooltipGraph
        .row.proxy(row => {
          const value = row.data;
          const tooltip = oreqUndefined(value.tooltip, graph.tooltip, tooltipConfig.row);
          return functor(tooltip)(value, graph);
        });
    };
  });

  // Generators Config
  chart.setGenerators(set => {
    const generators = [];

    set.generators.forEach(gen => {
      // If generator is a function it is probably a d2b generator and is ready to go
      if (typeof gen === 'function') {
        generators.push(gen);
      // Otherwise if multiple types are provided, setup the described generators
      } else if (gen.types) {
        gen.types.forEach(type => {
          generators.push(buildGenerator(type, gen));
        });
      // Otherwise setup the described type generator
      } else {
        generators.push(buildGenerator(gen.type, gen));
      }

      generators.forEach(newGen => {
        if (newGen.pcolor) newGen.pcolor.proxy(point => point.color);
        if (newGen.pcentered) newGen.pcentered.proxy(point => oreqUndefined(point.centered, gen.centered));
        if (newGen.box) newGen.box().width.proxy(point => oreq(point.width, gen.width));
        if (newGen.symbol) newGen.symbol.proxy(graph => oreq(graph.symbol, typeof gen === 'function' ? undefined : gen.symbol));
        if (newGen.psymbol) newGen.psymbol.proxy(point => point.symbol);
        if (newGen.psize) newGen.psize.proxy(point => point.size);
        if (newGen.stackBy) newGen.stackBy.proxy(graph => oreqUndefined(graph.stack, typeof gen === 'function' ? undefined : gen.stack));  
      });
    });

    return generators;
  });

  // Axis Config
  ['x', 'x2', 'y', 'y2'].forEach(axis => {
    const axisConfig = datum[axis] || {};
    
    chart[axis]((d, points) => {
      if (!points.length) return {};
      const scaleConfig = axisConfig.scale || {};
      const config = {};
      // Unique set of values.
      const values = points.filter((value, index, self) => self.indexOf(value) === index).sort(d3.ascending);
      config.orient = axisConfig.orient || 'outer';
      if (axisConfig.wrapLength !== undefined) config.wrapLength = axisConfig.wrapLength;
      if (axisConfig.tickSize !== undefined) config.tickSize = axisConfig.tickSize;
      if (axisConfig.showGrid !== undefined) config.showGrid = axisConfig.showGrid;
      if (axisConfig.label !== undefined) config.label = axisConfig.label;
      if (axisConfig.labelOrient !== undefined) config.labelOrient = axisConfig.labelOrient;
      if (axisConfig.linearPadding !== undefined) config.linearPadding = axisConfig.linearPadding;
      // D3 Axis Config:

      // If axis is given as a function it is probably a d3.axis and is ready to go
      if (typeof axisConfig.axis === 'function') {
        config.axis = axisConfig.axis;
      // Otherwise we can dynamically setup the axis
      } else {
        switch (`${axis}-${config.orient}`) {
          case 'x-outer':
            config.axis = d3.axisBottom();
            break;
          case 'y-outer':
            config.axis = d3.axisLeft();
            break;
          case 'x2-outer':
            config.axis = d3.axisTop();
            break;
          case 'y2-outer':
            config.axis = d3.axisRight();
            break;
          case 'x-inner':
            config.axis = d3.axisTop();
            break;
          case 'y-inner':
            config.axis = d3.axisRight();
            break;
          case 'x2-inner':
            config.axis = d3.axisBottom();
            break;
          case 'y2-inner':
            config.axis = d3.axisLeft();
            break;
        }
      }

      if (axisConfig.tickPadding !== undefined) config.axis.tickPadding(axisConfig.tickPadding);
      if (axisConfig.ticks !== undefined) config.axis.ticks(axisConfig.ticks);
      if (axisConfig.tickFormat !== undefined) config.axis.tickFormat(axisConfig.tickFormat);
      if (axisConfig.tickValues !== undefined) config.axis.tickValues(axisConfig.tickValues);

      // D3 Scale Config

      // If scale is given as a function it is probably a d3.scale and is ready to go
      let domain = [0, 1];
      if (typeof scaleConfig === 'function') {
        config.scale = scaleConfig;
      // Otherwise we can dynamically setup the scale
      } else {
        let type = scaleConfig.type;

        if (!type) {
          const firstValue = values[0];
          if (firstValue.constructor.name === 'String') type = 'band';
          else if (firstValue.constructor.name === 'Date') type = 'time';
          else type = 'linear';
        }

        type = type.toLowerCase();
        const scaleGenerator = d3[`scale${type.charAt(0).toUpperCase() + type.slice(1)}`];
        config.scale = scaleGenerator();

        switch (type) {
          case 'band':
          case 'point':
            domain = values;
            break;
          default:
            domain = d3.extent(values.map(Number));
        }
      }

      if (scaleConfig.domain) domain = functor(scaleConfig.domain)(values);
      if (scaleConfig.clamp !== undefined) config.scale.clamp(scaleConfig.clamp);
      if (scaleConfig.nice !== undefined) config.scale.nice(scaleConfig.nice);
      if (scaleConfig.exponent !== undefined) config.scale.exponent(scaleConfig.exponent);
      if (scaleConfig.base !== undefined) config.scale.base(scaleConfig.base);
      if (scaleConfig.constant !== undefined) config.scale.constant(scaleConfig.constant);
      if (scaleConfig.forceBounds) {
        if (scaleConfig.forceBounds.min !== undefined) domain[0] = scaleConfig.forceBounds.min;
        if (scaleConfig.forceBounds.max !== undefined) domain[1] = scaleConfig.forceBounds.max;
      }

      config.scale.domain(domain);

      return config;
    });
  });

  return datum;
}

function buildGenerator (type, gen) {
  let newGen = null;
  const stackOffset = gen.stackOffset;
  const stackOrder = gen.stackOrder;
  const curve = gen.curve;
  const orient = gen.orient;
  const align = gen.align;
  const configureStack = svgGen => {
    const stack = svgGen.stack();
    if (stackOffset !== undefined) stack.offset(stackOffset);
    if (stackOrder !== undefined) stack.order(stackOrder);
  };
  const configureCurve = shape => {
    if (curve !== undefined) shape.curve(curve);
  };
  const configureOrient = svgGen => {
    svgGen.orient.conditionally(orient);
  };
  const configureAlign = svgGen => {
    svgGen.align.conditionally(align);
  };
  switch (type) {
    case 'bar':
      newGen = svgBar()
        .padding.conditionally(gen.padding)
        .groupPadding.conditionally(gen.groupPadding);
      configureOrient(newGen);
      break;

    case 'line':
      newGen = svgLine();
      configureStack(newGen);
      configureAlign(newGen);
      configureCurve(newGen.line());
      break;

    case 'area':
      newGen = svgArea();
      configureStack(newGen);
      configureCurve(newGen.area());
      break;

    case 'scatter':
      newGen = svgScatter()
        .psize.conditionally(gen.size);
      configureStack(newGen);
      configureAlign(newGen);
      break;

    case 'bubblePack':
      newGen = svgBubblePack()
        .tendancy.conditionally(gen.tendancy);
      newGen.point()
        .size.conditionally(gen.size, d => gen.size * d.size);
      break;

    case 'boxPlot':
      newGen = svgBoxPlot();

      newGen.box()
        .valueFormat.conditionally(gen.valueFormat);
      configureOrient(newGen);
      break;
  }

  return newGen;
}