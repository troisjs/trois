<template>
  <Slider :images="images" />
</template>

<script>
import Slider from '../sliders/Slider1.vue';

export default {
  components: { Slider },
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
