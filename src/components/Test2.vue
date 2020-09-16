<template>
  <Renderer ref="renderer" :shadow="true" mouse-move="body" :mouse-raycast="true">
    <Camera :position="{ z: 200 }"></Camera>

    <!-- Not possible to use the same material for Mesh and InstancedMesh -->
    <PhongMaterial id="material1" color="#ffffff"></PhongMaterial>
    <PhongMaterial id="material2" color="#ffffff"></PhongMaterial>

    <Scene id="scene1">
      <PointLight ref="light" :intensity="0.5" :position="{ z: 200 }" :cast-shadow="true" :shadow-map-size="{ width: 2048, height: 2048 }"></PointLight>
      <Plane ref="plane" material="material1" :receive-shadow="true"></Plane>
      <InstancedMesh ref="imesh" material="material2" :count="500" :cast-shadow="true" :receive-shadow="true">
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
  Plane, InstancedMesh, BoxGeometry,
} from '../index.js';

import { lerp } from '../tools.js';

export default {
  components: {
    Renderer, Camera, Scene,
    PointLight,
    PhongMaterial,
    Plane, InstancedMesh, BoxGeometry,
  },
  mounted() {
    this.renderer = this.$refs.renderer;
    this.three = this.renderer.three;
    this.init();
  },
  methods: {
    init() {
      this.updatePlaneSize();
      this.renderer.onAfterResize(this.updatePlaneSize);

      // init instanced mesh matrix
      const { randFloat: rnd, randFloatSpread: rndFS } = MathUtils;
      const imesh = this.$refs.imesh.mesh;
      const dummy = new Object3D();
      for (let i = 0; i < 500; i++) {
        dummy.position.set(rndFS(200), rndFS(200), rnd(10, 50));
        dummy.rotation.set(rndFS(1), rndFS(1), rndFS(1));
        // const scale = rnd(0.2, 1);
        // dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        imesh.setMatrixAt(i, dummy.matrix);
      }
      imesh.instanceMatrix.needsUpdate = true;

      // light move
      const light = this.$refs.light.light;
      this.renderer.onBeforeRender(() => {
        const pos = this.three.mouseV3;
        // light.position.x = pos.x;
        // light.position.y = pos.y;
        light.position.x = lerp(light.position.x, pos.x, 0.05);
        light.position.y = lerp(light.position.y, pos.y, 0.05);
      });

      // const light = this.$refs.light.light;
      // this.renderer.onBeforeRender(() => {
      //   const t = Date.now() * 0.0001;
      //   const c1 = Math.cos(t), c2 = c1 * Math.sin(t * 1.4);
      //   light.position.set(c1 * 100, c2 * 100, 150);
      // });
    },
    updatePlaneSize() {
      const plane = this.$refs.plane.mesh;
      plane.scale.x = this.three.size.wWidth;
      plane.scale.y = this.three.size.wHeight;
    },
  },
};
</script>
