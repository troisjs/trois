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
    if (!this.material) {
      // this.material = new ShaderMaterial(this.$props);
    }
    this.three.materials[this.id] = this.material;
  },
  unmounted() {
    this.material.dispose();
  },
  methods: {
  },
  render() {
    return [];
  },
  __hmrId: 'ShaderMaterial',
};
