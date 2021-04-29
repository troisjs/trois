import { defineComponent, PropType, watch } from 'vue'
import { ClampToEdgeWrapping, LinearEncoding, LinearFilter, LinearMipmapLinearFilter, ShaderMaterial, Texture, TextureLoader, UVMapping } from 'three'
import { bindProp } from '../tools'
import { MaterialInjectionKey, MaterialInterface } from './Material'
import { Vector2PropInterface } from '../core/Object3D'

export interface TexureInterface {
  material?: MaterialInterface
  texture?: Texture
}

export default defineComponent({
  inject: {
    material: MaterialInjectionKey as symbol,
  },
  props: {
    name: { type: String, default: 'map' },
    uniform: String,
    src: String,
    onLoad: Function as PropType<(t: Texture) => void>,
    onProgress: Function as PropType<(e: ProgressEvent) => void>,
    onError: Function as PropType<(e: ErrorEvent) => void>,
    encoding: { type: Number, default: LinearEncoding },
    // format: { type: Number, default: RGBAFormat },
    mapping: { type: Number, default: UVMapping },
    wrapS: { type: Number, default: ClampToEdgeWrapping },
    wrapT: { type: Number, default: ClampToEdgeWrapping },
    magFilter: { type: Number, default: LinearFilter },
    minFilter: { type: Number, default: LinearMipmapLinearFilter },
    repeat: { type: Object as PropType<Vector2PropInterface>, default: () => ({ x: 1, y: 1 }) },
    rotation: { type: Number, default: 0 },
    center: { type: Object as PropType<Vector2PropInterface>, default: () => ({ x: 0, y: 0 }) },
  },
  setup(): TexureInterface {
    return {}
  },
  created() {
    this.refreshTexture()
    watch(() => this.src, this.refreshTexture)
  },
  unmounted() {
    this.material?.setTexture(null, this.name)
    this.texture?.dispose()
  },
  methods: {
    createTexture() {
      if (!this.src) return undefined
      const texture = new TextureLoader().load(this.src, this.onLoaded, this.onProgress, this.onError)
      // use format ? TextureLoader will automatically set format to THREE.RGBFormat for JPG images.
      const wathProps = ['encoding', 'mapping', 'wrapS', 'wrapT', 'magFilter', 'minFilter', 'repeat', 'rotation', 'center']
      wathProps.forEach(prop => { bindProp(this, prop, texture) })
      return texture
    },
    refreshTexture() {
      this.texture = this.createTexture()

      if (this.texture && this.material) {
        this.material.setTexture(this.texture, this.name)
        if (this.material.material instanceof ShaderMaterial && this.uniform) {
          (this.material as any).uniforms[this.uniform] = { value: this.texture }
        }
      }
    },
    onLoaded(t: Texture) {
      this.onLoad?.(t)
    },
  },
  render() { return [] },
})
