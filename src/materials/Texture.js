import { TextureLoader } from 'three';
import { watch } from 'vue';

export default {
  inject: ['material'],
  emits: ['loaded'],
  props: {
    src: String,
    onLoad: Function,
    onProgress: Function,
    onError: Function,
    id: { type: String, default: 'map' },
  },
  created() {
    this.refreshTexture();
    watch(() => this.src, this.refreshTexture);
  },
  unmounted() {
    this.material.setTexture(null, this.id);
    this.texture.dispose();
  },
  methods: {
    createTexture() {
      this.texture = new TextureLoader().load(this.src, this.onLoaded, this.onProgress, this.onError);
    },
    refreshTexture() {
      this.createTexture();
      this.material.setTexture(this.texture, this.id);
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
