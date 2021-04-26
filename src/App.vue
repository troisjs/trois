<template>
  <Renderer ref="renderer" antialias :pointer="{ resetOnEnd: true }" :orbit-ctrl="{ enableDamping: true }" resize="window">
    <Camera :position="{ z: 10 }" />
    <Scene>
      <PointLight :position="{ y: 50, z: 50 }" />
      <Box :size="1" ref="box" :rotation="{ y: Math.PI / 4, z: Math.PI / 4 }">
        <LambertMaterial />
      </Box>
    </Scene>
  </Renderer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Box from './meshes/Box'
import Camera from './core/PerspectiveCamera'
import LambertMaterial from './materials/LambertMaterial'
import { MeshInterface } from './meshes/Mesh'
import PointLight from './lights/PointLight'
import Renderer, { RendererInterface } from './core/Renderer'
import Scene from './core/Scene'

export default defineComponent({
  components: { Box, Camera, LambertMaterial, PointLight, Renderer, Scene },
  mounted() {
    const renderer = this.$refs.renderer as RendererInterface
    const mesh = (this.$refs.box as MeshInterface).mesh
    if (renderer && mesh) {
      renderer.onBeforeRender(() => {
        mesh.rotation.x += 0.01
      })
    }
  },
})
</script>

<style>
body, html {
  margin: 0;
}
canvas {
  display: block;
}
</style>
