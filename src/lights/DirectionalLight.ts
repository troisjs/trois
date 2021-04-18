import { defineComponent } from 'vue'
import { DirectionalLight } from 'three'
import Light from './Light'

export default defineComponent({
  extends: Light,
  props: {
    target: { type: Object, default: () => ({ x: 0, y: 0, z: 0 }) },
  },
  created() {
    this.initLight(new DirectionalLight(this.color, this.intensity))
  },
  __hmrId: 'DirectionalLight',
})
