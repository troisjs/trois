import { defineComponent } from 'vue';
import { Group } from 'three';
import Object3D from './Object3D.js';

export default defineComponent({
  name: 'Group',
  extends: Object3D,
  created() {
    this.group = new Group();
    this.initObject3D(this.group);
  },
  __hmrId: 'Group',
});
