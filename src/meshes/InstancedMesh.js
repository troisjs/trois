import { InstancedMesh } from 'three';
import Object3D from '../core/Object3D.js';
import { bindProp } from '../tools.js';

export default {
  extends: Object3D,
  props: {
    castShadow: Boolean,
    receiveShadow: Boolean,
    count: Number,
    onHover: Function,
    onClick: Function
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

      bindProp(this, 'castShadow', this.mesh);
      bindProp(this, 'receiveShadow', this.mesh);

      if (this.onHover) {
        this.mesh.onHover = (over, hit) => { this.onHover({ component: this, over, hit }); };
        this.three.addIntersectObject(this.mesh);
      }

      if (this.onClick) {
        this.mesh.onClick = (e) => { this.onClick({ component: this, event: e }); };
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
  __hmrId: 'InstancedMesh',
};
