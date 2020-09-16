import { FrontSide } from 'three';

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
      default: false,
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
  },
  unmounted() {
    this.material.dispose();
  },
  methods: {
    propsValues() {
      const props = {};
      for (const [key, value] of Object.entries(this.$props)) {
        if (key !== 'id') props[key] = value;
      }
      return props;
    },
  },
  render() {
    return [];
  },
};
