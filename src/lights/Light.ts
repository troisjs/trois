import { DirectionalLight, Light, SpotLight } from 'three'
import { defineComponent, watch } from 'vue'
import Object3D from '../core/Object3D'
import { bindProp, setFromProp } from '../tools'

interface LightInterface {
  light?: Light
}

type LightWithTarget = SpotLight | DirectionalLight

export default defineComponent({
  extends: Object3D,
  name: 'Light',
  props: {
    color: { type: String, default: '#ffffff' },
    intensity: { type: Number, default: 1 },
    castShadow: { type: Boolean, default: false },
    shadowMapSize: { type: Object, default: () => ({ x: 512, y: 512 }) },
    shadowCamera: { type: Object, default: () => ({}) },
  },
  setup(): LightInterface {
    return {}
  },
  unmounted() {
    const light = this.light as LightWithTarget
    if (light && light.target) this.removeFromParent(light.target)
  },
  methods: {
    initLight(light: Light) {
      this.light = light

      const lightWithTarget = light as LightWithTarget
      if (lightWithTarget.target) {
        bindProp(this, 'target', lightWithTarget.target, 'position')
      }

      if (this.light?.shadow) {
        this.light.castShadow = this.castShadow
        setFromProp(this.light.shadow.mapSize, this.shadowMapSize)
        setFromProp(this.light.shadow.camera, this.shadowCamera)
      }

      ['color', 'intensity', 'castShadow'].forEach(p => {
        watch(() => this[p], () => {
          if (p === 'color') {
            light.color.set(this.color)
          } else {
            light[p] = this[p]
          }
        })
      })

      this.initObject3D(this.light)
      if (lightWithTarget.target) this.addToParent(lightWithTarget.target)
    },
  },
  __hmrId: 'Light',
})
