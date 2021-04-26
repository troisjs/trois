import { defineComponent } from 'vue'
import { MeshLambertMaterial } from 'three'
import { bindProps, propsValues } from '../tools'
import Material, { wireframeProps } from './Material'

export default defineComponent({
  extends: Material,
  props: {
    ...wireframeProps,
  },
  methods: {
    createMaterial() {
      const material = new MeshLambertMaterial(propsValues(this.$props))
      bindProps(this, Object.keys(wireframeProps), material)
      return material
    },
  },
  __hmrId: 'LambertMaterial',
})
