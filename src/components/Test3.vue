<template>
  <Renderer ref="renderer" :orbit-ctrl="{ enableDamping: true, dampingFactor: 0.05 }">
    <Camera :position="{ z: 100 }"></Camera>
    <PhongMaterial id="material" color="#ffffff"></PhongMaterial>
    <Scene id="scene1" background="#ffffff">
      <!-- <SpotLight color="#ffffff" :intensity="0.5" :position="{ y: 50, z: 50 }"></SpotLight> -->
      <!-- <SpotLight color="#ff0000" :intensity="0.5" :position="{ y: -50, z: 50 }"></SpotLight> -->
      <PointLight color="#ffffff" :intensity="0.5" :position="{ y: 50, z: 50 }"></PointLight>
      <PointLight color="#ff0000" :intensity="0.5" :position="{ y: -50, z: 50 }"></PointLight>
      <InstancedMesh ref="imesh" material="material" :count="1000">
        <SphereGeometry :radius="2"></SphereGeometry>
      </InstancedMesh>
    </Scene>
  </Renderer>
</template>

<script>
import { Object3D, MathUtils } from 'three';

import {
  Renderer, Camera, Scene,
  PointLight, SpotLight,
  PhongMaterial,
  InstancedMesh, SphereGeometry,
} from '../index.js';

export default {
  components: {
    Renderer, Camera, Scene,
    PointLight, SpotLight,
    PhongMaterial,
    InstancedMesh, SphereGeometry,
  },
  mounted() {
    // init instanced mesh matrix
    const imesh = this.$refs.imesh.mesh;
    const dummy = new Object3D();
    const { randFloat: rnd, randFloatSpread: rndFS } = MathUtils;
    for (let i = 0; i < 1000; i++) {
      dummy.position.set(rndFS(100), rndFS(100), rndFS(100));
      const scale = rnd(0.2, 1);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      imesh.setMatrixAt(i, dummy.matrix);
    }
    imesh.instanceMatrix.needsUpdate = true;
  },
};
</script>
