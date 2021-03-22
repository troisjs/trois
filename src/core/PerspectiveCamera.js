import { PerspectiveCamera } from 'three';
import { watch } from 'vue';
import { bindProp } from '../tools.js';
import Camera from './Camera.js';

export default {
  extends: Camera,
  name: 'PerspectiveCamera',
  inject: ['three'],
  props: {
    aspect: { type: Number, default: 1 },
    far: { type: Number, default: 2000 },
    fov: { type: Number, default: 50 },
    near: { type: Number, default: 0.1 },
    position: { type: Object, default: { x: 0, y: 0, z: 0 } },
    lookAt: { type: Object, default: null },
  },
  created() {
    this.camera = new PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
    bindProp(this, 'position', this.camera);

    if (this.lookAt) this.camera.lookAt(this.lookAt.x, this.lookAt.y, this.lookAt.z);
    watch(() => this.lookAt, (v) => { this.camera.lookAt(v.x, v.y, v.z); }, { deep: true });

    ['aspect', 'far', 'fov', 'near'].forEach(p => {
      watch(() => this[p], () => {
        this.camera[p] = this[p];
        this.camera.updateProjectionMatrix();
      });
    });

    this.three.camera = this.camera;
  },
  __hmrId: 'PerspectiveCamera',
};
