import { watch } from 'vue';

export default {
  emits: ['ready'],
  inject: ['mesh'],
  props: {
    rotateX: Number,
    rotateY: Number,
    rotateZ: Number,
  },
  created() {
    if (!this.mesh) {
      console.error('Missing parent Mesh');
    }
    this.watchProps = [];
    Object.entries(this.$props).forEach(e => this.watchProps.push(e[0]));
  },
  beforeMount() {
    this.createGeometry();
    this.rotateGeometry();
    this.mesh.setGeometry(this.geometry);
  },
  mounted() {
    this.addWatchers();
  },
  unmounted() {
    this.geometry.dispose();
  },
  methods: {
    rotateGeometry() {
      if (this.rotateX) this.geometry.rotateX(this.rotateX);
      if (this.rotateY) this.geometry.rotateY(this.rotateY);
      if (this.rotateZ) this.geometry.rotateZ(this.rotateZ);
    },
    addWatchers() {
      this.watchProps.forEach(prop => {
        watch(() => this[prop], () => {
          this.refreshGeometry();
        });
      });
    },
    refreshGeometry() {
      const oldGeo = this.geometry;
      this.createGeometry();
      this.rotateGeometry();
      this.mesh.setGeometry(this.geometry);
      oldGeo.dispose();
    },
  },
  render() {
    return [];
  },
};
