import { defineComponent, watch } from 'vue'
import { Text } from '../../../build/trois.module.js'
import snoise2 from '../../glsl/snoise2.glsl.js'

export default defineComponent({
  extends: Text,
  props: {
    timeCoef: { type: Number, default: 0.001 },
    noiseCoef: { type: Number, default: 0.015 },
    zCoef: { type: Number, default: 10 },
  },
  setup(props) {
    // uniforms
    const uTime = { value: 0 }
    const uNoiseCoef = { value: props.noiseCoef }
    watch(() => props.noiseCoef, (value) => { uNoiseCoef.value = value })
    const uZCoef = { value: props.zCoef }
    watch(() => props.zCoef, (value) => { uZCoef.value = value })

    return {
      uTime, uNoiseCoef, uZCoef,
    }
  },
  mounted() {
    this.updateMaterial()

    this.startTime = Date.now()
    this.renderer.onBeforeRender(this.updateTime)
  },
  unmounted() {
    this.renderer.offBeforeRender(this.updateTime)
  },
  methods: {
    updateMaterial() {
      this.material.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = this.uTime
        shader.uniforms.uNoiseCoef = this.uNoiseCoef
        shader.uniforms.uZCoef = this.uZCoef
        shader.vertexShader = `
          uniform float uTime;
          uniform float uNoiseCoef;
          uniform float uZCoef;
          ${snoise2}
        ` + shader.vertexShader

        shader.vertexShader = shader.vertexShader.replace(
          '#include <begin_vertex>',
          `         
            vec3 p = vec3(position * uNoiseCoef);
            p.x += uTime;
            float noise = snoise(p.xy);
            vec3 transformed = vec3(position);
            transformed.z += noise * uZCoef;
          `
        )
        this.materialShader = shader
      }
      this.material.needsupdate = true
    },
    updateTime() {
      this.uTime.value = (Date.now() - this.startTime) * this.timeCoef
    },
  },
  __hmrId: 'NoisyText',
})
