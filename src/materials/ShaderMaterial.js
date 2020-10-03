export default {
  inject: ['three', 'mesh'],
  props: {
    id: String,
    uniforms: Object,
    vertexShader: String,
    fragmentShader: String,
  },
  beforeMount() {
    this.createMaterial();
    if (this.id) this.three.materials[this.id] = this.material;
    this.mesh.setMaterial(this.material);
  },
  mounted() {
    if (this.addWatchers) this.addWatchers();
  },
  unmounted() {
    this.material.dispose();
    if (this.id) delete this.three.materials[this.id];
  },
  render() {
    return [];
  },
  __hmrId: 'ShaderMaterial',
};
