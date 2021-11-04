<template>
  <Renderer
    ref="renderer"
    antialias
    :orbit-ctrl="{ enableDamping: true }"
    resize="window"
  >
    <Camera :position="{ z: 10 }" />
    <Scene background="#fff">
      <PointLight :position="{ y: 50, z: 50 }" />
      <Box :size="1" ref="box" :rotation="{ y: Math.PI / 4, z: Math.PI / 4 }">
        <LambertMaterial />
      </Box>
      <GltfModel
        :position="{ x: 3, y: 0, z: 0 }"
        src="/models/gltf/animals_by_google_3d/scene.gltf"
        @load="onLoad"
      />
    </Scene>
  </Renderer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import * as THREE from "three";
import {
  Box,
  Camera,
  LambertMaterial,
  MeshPublicInterface,
  PointLight,
  Renderer,
  RendererPublicInterface,
  Scene,
  GltfModel,
} from "./export";

export default defineComponent({
  components: {
    Box,
    Camera,
    LambertMaterial,
    PointLight,
    Renderer,
    Scene,
    GltfModel,
  },
  data() {
    return {
      mixer: null,
      clock: null,
    };
  },
  mounted() {
    const renderer = this.$refs.renderer as RendererPublicInterface;
    const mesh = (this.$refs.box as MeshPublicInterface).mesh;
    if (renderer && mesh) {
      renderer.onBeforeRender(() => {
        mesh.rotation.x += 0.01;
      });
    }
  },
  methods: {
    onLoad(object) {
      this.mixer = new THREE.AnimationMixer(object);
      const action = this.mixer.clipAction(object.animations[0]);
      action.play();
      object.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      this.clock = new THREE.Clock();
      this.$refs.renderer.onBeforeRender(this.updateMixer);
    },
    updateMixer() {
      this.mixer.update(this.clock.getDelta());
    },
  },
});
</script>

<style>
body,
html {
  margin: 0;
}
canvas {
  display: block;
}
</style>
