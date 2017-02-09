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

export default {
  entry: 'src/scripts/index.js',
  dest: 'build/d2b.min.js',
  format: 'iife',
  sourceMap: 'inline',
  moduleName: 'd2b',
  globals: {
    'd3': 'd3',
  },
  plugins: [
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
    (process.env.NODE_ENV === 'production' && uglify()),
  ],
};
