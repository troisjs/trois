import { Group } from 'three';
import useBindProp from '../use/useBindProp.js';

export default {
  inject: {
    three: 'three',
    scene: 'scene',
    group: { default: null },
  },
  props: {
    position: Object,
    rotation: Object,
    scale: Object,
  },
  provide() {
    return {
      group: this.group,
    };
  },
  created() {
    this.parent = this.group ? this.group : this.scene;

    this.group = new Group();
    useBindProp(this, 'position', this.group.position);
    useBindProp(this, 'rotation', this.group.rotation);
    useBindProp(this, 'scale', this.group.scale);

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
