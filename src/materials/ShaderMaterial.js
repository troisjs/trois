import { ShaderMaterial } from 'three';

export default {
  inject: ['three'],
  props: {
    id: String,
    uniforms: Object,
    vertexShader: String,
    fragmentShader: String,
  },
  mounted() {
    this.three.materials[this.id] = this.material;
  },
  unmounted() {
    this.material.dispose();
    delete this.three.materials[this.id];
  },
  render() {
    return [];
  },
  __hmrId: 'ShaderMaterial',
};
