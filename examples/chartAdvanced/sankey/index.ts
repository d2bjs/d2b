import { ChartSankeyData } from '../../..';

import { select } from 'd3-selection';
import { chartSankey } from '../../../dist/d2b.cjs.js';

const sankey = chartSankey();

// The sankey chart data creation type checked with the ChartSankeyData interface.
const datum: ChartSankeyData = {
  nodes: [
    {name: 'Node A'},
    {name: 'Node B'},
    {name: 'Node C'},
    {name: 'Node D'},
    {name: 'Node E'},
  ],
  links: [
    {source: 'Node A', target: 'Node E', value: 2},
    {source: 'Node A', target: 'Node C', value: 2},
    {source: 'Node B', target: 'Node C', value: 2},
    {source: 'Node B', target: 'Node D', value: 2},
    {source: 'Node C', target: 'Node D', value: 2},
    {source: 'Node C', target: 'Node E', value: 2},
    {source: 'Node D', target: 'Node E', value: 4},
  ],
};

const chart = select('.chart-sankey').datum(datum);

chart.call(sankey.advanced);