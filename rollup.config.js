// Rollup plugins
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import postcss from 'rollup-plugin-postcss';

// Postcss plugins
// import csstriangle from 'postcss-triangle';
import precss from 'precss';
import postcssUtilities from 'postcss-utilities';
import postcssPresetEnv from 'postcss-preset-env';
import cssnano from 'cssnano';

let outputs;

let plugins = [
  postcss({
    extensions: ['.css', '.scss'],
    plugins: [
      precss(),
      postcssPresetEnv({ stage: 0 }),
      cssnano(),
      postcssUtilities()
    ],
  }),
  // eslint({
  //   exclude: [
  //     'src/styles/**',
  //   ],
  // }),
  babel({
    exclude: 'node_modules/**',
  }),
];

if (process.env.NODE_ENV === 'production') {
  outputs = [
    {
      file: 'dist/d2b.min.js',
      format: 'iife',
      globals: {d3: 'd3', 'd3-sankey': 'd3', 'd3-interpolate-path': 'd3', 'd3-svg-annotation': 'd3'},
      sourceMap: 'inline',
      name: 'd2b'
    }
  ];

  plugins.push(process.env.NODE_ENV === 'production' && uglify());
} else {
  outputs = [
    {
      file: 'dist/d2b.cjs.js',
      sourceMap: 'inline',
      format: 'cjs',
    },
    {
      file: 'dist/d2b.js',
      format: 'iife',
      globals: {d3: 'd3', 'd3-sankey': 'd3', 'd3-interpolate-path': 'd3', 'd3-svg-annotation': 'd3'},
      sourceMap: 'inline',
      name: 'd2b'
    },
  ];
}

export default {
  input: 'src/scripts/index.js',
  output: outputs,
  plugins: plugins,
};
