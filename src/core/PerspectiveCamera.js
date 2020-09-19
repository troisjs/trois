import { PerspectiveCamera, Vector3 } from 'three';
import { toRef, watch } from 'vue';
import useBindProp from '../use/useBindProp.js';

export default {
  inject: ['three'],
  props: {
    aspect: {
      type: Number,
      default: 1,
    },
    far: {
      type: Number,
      default: 2000,
    },
    fov: {
      type: Number,
      default: 50,
    },
    near: {
      type: Number,
      default: 0.1,
    },
    position: {
      type: [Object, Vector3],
      default: { x: 0, y: 0, z: 0 },
    },
  },
  created() {
    this.camera = new PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
    useBindProp(this, 'position', this.camera.position);

    ['aspect', 'far', 'fov', 'near'].forEach(p => {
      watch(() => this[p], () => {
        this.camera[p] = this[p];
        this.camera.updateProjectionMatrix();
      });
    });

    this.three.camera = this.camera;
  },
  render() {
    return [];
  },
  __hmrId: 'PerspectiveCamera',
};
