import { Mesh } from 'three';
import { watch } from 'vue';
import useBindProp from '../use/useBindProp.js';

export default {
  inject: ['three', 'scene'],
  emits: ['ready'],
  props: {
    materialId: String,
    position: Object,
    rotation: Object,
    scale: Object,
    castShadow: {
      type: Boolean,
      default: false,
    },
    receiveShadow: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    if (this.geometry) this.initMesh();
  },
  unmounted() {
    if (this.geometry) this.geometry.dispose();
    if (this.mesh) this.scene.remove(this.mesh);
  },
  methods: {
    initMesh() {
      if (!this.material && this.materialId) {
        this.material = this.three.materials[this.materialId];
      }
      this.mesh = new Mesh(this.geometry, this.material);

      useBindProp(this, 'position', this.mesh.position);
      useBindProp(this, 'rotation', this.mesh.rotation);
      useBindProp(this, 'scale', this.mesh.scale);

      this.mesh.castShadow = this.castShadow;
      this.mesh.receiveShadow = this.receiveShadow;
      ['castShadow', 'receiveShadow'].forEach(p => {
        watch(() => this[p], () => { this.mesh[p] = this[p]; });
      });

      this.scene.add(this.mesh);
      this.$emit('ready');
    },
  },
  render() {
    return [];
  },
  __hmrId: 'Mesh',
};
