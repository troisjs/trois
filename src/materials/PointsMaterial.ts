import { defineComponent } from 'vue'
import { PointsMaterial } from 'three'
import { propsValues } from '../tools'
import Material from './Material'

export default defineComponent({
  extends: Material,
  props: {
    size: { type: Number, default: 10 },
    sizeAttenuation: { type: Boolean, default: true },
  },
  methods: {
    createMaterial() {
      const material = new PointsMaterial(propsValues(this.$props))
      return material
    },
  },
  __hmrId: 'PointsMaterial',
})
