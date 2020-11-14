<template>
  <Renderer ref="renderer" :orbit-ctrl="{ enableDamping: true, dampingFactor: 0.05 }" shadow mouse-click>
    <Camera :position="{ z: 10 }" />
    <Scene>
      <AmbientLight :intensity="0.75"/>
      <DirectionalLight :intensity="0.25" :position="{ y: 200, z: 0, x: 150 }"/>
      <Box v-for="(obj, i) in boxes" :key="i" :position="{x: -4 + i*2}" @click="objClick($event, obj, i)">
        <PhysicalMaterial :color="obj ? '#0f0' : '#f00'"/>
      </Box>
      <Box @click="objClick($event, obj)" :position="{z: -2}" :scale="{x: 10, z: 0.1, y: 3}">
        <PhysicalMaterial color="#999"/>
      </Box>
      <Sphere v-if="point" :position="point" :scale="{ x: 0.1, y: 0.1, z: 0.1 }">
        <PhysicalMaterial color="orange"/>
      </Sphere>
    </Scene>
  </Renderer>
</template>

<script>
export default {
  data () {
    return {
      point:  null,
      boxes: [false, false, false, false, false]
    }
  },
  methods: {
    objClick (e, obj, i) {
      if (typeof i === 'number') this.boxes[i] = !this.boxes[i]
      this.point = e.point
    }
  }
}
</script>
