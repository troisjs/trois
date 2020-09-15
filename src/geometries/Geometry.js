export default {
  inject: ['parent'],
  beforeMounted() {
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
