import { RectAreaLight } from 'three';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import { watch } from 'vue';
import Light from './Light.js';

export default {
  extends: Light,
  props: {
    width: { type: Number, default: 10 },
    height: { type: Number, default: 10 },
    helper: Boolean,
  },
  created() {
    RectAreaLightUniformsLib.init();
    this.light = new RectAreaLight(this.color, this.intensity, this.width, this.height);

    ['width', 'height'].forEach(p => {
      watch(() => this[p], () => {
        this.light[p] = this[p];
      });
    });

    if (this.helper) {
      this.lightHelper = new RectAreaLightHelper(this.light);
      this.addToParent(this.lightHelper);
    }

    this.initLight();
  },
  unmounted() {
    if (this.lightHelper) this.removeFromParent(this.lightHelper);
  },
  __hmrId: 'RectAreaLight',
};
