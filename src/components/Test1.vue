<template>
  <Renderer ref="renderer">
    <Camera :position="{ z: 100 }"></Camera>

    <LambertMaterial id="material" color="#0000ff"></LambertMaterial>

    <Scene>
      <PointLight :position="{ x: 0, y: 50, z: 50 }"></PointLight>
      <Box ref="box" :size="10" :rotation="{ y: Math.PI / 4, z: Math.PI / 4 }" material="material"></Box>
    </Scene>
  </Renderer>
</template>

<script>
import {
  Renderer, Camera, Scene,
  PointLight,
  Box,
  LambertMaterial,
} from '../index.js';

export default {
  components: {
    Renderer, Camera, Scene,
    PointLight,
    Box,
    LambertMaterial,
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
