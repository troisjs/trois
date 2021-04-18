import { defineComponent, PropType, watch } from 'vue'
import { ClampToEdgeWrapping, LinearFilter, LinearMipmapLinearFilter, Texture, TextureLoader, UVMapping } from 'three'
import { bindProp } from '../tools'

interface MaterialInterface {
  uniforms: Record<string, unknown>
  setTexture(t: Texture | null, k: string): void
}

interface TexureInterface {
  material?: MaterialInterface
  texture?: Texture
}

export default defineComponent({
  inject: ['material'],
  props: {
    name: { type: String, default: 'map' },
    uniform: String,
    src: String,
    onLoad: Function as PropType<(t: Texture) => void>,
    onProgress: Function as PropType<(e: ProgressEvent) => void>,
    onError: Function as PropType<(e: ErrorEvent) => void>,
    mapping: { type: Number, default: UVMapping },
    wrapS: { type: Number, default: ClampToEdgeWrapping },
    wrapT: { type: Number, default: ClampToEdgeWrapping },
    magFilter: { type: Number, default: LinearFilter },
    minFilter: { type: Number, default: LinearMipmapLinearFilter },
    repeat: { type: Object, default: () => ({ x: 1, y: 1 }) },
    rotation: { type: Number, default: 0 },
    center: { type: Object, default: () => ({ x: 0, y: 0 }) },
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
      if (!this.src) return false
      this.texture = new TextureLoader().load(this.src, this.onLoaded, this.onProgress, this.onError)
      const wathProps = ['mapping', 'wrapS', 'wrapT', 'magFilter', 'minFilter', 'repeat', 'rotation', 'rotation', 'center']
      wathProps.forEach(prop => { bindProp(this, prop, this.texture) })
    },
    refreshTexture() {
      this.createTexture()
      if (!this.texture) return false

      if (this.material) {
        this.material.setTexture(this.texture, this.name)
        if (this.uniform) {
          this.material.uniforms[this.uniform] = { value: this.texture }
        }
      }
    },
    onLoaded(t: Texture) {
      if (this.onLoad) this.onLoad(t)
    },
  },
  render() { return [] },
})
