import { defineComponent, PropType, watch } from 'vue'
import { MeshStandardMaterial } from 'three'
import { bindProp, bindProps, propsValues } from '../tools'
import Material, { wireframeProps } from './Material'
import { Vector2PropInterface } from '../core/Object3D'

const props = {
  aoMapIntensity: { type: Number, default: 1 },
  bumpScale: { type: Number, default: 1 },
  displacementBias: { type: Number, default: 0 },
  displacementScale: { type: Number, default: 1 },
  emissive: { type: [String, Number] as PropType<string | number>, default: 0 },
  emissiveIntensity: { type: Number, default: 1 },
  envMapIntensity: { type: Number, default: 1 },
  lightMapIntensity: { type: Number, default: 1 },
  metalness: { type: Number, default: 0 },
  normalScale: { type: Object as PropType<Vector2PropInterface>, default: () => ({ x: 1, y: 1 }) },
  roughness: { type: Number, default: 1 },
  refractionRatio: { type: Number, default: 0.98 },
  flatShading: Boolean,
} as const

export default defineComponent({
  extends: Material,
  props: {
    ...props,
    ...wireframeProps,
  },
  methods: {
    createMaterial() {
      const material = new MeshStandardMaterial(propsValues(this.$props, ['normalScale']))

      // TODO : use setProp, handle flatShading ?
      Object.keys(props).forEach(p => {
        if (p === 'normalScale') return
        // @ts-ignore
        watch(() => this[p], (value) => {
          if (p === 'emissive') {
            material[p].set(value)
          } else {
            // @ts-ignore
            material[p] = value
          }
        })
      })

      bindProp(this, 'normalScale', material)
      bindProps(this, Object.keys(wireframeProps), material)

      return material
    },
  },
  __hmrId: 'StandardMaterial',
})
