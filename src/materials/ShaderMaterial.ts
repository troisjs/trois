import { ShaderMaterial } from 'three'
import { materialComponent } from './Material'
import { propsValues } from '../tools'

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

export default materialComponent(
  'ShaderMaterial',
  {
    props: { type: Object, default: () => ({
      uniforms: {},
      vertexShader: defaultVertexShader,
      fragmentShader: defaultFragmentShader,
    }) },
  },
  (opts) => {
    const material = new ShaderMaterial(propsValues(opts, ['color']));
    return material
  }
)

// export default defineComponent({
//   extends: Material,
//   props: {
//     uniforms: { type: Object, default: () => ({}) },
//     vertexShader: { type: String, default: defaultVertexShader },
//     fragmentShader: { type: String, default: defaultFragmentShader },
//   },
//   methods: {
//     createMaterial() {
//       const material = new ShaderMaterial(propsValues(this.$props, ['color']));

//       ['vertexShader', 'fragmentShader'].forEach(p => {
//         // @ts-ignore
//         watch(() => this[p], (value) => { material[p] = value; material.needsUpdate = true })
//       })

//       return material
//     },
//   },
//   __hmrId: 'ShaderMaterial',
// })
