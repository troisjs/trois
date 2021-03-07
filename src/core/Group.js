import { Group } from 'three';
import Object3D from './Object3D.js';

export default {
  extends: Object3D,
  name: 'Group',
  created() {
    this.group = new Group();
    this.initObject3D(this.group);
  },
};
