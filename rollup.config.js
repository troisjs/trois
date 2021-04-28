// import vue from 'rollup-plugin-vue'
import esbuild from 'rollup-plugin-esbuild'
import replace from '@rollup/plugin-replace'
import dts from "rollup-plugin-dts"

const input = 'src/export.ts'

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
]

const cdnReplaces = {
  'from \'vue\'': 'from \'https://unpkg.com/vue@3.0.11/dist/vue.esm-browser.prod.js\'',
  'from \'three\'': 'from \'https://unpkg.com/three@0.127.0/build/three.module.js\'',
  'from \'three/examples': 'from \'https://unpkg.com/three@0.127.0/examples',
  delimiters: ['', ''],
}

function createConfig(format, output, plugins = [], minify = false) {
  const tsPlugin = esbuild({
    sourceMap: true,
    minify,
    target: 'es2019',
  })

  return {
    input,
    external,
    output: {
      format,
      ...output,
      // exports: 'named',
      sourcemap: true,
    },
    plugins: [
      // vue(),
      tsPlugin,
      ...plugins,
    ],
  }
}

export default [
  createConfig('es', { file: 'build/trois.module.cdn.js' }, [replace(cdnReplaces)]),
  createConfig('es', { file: 'build/trois.module.cdn.min.js' }, [replace(cdnReplaces)], true),
  createConfig('es', { file: 'build/trois.module.js' }),
  createConfig('es', { file: 'build/trois.module.min.js' }, [], true),
  createConfig('cjs', { file: 'build/trois.js' }),
  {
    input: 'types/export.d.ts',
    external,
    plugins: [dts()],
    output: {
      format: 'es',
      file: 'build/trois.d.ts',
    },
  },
]
