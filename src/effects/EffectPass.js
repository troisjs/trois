export default {
  inject: ['three', 'passes'],
  beforeMount() {
    if (!this.passes) {
      console.error('Missing parent EffectComposer');
    }
  },
  render() {
    return [];
  },
};
