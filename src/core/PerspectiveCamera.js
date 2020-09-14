import { PerspectiveCamera } from 'three';
import { setFromProp } from '../tools.js';

export default {
  inject: ['three'],
  props: {
    fov: {
      type: Number,
      default: 50,
    },
    position: Object,
  },
  created() {
    const camera = new PerspectiveCamera(this.fov);
    setFromProp(camera.position, this.position);
    this.three.camera = camera;
  },
  render() {
    return [];
  },
};
