import { defineComponent } from 'vue'
import { PointLight } from 'three'
import Light from './Light'

export default defineComponent({
  extends: Light,
  props: {
    distance: { type: Number, default: 0 },
    decay: { type: Number, default: 1 },
  },
  created() {
    this.initLight(new PointLight(this.color, this.intensity, this.distance, this.decay))
  },
  __hmrId: 'PointLight',
})
