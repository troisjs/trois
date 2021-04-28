import { defineComponent, InjectionKey, watch } from 'vue'
import { FrontSide, Material, Texture } from 'three'
import { MeshInjectionKey, MeshInterface } from '../meshes/Mesh'

export interface MaterialSetupInterface {
  mesh?: MeshInterface
  material?: Material
  createMaterial?(): Material
}

export interface MaterialInterface extends MaterialSetupInterface {
  setProp(key: string, value: unknown, needsUpdate: boolean): void
  setTexture(texture: Texture | null, key: string): void
}

export const MaterialInjectionKey: InjectionKey<MaterialInterface> = Symbol('Material')

export default defineComponent({
  // inject for sub components
  inject: {
    mesh: MeshInjectionKey as symbol,
  },
  props: {
    color: { type: [String, Number], default: '#ffffff' },
    alphaTest: { type: Number, default: 0 },
    depthTest: { type: Boolean, default: true },
    depthWrite: { type: Boolean, default: true },
    fog: { type: Boolean, default: true },
    opacity: { type: Number, default: 1 },
    side: { type: Number, default: FrontSide },
    transparent: Boolean,
    vertexColors: Boolean,
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
      this.mesh.setMaterial(this.material)
      this.addWatchers()
    }
  },
  unmounted() {
    this.material?.dispose()
  },
  methods: {
    setProp(key: string, value: any, needsUpdate = false) {
      if (this.material) {
        // @ts-ignore
        this.material[key] = value
        this.material.needsUpdate = needsUpdate
      }
    },
    setTexture(texture: Texture | null, key = 'map') {
      this.setProp(key, texture, true)
    },
    addWatchers() {
      ['color', 'alphaTest', 'depthTest', 'depthWrite', 'fog', 'opacity', 'side', 'transparent'].forEach(p => {
        // @ts-ignore
        watch(() => this[p], (value) => {
          if (p === 'color') {
            // @ts-ignore
            this.material.color.set(value)
          } else {
            // @ts-ignore
            this.material[p] = value
          }
        })
      })
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
