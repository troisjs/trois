import { defineComponent, watch } from 'vue'
import { Scene, Color, Object3D } from 'three'

export default defineComponent({
  name: 'Scene',
  inject: ['three'],
  props: {
    id: String,
    background: [String, Number],
  },
  setup(props) {
    const scene = new Scene()
    if (props.background) {
      scene.background = new Color(props.background)
    }
    watch(() => props.background, (value) => { if (scene.background instanceof Color && value) scene.background.set(value) })
    return { scene }
  },
  provide() {
    return {
      scene: this.scene,
    }
  },
  created() {
    if (!this.three.scene) {
      this.three.scene = this.scene
    }
  },
  methods: {
    add(o: Object3D) { this.scene.add(o) },
    remove(o: Object3D) { this.scene.remove(o) },
  },
  render() {
    return this.$slots.default ? this.$slots.default() : []
  },
  __hmrId: 'Scene',
})
