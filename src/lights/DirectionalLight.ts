import { defineComponent, PropType } from 'vue'
import { DirectionalLight } from 'three'
import { Vector2PropInterface } from '../core/Object3D'
import Light from './Light'

export default defineComponent({
  extends: Light,
  props: {
    target: { type: Object as PropType<Vector2PropInterface>, default: () => ({ x: 0, y: 0, z: 0 }) },
  },
  created() {
    this.initLight(new DirectionalLight(this.color, this.intensity))
  },
  __hmrId: 'DirectionalLight',
})
