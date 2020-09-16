<template>
  <Renderer ref="renderer">
    <Camera :position="{ z: 100 }"></Camera>
    <LambertMaterial id="material"></LambertMaterial>
    <Scene>
      <PointLight :position="{ x: 0, y: 50, z: 50 }"></PointLight>
      <Box ref="box" :size="10" :rotation="{ y: Math.PI / 4, z: Math.PI / 4 }" material="material"></Box>
    </Scene>
  </Renderer>
</template>

<script>
import {
  Renderer, Camera, Scene,
  LambertMaterial,
  PointLight,
  Box,
} from '../index.js';

export default {
  components: {
    Renderer, Camera, Scene,
    LambertMaterial,
    PointLight,
    Box,
  },
  mounted() {
    const renderer = this.$refs.renderer;
    const box = this.$refs.box.mesh;

    renderer.onBeforeRender(() => {
      box.rotation.x += 0.01;
    });
  },
};
</script>
