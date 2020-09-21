import { InstancedMesh } from 'three';
import { watch } from 'vue';
import useBindProp from '../use/useBindProp.js';

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

    useBindProp(this, 'position', this.mesh.position);
    useBindProp(this, 'rotation', this.mesh.rotation);
    useBindProp(this, 'scale', this.mesh.scale);

    ['castShadow', 'receiveShadow'].forEach(p => {
      this.mesh[p] = this[p];
      watch(() => this[p], () => { this.mesh[p] = this[p]; });
    });

    // watch(() => this.materialId, () => {
    //   this.mesh.material = this.three.materials[this.materialId];
    // });

    this.scene.add(this.mesh);
  },
  unmounted() {
    this.scene.remove(this.mesh);
  },
  render() {
    return this.$slots.default();
  },
  __hmrId: 'InstancedMesh',
};
