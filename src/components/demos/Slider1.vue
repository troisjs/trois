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
        { src: 'https://assets.codepen.io/33787/img1.jpg' },
        { src: 'https://assets.codepen.io/33787/img2.jpg' },
        { src: 'https://assets.codepen.io/33787/img3.jpg' },
        { src: 'https://assets.codepen.io/33787/img4.jpg' },
      ],
    };
  },
  mounted() {
  },
};
</script>
