import svgLine from '../../src/scripts/svg/line.js';
import * as d3 from "d3";

describe("SVG Line.", function() {

  describe('Module properties', function () {

    let line;

    beforeEach(function() {

      line = svgLine();

    });

    it('has a type getter.', () => {

      // get type and verify
      expect(line.type()).toBe('line');

    });

    it('has a d3-line getter / setter.', () => {

      const d3Line = d3.line();

      // set d3-line
      line.line(d3Line);

      // get d3-line and verify
      expect(line.line()).toBe(d3Line);

    });

    it('has a d3-line getter / setter.', () => {

      const d3Line = d3.line();

      // set d3-line
      line.line(d3Line);

      // get d3-line and verify
      expect(line.line()).toBe(d3Line);

    });

    it('has a x-scale getter / setter.', () => {

      const scale = d3.scaleLinear();

      // set x scale
      line.x(scale);

      // get x scale and verify
      expect(line.x()).toBe(scale);

    });

    it('has a y-scale getter / setter.', () => {

      const scale = d3.scaleLinear();

      // set y scale
      line.y(scale);

      // get y scale and verify
      expect(line.y()).toBe(scale);

    });

  });

});
