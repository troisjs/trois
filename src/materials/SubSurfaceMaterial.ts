import { defineComponent } from 'vue'
import { Color, ShaderMaterial, UniformsUtils } from 'three'
import SubsurfaceScatteringShader from './SubsurfaceScatteringShader'
import Material from './Material'
// import { bindProps, propsValues } from '../tools'

export default defineComponent({
  extends: Material,
  props: {
    thicknessColor: { type: String, default: '#ffffff' },
    thicknessDistortion: { type: Number, default: 0.4 },
    thicknessAmbient: { type: Number, default: 0.01 },
    thicknessAttenuation: { type: Number, default: 0.7 },
    thicknessPower: { type: Number, default: 2 },
    thicknessScale: { type: Number, default: 4 },
  },
  methods: {
    createMaterial() {
      const params = SubsurfaceScatteringShader
      const uniforms = UniformsUtils.clone(params.uniforms)

      // Object.entries(this.$props).forEach(([key, value]) => {
      //   let _key = key, _value = value
      //   if (['color', 'thicknessColor'].includes(key)) {
      //     if (key === 'color') _key = 'diffuse'
      //     _value = new Color(value)
      //   }
      //   if (!['transparent', 'vertexColors'].includes(key)) {
      //     console.log(_key)
      //     uniforms[_key].value = _value
      //   }
      // })

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


// export default defineComponent({
//   inject: ['three', 'mesh'],
//   props: {
//     color: { type: String, default: '#ffffff' },
//     thicknessColor: { type: String, default: '#ffffff' },
//     thicknessDistortion: { type: Number, default: 0.4 },
//     thicknessAmbient: { type: Number, default: 0.01 },
//     thicknessAttenuation: { type: Number, default: 0.7 },
//     thicknessPower: { type: Number, default: 2 },
//     thicknessScale: { type: Number, default: 4 },
//     transparent: { type: Boolean, default: false },
//     opacity: { type: Number, default: 1 },
//     vertexColors: { type: Boolean, default: false },
//   },
//   created() {
//     this.createMaterial()
//     this.mesh.setMaterial(this.material)
//   },
//   unmounted() {
//     this.material.dispose()
//   },
//   methods: {
//     createMaterial() {
//       const params = SubsurfaceScatteringShader
//       const uniforms = UniformsUtils.clone(params.uniforms)

//       Object.entries(this.$props).forEach(([key, value]) => {
//         let _key = key, _value = value
//         if (['color', 'thicknessColor'].includes(key)) {
//           if (key === 'color') _key = 'diffuse'
//           _value = new Color(value)
//         }
//         if (!['transparent', 'vertexColors'].includes(key)) {
//           uniforms[_key].value = _value
//         }
//       })

//       this.material = new TShaderMaterial({
//         ...params,
//         uniforms,
//         lights: true,
//         transparent: this.transparent,
//         vertexColors: this.vertexColors,
//       })
//     },
//   },
//   render() {
//     return []
//   },
//   __hmrId: 'SubSurfaceMaterial',
// })
