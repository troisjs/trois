export default {
  inject: ['three', 'passes'],
  beforeMount() {
    if (!this.passes) {
      console.error('Missing parent EffectComposer');
    }
  },
  unmounted() {
    if (this.pass.dispose) this.pass.dispose();
  },
  render() {
    return [];
  },
  __hmrId: 'EffectPass',
};
