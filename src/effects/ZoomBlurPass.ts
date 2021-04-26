import { defineComponent, PropType } from 'vue'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import EffectPass from './EffectPass'
import ZoomBlur from '../shaders/ZoomBlur'
import { Vector2PropInterface } from '../core/Object3D'
import { bindProp } from '../tools'

export default defineComponent({
  extends: EffectPass,
  props: {
    center: { type: Object as PropType<Vector2PropInterface>, default: () => ({ x: 0.5, y: 0.5 }) },
    strength: { type: Number, default: 0.5 },
  },
  created() {
    const pass = new ShaderPass(ZoomBlur)

    bindProp(this, 'center', pass.uniforms.center, 'value')
    bindProp(this, 'strength', pass.uniforms.strength, 'value')

    this.initEffectPass(pass)
  },
  __hmrId: 'ZoomBlurPass',
})
