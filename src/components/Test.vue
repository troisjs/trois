<template>
  <Renderer ref="renderer"> <!-- :orbit-ctrl="{ enableDamping: true, dampingFactor: 0.05 }"> -->
    <PerspectiveCamera :position="{ z: 100 }"></PerspectiveCamera>

    <PhongMaterial id="material1" color="#ff0000"></PhongMaterial>
    <LambertMaterial id="material2" color="#0000ff"></LambertMaterial>

    <Scene id="scene1">
      <PointLight :position="{ x: 0, y: 50, z: 50 }"></PointLight>
      <!-- <Box ref="box" :size="10" :rotation="{ y: Math.PI / 4 }" material="material1"></Box>
      <Sphere ref="sphere" :radius="10" :position="{ x: 50 }" material="material2"></Sphere> -->
      <InstancedMesh ref="iMesh" material="material2" :count="1000">
        <BoxGeometry :size="2"></BoxGeometry>
      </InstancedMesh>
    </Scene>
  </Renderer>
</template>

<script>
import { Object3D, MathUtils } from 'three';

import {
  Renderer, PerspectiveCamera, Scene,
  PointLight,
  Box, Sphere,
  LambertMaterial, PhongMaterial,
  InstancedMesh, BoxGeometry,
} from '../index.js';

export default {
  components: {
    Renderer, PerspectiveCamera, Scene,
    PointLight,
    Box, Sphere,
    LambertMaterial, PhongMaterial,
    InstancedMesh, BoxGeometry,
  },
  mounted() {
    const renderer = this.$refs.renderer;
    // const box = this.$refs.box.mesh;

    const { randFloat: rnd, randFloatSpread: rndFS } = MathUtils;
    const iMesh = this.$refs.iMesh.mesh;
    const dummy = new Object3D();
    for (let i = 0; i < 1000; i++) {
      dummy.position.set(rndFS(100), rndFS(100), rndFS(100));
      dummy.rotation.set(rndFS(1), rndFS(1), rndFS(1));
      // dummy.scale.set(rnd(0.1, 1), rnd(0.1, 1), rnd(0.1, 1));
      dummy.updateMatrix();
      iMesh.setMatrixAt(i, dummy.matrix);
    }
    iMesh.instanceMatrix.needsUpdate = true;

    renderer.onBeforeRender(() => {
      // box.rotation.x += 0.01;
    });
  },
};
</script>
