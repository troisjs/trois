import { DirectionalLight, Light, SpotLight } from 'three'
import { defineComponent, PropType, watch } from 'vue'
import Object3D, { Vector2PropInterface } from '../core/Object3D'
import { bindProp, setFromProp } from '../tools'

export interface LightSetupInterface {
  light?: Light
}

export default defineComponent({
  extends: Object3D,
  name: 'Light',
  props: {
    color: { type: String, default: '#ffffff' },
    intensity: { type: Number, default: 1 },
    castShadow: { type: Boolean, default: false },
    shadowMapSize: { type: Object as PropType<Vector2PropInterface>, default: () => ({ x: 512, y: 512 }) },
    shadowCamera: { type: Object, default: () => ({}) },
  },
  setup(): LightSetupInterface {
    return {}
  },
  unmounted() {
    if (this.light instanceof SpotLight || this.light instanceof DirectionalLight) {
      this.removeFromParent(this.light.target)
    }
  },
  methods: {
    initLight(light: Light) {
      this.light = light

      if ((light as any).shadow) {
        light.castShadow = this.castShadow
        // @ts-ignore
        setFromProp(light.shadow.mapSize, this.shadowMapSize)
        // @ts-ignore
        setFromProp(light.shadow.camera, this.shadowCamera)
      }

      ['color', 'intensity', 'castShadow'].forEach(p => {
        // @ts-ignore
        watch(() => this[p], (value) => {
          if (p === 'color') {
            light.color.set(value)
          } else {
            // @ts-ignore
            light[p] = value
          }
        })
      })

      this.initObject3D(light)

      if (light instanceof SpotLight || light instanceof DirectionalLight) {
        bindProp(this, 'target', light.target, 'position')
        this.addToParent(light.target)
      }
    },
  },
  __hmrId: 'Light',
})
