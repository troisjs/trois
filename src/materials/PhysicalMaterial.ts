import { defineComponent } from 'vue'
import { MeshPhysicalMaterial } from 'three'
import { propsValues } from '../tools'
import StandardMaterial from './StandardMaterial'

export default defineComponent({
  extends: StandardMaterial,
  props: {
    flatShading: Boolean,
  },
  methods: {
    createMaterial() {
      return new MeshPhysicalMaterial(propsValues(this.$props))
    },
  },
  __hmrId: 'PhysicalMaterial',
})
