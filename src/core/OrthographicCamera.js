import { OrthographicCamera, Vector3 } from 'three';
import { watch } from 'vue';
import useBindProp from '../use/useBindProp.js';

export default {
  inject: ['three'],
  props: {
    left: { type: Number, default: -1 },
    right: { type: Number, default: 1 },
    top: { type: Number, default: 1 },
    bottom: { type: Number, default: -1 },
    near: { type: Number, default: 0.1 },
    far: { type: Number, default: 2000 },
    zoom: { type: Number, default: 1 },
    position: { type: [Object, Vector3], default: { x: 0, y: 0, z: 0 } },
  },
  created() {
    this.camera = new OrthographicCamera(this.left, this.right, this.top, this.bottom, this.near, this.far);
    useBindProp(this, 'position', this.camera.position);

    ['left', 'right', 'top', 'bottom', 'near', 'far', 'zoom'].forEach(p => {
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
  __hmrId: 'OrthographicCamera',
};
