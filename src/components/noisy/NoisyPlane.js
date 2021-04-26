import { defineComponent, watch } from 'vue'
import { ObjectSpaceNormalMap, ShaderMaterial, Vector2, WebGLRenderTarget } from 'three'
import { Pass } from 'three/examples/jsm/postprocessing/Pass.js'
import { Plane } from '../../../build/trois.module.js'
import snoise3 from '../../glsl/snoise3.glsl.js'

export default defineComponent({
  extends: Plane,
  props: {
    timeCoef: { type: Number, default: 0.001 },
    noiseCoef: { type: Number, default: 5 },
    deltaCoef: { type: Number, default: 1 / 512 },
    displacementScale: { type: Number, default: 5 },
  },
  setup(props) {
    // uniforms
    const uTime = { value: 0 }
    const uNoiseCoef = { value: props.noiseCoef }
    watch(() => props.noiseCoef, (value) => { uNoiseCoef.value = value })
    const uDelta = { value: new Vector2(props.deltaCoef, props.deltaCoef) }
    watch(() => props.deltaCoef, (value) => { uDelta.value.set(value, value) })

    return {
      uTime, uNoiseCoef, uDelta,
    }
  },
  mounted() {
    this.init()

    watch(() => this.displacementScale, (value) => { this.material.displacementScale = value })

    this.startTime = Date.now()
    this.renderer.onBeforeRender(this.update)
  },
  unmounted() {
    this.renderer.offBeforeRender(this.update)
    this.fsQuad.dispose()
    this.dispRT.dispose()
    this.dispMat.dispose()
    this.normRT.dispose()
    this.normMat.dispose()
  },
  methods: {
    init() {
      this.fsQuad = new Pass.FullScreenQuad()

      // displacement map
      this.dispRT = new WebGLRenderTarget(512, 512, { depthBuffer: false, stencilBuffer: false })
      this.dispMat = new ShaderMaterial({
        uniforms: {
          uTime: this.uTime,
          uNoiseCoef: this.uNoiseCoef,
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform float uNoiseCoef;
          varying vec2 vUv;
          ${snoise3}
          void main() {
            vec2 p = vec2(vUv * uNoiseCoef);
            float noise = (snoise(vec3(p.x, p.y, uTime)) + 1.0) / 2.0;
            gl_FragColor = vec4(noise, 0.0, 0.0, 1.0);
          }
        `,
      })

      // normal map
      this.normRT = new WebGLRenderTarget(512, 512, { depthBuffer: false, stencilBuffer: false })
      this.normMat = new ShaderMaterial({
        uniforms: {
          dispMap: { value: this.dispRT.texture },
          delta: this.uDelta,
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D dispMap;
          uniform vec2 delta;
          varying vec2 vUv;
          void main() {
            // gl_FragColor = vec4(0.5, 0.5, 1.0, 0.0);
            float x1 = texture2D(dispMap, vec2(vUv.x - delta.x, vUv.y)).r;
            float x2 = texture2D(dispMap, vec2(vUv.x + delta.x, vUv.y)).r;
            float y1 = texture2D(dispMap, vec2(vUv.x, vUv.y - delta.y)).r;
            float y2 = texture2D(dispMap, vec2(vUv.x, vUv.y + delta.y)).r;
            gl_FragColor = vec4(0.5 + (x1 - x2), 0.5 + (y1 - y2), 1.0, 1.0);
          }
        `,
      })

      this.material.displacementMap = this.dispRT.texture
      this.material.displacementScale = this.displacementScale
      this.material.normalMap = this.normRT.texture
      this.material.normalMapType = ObjectSpaceNormalMap
      // this.material.needsUpdate = true;
    },
    update() {
      this.uTime.value = (Date.now() - this.startTime) * this.timeCoef
      this.renderDisp()
    },
    renderDisp() {
      this.renderMat(this.dispMat, this.dispRT)
      this.renderMat(this.normMat, this.normRT)
    },
    renderMat(mat, target) {
      const renderer = this.renderer.renderer
      this.fsQuad.material = mat
      const oldTarget = renderer.getRenderTarget()
      renderer.setRenderTarget(target)
      this.fsQuad.render(renderer)
      renderer.setRenderTarget(oldTarget)
    },
  },
  __hmrId: 'NoisyPlane',
})
