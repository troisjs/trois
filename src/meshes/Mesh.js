import { watch } from 'vue';
import { Mesh } from 'three';
import { setFromProp } from '../tools.js';

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
  },
  methods: {
    initMesh() {
      if (!this.material && this.materialId) {
        this.material = this.three.materials[this.materialId];
      }
      this.mesh = new Mesh(this.geometry, this.material);
      this.updateMesh();
      this.scene.add(this.mesh);

      this.addWatchers();
      this.$emit('ready');
    },
    addWatchers() {
      ['position', 'rotation', 'scale'].forEach(p => {
        watch(() => this[p], () => {
          setFromProp(this.mesh[p], this[p]);
        }, { deep: true });
      });
    },
    updateMesh() {
      setFromProp(this.mesh.position, this.position);
      setFromProp(this.mesh.rotation, this.rotation);
      setFromProp(this.mesh.scale, this.scale);
      this.mesh.castShadow = this.castShadow;
      this.mesh.receiveShadow = this.receiveShadow;
    },
  },
  render() {
    return [];
  },
};
