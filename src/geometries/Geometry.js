export default {
  inject: ['parent'],
  beforeMount() {
    if (!this.parent) {
      console.error('Missing parent Mesh');
    }
  },
  unmounted() {
    this.parent.geometry.dispose();
  },
  render() {
    return [];
  },
};
