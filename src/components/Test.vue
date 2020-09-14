<template>
  <Renderer ref="renderer">
    <PerspectiveCamera :position="{ z: 100 }"></PerspectiveCamera>

    <PhongMaterial name="mat1" color="#ff0000"></PhongMaterial>
    <LambertMaterial name="mat2" color="#0000ff"></LambertMaterial>

    <Scene>
      <PointLight :position="{ x: 0, y: 50, z: 50 }"></PointLight>
      <Box ref="box" :size="10" :rotation="{ x: 0.5, y: 0.25 }" material="mat1"></Box>
      <Sphere ref="sphere" :radius="10" :position="{ x: 50 }" material="mat2"></Sphere>
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
};
</script>
