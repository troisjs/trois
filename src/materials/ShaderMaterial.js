import { defineComponent, watch } from 'vue';
import { ShaderMaterial } from 'three';
import { propsValues } from '../tools';

const defaultVertexShader = `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}`;

const defaultFragmentShader = `
varying vec2 vUv;
void main() {
  gl_FragColor = vec4(vUv.x, vUv.y, 0., 1.0);
}`;

export default defineComponent({
  inject: ['three', 'mesh'],
  props: {
    uniforms: { type: Object, default: () => { return {}; } },
    vertexShader: { type: String, default: defaultVertexShader },
    fragmentShader: { type: String, default: defaultFragmentShader },
  },
  provide() {
    return {
      material: this,
    };
  },
  created() {
    this.createMaterial();
    ['vertexShader', 'fragmentShader'].forEach(p => {
      watch(() => this[p], () => {
        // recreate material if we change either shader
        this.material.dispose();
        this.createMaterial();
      });
    });
  },
  unmounted() {
    this.material.dispose();
  },
  methods: {
    createMaterial() {
      this.material = new ShaderMaterial(propsValues(this.$props));
      this.mesh.setMaterial(this.material);
    },
  },
  render() {
    return this.$slots.default ? this.$slots.default() : [];
  },
  __hmrId: 'ShaderMaterial',
});
