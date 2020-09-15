<template>
  <Renderer ref="renderer" :orbit-ctrl="{ enableDamping: true, dampingFactor: 0.05 }">
    <Camera ref="camera" :position="cameraPosition"></Camera>
    <Scene>
      <slot></slot>
    </Scene>
  </Renderer>
</template>

<script>
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Renderer, Camera, Scene } from '../../index.js';
import { setFromProp } from '../../tools.js';

export default {
  components: { Renderer, Camera, Scene },
  props: {
    src: String,
    cameraPosition: Object,
  },
  mounted() {
    this.renderer = this.$refs.renderer;

    setFromProp(this.$refs.camera.position, this.cameraPosition);

    const loader = new GLTFLoader();
    loader.load(this.src, (gltf) => {
      this.renderer.three.scene.add(gltf.scene);
    });
  },
};
</script>
