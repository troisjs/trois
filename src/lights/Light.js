import { Color } from 'three';
import { watch } from 'vue';
import { bindProp, setFromProp } from '../tools.js';

export default {
  props: {
    color: { type: String, default: '#ffffff' },
    intensity: { type: Number, default: 1 },
    castShadow: { type: Boolean, default: false },
    shadowMapSize: { type: Object, default: { x: 512, y: 512 } },
    position: Object,
  },
  // can't use setup because it will not be used in sub components
  // setup() {},
  unmounted() {
    this.$parent.remove(this.light);
    if (this.light.target) this.$parent.remove(this.light.target);
  },
  methods: {
    initLight() {
      bindProp(this, 'position', this.light.position);

      if (this.light.target) {
        bindProp(this, 'target', this.light.target.position);
      }

      if (this.light.shadow) {
        this.light.castShadow = this.castShadow;
        setFromProp(this.light.shadow.mapSize, this.shadowMapSize);
      }

      ['color', 'intensity', 'castShadow'].forEach(p => {
        watch(() => this[p], () => {
          if (p === 'color') {
            this.light.color = new Color(this.color);
          } else {
            this.light[p] = this[p];
          }
        });
      });

      this.$parent.add(this.light);
      if (this.light.target) this.$parent.add(this.light.target);
    },
  },
  render() {
    return [];
  },
  __hmrId: 'Light',
};
