<template>
  <Renderer ref="renderer" :orbit-ctrl="{ enableDamping: true, dampingFactor: 0.05 }">
    <PerspectiveCamera :position="{ z: 100 }"></PerspectiveCamera>

    <PhongMaterial id="material1" color="#ff0000"></PhongMaterial>
    <LambertMaterial id="material2" color="#0000ff"></LambertMaterial>

    <Scene id="scene1">
      <PointLight :position="{ x: 0, y: 50, z: 50 }"></PointLight>
      <Box ref="box" :size="10" :rotation="{ y: Math.PI / 4 }" material="material1"></Box>
      <Sphere ref="sphere" :radius="10" :position="{ x: 50 }" material="material2"></Sphere>
    </Scene>
  </Renderer>
</template>

<script>
import {
  Renderer, PerspectiveCamera, Scene,
  PointLight,
  Box, Sphere,
  LambertMaterial, PhongMaterial,
} from '../index.js';

export default {
  components: {
    Renderer, PerspectiveCamera, Scene,
    PointLight,
    Box, Sphere,
    LambertMaterial, PhongMaterial,
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
