import { defineComponent, watch } from 'vue'
import { Image } from '../../../build/trois.module.js'
import snoise2 from '../../glsl/snoise2.glsl.js'

export default defineComponent({
  extends: Image,
  props: {
    widthSegments: { type: Number, default: 20 },
    heightSegments: { type: Number, default: 20 },
    timeCoef: { type: Number, default: 0.001 },
    noiseCoef: { type: Number, default: 1 },
    zCoef: { type: Number, default: 5 },
    dispCoef: { type: Number, default: 0.05 },
  },
  setup(props) {
    // uniforms
    const uTime = { value: 0 }
    const uNoiseCoef = { value: props.noiseCoef }
    watch(() => props.noiseCoef, (value) => { uNoiseCoef.value = value })
    const uZCoef = { value: props.zCoef }
    watch(() => props.zCoef, (value) => { uZCoef.value = value })
    const uDispCoef = { value: props.dispCoef }
    watch(() => props.dispCoef, (value) => { uDispCoef.value = value })

    return {
      uTime, uNoiseCoef, uZCoef, uDispCoef,
    }
  },
  created() {
    this.tweakMaterial()

    this.startTime = Date.now()
    this.renderer.onBeforeRender(this.updateTime)
  },
  unmounted() {
    this.renderer.offBeforeRender(this.updateTime)
  },
  methods: {
    tweakMaterial() {
      this.material.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = this.uTime
        shader.uniforms.uNoiseCoef = this.uNoiseCoef
        shader.uniforms.uZCoef = this.uZCoef
        shader.uniforms.uDispCoef = this.uDispCoef
        shader.vertexShader = `
          uniform float uTime;
          uniform float uNoiseCoef;
          uniform float uZCoef;
          varying float vNoise;
          ${snoise2}
        ` + shader.vertexShader

        shader.vertexShader = shader.vertexShader.replace(
          '#include <begin_vertex>',
          `         
            vec3 p = vec3(position * uNoiseCoef);
            p.x += uTime;
            vNoise = snoise(p.xy);
            vec3 transformed = vec3(position);
            transformed.z += vNoise * uZCoef;
          `
        )

        shader.fragmentShader = `
          uniform float uDispCoef;
          varying float vNoise;
        ` + shader.fragmentShader

        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <map_fragment>',
          `
            vec4 texelColor = texture2D(map, vUv);
            vec4 dispTexel = texture2D(map, vUv + vec2(vNoise * uDispCoef, 0));
            texelColor.r = dispTexel.r;
            diffuseColor = texelColor;
          `
        )
        this.materialShader = shader
      }
    },
    updateTime() {
      this.uTime.value = (Date.now() - this.startTime) * this.timeCoef
    },
  },
  __hmrId: 'NoisyImage',
})
