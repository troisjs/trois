import { watch } from 'vue';
import { Mesh } from 'three';
import Object3D from '../core/Object3D.js';

export default {
  extends: Object3D,
  name: 'Mesh',
  props: {
    castShadow: Boolean,
    receiveShadow: Boolean,
    onHover: Function,
    onClick: Function,
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

      ['castShadow', 'receiveShadow'].forEach(p => {
        this.mesh[p] = this[p];
        watch(() => this[p], () => { this.mesh[p] = this[p]; });
      });

      if (this.onHover) {
        this.mesh.onHover = (over) => { this.onHover({ component: this, over }); };
        this.three.addIntersectObject(this.mesh);
      }

      if (this.onClick) {
        this.mesh.onClick = (e) => { this.onClick({ component: this, event: e }); };
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
    // for predefined mesh (geometry and material are not unmounted)
    if (this.geometry) this.geometry.dispose();
    if (this.material) this.material.dispose();
  },
  __hmrId: 'Mesh',
};
