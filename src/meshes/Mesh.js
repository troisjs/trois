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
    // mass: Number,
  },
  mounted() {
    if (this.geometry && !this.mesh) this.initMesh();
  },
  unmounted() {
    if (this.mesh) this.scene.remove(this.mesh);
    if (this.geometry) this.geometry.dispose();
    if (this.material && !this.materialId) this.material.dispose();
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

      ['castShadow', 'receiveShadow'].forEach(p => {
        this.mesh[p] = this[p];
        watch(() => this[p], () => { this.mesh[p] = this[p]; });
      });

      watch(() => this.materialId, () => {
        this.mesh.material = this.three.materials[this.materialId];
      });

      this.scene.add(this.mesh);

      // if (this.three.cannon) {
      //   this.mesh.mass = this.mass;
      //   this.three.cannon.addMesh(this.mesh);
      // }

      this.$emit('ready');
    },
    refreshGeometry() {
      const oldGeo = this.geometry;
      this.createGeometry();
      this.mesh.geometry = this.geometry;
      oldGeo.dispose();
    },
  },
  render() {
    return [];
  },
  __hmrId: 'Mesh',
};
