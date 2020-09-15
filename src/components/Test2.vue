<template>
  <Renderer ref="renderer" :shadow="true" :orbit-ctrl="{ enableDamping: true, dampingFactor: 0.05 }">
    <Camera :position="{ z: 100 }"></Camera>

    <PhongMaterial id="material" color="#ff0000"></PhongMaterial>

    <Scene id="scene1">
      <PointLight :position="{ x: 0, y: 150, z: 150 }" :castShadow="true"></PointLight>
      <InstancedMesh ref="imesh" material="material" :count="1000" :castShadow="true" :receiveShadow="true">
        <BoxGeometry :size="5"></BoxGeometry>
      </InstancedMesh>
    </Scene>
  </Renderer>
</template>

<script>
import { Object3D, MathUtils } from 'three';

import {
  Renderer, Camera, Scene,
  PointLight,
  PhongMaterial,
  InstancedMesh, BoxGeometry,
} from '../index.js';

export default {
  components: {
    Renderer, Camera, Scene,
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
      const scale = rnd(0.2, 1);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      imesh.setMatrixAt(i, dummy.matrix);
    }
    imesh.instanceMatrix.needsUpdate = true;

    renderer.onBeforeRender(() => {
    });
  },
};
</script>
