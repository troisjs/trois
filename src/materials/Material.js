export default {
  inject: ['three'],
  props: {
    name: String,
    color: {
      type: String,
      default: '#ffffff',
    },
  },
  mounted() {
    this.three.materials[this.name] = this.material;
  },
  render() {
    return [];
  },
};
