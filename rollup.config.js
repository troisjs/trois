// import commonjs from '@rollup/plugin-commonjs';
import vue from 'rollup-plugin-vue';
import buble from '@rollup/plugin-buble';
import { terser } from "rollup-plugin-terser";
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';

const input = 'src/export.js';
const external = [
  'three',
  'three/examples/jsm/controls/OrbitControls.js',
  'three/examples/jsm/deprecated/Geometry.js',
  'three/examples/jsm/loaders/GLTFLoader.js',
  'three/examples/jsm/postprocessing/BokehPass.js',
  'three/examples/jsm/postprocessing/EffectComposer.js',
  'three/examples/jsm/postprocessing/FilmPass.js',
  'three/examples/jsm/postprocessing/HalftonePass.js',
  'three/examples/jsm/postprocessing/RenderPass.js',
  'three/examples/jsm/postprocessing/Pass.js',
  'three/examples/jsm/postprocessing/SAOPass.js',
  'three/examples/jsm/postprocessing/SMAAPass.js',
  'three/examples/jsm/postprocessing/ShaderPass.js',
  'three/examples/jsm/postprocessing/UnrealBloomPass.js',
  'three/examples/jsm/shaders/FXAAShader.js',
  'gsap',
  'vue',
];

const cdn_replaces = {
  'from \'vue\'': 'from \'https://unpkg.com/vue@3.0.5/dist/vue.esm-browser.prod.js\'',
  'from \'three\'': 'from \'https://unpkg.com/three@0.125.2/build/three.module.js\'',
  'from \'three/examples': 'from \'https://unpkg.com/three@0.125.2/examples',
  'from \'gsap\'': 'from \'https://unpkg.com/gsap@3.5.1/index.js\'',
  delimiters: ['', ''],
};

const plugins = [
  vue(),
  buble({
    transforms: { asyncAwait: false, forOf: false },
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
  {
    input,
    external,
    output: {
      format: 'es',
      exports: 'named',
      file: 'build/trois.module.cdn.js',
      sourcemap: true,
    },
    plugins: [
      replace(cdn_replaces),
      ...plugins,
    ],
  },
  {
    input,
    external,
    output: {
      format: 'es',
      exports: 'named',
      file: 'build/trois.module.cdn.min.js',
      sourcemap: true,
    },
    plugins: [
      replace(cdn_replaces),
      ...plugins,
      terser(),
    ],
  },
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
  // {
  //   input,
  //   external: [
  //     'gsap',
  //     'vue',
  //   ],
  //   output: {
  //     format: 'cjs',
  //     file: 'build/trois.js',
  //     sourcemap: true,
  //   },
  //   plugins: [
  //     ...plugins,
  //     resolve({
  //       moduleDirectories: ['node_modules'],
  //     }),
  //   ],
  // },
  // {
  //   input,
  //   external: [
  //     'gsap',
  //     'vue',
  //   ],
  //   output: {
  //     format: 'cjs',
  //     file: 'build/trois.min.js',
  //     sourcemap: true,
  //   },
  //   plugins: [
  //     ...plugins,
  //     resolve({
  //       moduleDirectories: ['node_modules'],
  //     }),
  //     terser(),
  //   ],
  // },
];
