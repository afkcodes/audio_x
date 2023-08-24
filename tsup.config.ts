import type { Options } from 'tsup';

const config: Options = {
  entry: ['src/index.ts'],
  dts: true,
  sourcemap: true,
  minify: true,
  clean: true,
  treeshake: true,
  target: 'es5',
  esbuildOptions(options, context) {
    options.drop = ['console', 'debugger'];
  },
  terserOptions: {
    mangle: {
      eval: true,
      keep_classnames: false,
      keep_fnames: false
    },
    safari10: true,
    ecma: 2015
  },
  format: ['cjs', 'esm']
};

export default config;
