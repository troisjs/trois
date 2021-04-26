import { defineComponent, watch } from 'vue'
import { ShaderMaterial } from 'three'
import Material from './Material'

const defaultVertexShader = `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
`

const defaultFragmentShader = `
  varying vec2 vUv;
  void main() {
    gl_FragColor = vec4(vUv.x, vUv.y, 0., 1.0);
  }
`

export default defineComponent({
  extends: Material,
  props: {
    uniforms: { type: Object, default: () => ({}) },
    vertexShader: { type: String, default: defaultVertexShader },
    fragmentShader: { type: String, default: defaultFragmentShader },
  },
  methods: {
    createMaterial() {
      const material = new ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: this.vertexShader,
        fragmentShader: this.fragmentShader,
      })

      const watchProps = ['vertexShader', 'fragmentShader']
      watchProps.forEach(p => {
        // @ts-ignore
        watch(() => this[p], (value) => {
          this.setProp(p, value, true)
        })
      })

      return material
    },
    addWatchers() {},
  },
  __hmrId: 'ShaderMaterial',
})
