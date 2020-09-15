export default {
  inject: ['parent'],
  beforeMounted() {
    if (!this.parent) {
      console.error('Missing parent Mesh');
    }
  },
  render() {
    return [];
  },
};
