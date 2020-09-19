import { DoubleSide, MeshBasicMaterial, PlaneBufferGeometry, TextureLoader } from 'three';
import Mesh from './Mesh.js';

export default {
  extends: Mesh,
  props: {
    src: String,
    width: {
      type: Number,
      default: 1,
    },
    height: {
      type: Number,
      default: 1,
    },
  },
  created() {
    this.geometry = new PlaneBufferGeometry(this.width, this.height, 1, 1);
    this.material = new MeshBasicMaterial({ map: new TextureLoader().load(this.src), side: DoubleSide });
  },
  unmounted() {
    // this material is not mounted, it won't be auto dispose
    this.material.dispose();
  },
};
