<template>
  <Renderer ref="renderer" :orbit-ctrl="{ enableDamping: true, dampingFactor: 0.05 }" :shadow="true">
    <Camera :position="{ z: 100 }"></Camera>
    <PhongMaterial id="material" color="#ffffff"></PhongMaterial>
    <Scene id="scene1" background="#000000">
      <SpotLight color="#ffffff" :intensity="0.5" :position="{ y: 150, z: 0 }" :cast-shadow="true" :shadow-map-size="{ width: 1024, height: 1024 }"></SpotLight>
      <SpotLight color="#ff0000" :intensity="0.5" :position="{ y: -150, z: 0 }" :cast-shadow="true" :shadow-map-size="{ width: 1024, height: 1024 }"></SpotLight>
      <InstancedMesh ref="imesh" material="material" :count="NUM_INSTANCES" :cast-shadow="true" :receive-shadow="true">
        <SphereGeometry :radius="5"></SphereGeometry>
      </InstancedMesh>
    </Scene>
    <EffectComposer>
      <RenderPass></RenderPass>
      <UnrealBloomPass :strength="1"></UnrealBloomPass>
    </EffectComposer>
  </Renderer>
</template>

<script>
import { Object3D, MathUtils } from 'three';

import {
  Renderer, Camera, Scene, SpotLight,
  PhongMaterial, InstancedMesh, SphereGeometry,
  EffectComposer, RenderPass, UnrealBloomPass,
} from '../index.js';

export default {
  components: {
    Renderer, Camera, Scene, SpotLight,
    PhongMaterial, InstancedMesh, SphereGeometry,
    EffectComposer, RenderPass, UnrealBloomPass,
  },
  setup() {
    return {
      NUM_INSTANCES: 500,
    };
  },
  mounted() {
    // init instanced mesh matrix
    const imesh = this.$refs.imesh.mesh;
    const dummy = new Object3D();
    const { randFloat: rnd, randFloatSpread: rndFS } = MathUtils;
    for (let i = 0; i < this.NUM_INSTANCES; i++) {
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
