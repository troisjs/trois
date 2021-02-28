<template>
  <Renderer ref="renderer" mouse-over click>
    <Camera :position="{ z: 10 }" />
    <Scene>
      <PointLight :position="{ y: 50, z: 50 }" />
      <Box ref="box" @hover="boxHover" @click="boxClick" :size="1" :rotation="{ y: Math.PI / 4, z: Math.PI / 4 }">
        <LambertMaterial :color="boxColor" />
      </Box>
    </Scene>
  </Renderer>
</template>

<script>
export default {
  data() {
    return {
      boxColor: '#ffffff',
    };
  },
  mounted() {
    const renderer = this.$refs.renderer;
    const box = this.$refs.box.mesh;
    renderer.onBeforeRender(() => {
      box.rotation.x += 0.01;
    });
  },
  methods: {
    boxHover({ over }) {
      if (over) this.boxColor = '#ff0000';
      else this.boxColor = '#ffffff';
    },
    boxClick() {
      console.log('click');
    },
  },
};
</script>

<style lang="scss">
body {
  margin: 0;
}

body, html, #app, .app { height: 100%; }

.app {
  canvas {
    display: block;
  }
}
</style>
