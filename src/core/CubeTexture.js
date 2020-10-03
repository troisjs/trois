import { CubeTextureLoader } from 'three';
// import { watch } from 'vue';

export default {
  inject: ['three'],
  emits: ['loaded'],
  props: {
    path: String,
    urls: {
      type: Array,
      default: ['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'],
    },
    onLoad: Function,
    onProgress: Function,
    onError: Function,
  },
  created() {
    this.texture = new CubeTextureLoader()
      .setPath(this.path)
      .load(this.urls, this.onLoaded, this.onProgress, this.onError);
  },
  unmounted() {
    this.texture.dispose();
  },
  methods: {
    onLoaded() {
      if (this.onLoad) this.onLoad();
      this.$emit('loaded');
    },
  },
  render() {
    return [];
  },
};
