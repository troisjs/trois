import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import Object3D from '../core/Object3D.js';

export default {
  extends: Object3D,
  emits: ['loaded'],
  props: {
    src: String,
  },
  created() {
    const loader = new FBXLoader();
    loader.load(this.src, (fbx) => {
      this.$emit('loaded', fbx);
      this.initObject3D(fbx);
    });
  },
};
