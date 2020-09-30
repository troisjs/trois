<template>
  <Renderer ref="renderer" :orbit-ctrl="{ enableDamping: true, dampingFactor: 0.05 }">
    <Camera :position="{ x: 0, y: 0, z: 100 }" />
    <Scene background="#000000">
      <NoisyImage
        src="https://assets.codepen.io/33787/img2.jpg"
        :width="800"
        :time-coef="0.001"
        :noise-coef="2"
        :z-coef="5"
        :disp-coef="0.015"
        :rotation="{ x: -Math.PI / 6 }"
      />
    </Scene>
  </Renderer>
</template>

<script>
import NoisyImage from '../noisy/NoisyImage.js';

export default {
  components: { NoisyImage },
};
</script>
