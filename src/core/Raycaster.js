import { watch } from 'vue';
import { bindProp } from '../tools.js';

export default {
  name: 'Raycaster',
  inject: ['three'],
  emits: ['created', 'ready'],
  props: {
  },
  // can't use setup because it will not be used in sub components
  // setup() {},
  mounted() {
    console.log('TODO: raycaster')
  },
  methods: {
  },
  render() {
    return this.$slots.default ? this.$slots.default() : [];
  },
  __hmrId: 'Raycaster',
};
