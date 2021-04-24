import { defineComponent } from 'vue'
import { InstancedMesh } from 'three'
import Mesh from './Mesh'
import { bindProp } from '../tools'

export default defineComponent({
  extends: Mesh,
  props: {
    count: { type: Number, required: true },
  },
  methods: {
    initMesh() {
      if (!this.renderer) return

      if (!this.geometry || !this.material) {
        console.error('Missing geometry and/or material')
        return false
      }

      this.mesh = new InstancedMesh(this.geometry, this.material, this.count)
      this.mesh.userData.component = this

      bindProp(this, 'castShadow', this.mesh)
      bindProp(this, 'receiveShadow', this.mesh)

      if (this.onPointerEnter ||
        this.onPointerOver ||
        this.onPointerMove ||
        this.onPointerLeave ||
        this.onPointerDown ||
        this.onPointerUp ||
        this.onClick) {
        this.renderer.three.addIntersectObject(this.mesh)
      }

      this.initObject3D(this.mesh)
    },
  },
  __hmrId: 'InstancedMesh',
})
