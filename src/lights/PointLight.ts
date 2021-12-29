import { defineComponent, PropType } from 'vue'
import { PointLight, PointLightHelper } from 'three'
import Light from './Light'

export interface PointLightHelperInterface {
  sphereSize?: number
  color?: string
}

export default defineComponent({
  extends: Light,
  props: {
    distance: { type: Number, default: 0 },
    decay: { type: Number, default: 1 },
    helper: { type: [Boolean, Object] as PropType<boolean | PointLightHelperInterface>, default: false },
  },
  created() {
    const light = new PointLight(this.color, this.intensity, this.distance, this.decay)
    if (this.helper) {
      this.initHelper(light)
    }
    this.initLight(light)
  },
  methods: {
    initHelper(light: PointLight) {
      if (this.helper instanceof Object) {
        const helperConfig: PointLightHelperInterface = {
          sphereSize: 1,
          color: this.color,
        }
        Object.entries(this.helper).forEach(([key, value]) => {
          // @ts-ignore
          helperConfig[key] = value
        })
        const pointLightHelper = new PointLightHelper(light, helperConfig.sphereSize, helperConfig.color)
        this.initObject3D(pointLightHelper)
        // @ts-ignore
        this.pointLightHelper = pointLightHelper
      } else {
        const pointLightHelper = new PointLightHelper(light)
        this.initObject3D(pointLightHelper)
        // @ts-ignore
        this.pointLightHelper = pointLightHelper
      }
    },
  },
  __hmrId: 'PointLight',
})
