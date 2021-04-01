import { watch } from 'vue';
import Object3D from '../core/Object3D.js';
import { bindProp, setFromProp } from '../tools';

export default {
  extends: Object3D,
  name: 'Light',
  props: {
    color: { type: String, default: '#ffffff' },
    intensity: { type: Number, default: 1 },
    castShadow: { type: Boolean, default: false },
    shadowMapSize: { type: Object, default: { x: 512, y: 512 } },
    shadowCamera: { type: Object, default: {} },
  },
  // can't use setup because it will not be used in sub components
  // setup() {},
  unmounted() {
    if (this.light.target) this.$parent.remove(this.light.target);
  },
  methods: {
    initLight() {
      if (this.light.target) {
        bindProp(this, 'target', this.light.target, 'position');
      }

      if (this.light.shadow) {
        this.light.castShadow = this.castShadow;
        setFromProp(this.light.shadow.mapSize, this.shadowMapSize);
        setFromProp(this.light.shadow.camera, this.shadowCamera);
      }

      ['color', 'intensity', 'castShadow'].forEach(p => {
        watch(() => this[p], () => {
          if (p === 'color') {
            this.light.color.set(this.color);
          } else {
            this.light[p] = this[p];
          }
        });
      });

      this.initObject3D(this.light);
      if (this.light.target) this.$parent.add(this.light.target);
    },
  },
  __hmrId: 'Light',
};
