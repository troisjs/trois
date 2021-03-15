import { CubeTextureLoader, CubeRefractionMapping } from 'three';
import { watch } from 'vue';

export default {
  inject: ['material'],
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
    name: { type: String, default: 'envMap' },
    refraction: Boolean,
    // todo: remove ?
    refractionRatio: { type: Number, default: 0.98 },
  },
  created() {
    this.refreshTexture();
    watch(() => this.path, this.refreshTexture);
    watch(() => this.urls, this.refreshTexture);
  },
  unmounted() {
    this.material.setTexture(null, this.name);
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
      this.material.setTexture(this.texture, this.name);
      if (this.refraction) {
        this.texture.mapping = CubeRefractionMapping;
        this.material.setProp('refractionRatio', this.refractionRatio);
      }
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
