import { Group } from 'three';
import { inject } from 'vue';
import useBindProp from '../use/useBindProp.js';

export default {
  inject: ['three', 'scene'],
  props: {
    position: Object,
    rotation: Object,
    scale: Object,
  },
  setup(props) {
    const parent = inject('group', inject('scene'));
    const group = new Group();
    useBindProp(props, 'position', group.position);
    useBindProp(props, 'rotation', group.rotation);
    useBindProp(props, 'scale', group.scale);
    return { parent, group };
  },
  provide() {
    return {
      group: this.group,
    };
  },
  created() {
    this.parent.add(this.group);
  },
  unmounted() {
    this.parent.remove(this.group);
  },
  render() {
    if (this.$slots.default) {
      return this.$slots.default();
    }
    return [];
  },
  __hmrId: 'Group',
};
