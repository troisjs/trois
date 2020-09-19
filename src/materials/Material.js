import { watch } from 'vue';
import { Color, FrontSide } from 'three';

export default {
  inject: ['three'],
  props: {
    id: String,
    color: {
      type: [String, Number],
      default: '#ffffff',
    },
    depthTest: {
      type: Boolean,
      default: true,
    },
    depthWrite: {
      type: Boolean,
      default: true,
    },
    fog: {
      type: Boolean,
      default: true,
    },
    opacity: {
      type: Number,
      default: 1,
    },
    side: {
      type: Number,
      default: FrontSide,
    },
    transparent: {
      type: Boolean,
      default: false,
    },
    vertexColors: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.three.materials[this.id] = this.material;

    ['color', 'depthTest', 'depthWrite', 'fog', 'opacity', 'transparent'].forEach(p => {
      watch(() => this[p], () => {
        if (p === 'color') {
          this.material.color = new Color(this.color);
        } else {
          this.material[p] = this[p];
        }
      });
    });
  },
  unmounted() {
    this.material.dispose();
  },
  methods: {
    propsValues() {
      const props = {};
      Object.entries(this.$props).forEach(([key, value]) => {
        if (key !== 'id') props[key] = value;
      });
      return props;
    },
  },
  render() {
    return [];
  },
  __hmrId: 'Material',
};
