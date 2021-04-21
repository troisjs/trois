import { defineComponent } from 'vue'
import { BufferGeometry, InstancedMesh, Material } from 'three'
import Object3D, { object3DSetup } from '../core/Object3D'
import { bindProp } from '../tools'
import { MeshSetupInterface, pointerProps } from './Mesh'

export default defineComponent({
  extends: Object3D,
  props: {
    castShadow: Boolean,
    receiveShadow: Boolean,
    count: { type: Number, required: true },
    ...pointerProps,
  },
  setup(): MeshSetupInterface {
    return object3DSetup()
  },
  provide() {
    return {
      mesh: this,
    }
  },
  mounted() {
    if (!this.$slots.default) {
      console.error('Missing geometry and material')
      return
    }
    this.initMesh()
  },
  methods: {
    initMesh() {
      console.log(this.material)
      if (!this.geometry || !this.material) return false
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
        this.three.addIntersectObject(this.mesh)
      }

      this.initObject3D(this.mesh)
    },
    setGeometry(geometry: BufferGeometry) {
      this.geometry = geometry
      if (this.mesh) this.mesh.geometry = geometry
    },
    setMaterial(material: Material) {
      this.material = material
      if (this.mesh) this.mesh.material = material
    },
  },
  unmounted() {
    if (this.mesh) {
      this.three.removeIntersectObject(this.mesh)
    }
  },
  __hmrId: 'InstancedMesh',
})
