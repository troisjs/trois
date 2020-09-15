<template>
  <GLTFViewer src="test.glb" :camera-position="{ z: 1 }">
    <AmbientLight></AmbientLight>
  </GLTFViewer>
</template>

<script>
import { AmbientLight } from '../index.js';
import GLTFViewer from './viewers/GLTFViewer.vue';

export default {
  components: { GLTFViewer, AmbientLight },
};
</script>
