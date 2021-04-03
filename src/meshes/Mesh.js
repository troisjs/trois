import { watch } from 'vue';
import { Mesh } from 'three';
import Object3D from '../core/Object3D.js';
import { bindProp } from '../tools';

export const pointerProps = {
  onPointerEnter: Function,
  onPointerOver: Function,
  onPointerMove: Function,
  onPointerLeave: Function,
  onPointerDown: Function,
  onPointerUp: Function,
  onClick: Function,
};

export default {
  name: 'Mesh',
  extends: Object3D,
  props: {
    castShadow: Boolean,
    receiveShadow: Boolean,
    ...pointerProps,
  },
  // can't use setup because it will not be used in sub components
  // setup() {},
  provide() {
    return {
      mesh: this,
    };
  },
  mounted() {
    if (!this.mesh && !this.loading) this.initMesh();
  },
  methods: {
    initMesh() {
      this.mesh = new Mesh(this.geometry, this.material);
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
    addGeometryWatchers(props) {
      Object.keys(props).forEach(prop => {
        watch(() => this[prop], () => {
          this.refreshGeometry();
        });
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
  unmounted() {
    if (this.mesh) {
      this.three.removeIntersectObject(this.mesh);
    }
    // for predefined mesh (geometry is not unmounted)
    if (this.geometry) this.geometry.dispose();
  },
  __hmrId: 'Mesh',
};
