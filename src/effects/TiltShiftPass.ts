import { defineComponent, PropType, watch } from 'vue'
import { Vector2 } from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import EffectPass from './EffectPass'
import TiltShift from '../shaders/TiltShift'
import { Vector2PropInterface } from '../core/Object3D'
import { bindProp } from '../tools'

const props = {
  blurRadius: { type: Number, default: 10 },
  gradientRadius: { type: Number, default: 100 },
  start: { type: Object as PropType<Vector2PropInterface>, default: () => ({ x: 0, y: 100 }) },
  end: { type: Object as PropType<Vector2PropInterface>, default: () => ({ x: 10, y: 100 }) },
} as const

interface TiltShiftPassSetupInterface {
  uniforms1: {[name: string]: { value: any }}
  uniforms2: {[name: string]: { value: any }}
  pass1?: ShaderPass
  pass2?: ShaderPass
}

export default defineComponent({
  extends: EffectPass,
  props,
  setup(): TiltShiftPassSetupInterface {
    return { uniforms1: {}, uniforms2: {} }
  },
  created() {
    if (!this.composer) return

    this.pass1 = new ShaderPass(TiltShift)
    this.pass2 = new ShaderPass(TiltShift)

    const uniforms1 = this.uniforms1 = this.pass1.uniforms
    const uniforms2 = this.uniforms2 = this.pass2.uniforms

    // shared uniforms
    uniforms2.blurRadius = uniforms1.blurRadius
    uniforms2.gradientRadius = uniforms1.gradientRadius
    uniforms2.start = uniforms1.start
    uniforms2.end = uniforms1.end
    uniforms2.texSize = uniforms1.texSize

    bindProp(this, 'blurRadius', uniforms1.blurRadius, 'value')
    bindProp(this, 'gradientRadius', uniforms1.gradientRadius, 'value')

    this.updateFocusLine();

    ['start', 'end'].forEach(p => {
      // @ts-ignore
      watch(() => this[p], this.updateFocusLine, { deep: true })
    })

    this.pass1.setSize = (width: number, height: number) => {
      uniforms1.texSize.value.set(width, height)
    }

    this.initEffectPass(this.pass1)
    this.composer.addPass(this.pass2)
  },
  unmounted() {
    if (this.composer && this.pass2) this.composer.removePass(this.pass2)
  },
  methods: {
    updateFocusLine() {
      this.uniforms1.start.value.copy(this.start)
      this.uniforms1.end.value.copy(this.end)
      const dv = new Vector2().copy(this.end as Vector2).sub(this.start as Vector2).normalize()
      this.uniforms1.delta.value.copy(dv)
      this.uniforms2.delta.value.set(-dv.y, dv.x)
    },
  },
  __hmrId: 'TiltShiftPass',
})
