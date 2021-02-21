import { Color } from 'three';
import { watch } from 'vue';
import { setFromProp } from '../tools.js';
import useBindProp from '../use/useBindProp.js';

export default {
  inject: ['scene', 'group'],
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
  mounted() {
    useBindProp(this, 'position', this.light.position);

    if (this.light.target) {
      useBindProp(this, 'target', this.light.target.position);
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

    if (this.group) {
      this.group.add(this.light);
      if (this.light.target) this.group.add(this.light.target);
    } else {
      this.scene.add(this.light);
      if (this.light.target) this.scene.add(this.light.target);
    }
  },
  unmounted() {
    if (this.group) this.group.remove(this.light)
    else this.scene.remove(this.light);
  },
  render() {
    return [];
  },
  __hmrId: 'Light',
};
