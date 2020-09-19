import { InstancedMesh } from 'three';
import { setFromProp } from '../tools.js';

export default {
  inject: ['three', 'scene'],
  props: {
    materialId: String,
    count: Number,
    position: Object,
    castShadow: {
      type: Boolean,
      default: false,
    },
    receiveShadow: {
      type: Boolean,
      default: false,
    },
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
    this.mesh = new InstancedMesh(this.conf.geometry, this.three.materials[this.materialId], this.count);
    setFromProp(this.mesh.position, this.position);
    this.mesh.castShadow = this.castShadow;
    this.mesh.receiveShadow = this.receiveShadow;
    this.scene.add(this.mesh);
  },
  render() {
    return this.$slots.default();
  },
  __hmrId: 'InstancedMesh',
};
