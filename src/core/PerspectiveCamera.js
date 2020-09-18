import { PerspectiveCamera, Vector3 } from 'three';
import { setFromProp } from '../tools.js';

export default {
  inject: ['three'],
  props: {
    fov: {
      type: Number,
      default: 50,
    },
    position: {
      type: [Object, Vector3],
      default: { x: 0, y: 0, z: 0 },
    },
  },
  watch: {
    fov() {
      this.camera.fov = this.fov;
    },
    position: {
      deep: true,
      handler() {
        setFromProp(this.camera.position, this.position);
      },
    },
  },
  created() {
    this.camera = new PerspectiveCamera(this.fov);
    setFromProp(this.camera.position, this.position);
    this.three.camera = this.camera;
  },
  render() {
    return [];
  },
};
