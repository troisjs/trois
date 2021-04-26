import { defineComponent } from 'vue'
import { AmbientLight } from 'three'
import Light from './Light'

export default defineComponent({
  extends: Light,
  created() {
    this.initLight(new AmbientLight(this.color, this.intensity))
  },
  __hmrId: 'AmbientLight',
})
