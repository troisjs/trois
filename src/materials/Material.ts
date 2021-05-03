import { ComponentPublicInstance, defineComponent, InjectionKey } from 'vue'
import { Material, Texture } from 'three'
import { MeshInjectionKey, MeshInterface } from '../meshes/Mesh'
import { bindObjectProp } from '../tools'

export interface MaterialSetupInterface {
  mesh?: MeshInterface
  material?: Material
  createMaterial?(): Material
}

export interface MaterialInterface extends MaterialSetupInterface {
  setTexture(texture: Texture | null, key: string): void
}

export interface MaterialPublicInterface extends ComponentPublicInstance, MaterialInterface {}

export const MaterialInjectionKey: InjectionKey<MaterialPublicInterface> = Symbol('Material')

export default defineComponent({
  // inject for sub components
  inject: {
    mesh: MeshInjectionKey as symbol,
  },
  props: {
    color: { type: String, default: '#ffffff' },
    props: { type: Object, default: () => ({}) },
  },
  setup(): MaterialSetupInterface {
    return {}
  },
  provide() {
    return {
      [MaterialInjectionKey as symbol]: this,
    }
  },
  created() {
    if (!this.mesh) {
      console.error('Missing parent Mesh')
      return
    }

    if (this.createMaterial) {
      this.material = this.createMaterial()
      bindObjectProp(this, 'props', this.material, this.setProp)
      this.mesh.setMaterial(this.material)
    }
  },
  unmounted() {
    this.material?.dispose()
  },
  methods: {
    getProps() {
      return { color: this.color, ...this.props }
    },
    setProp(dst: any, key: string, value: any, needsUpdate = false) {
      if (key === 'color') dst[key].set(value)
      else dst[key] = value
      dst.needsUpdate = needsUpdate
    },
    setTexture(texture: Texture | null, key = 'map') {
      this.setProp(this, key, texture, true)
    },
  },
  render() {
    return this.$slots.default ? this.$slots.default() : []
  },
  __hmrId: 'Material',
})

export const wireframeProps = {
  wireframe: { type: Boolean, default: false },
  // not needed for WebGL
  // wireframeLinecap: { type: String, default: 'round' },
  // wireframeLinejoin: { type: String, default: 'round' },
  wireframeLinewidth: { type: Number, default: 1 }, // not really useful
}
