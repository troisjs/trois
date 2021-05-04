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
  (opts) => new ShaderMaterial(propsValues(opts, ['color']))
)
