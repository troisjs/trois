import CubeTexture from '../core/CubeTexture';

export default {
  extends: CubeTexture,
  inject: ['material'],
  created() {
    this.material.setEnvMap(this.texture);
  },
  unmounted() {
    this.material.setEnvMap(null);
  },
  __hmrId: 'EnvMap',
};
