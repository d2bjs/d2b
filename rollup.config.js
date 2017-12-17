// Rollup plugins
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import uglify from 'rollup-plugin-uglify';
import postcss from 'rollup-plugin-postcss';

// Postcss plugins
import csstriangle from 'postcss-triangle';
import precss from 'precss';
import cssnext from 'postcss-cssnext';
import cssnano from 'cssnano';

let targets;

let plugins = [
  postcss({
    extensions: ['.css', '.scss'],
    plugins: [
      precss(),
      cssnext({warnForDuplicates: false}),
      cssnano(),
      csstriangle(),
    ],
  }),
  eslint({
    exclude: [
      'src/styles/**',
    ],
  }),
  babel({
    exclude: 'node_modules/**',
  }),
];

if (process.env.NODE_ENV === 'production') {
  targets = [
    {
      dest: 'build/d2b.min.js',
      format: 'iife',
      globals: {d3: 'd3', 'd3-sankey': 'd3', 'd3-interpolate-path': 'd3', 'd3-svg-annotation': 'd3'},
      moduleName: 'd2b'
    }
  ];

  plugins.push(process.env.NODE_ENV === 'production' && uglify());
} else {
  targets = [
    {
      dest: 'build/d2b.cjs.js',
      format: 'cjs',
    },
    {
      dest: 'build/d2b.js',
      format: 'iife',
      globals: {d3: 'd3', 'd3-sankey': 'd3', 'd3-interpolate-path': 'd3', 'd3-svg-annotation': 'd3'},
      moduleName: 'd2b'
    },
  ];
}

export default {
  entry: 'src/scripts/index.js',
  targets: targets,
  sourceMap: 'inline',
  plugins: plugins,
};
