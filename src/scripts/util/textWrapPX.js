import * as d3 from 'd3';

// Wrap text based on pixel length.
// This isn't used very frequently because it causes problems with event
// rebinding namely double click events.
export default function (text, width = Infinity) {
  text.each( function() {
    let text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = parseFloat(text.attr('y')) || 0,
        dy = parseFloat(text.attr('dy')) || 0,
        tspan = text.text(null)
          .append('tspan')
            .attr('x', 0)
            .attr('y', y)
            .attr('dy', dy + 'em');

    word = words.pop();
    while (word) {
      line.push(word);
      tspan.text(line.join(' '));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(' '));
        line = [word];
        tspan = text
          .append('tspan')
            .attr('x', 0)
            .attr('y', y)
            .attr('dy', ++lineNumber * lineHeight + dy + 'em')
            .text(word);
      }
      word = words.pop();
    }
  });
}
