import { watch } from 'vue';
import { InstancedMesh } from 'three';
import Object3D from '../core/Object3D.js';

export default {
  extends: Object3D,
  props: {
    castShadow: Boolean,
    receiveShadow: Boolean,
    count: Number,
  },
  provide() {
    return {
      mesh: this,
    };
  },
  beforeMount() {
    if (!this.$slots.default) {
      console.error('Missing Geometry');
    }
  },
  created() {
    this.initMesh();
  },
  methods: {
    initMesh() {
      this.mesh = new InstancedMesh(this.geometry, this.material, this.count);

      ['castShadow', 'receiveShadow'].forEach(p => {
        this.mesh[p] = this[p];
        watch(() => this[p], () => { this.mesh[p] = this[p]; });
      });

      this.initObject3D(this.mesh);
    },
    setGeometry(geometry) {
      this.geometry = geometry;
      if (this.mesh) this.mesh.geometry = geometry;
    },
    setMaterial(material) {
      this.material = material;
      if (this.mesh) this.mesh.material = material;
    },
  },
  __hmrId: 'InstancedMesh',
};
