import {pi} from '../math.js';

export default {
  draw: (context, size) => {
    const r = Math.sqrt(size / (pi + 5 / 4));
    const theta = 2 * Math.asin(1 / 4);
    const circley = r / 4 - r * Math.cos(theta / 2);

    context.arc(0, circley, r, - pi * 3 / 2 + theta / 2, pi / 2 - theta / 2);
    context.lineTo(r / 4, 3 * r / 4);
    context.lineTo(r * 3 / 4, 3 * r / 4);
    context.lineTo(r * 3 / 4, 5 * r / 4);
    context.lineTo(r / 4, 5 * r / 4);
    context.lineTo(r / 4, 7 * r / 4);
    context.lineTo(-r / 4, 7 * r / 4);
    context.lineTo(-r / 4, 5 * r / 4);
    context.lineTo(-r * 3 / 4, 5 * r / 4);
    context.lineTo(-r * 3 / 4, 3 * r / 4);
    context.lineTo(-r / 4, 3 * r / 4);
    context.closePath();
  }
};
