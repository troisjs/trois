import { CubeTextureLoader } from 'three';
import { watch } from 'vue';

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
    this.createTexture();
    watch(() => this.path, this.refreshTexture);
    watch(() => this.urls, this.refreshTexture);
  },
  unmounted() {
    this.texture.dispose();
  },
  methods: {
    createTexture() {
      this.texture = new CubeTextureLoader()
        .setPath(this.path)
        .load(this.urls, this.onLoaded, this.onProgress, this.onError);
    },
    refreshTexture() {
      this.createTexture();
    },
    onLoaded() {
      if (this.onLoad) this.onLoad();
      this.$emit('loaded');
    },
  },
  render() {
    return [];
  },
};
