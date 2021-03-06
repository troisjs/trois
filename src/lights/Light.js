import { Color } from 'three';
import { watch } from 'vue';
import { setFromProp } from '../tools.js';
import { bindProp } from '../tools.js';

export default {
  inject: {
    scene: 'scene',
    group: { default: null },
  },
  props: {
    color: {
      type: String,
      default: '#ffffff',
    },
    intensity: {
      type: Number,
      default: 1,
    },
    castShadow: {
      type: Boolean,
      default: false,
    },
    shadowMapSize: Object,
    position: Object,
  },
  // can't use setup because it will not be used in sub components
  // setup() {},
  created() {
    this.parent = this.group ? this.group : this.scene;
  },
  mounted() {
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

    this.parent.add(this.light);
    if (this.light.target) this.parent.add(this.light.target);
  },
  unmounted() {
    this.parent.remove(this.light);
    if (this.light.target) this.parent.remove(this.light.target);
  },
  render() {
    return [];
  },
  __hmrId: 'Light',
};
