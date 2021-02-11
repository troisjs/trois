<template>
  <Slider :images="images" />
</template>

<script>
import Slider from '../sliders/Slider2.vue';

export default {
  components: { Slider },
  data() {
    return {
      images: [
        { src: 'https://troisjs.github.io/trois/images/img10.jpg' },
        { src: 'https://troisjs.github.io/trois/images/img6.jpg' },
        { src: 'https://troisjs.github.io/trois/images/img7.jpg' },
        { src: 'https://troisjs.github.io/trois/images/img8.jpg' },
        { src: 'https://troisjs.github.io/trois/images/img2.jpg' },
      ],
    };
  },
};
</script>
