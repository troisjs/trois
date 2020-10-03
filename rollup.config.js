import commonjs from '@rollup/plugin-commonjs';
import vue from 'rollup-plugin-vue';
import buble from '@rollup/plugin-buble';
import { terser } from "rollup-plugin-terser";
// import replace from '@rollup/plugin-replace';

const input = 'src/export.js';
const external = [
  'three',
  'three/examples/jsm/controls/OrbitControls.js',
  'three/examples/jsm/loaders/GLTFLoader.js',
  'three/examples/jsm/postprocessing/BokehPass.js',
  'three/examples/jsm/postprocessing/EffectComposer.js',
  'three/examples/jsm/postprocessing/FilmPass.js',
  'three/examples/jsm/postprocessing/HalftonePass.js',
  'three/examples/jsm/postprocessing/RenderPass.js',
  'three/examples/jsm/postprocessing/SAOPass.js',
  'three/examples/jsm/postprocessing/UnrealBloomPass.js',
  'gsap',
  'vue',
];

const plugins = [
  commonjs(),
  vue(),
  buble({
    // transforms: { forOf: false },
    objectAssign: 'Object.assign',
  }),
];

export default [
  // {
  //   input,
  //   external,
  //   output: {
  //     format: 'umd',
  //     name: 'TroisJS',
  //     file: 'build/trois.umd.js',
  //     sourcemap: true,
  //     globals: {
  //       'three': 'THREE',
  //       'vue': 'Vue',
  //     },
  //   },
  //   plugins,
  // },
  // {
  //   input,
  //   external,
  //   output: {
  //     format: 'umd',
  //     name: 'TroisJS',
  //     file: 'build/trois.umd.min.js',
  //     sourcemap: true,
  //   },
  //   plugins: [
  //     ...plugins,
  //     terser(),
  //   ],
  // },
  // {
  //   input,
  //   external,
  //   output: {
  //     format: 'es',
  //     exports: 'named',
  //     file: 'build/trois.module.cdn.js',
  //     sourcemap: true,
  //   },
  //   plugins: [
  //     replace({
  //       'from \'three\'': 'from \'https://unpkg.com/three@0.120.1/build/three.module.js\'',
  //       'from \'three/examples': 'from \'https://unpkg.com/three@0.120.1/examples',
  //       'from \'gsap\'': 'from \'https://unpkg.com/gsap@3.5.1/index.js\'',
  //       delimiters: ['', ''],
  //     }),
  //     ...plugins,
  //   ],
  // },
  // {
  //   input,
  //   external,
  //   output: {
  //     format: 'es',
  //     exports: 'named',
  //     file: 'build/trois.module.cdn.min.js',
  //     sourcemap: true,
  //   },
  //   plugins: [
  //     replace({
  //       'from \'three\'': 'from \'https://unpkg.com/three@0.120.1/build/three.module.js\'',
  //       'from \'three/examples': 'from \'https://unpkg.com/three@0.120.1/examples',
  //       'from \'gsap\'': 'from \'https://unpkg.com/gsap@3.5.1/index.js\'',
  //       delimiters: ['', ''],
  //     }),
  //     ...plugins,
  //     terser(),
  //   ],
  // },
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
      file: 'build/trois.js',
      sourcemap: true,
    },
    plugins,
  },
  {
    input,
    external,
    output: {
      format: 'cjs',
      file: 'build/trois.min.js',
      sourcemap: true,
    },
    plugins: [
      ...plugins,
      terser(),
    ],
  },
];
