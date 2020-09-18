<template>
  <Renderer ref="renderer" :orbit-ctrl="{ enableDamping: true, dampingFactor: 0.05 }">
    <Camera :position="{ z: 200 }"></Camera>
    <BasicMaterial id="material"></BasicMaterial>
    <Scene>
      <Text
        text="TEST"
        font-src="helvetiker_regular.typeface.json"
        material="material"
        align="center"
      ></Text>
    </Scene>
  </Renderer>
</template>

<script>
export default {};
</script>
