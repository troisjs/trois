import { defineComponent, watch } from 'vue'
import { SpotLight } from 'three'
import Light from './Light'

export default defineComponent({
  extends: Light,
  props: {
    angle: { type: Number, default: Math.PI / 3 },
    decay: { type: Number, default: 1 },
    distance: { type: Number, default: 0 },
    penumbra: { type: Number, default: 0 },
    target: Object,
  },
  created() {
    const light = new SpotLight(this.color, this.intensity, this.distance, this.angle, this.penumbra, this.decay)

    const watchProps = ['angle', 'decay', 'distance', 'penumbra']
    watchProps.forEach(p => {
      // @ts-ignore
      watch(() => this[p], (value) => { light[p] = value })
    })

    this.initLight(light)
  },
  __hmrId: 'SpotLight',
})
