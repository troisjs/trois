import { TextureLoader } from 'three';
// import { watch } from 'vue';

export default {
  inject: ['three'],
  emits: ['loaded'],
  props: {
    src: String,
    onLoad: Function,
    onProgress: Function,
    onError: Function,
  },
  created() {
    this.texture = new TextureLoader().load(this.src, this.onLoaded, this.onProgress, this.onError);
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
