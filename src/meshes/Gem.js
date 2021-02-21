import {
  BackSide,
  CubeCamera,
  FrontSide,
  LinearMipmapLinearFilter,
  Mesh as TMesh,
  RGBFormat,
  WebGLCubeRenderTarget,
} from 'three';
// import { watch } from 'vue';
import Mesh from '../meshes/Mesh.js';
import useBindProp from '../use/useBindProp.js';

export default {
  extends: Mesh,
  props: {
    cubeRTSize: { type: Number, default: 256 },
    cubeCameraNear: { type: Number, default: 0.1 },
    cubeCameraFar: { type: Number, default: 2000 },
    autoUpdate: Boolean,
  },
  mounted() {
    this.initGem();
    if (this.autoUpdate) this.three.onBeforeRender(this.updateCubeRT);
    else this.rendererComponent.onMounted(this.updateCubeRT);
  },
  unmounted() {
    this.three.offBeforeRender(this.updateCubeRT);
    if (this.meshBack) this.parent.remove(this.meshBack);
    if (this.materialBack) this.materialBack.dispose();
  },
  methods: {
    initGem() {
      const cubeRT = new WebGLCubeRenderTarget(this.cubeRTSize, { format: RGBFormat, generateMipmaps: true, minFilter: LinearMipmapLinearFilter });
      this.cubeCamera = new CubeCamera(this.cubeCameraNear, this.cubeCameraFar, cubeRT);
      useBindProp(this, 'position', this.cubeCamera.position);
      this.parent.add(this.cubeCamera);

      this.material.side = FrontSide;
      this.material.envMap = cubeRT.texture;
      this.material.envMapIntensity = 10;
      this.material.metalness = 0;
      this.material.roughness = 0;
      this.material.opacity = 0.75;
      this.material.transparent = true;
      this.material.premultipliedAlpha = true;
      this.material.needsUpdate = true;

      this.materialBack = this.material.clone();
      this.materialBack.side = BackSide;
      this.materialBack.envMapIntensity = 5;
      this.materialBack.metalness = 1;
      this.materialBack.roughness = 0;
      this.materialBack.opacity = 0.5;

      this.meshBack = new TMesh(this.geometry, this.materialBack);

      useBindProp(this, 'position', this.meshBack.position);
      useBindProp(this, 'rotation', this.meshBack.rotation);
      useBindProp(this, 'scale', this.meshBack.scale);
      this.parent.add(this.meshBack);
    },
    updateCubeRT() {
      this.mesh.visible = false;
      this.meshBack.visible = false;
      this.cubeCamera.update(this.three.renderer, this.scene);
      this.mesh.visible = true;
      this.meshBack.visible = true;
    },
  },
  __hmrId: 'Gem',
};
