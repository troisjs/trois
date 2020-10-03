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
    castShadow: Boolean,
    receiveShadow: Boolean,
  },
  provide() {
    return {
      mesh: this,
    };
  },
  mounted() {
    // console.log('Mesh mounted');
    if (this.geometry && !this.mesh) this.initMesh();
  },
  unmounted() {
    // console.log('Mesh unmounted');
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
      this.bindProps();
      this.scene.add(this.mesh);
      this.$emit('ready');
    },
    bindProps() {
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
    },
    setGeometry(geometry) {
      this.geometry = geometry;
      if (this.mesh) this.mesh.geometry = geometry;
    },
    setMaterial(material) {
      this.material = material;
      if (this.mesh) this.mesh.material = material;
    },
    refreshGeometry() {
      const oldGeo = this.geometry;
      this.createGeometry();
      this.mesh.geometry = this.geometry;
      oldGeo.dispose();
    },
  },
  render() {
    if (this.$slots.default) {
      return this.$slots.default();
    }
    return [];
  },
  __hmrId: 'Mesh',
};
