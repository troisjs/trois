import { PerspectiveCamera, Vector3 } from 'three';

import { setFromProp } from '../tools.js';

export default {
  inject: ['three'],
  props: {
    fov: {
      type: Number,
      default: 50,
    },
    position: Object,
    // position: {
    //   type: Object,
    //   default: new Vector3(),
    // },
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
