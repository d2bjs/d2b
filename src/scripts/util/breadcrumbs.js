import base from '../model/base';

export default function () {
  const $$ = {};

  const breadcrumbs = function (context) {
    const selection = context.selection? context.selection() : context;

    let bcs = selection.selectAll('.d2b-breadcrumbs').data(d => [d]);

    const bcsEnter = bcs.enter()
      .append('div')
        .attr('class', 'd2b-breadcrumbs');

    bcs = bcs.merge(bcsEnter).classed('d2b-vertical', $$.vertical);

    // Set breadcrumb data from values accessor. And only show breadcrumbs that have html content.
    let bc = bcs.selectAll('.d2b-breadcrumb').data(d => $$.values(d).filter($$.html), $$.key),
        bcExit = bc.exit();

    const bcEnter = bc.enter()
      .append('div')
        .attr('class', 'd2b-breadcrumb')
        .style('opacity', 0);

    bcEnter.append('div').attr('class', 'd2b-breadcrumb-icon');
    bcEnter.append('div').attr('class', 'd2b-breadcrumb-content');

    bc = bc.merge(bcEnter).order();

    bc.select('.d2b-breadcrumb-content').html($$.html);

    if (context !== selection) {
      bc = bc.transition(context);
      bcExit = bcExit.transition(context).style('opacity', 0);
    }

    bc
        .style('border-color', $$.color)
        .style('opacity', 1)
      .select('.d2b-breadcrumb-icon')
        .style('background-color', $$.color);

    bcExit.remove();

    selection.dispatch('breadcrumbs-updated', {bubbles: true});

    return breadcrumbs;
  };

  /* Inherit from base model */
  base(breadcrumbs, $$)
    .addPropFunctor('values', d => d)
    .addPropFunctor('key', (d, i) => i)
    .addPropFunctor('color', 'blue')
    .addPropFunctor('html', d => d.html)
    .addPropFunctor('vertical', true);

  return breadcrumbs;
}
