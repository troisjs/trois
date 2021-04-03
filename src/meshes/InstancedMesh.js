import { defineComponent } from 'vue';
import { InstancedMesh } from 'three';
import Object3D from '../core/Object3D';
import { bindProp } from '../tools';
import { pointerProps } from './Mesh';

export default defineComponent({
  extends: Object3D,
  props: {
    castShadow: Boolean,
    receiveShadow: Boolean,
    count: Number,
    ...pointerProps,
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
  mounted() {
    this.initMesh();
  },
  methods: {
    initMesh() {
      this.mesh = new InstancedMesh(this.geometry, this.material, this.count);
      this.mesh.component = this;

      bindProp(this, 'castShadow', this.mesh);
      bindProp(this, 'receiveShadow', this.mesh);

      if (this.onPointerEnter ||
        this.onPointerOver ||
        this.onPointerMove ||
        this.onPointerLeave ||
        this.onPointerDown ||
        this.onPointerUp ||
        this.onClick) {
        this.three.addIntersectObject(this.mesh);
      }

      this.initObject3D(this.mesh);
    },
    setGeometry(geometry) {
      this.geometry = geometry;
      if (this.mesh) this.mesh.geometry = geometry;
    },
    setMaterial(material) {
      this.material = material;
      this.material.instancingColor = true;
      if (this.mesh) this.mesh.material = material;
    },
  },
  unmounted() {
    if (this.mesh) {
      this.three.removeIntersectObject(this.mesh);
    }
  },
  __hmrId: 'InstancedMesh',
});
