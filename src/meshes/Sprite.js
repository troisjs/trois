import { defineComponent } from 'vue';
import { Sprite, SpriteMaterial, TextureLoader } from 'three';
import Object3D from '../core/Object3D.js';

export default defineComponent({
  extends: Object3D,
  emits: ['loaded'],
  props: {
    src: String,
  },
  data() {
    return {
      loading: true,
    };
  },
  created() {
    this.texture = new TextureLoader().load(this.src, this.onLoaded);
    this.material = new SpriteMaterial({ map: this.texture });
    this.sprite = new Sprite(this.material);
    this.geometry = this.sprite.geometry;
    this.initObject3D(this.sprite);
  },
  unmounted() {
    this.texture.dispose();
    this.material.dispose();
  },
  methods: {
    onLoaded() {
      this.loading = false;
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
  __hmrId: 'Sprite',
});
