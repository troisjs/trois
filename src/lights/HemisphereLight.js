import { defineComponent, watch } from 'vue';
import { HemisphereLight } from 'three';
import Light from './Light.js';

export default defineComponent({
  extends: Light,
  props: {
    groundColor: { type: String, default: '#444444' },
  },
  created() {
    this.light = new HemisphereLight(this.color, this.groundColor, this.intensity);
    watch(() => this.groundColor, (value) => { this.light.groundColor.set(value); });
    this.initLight();
  },
  __hmrId: 'HemisphereLight',
});
