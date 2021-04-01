export default {
  inject: ['three', 'passes'],
  emits: ['ready'],
  beforeMount() {
    if (!this.passes) {
      console.error('Missing parent EffectComposer');
    }
  },
  unmounted() {
    if (this.pass.dispose) this.pass.dispose();
  },
  methods: {
    completePass(pass) {
      this.passes.push(pass);
      this.pass = pass;
      this.$emit('ready', pass);
    },
  },
  render() {
    return [];
  },
  __hmrId: 'EffectPass',
};
