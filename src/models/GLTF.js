import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Object3D from '../core/Object3D.js';

export default {
  extends: Object3D,
  props: {
    src: String,
    cameraPosition: Object,
  },
  created() {
    const loader = new GLTFLoader();
    loader.load(this.src, (gltf) => {
      this.initObject3D(gltf.scene);
    });
  },
};
