import { defineComponent, watch } from 'vue'
import { HemisphereLight } from 'three'
import Light from './Light'

export default defineComponent({
  extends: Light,
  props: {
    groundColor: { type: String, default: '#444444' },
  },
  created() {
    const light = new HemisphereLight(this.color, this.groundColor, this.intensity)
    watch(() => this.groundColor, (value) => { light.groundColor.set(value) })
    this.initLight(light)
  },
  __hmrId: 'HemisphereLight',
})
