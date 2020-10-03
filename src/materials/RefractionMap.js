import { CubeRefractionMapping } from 'three';
import CubeTexture from '../core/CubeTexture';

export default {
  extends: CubeTexture,
  inject: ['material'],
  props: {
    refractionRatio: { type: Number, default: 0.98 },
  },
  created() {
    this.texture.mapping = CubeRefractionMapping;
    this.material.setRefractionMap(this.texture, this.refractionRatio);
  },
  unmounted() {
    this.material.setEnvMap(null);
  },
  methods: {
    refreshTexture() {
      this.createTexture();
      this.material.setRefractionMap(this.texture, this.refractionRatio);
    },
  },
  __hmrId: 'RefractionMap',
};
