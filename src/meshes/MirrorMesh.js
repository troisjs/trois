import {
  CubeCamera,
  LinearMipmapLinearFilter,
  RGBFormat,
  WebGLCubeRenderTarget,
} from 'three';
// import { watch } from 'vue';
import Mesh from './Mesh.js';
import useBindProp from '../use/useBindProp.js';

export default {
  extends: Mesh,
  props: {
    cubeRTSize: { type: Number, default: 512 },
    cubeCameraNear: { type: Number, default: 0.1 },
    cubeCameraFar: { type: Number, default: 2000 },
    cubeRTAutoUpdate: Boolean,
  },
  mounted() {
    this.initMirrorMesh();
    if (this.cubeRTAutoUpdate) this.three.onBeforeRender(this.updateCubeRT);
    else this.rendererComponent.onMounted(this.updateCubeRT);
  },
  unmounted() {
    this.three.offBeforeRender(this.updateCubeRT);
  },
  methods: {
    initMirrorMesh() {
      const cubeRT = new WebGLCubeRenderTarget(this.cubeRTSize, { format: RGBFormat, generateMipmaps: true, minFilter: LinearMipmapLinearFilter });
      this.cubeCamera = new CubeCamera(this.cubeCameraNear, this.cubeCameraFar, cubeRT);
      useBindProp(this, 'position', this.cubeCamera.position);
      this.scene.add(this.cubeCamera);

      this.material.envMap = cubeRT.texture;
      this.material.needsUpdate = true;
    },
    updateCubeRT() {
      this.mesh.visible = false;
      this.cubeCamera.update(this.three.renderer, this.scene);
      this.mesh.visible = true;
    },
  },
  __hmrId: 'MirrorMesh',
};
