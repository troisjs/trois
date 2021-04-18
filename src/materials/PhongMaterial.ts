import { defineComponent, watch } from 'vue'
import { MeshPhongMaterial } from 'three'
import { bindProps, propsValues } from '../tools'
import Material, { wireframeProps } from './Material'

export default defineComponent({
  extends: Material,
  props: {
    emissive: { type: [Number, String], default: 0 },
    emissiveIntensity: { type: Number, default: 1 },
    reflectivity: { type: Number, default: 1 },
    shininess: { type: Number, default: 30 },
    specular: { type: [String, Number], default: 0x111111 },
    flatShading: Boolean,
    ...wireframeProps,
  },
  methods: {
    createMaterial() {
      const material = new MeshPhongMaterial(propsValues(this.$props))

      // TODO : handle flatShading ?
      const watchProps = ['emissive', 'emissiveIntensity', 'reflectivity', 'shininess', 'specular']
      watchProps.forEach(p => {
        watch(() => this[p], (value) => {
          if (p === 'emissive' || p === 'specular') {
            material[p].set(value)
          } else {
            material[p] = value
          }
        })
      })
      bindProps(this, Object.keys(wireframeProps), material)

      return material
    },
  },
  __hmrId: 'PhongMaterial',
})
