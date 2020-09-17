<template>
  <Renderer ref="renderer" :orbit-ctrl="{ enableDamping: true, dampingFactor: 0.05 }" mouse-move="body" :mouse-raycast="true">
    <Camera :position="{ z: 200 }"></Camera>
    <StandardMaterial id="material" :transparent="true" :opacity="0.9" :metalness="0.8" :roughness="0.5"></StandardMaterial>
    <Scene id="scene1" background="#000000">
      <AmbientLight color="#808080"></AmbientLight>
      <PointLight color="#ff6000"></PointLight>
      <PointLight ref="light" color="#0060ff" :intensity="0.5"></PointLight>
      <InstancedMesh ref="imesh" material="material" :count="NUM_INSTANCES">
        <BoxGeometry :width="2" :height="2" :depth="10"></BoxGeometry>
      </InstancedMesh>
    </Scene>
    <EffectComposer>
      <RenderPass></RenderPass>
      <UnrealBloomPass :strength="1"></UnrealBloomPass>
    </EffectComposer>
  </Renderer>
</template>

<script>
import { Object3D, MathUtils, Vector3 } from 'three';

import {
  Renderer, Camera, Scene, AmbientLight, PointLight,
  StandardMaterial, InstancedMesh, BoxGeometry,
  EffectComposer, RenderPass, UnrealBloomPass,
} from '../index.js';

const {
  randFloat: rnd,
  randFloatSpread: rndFS,
} = MathUtils;

export default {
  components: {
    Renderer, Camera, Scene, AmbientLight, PointLight,
    StandardMaterial, InstancedMesh, BoxGeometry,
    EffectComposer, RenderPass, UnrealBloomPass,
  },
  setup() {
    const NUM_INSTANCES = 2000;
    const instances = [];
    const target = new Vector3();
    const dummyO = new Object3D();
    const dummyV = new Vector3();

    for (let i = 0; i < NUM_INSTANCES; i++) {
      instances.push({
        position: new Vector3(rndFS(200), rndFS(200), rndFS(200)),
        scale: rnd(0.2, 1),
        scaleZ: rnd(0.1, 1),
        velocity: new Vector3(rndFS(2), rndFS(2), rndFS(2)),
        attraction: 0.03 + rnd(-0.01, 0.01),
        vlimit: 1.2 + rnd(-0.1, 0.1),
      });
    }

    return {
      NUM_INSTANCES,
      instances,
      target,
      dummyO,
      dummyV,
    };
  },
  mounted() {
    this.renderer = this.$refs.renderer;
    this.imesh = this.$refs.imesh.mesh;
    this.light = this.$refs.light.light;
    this.init();
  },
  methods: {
    init() {
      // init instanced mesh matrix
      for (let i = 0; i < this.NUM_INSTANCES; i++) {
        const { position, scale, scaleZ } = this.instances[i];
        this.dummyO.position.copy(position);
        this.dummyO.scale.set(scale, scale, scaleZ);
        this.dummyO.updateMatrix();
        this.imesh.setMatrixAt(i, this.dummyO.matrix);
      }
      this.imesh.instanceMatrix.needsUpdate = true;

      // animate
      this.renderer.onBeforeRender(this.animate);
    },
    animate() {
      this.target.copy(this.renderer.three.mouseV3);
      this.light.position.copy(this.target);

      for (let i = 0; i < this.NUM_INSTANCES; i++) {
        const { position, scale, scaleZ, velocity, attraction, vlimit } = this.instances[i];

        this.dummyV.copy(this.target).sub(position).normalize().multiplyScalar(attraction);
        velocity.add(this.dummyV).clampScalar(-vlimit, vlimit);
        position.add(velocity);

        this.dummyO.position.copy(position);
        this.dummyO.scale.set(scale, scale, scaleZ);
        this.dummyO.lookAt(this.dummyV.copy(position).add(velocity));
        this.dummyO.updateMatrix();
        this.imesh.setMatrixAt(i, this.dummyO.matrix);
      }
      this.imesh.instanceMatrix.needsUpdate = true;
    },
  },
};
</script>
