import { defineComponent } from 'vue'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'
import EffectPass from './EffectPass'
import { ThreeResizeEventInterface } from '../core/useThree'

export default defineComponent({
  extends: EffectPass,
  created() {
    const pass = new ShaderPass(FXAAShader)

    // resize will be called in three init
    this.three.onAfterResize(this.resize)

    this.initEffectPass(pass)
  },
  unmounted() {
    this.three.offAfterResize(this.resize)
  },
  methods: {
    resize({ size }: ThreeResizeEventInterface) {
      if (this.pass) {
        const { resolution } = (this.pass as ShaderPass).material.uniforms
        resolution.value.x = 1 / size.width
        resolution.value.y = 1 / size.height
      }
    },
  },
  __hmrId: 'FXAAPass',
})
