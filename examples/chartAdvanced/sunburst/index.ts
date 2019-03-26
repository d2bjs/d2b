import { ChartSunburstData } from '../../..';

import { select } from 'd3';
import { chartSunburst } from '../../../dist/d2b.cjs.js';

const sunburst = chartSunburst();

// The sunburst chart data creation type checked with the ChartSunburstData interface.
const datum: ChartSunburstData = {
  root: {
    label: 'root',
    children: [
      {
        label: 'child 1',
        children: [
          {
            label: 'child 1-1',
            size: 10
          },
          {
            label: 'child 1-2',
            children: [
              {
                label: 'child 1-2-1',
                size: 5
              },
              {
                label: 'child 1-3-1',
                size: 8
              }
            ]
          },
          {
            label: 'child 1-3',
            // selected: true,
            children: [
              {
                label: 'child 1-3-1',
                children: [
                  {
                    label: 'child 1-3-1-1',
                    size: 2
                  },
                  {
                    label: 'child 1-3-1-2',
                    size: 16
                  }
                ]
              },
              {
                label: 'child 1-3-2',
                size: 8
              }
            ]
          }
        ]
      },
      {
        label: 'child 2',
        size: 25
      }
    ]
  }
};

const chart = select('.chart-sunburst').datum(datum);

chart.call(sunburst.advanced);