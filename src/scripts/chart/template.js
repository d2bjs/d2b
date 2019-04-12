// import base from '../model/base';
// import chartFrame from '../util/chartFrame';

// // if a legend is required
// import legend from '../util/legend';

// // if breadcrumbs are required
// import breadcrumbs from '../util/breadcrumbs';

// export default function () {

//   function chart (context) {
//     context.call($$.chartFrame);

//     const selection = (context.selection)? context.selection() : context;

//     selection.each(function (datum) {
//       update.call(this, datum, context !== selection ? context : null);
//     });

//     selection.dispatch('chart-template-updated', {bubbles: true});

//     return chart;
//   }

//   function update (datum, transition) {
//     const container = d3.select(this),
//           chartContainer = container.select('.d2b-chart-container'),
//           legendContainer = container.select('.d2b-legend-container'),
//           breadcrumbsContainer = container.select('.d2b-breadcrumbs-container'),
//           size = chartContainer.node().__size__;

//     // update the chart here

//     let legendUpdate = legendContainer,
//         breadcrumbsUpdate = breadcrumbsContainer;

//     // propagate a transition like this
//     if (transition) legendUpdate = legendUpdate.transition(transition);

//     legendUpdate.call($$.legend);
//   }

//   // configure the model
//   const model = base(chart, $$)
//     .addProp('legend', legend())
//     .addPropFunctor('interpolate', 'linear')
//     .addPropFunctor('items', d => d);

//   return chart;
// };
