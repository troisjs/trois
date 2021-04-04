import { defineComponent } from 'vue';
import { AmbientLight } from 'three';
import Light from './Light.js';

export default defineComponent({
  extends: Light,
  created() {
    this.light = new AmbientLight(this.color, this.intensity);
    this.initLight();
  },
  __hmrId: 'AmbientLight',
});
