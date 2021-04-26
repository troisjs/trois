import { defineComponent, watch } from 'vue'
import { DoubleSide, MeshBasicMaterial, PlaneGeometry, Texture, TextureLoader } from 'three'
import Mesh, { MeshSetupInterface } from './Mesh'

interface ImageSetupInterface extends MeshSetupInterface {
  material?: MeshBasicMaterial
  texture?: Texture
}

export default defineComponent({
  emits: ['loaded'],
  extends: Mesh,
  props: {
    src: { type: String, required: true },
    width: Number,
    height: Number,
    widthSegments: { type: Number, default: 1 },
    heightSegments: { type: Number, default: 1 },
    keepSize: Boolean,
  },
  setup(): ImageSetupInterface {
    return {}
  },
  created() {
    if (!this.renderer) return

    this.geometry = new PlaneGeometry(1, 1, this.widthSegments, this.heightSegments)
    this.material = new MeshBasicMaterial({ side: DoubleSide, map: this.loadTexture() })

    watch(() => this.src, this.refreshTexture);

    ['width', 'height'].forEach(p => {
      // @ts-ignore
      watch(() => this[p], this.resize)
    })

    this.resize()
    if (this.keepSize) this.renderer.onResize(this.resize)
  },
  unmounted() {
    this.renderer?.offResize(this.resize)
  },
  methods: {
    loadTexture() {
      return new TextureLoader().load(this.src, this.onLoaded)
    },
    refreshTexture() {
      this.texture?.dispose()
      if (this.material) {
        this.material.map = this.loadTexture()
        this.material.needsUpdate = true
      }
    },
    onLoaded(texture: Texture) {
      this.texture = texture
      this.resize()
      this.$emit('loaded', texture)
    },
    resize() {
      if (!this.renderer || !this.texture) return
      const screen = this.renderer.size
      const iW = this.texture.image.width
      const iH = this.texture.image.height
      const iRatio = iW / iH
      let w = 1, h = 1
      if (this.width && this.height) {
        w = this.width * screen.wWidth / screen.width
        h = this.height * screen.wHeight / screen.height
      } else if (this.width) {
        w = this.width * screen.wWidth / screen.width
        h = w / iRatio
      } else if (this.height) {
        h = this.height * screen.wHeight / screen.height
        w = h * iRatio
      } else {
        if (iRatio > 1) w = h * iRatio
        else h = w / iRatio
      }
      if (this.mesh) {
        this.mesh.scale.x = w
        this.mesh.scale.y = h
      }
    },
  },
  __hmrId: 'Image',
})
