import { Group } from 'three';
import { inject } from 'vue';

export default {
  inject: ['three'],
  setup(props) {
    const group = new Group();
    const parentGroup = inject('group') || undefined;
    if (parentGroup) parentGroup.add(group);
    else inject('scene').add(group);
    return { parentGroup, group };
  },
  provide(){
    return {
      group: this.group
    };
  },
  unmounted() {
    if (this.parentGroup) this.parentGroup.remove(this.group);
    else this.three.scene.remove(this.group);
  },
  render() {
    if (this.$slots.default) {
      return this.$slots.default();
    }
    return [];
  },
  __hmrId: 'Group',
};
