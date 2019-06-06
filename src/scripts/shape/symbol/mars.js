import { pi, sqrt8, sqrt2 } from '../math';

export default {
  draw: (context, size) => {
    const r = Math.sqrt(size / (pi + 5 / 4));
    const s = 0.3125 * r;
    const theta = 2 * Math.asin(1 / 4);
    const theta2 = (pi / 2 - theta) / 2;
    const circlex = r / sqrt8 - r * Math.cos(theta2);
    const circley = r * Math.sin(theta2);

    context.arc(circlex, circley, r, -theta2, 2 * pi - theta - theta2);
    context.lineTo(r * (5 / 4 - 1 / sqrt2), -r * (1 / sqrt8 + 5 / 4 - 1 / sqrt2));
    context.lineTo(r * (5 / 4 - 1 / sqrt2) - s, -r * (1 / sqrt8 + 5 / 4 - 1 / sqrt2));
    context.lineTo(r * (5 / 4 - 1 / sqrt2) - s, -r * (1 / sqrt8 + 7 / 4 - 1 / sqrt2));
    context.lineTo(r * (7 / 4 - 1 / sqrt2 + 1 / sqrt8), -r * (1 / sqrt8 + 7 / 4 - 1 / sqrt2));
    context.lineTo(r * (7 / 4 - 1 / sqrt2 + 1 / sqrt8), -r * (5 / 4 - 1 / sqrt2) + s);
    context.lineTo(r * (5 / 4 - 1 / sqrt2 + 1 / sqrt8), -r * (5 / 4 - 1 / sqrt2) + s);
    context.lineTo(r * (5 / 4 - 1 / sqrt2 + 1 / sqrt8), -r * (5 / 4 - 1 / sqrt2));
    context.closePath();
  }
};
