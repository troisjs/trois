import { defineComponent } from 'vue'
import { Group } from 'three'
import Object3D from './Object3D'

export default defineComponent({
  name: 'Group',
  extends: Object3D,
  setup() {
    return {
      group: new Group(),
    }
  },
  created() {
    this.initObject3D(this.group)
  },
  __hmrId: 'Group',
})
