import { Mesh } from 'three';
import { inject, watch } from 'vue';
import useBindProp from '../use/useBindProp.js';

export default {
  inject: ['three', 'scene', 'rendererComponent'],
  emits: ['ready'],
  props: {
    materialId: String,
    position: Object,
    rotation: Object,
    scale: Object,
    castShadow: Boolean,
    receiveShadow: Boolean,
    onHover: Function,
    onClick: Function,
  },
  // can't use setup because it will not be used in sub components
  // setup() {},
  created() {
    this.parent = inject('group', this.scene);
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
    if (this.mesh) {
      this.three.removeIntersectObject(this.mesh);
      this.parent.remove(this.mesh);
    }
    if (this.geometry) this.geometry.dispose();
    if (this.material && !this.materialId) this.material.dispose();
  },
  methods: {
    initMesh() {
      if (!this.material && this.materialId) {
        this.material = this.three.materials[this.materialId];
      }
      this.mesh = new Mesh(this.geometry, this.material);

      if (this.onHover) {
        this.mesh.onHover = (over) => { this.onHover({ component: this, over }); };
        this.three.addIntersectObject(this.mesh);
      }

      if (this.onClick) {
        this.mesh.onClick = (e) => { this.onClick({ component: this, event: e }); };
        this.three.addIntersectObject(this.mesh);
      }

      this.bindProps();
      this.parent.add(this.mesh);
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
