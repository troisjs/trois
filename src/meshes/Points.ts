import { defineComponent } from 'vue'
import { BufferGeometry, Material, Points } from 'three'
import Object3D, { Object3DSetupInterface } from '../core/Object3D'
import { MeshInjectionKey } from './Mesh'

export interface PointsSetupInterface extends Object3DSetupInterface {
  mesh?: Points
  points?: Points
  geometry?: BufferGeometry
  material?: Material
}

export interface PointsInterface extends PointsSetupInterface {
  setGeometry(geometry: BufferGeometry): void
  setMaterial(material: Material): void
}

// not really a mesh, but allow us to easily get geometry/material support
export default defineComponent({
  extends: Object3D,
  setup(): PointsSetupInterface {
    return {}
  },
  provide() {
    return {
      [MeshInjectionKey as symbol]: this,
    }
  },
  mounted() {
    this.mesh = this.points = new Points(this.geometry, this.material)
    this.initObject3D(this.mesh)
  },
  methods: {
    setGeometry(geometry: BufferGeometry) {
      this.geometry = geometry
      if (this.mesh) this.mesh.geometry = geometry
    },
    setMaterial(material: Material) {
      this.material = material
      if (this.mesh) this.mesh.material = material
    },
  },
})
