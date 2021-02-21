import { Sprite, SpriteMaterial, TextureLoader } from 'three';
import { inject } from 'vue';
import useBindProp from '../use/useBindProp.js';

export default {
  emits: ['ready', 'loaded'],
  inject: ['three', 'scene'],
  props: {
    src: String,
    position: Object,
    scale: Object,
  },
  created() {
    this.parent = inject('group', this.scene);
  },
  mounted() {
    this.texture = new TextureLoader().load(this.src, this.onLoaded);
    this.material = new SpriteMaterial({ map: this.texture });
    this.sprite = new Sprite(this.material);
    this.geometry = this.sprite.geometry;
    useBindProp(this, 'position', this.sprite.position);
    useBindProp(this, 'scale', this.sprite.scale);

    this.parent.add(this.sprite);
    this.$emit('ready');
  },
  unmounted() {
    this.texture.dispose();
    this.material.dispose();
    this.parent.remove(this.sprite);
  },
  methods: {
    onLoaded() {
      this.updateUV();
      this.$emit('loaded');
    },
    updateUV() {
      this.iWidth = this.texture.image.width;
      this.iHeight = this.texture.image.height;
      this.iRatio = this.iWidth / this.iHeight;

      let x = 0.5, y = 0.5;
      if (this.iRatio > 1) {
        y = 0.5 / this.iRatio;
      } else {
        x = 0.5 / this.iRatio;
      }

      const positions = this.geometry.attributes.position.array;
      positions[0] = -x; positions[1] = -y;
      positions[5] = x; positions[6] = -y;
      positions[10] = x; positions[11] = y;
      positions[15] = -x; positions[16] = y;
      this.geometry.attributes.position.needsUpdate = true;
    },
  },
  render() {
    return [];
  },
  __hmrId: 'Sprite',
};
