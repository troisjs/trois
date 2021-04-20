import { defineComponent, watch } from 'vue'
import { ShaderMaterial, Vector2 } from 'three'
import { Pass } from 'three/examples/jsm/postprocessing/Pass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import EffectPass from './EffectPass'
import TiltShift from '../shaders/TiltShift'
import { bindProp } from '../tools'

const props = {
  blurRadius: { type: Number, default: 10 },
  gradientRadius: { type: Number, default: 100 },
  start: { type: Object, default: () => ({ x: 0, y: 100 }) },
  end: { type: Object, default: () => ({ x: 10, y: 100 }) },
}

interface TiltShiftPassSetupInterface {
  uniforms: {[name: string]: { value: any }}
  pass1?: Pass
  pass2?: Pass
}

export default defineComponent({
  extends: EffectPass,
  props,
  setup(): TiltShiftPassSetupInterface {
    const uniforms = {}
    return { uniforms }
  },
  created() {
    const shaderMat = new ShaderMaterial(TiltShift)
    this.uniforms = shaderMat.uniforms

    this.pass1 = new ShaderPass(shaderMat)
    this.pass2 = new ShaderPass(shaderMat)

    bindProp(this, 'blurRadius', this.uniforms.blurRadius, 'value')
    bindProp(this, 'gradientRadius', this.uniforms.gradientRadius, 'value')
    this.updateFocusLine();

    ['start', 'end'].forEach(p => {
      // @ts-ignore
      watch(() => this[p], this.updateFocusLine, { deep: true })
    })

    this.pass1.setSize = (width: number, height: number) => {
      this.uniforms.texSize.value.set(width, height)
    }

    this.initEffectPass(this.pass1)
    this.composer.addPass(this.pass2)
  },
  unmounted() {
    if (this.pass2) this.composer.removePass(this.pass2)
  },
  methods: {
    updateFocusLine() {
      this.uniforms.start.value.copy(this.start)
      this.uniforms.end.value.copy(this.end)
      const dv = new Vector2().copy(this.end as Vector2).sub(this.start as Vector2).normalize()
      this.uniforms.delta.value.copy(dv)
    },
  },
  __hmrId: 'TiltShiftPass',
})
