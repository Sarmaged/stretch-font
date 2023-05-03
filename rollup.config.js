import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'

export default [
  {
    input: 'stretch-font.js',
    plugins: [
      resolve({
        browser: true,
      }),
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'bundled',
      }),
    ],

    output: [
      {
        file: 'stretch-font.min.js',
        format: 'iife',
        name: 'stretchFont',
        plugins: [terser()],
        sourcemap: true,
      },
    ],
  },
]
