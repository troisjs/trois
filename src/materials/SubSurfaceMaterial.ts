import { defineComponent, PropType } from 'vue'
import { Color, ShaderMaterial, UniformsUtils } from 'three'
import SubsurfaceScatteringShader from './SubsurfaceScatteringShader'
import Material from './Material'
// import { bindProps, propsValues } from '../tools'

const props = {
  color: { type: [String, Number] as PropType<string | number>, default: '#ffffff' },
  thicknessColor: { type: [String, Number] as PropType<string | number>, default: '#ffffff' },
  thicknessDistortion: { type: Number, default: 0.4 },
  thicknessAmbient: { type: Number, default: 0.01 },
  thicknessAttenuation: { type: Number, default: 0.7 },
  thicknessPower: { type: Number, default: 2 },
  thicknessScale: { type: Number, default: 4 },
} as const

export default defineComponent({
  extends: Material,
  props,
  methods: {
    createMaterial() {
      const params = SubsurfaceScatteringShader
      const uniforms = UniformsUtils.clone(params.uniforms)

      Object.keys(props).forEach((key) => {
        // @ts-ignore
        const value = this[key]
        let _key = key, _value = value
        if (['color', 'thicknessColor'].includes(key)) {
          if (key === 'color') _key = 'diffuse'
          _value = new Color(value)
        }
        uniforms[_key].value = _value
      })

      const material = new ShaderMaterial({
        ...params,
        uniforms,
        lights: true,
        transparent: this.transparent,
        vertexColors: this.vertexColors,
      })

      return material
    },
  },
  __hmrId: 'SubSurfaceMaterial',
})
