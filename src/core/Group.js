import { Group } from 'three';
import { bindProp } from '../tools.js';

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
    if (!this.$parent) {
      console.error('Missing parent');
    } else if (!this.$parent.add || !this.$parent.remove) {

    }

    this.parent = this.group ? this.group : this.scene;

    this.group = new Group();
    bindProp(this, 'position', this.group.position);
    bindProp(this, 'rotation', this.group.rotation);
    bindProp(this, 'scale', this.group.scale);

    this.parent.add(this.group);
  },
  unmounted() {
    if (this.$parent) this.$parent.remove(this.group);
  },
  methods: {
    add(o) { this.group.add(o); },
    remove(o) { this.group.remove(o); },
  },
  render() {
    return this.$slots.default ? this.$slots.default() : [];
  },
  __hmrId: 'Group',
};
