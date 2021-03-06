import Texture from './Texture.js';

export default {
  extends: Texture,
  inject: ['material'],
  created() {
    this.material.setMap(this.texture);
  },
  unmounted() {
    this.material.setMap(null);
  },
  methods: {
    refreshTexture() {
      this.createTexture();
      this.material.setMap(this.texture);
    },
  },
  __hmrId: 'Map',
};
