<template>
  <Renderer ref="renderer" :orbit-ctrl="{ enableDamping: true, dampingFactor: 0.05 }">
    <Camera :position="{ z: 250 }"></Camera>
    <BasicMaterial id="material"></BasicMaterial>
    <Scene>
      <Text
        ref="text"
        text="TroisJS"
        font-src="helvetiker_regular.typeface.json"
        material-id="material"
        align="center"
        @ready="anim"
      ></Text>
    </Scene>
  </Renderer>
</template>

<script>
export default {
  methods: {
    anim() {
      this.$refs.renderer.onBeforeRender(() => {
        this.$refs.text.mesh.rotation.x += 0.01;
      });
    },
  },
};
</script>
