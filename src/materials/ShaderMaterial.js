export default {
  inject: ['three', 'mesh'],
  props: {
    uniforms: Object,
    vertexShader: String,
    fragmentShader: String,
  },
  created() {
    this.createMaterial();
    this.mesh.setMaterial(this.material);
    if (this.addWatchers) this.addWatchers();
  },
  unmounted() {
    this.material.dispose();
  },
  render() {
    return [];
  },
  __hmrId: 'ShaderMaterial',
};
