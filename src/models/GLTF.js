import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Object3D from '../core/Object3D.js';

export default {
  extends: Object3D,
  emits: ['loaded'],
  props: {
    src: String,
  },
  created() {
    const loader = new GLTFLoader();
    loader.load(this.src, (gltf) => {
      this.$emit('loaded', gltf);
      this.initObject3D(gltf.scene);
    });
  },
};
