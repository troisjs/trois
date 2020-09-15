<template>
  <Renderer ref="renderer" :shadow="true" :orbit-ctrl="{ enableDamping: true, dampingFactor: 0.05 }">
    <Camera :position="{ z: 100 }"></Camera>

    <PhongMaterial id="material" color="#ff0000"></PhongMaterial>

    <Scene id="scene1">
      <PointLight ref="light" :position="{ x: 0, y: 150, z: 150 }" :cast-shadow="true" :shadow-map-size="{ width: 1024, height: 1024 }"></PointLight>
      <InstancedMesh ref="imesh" material="material" :count="1000" :cast-shadow="true" :receive-shadow="true">
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

    const renderer = this.$refs.renderer;
    const light = this.$refs.light.light;
    renderer.onBeforeRender(() => {
      const t = Date.now() * 0.0001;
      const c1 = Math.cos(t), c2 = c1 * Math.sin(t * 1.4), c3 = c2 * Math.cos(t * 0.3);
      light.position.set(c1 * 100, c2 * 100, c3 * 100);
    });
  },
};
</script>
