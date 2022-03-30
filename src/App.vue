<template>
    <YangArchvizComponent :gltfUrl='GLTFTest'/>

</template>

<script setup lang="ts">
import YangArchvizComponent from './components/archviz/YangArchvizComponent'
import GLTFTest from './assets/podium_hitbox_v3.gltf'

</script>

<style>
body, html {
  margin: 0;
}
canvas {
  display: block;
}
</style>
