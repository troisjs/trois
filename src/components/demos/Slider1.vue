<template>
  <Slider1 :images="images" />
</template>

<script>
import Slider1 from '../sliders/Slider1.vue';

export default {
  components: { Slider1 },
  data() {
    return {
      images: [
        { src: 'https://troisjs.github.io/trois/images/img1.jpg' },
        { src: 'https://troisjs.github.io/trois/images/img2.jpg' },
        { src: 'https://troisjs.github.io/trois/images/img3.jpg' },
        { src: 'https://troisjs.github.io/trois/images/img4.jpg' },
      ],
    };
  },
};
</script>
