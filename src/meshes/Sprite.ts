import { defineComponent } from 'vue'
import { Sprite, SpriteMaterial, Texture, TextureLoader } from 'three'
import Object3D, { Object3DSetupInterface } from '../core/Object3D'

interface SpriteSetupInterface extends Object3DSetupInterface {
  texture?: Texture
  material?: SpriteMaterial
  sprite?: Sprite
}

export default defineComponent({
  extends: Object3D,
  emits: ['loaded'],
  props: {
    src: { type: String, required: true },
  },
  setup(): SpriteSetupInterface {
    return {}
  },
  created() {
    this.texture = new TextureLoader().load(this.src, this.onLoaded)
    this.material = new SpriteMaterial({ map: this.texture })
    this.sprite = new Sprite(this.material)
    this.initObject3D(this.sprite)
  },
  unmounted() {
    this.texture?.dispose()
    this.material?.dispose()
  },
  methods: {
    onLoaded() {
      this.updateUV()
      this.$emit('loaded')
    },
    updateUV() {
      if (!this.texture || !this.sprite) return

      const iWidth = this.texture.image.width
      const iHeight = this.texture.image.height
      const iRatio = iWidth / iHeight

      let x = 0.5, y = 0.5
      if (iRatio > 1) {
        x = 0.5 * iRatio
      } else {
        y = 0.5 / iRatio
      }

      const positions = this.sprite.geometry.attributes.position.array as Array<number>
      positions[0] = -x; positions[1] = -y
      positions[5] = x; positions[6] = -y
      positions[10] = x; positions[11] = y
      positions[15] = -x; positions[16] = y
      this.sprite.geometry.attributes.position.needsUpdate = true
    },
  },
  __hmrId: 'Sprite',
})
