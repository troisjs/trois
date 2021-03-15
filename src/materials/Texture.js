import { ClampToEdgeWrapping, LinearFilter, LinearMipmapLinearFilter, TextureLoader, UVMapping } from 'three';
import { watch } from 'vue';
import { bindProp } from '../tools.js';

export default {
  inject: ['material'],
  emits: ['loaded'],
  props: {
    id: { type: String, default: 'map' },
    src: String,
    onLoad: Function,
    onProgress: Function,
    onError: Function,
    mapping: { type: Number, default: UVMapping },
    wrapS: { type: Number, default: ClampToEdgeWrapping },
    wrapT: { type: Number, default: ClampToEdgeWrapping },
    magFilter: { type: Number, default: LinearFilter },
    minFilter: { type: Number, default: LinearMipmapLinearFilter },
    repeat: { type: Object, default: { x: 1, y: 1 } },
    rotation: { type: Number, default: 0 },
    center: { type: Object, default: { x: 0, y: 0 } },
  },
  created() {
    this.refreshTexture();
    watch(() => this.src, this.refreshTexture);
  },
  unmounted() {
    if (this.material && this.material.setTexture) this.material.setTexture(null, this.id);
    this.texture.dispose();
  },
  methods: {
    createTexture() {
      this.texture = new TextureLoader().load(this.src, this.onLoaded, this.onProgress, this.onError);
      const wathProps = ['mapping', 'wrapS', 'wrapT', 'magFilter', 'minFilter', 'repeat', 'rotation', 'rotation', 'center'];
      wathProps.forEach(prop => {
        bindProp(this, prop, this.texture);
      });
    },
    refreshTexture() {
      this.createTexture();
      if (this.material && this.material.setTexture) { this.material.setTexture(this.texture, this.id); }
      else if (this.material && this.material.material.type === "ShaderMaterial") {
        const id = this.id === 'map' ? this.src.replace(/\..*/, '') : this.id;
        this.material.uniforms[id] = { value: this.texture };
      }
    },
    onLoaded() {
      if (this.onLoad) this.onLoad();
      this.$emit('loaded');
    },
  },
  render() { return []; },
};
