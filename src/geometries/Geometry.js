export default {
  inject: ['parent'],
  created() {
    if (!this.parent) {
      console.error('Missing parent Mesh');
    }
  },
  render() {
    return [];
  },
};
