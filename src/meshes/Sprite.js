import { Sprite, SpriteMaterial, TextureLoader } from 'three';
import useBindProp from '../use/useBindProp.js';

export default {
  emits: ['ready', 'loaded'],
  inject: ['three', 'scene'],
  props: {
    src: String,
    position: Object,
  },
  mounted() {
    this.texture = new TextureLoader().load(this.src, () => { this.$emit('loaded'); });
    this.material = new SpriteMaterial({ map: this.texture });
    this.sprite = new Sprite(this.material);
    useBindProp(this, 'position', this.sprite.position);
    this.scene.add(this.sprite);
    this.$emit('ready');
  },
  unmounted() {
    this.texture.dispose();
  },
  render() {
    return [];
  },
};
