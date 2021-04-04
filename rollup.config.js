// import commonjs from '@rollup/plugin-commonjs';
import vue from 'rollup-plugin-vue';
// import buble from '@rollup/plugin-buble';
import { terser } from "rollup-plugin-terser";
import replace from '@rollup/plugin-replace';

const input = 'src/export.js';
const external = [
  'three',
  'three/examples/jsm/controls/OrbitControls.js',
  'three/examples/jsm/deprecated/Geometry.js',
  'three/examples/jsm/lights/RectAreaLightUniformsLib.js',
  'three/examples/jsm/helpers/RectAreaLightHelper.js',
  'three/examples/jsm/loaders/GLTFLoader.js',
  'three/examples/jsm/loaders/FBXLoader.js',
  'three/examples/jsm/postprocessing/BokehPass.js',
  'three/examples/jsm/postprocessing/EffectComposer.js',
  'three/examples/jsm/postprocessing/FilmPass.js',
  'three/examples/jsm/postprocessing/HalftonePass.js',
  'three/examples/jsm/postprocessing/RenderPass.js',
  'three/examples/jsm/postprocessing/Pass.js',
  'three/examples/jsm/postprocessing/SAOPass.js',
  'three/examples/jsm/postprocessing/SSAOPass.js',
  'three/examples/jsm/postprocessing/SMAAPass.js',
  'three/examples/jsm/postprocessing/ShaderPass.js',
  'three/examples/jsm/postprocessing/UnrealBloomPass.js',
  'three/examples/jsm/shaders/FXAAShader.js',
  'three/examples/jsm/webxr/VRButton.js',
  'vue',
];

const cdnReplaces = {
  'from \'vue\'': 'from \'https://unpkg.com/vue@3.0.11/dist/vue.esm-browser.prod.js\'',
  'from \'three\'': 'from \'https://unpkg.com/three@0.127.0/build/three.module.js\'',
  'from \'three/examples': 'from \'https://unpkg.com/three@0.127.0/examples',
  delimiters: ['', ''],
};

const plugins = [
  vue(),
  // buble({
  //   transforms: { asyncAwait: false, forOf: false },
  //   objectAssign: 'Object.assign',
  // }),
];

export default [
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
      replace(cdnReplaces),
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
      replace(cdnReplaces),
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
  {
    input,
    external,
    output: {
      format: 'cjs',
      file: 'build/trois.js',
      sourcemap: false,
    },
    plugins,
  },
];
