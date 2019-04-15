import { select } from 'd3-selection';

import functor from '../util/functor';
import oreq from '../util/oreq';

// Wraps text based on character count and text accessor. This method uses
// d3's enter/update/exit strategy as to be less destructive on the text content.
export default function (text, getText = d => d.label, getCount = Infinity, getAnchor = 'start') {
  getText = functor(getText);
  getCount = functor(getCount);
  getAnchor = functor(getAnchor);

  text.each( function(d, i) {
    let text = select(this),
        words = `${getText.call(this, d, i)}`.split(/\s+/).reverse(),
        word,
        lines = [],
        line = [words.pop()],
        lineHeight = 1.1,
        count = getCount.call(this, d, i),
        anchor = getAnchor.call(this, d, i),
        x = +text.attr('x'),
        y = +text.attr('y'),
        dy = parseFloat(text.attr('dy')) || 0;

    // clear text if the wrapper is being run for the first time
    if ((oreq(text.html(), '')).indexOf('tspan') === -1) text.text('');

    word = words.pop();
    while (word) {
      if (line.join(' ').length + word.length > count) {
        lines.push(line);
        line = [];
      }

      line.push(word);
      word = words.pop();
    }
    lines.push(line);

    const tspan = text.selectAll('tspan').data(lines),
          height = (lines.length - 1) * lineHeight,
          offset = anchor === 'end'? height :
                   anchor === 'middle'? height / 2 :
                   0;

    tspan.merge(tspan.enter().append('tspan'))
        .text(d => d.join(' '))
        .attr('x', x)
        .attr('y', y)
        .attr('dy', (d, i) => `${dy + i * lineHeight - offset}em`);
  });
}
