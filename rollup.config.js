import commonjs from '@rollup/plugin-commonjs';
import vue from 'rollup-plugin-vue';
import buble from '@rollup/plugin-buble';
import { terser } from "rollup-plugin-terser";

const input = 'src/index.js';
const external = [
  'three',
  'three/examples/jsm/controls/OrbitControls.js',
  'three/examples/jsm/postprocessing/EffectComposer.js',
  'three/examples/jsm/postprocessing/BokehPass.js',
  'three/examples/jsm/postprocessing/RenderPass.js',
  'three/examples/jsm/postprocessing/UnrealBloomPass.js',
  'vue',
];
const plugins = [
  commonjs(),
  vue(),
  buble({
    transforms: { forOf: false },
  }),
];

export default [
  {
    input,
    external,
    output: {
      format: 'es',
      exports: 'named',
      file: 'build/trois.module.js',
      sourcemap: true,
    },
    plugins,
  },
  {
    input,
    external,
    output: {
      format: 'es',
      exports: 'named',
      file: 'build/trois.module.min.js',
      sourcemap: true,
    },
    plugins: [
      ...plugins,
      terser(),
    ],
  },
  {
    input,
    external,
    output: {
      format: 'cjs',
      file: 'dist/trois.js',
      sourcemap: true,
    },
    plugins,
  },
  {
    input,
    external,
    output: {
      format: 'cjs',
      file: 'dist/trois.min.js',
      sourcemap: true,
    },
    plugins: [
      ...plugins,
      terser(),
    ],
  },
];
