import { ClampToEdgeWrapping, LinearFilter, LinearMipmapLinearFilter, TextureLoader, UVMapping } from 'three';
import { watch } from 'vue';
import { bindProp } from '../tools';

export default {
  inject: ['material'],
  emits: ['loaded'],
  props: {
    name: { type: String, default: 'map' },
    uniform: { type: String, default: null },
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
    if (this.material && this.material.setTexture) this.material.setTexture(null, this.name);
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
      // handle standard material
      if (this.material && this.material.setTexture) { this.material.setTexture(this.texture, this.name); }
      // handle shader material
      else if (this.material && this.material.material.type === "ShaderMaterial") {
        // require a `uniform` prop so we know what to call the uniform
        if (!this.uniform) {
          console.warn('"uniform" prop required to use texture in a shader.')
          return
        }
        this.material.uniforms[this.uniform] = { value: this.texture };
      }
    },
    onLoaded() {
      if (this.onLoad) this.onLoad();
      this.$emit('loaded');
    },
  },
  render() { return []; },
};
