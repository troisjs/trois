import { watch } from 'vue';

export default {
  emits: ['ready'],
  inject: ['mesh'],
  created() {
    if (!this.mesh) {
      console.error('Missing parent Mesh');
    }
    this.watchProps = [];
    Object.entries(this.$props).forEach(e => this.watchProps.push(e[0]));
  },
  beforeMount() {
    this.createGeometry();
    this.mesh.setGeometry(this.geometry);
  },
  mounted() {
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
    refreshGeometry() {
      const oldGeo = this.geometry;
      this.createGeometry();
      this.mesh.setGeometry(this.geometry);
      oldGeo.dispose();
    },
  },
  render() {
    return [];
  },
};
