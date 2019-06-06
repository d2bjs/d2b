import { ChartPieData } from '../../..';

import { select } from 'd3';
import { chartPie } from '../../../dist/d2b.cjs.js';

const pie = chartPie();

// The pie chart data creation type checked with the ChartPieData interface.
const datum: ChartPieData = {
  values: [
    {label: 'arc 1', value: 23},
    {label: 'arc 2', value: 31},
    {label: 'arc 3', value: 80},
    {label: 'arc 4', value: 8}
  ]
};

const chart = select('.chart-pie').datum(datum);

chart.call(pie.advanced);