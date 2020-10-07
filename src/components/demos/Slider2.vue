<template>
  <Slider2 :images="images" />
</template>

<script>
import Slider2 from '../sliders/Slider2.vue';

export default {
  components: { Slider2 },
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
