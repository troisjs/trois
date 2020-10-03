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
  },
  mounted() {
    this.initMirrorMesh();
    this.three.onBeforeRender(this.upateCubeRT);
  },
  unmounted() {
    this.three.offBeforeRender(this.upateCubeRT);
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
    upateCubeRT() {
      this.mesh.visible = false;
      this.cubeCamera.update(this.three.renderer, this.scene);
      this.mesh.visible = true;
      console.log('upateCubeRT');
    },
  },
  __hmrId: 'MirrorMesh',
};
