import { defineComponent, watch } from 'vue';

export default defineComponent({
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

    this.createGeometry();
    this.rotateGeometry();
    this.mesh.setGeometry(this.geometry);

    this.addWatchers();
  },
  unmounted() {
    this.geometry.dispose();
  },
  methods: {
    addWatchers() {
      this.watchProps.forEach(prop => {
        watch(() => this[prop], () => {
          this.refreshGeometry();
        });
      });
    },
    rotateGeometry() {
      if (this.rotateX) this.geometry.rotateX(this.rotateX);
      if (this.rotateY) this.geometry.rotateY(this.rotateY);
      if (this.rotateZ) this.geometry.rotateZ(this.rotateZ);
    },
    refreshGeometry() {
      const oldGeo = this.geometry;
      this.createGeometry();
      this.rotateGeometry();
      this.mesh.setGeometry(this.geometry);
      oldGeo.dispose();
    },
  },
  render() { return []; },
});
