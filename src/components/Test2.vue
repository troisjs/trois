<template>
  <Renderer ref="renderer" :orbit-ctrl="{ enableDamping: true, dampingFactor: 0.05 }">
    <PerspectiveCamera :position="{ z: 100 }"></PerspectiveCamera>

    <PhongMaterial id="material" color="#ff0000"></PhongMaterial>

    <Scene id="scene1">
      <PointLight :position="{ x: 0, y: 50, z: 50 }"></PointLight>
      <InstancedMesh ref="imesh" material="material" :count="1000">
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
  PhongMaterial,
  InstancedMesh, BoxGeometry,
} from '../index.js';

export default {
  components: {
    Renderer, PerspectiveCamera, Scene,
    PointLight,
    PhongMaterial,
    InstancedMesh, BoxGeometry,
  },
  mounted() {
    const renderer = this.$refs.renderer;

    const { randFloat: rnd, randFloatSpread: rndFS } = MathUtils;
    const imesh = this.$refs.imesh.mesh;
    const dummy = new Object3D();
    for (let i = 0; i < 1000; i++) {
      dummy.position.set(rndFS(100), rndFS(100), rndFS(100));
      dummy.rotation.set(rndFS(1), rndFS(1), rndFS(1));
      // dummy.scale.set(rnd(0.1, 1), rnd(0.1, 1), rnd(0.1, 1));
      dummy.updateMatrix();
      imesh.setMatrixAt(i, dummy.matrix);
    }
    imesh.instanceMatrix.needsUpdate = true;

    renderer.onBeforeRender(() => {
    });
  },
};
</script>
