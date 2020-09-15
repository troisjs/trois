import { InstancedMesh } from 'three';

export default {
  inject: ['three', 'scene'],
  props: {
    material: String,
    count: Number,
  },
  setup() {
    return {
      conf: {},
    };
  },
  provide() {
    return {
      parent: this.conf,
    };
  },
  beforeMount() {
    if (!this.$slots.default) {
      console.error('Missing Geometry');
    }
  },
  mounted() {
    this.mesh = new InstancedMesh(this.conf.geometry, this.three.materials[this.material], this.count);
    this.scene.add(this.mesh);
  },
  render() {
    return this.$slots.default();
  },
};
