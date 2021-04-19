import { defineComponent, watch } from 'vue'
import { RectAreaLight } from 'three'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'
import Light from './Light'

export default defineComponent({
  extends: Light,
  props: {
    width: { type: Number, default: 10 },
    height: { type: Number, default: 10 },
    helper: Boolean,
  },
  created() {
    RectAreaLightUniformsLib.init()
    const light = new RectAreaLight(this.color, this.intensity, this.width, this.height)

    const watchProps = ['width', 'height']
    watchProps.forEach(p => {
      // @ts-ignore
      watch(() => this[p], (value) => { light[p] = value })
    })

    if (this.helper) {
      const lightHelper = new RectAreaLightHelper(light)
      light.add(lightHelper)
    }

    this.initLight(light)
  },
  __hmrId: 'RectAreaLight',
})
