import { defineComponent } from 'vue';
import { DirectionalLight } from 'three';
import Light from './Light.js';

export default defineComponent({
  extends: Light,
  props: {
    target: Object,
  },
  created() {
    this.light = new DirectionalLight(this.color, this.intensity);
    this.initLight();
  },
  __hmrId: 'DirectionalLight',
});
