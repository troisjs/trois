import Texture from '../core/Texture';

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
  },
  __hmrId: 'Map',
};
