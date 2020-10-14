<template>
  <Renderer ref="renderer" antialias orbit-ctrl>
    <Camera :position="{ z: 10 }" />
    <Scene background="#000000" >
      <AmbientLight :intensity="0.5" />
      <PointLight :position="{ y: 50, z: 0 }" />
      <PointLight color="#ff6000" :intensity="0.75" :position="{ y: -50, z: 0 }" />
      <Sphere ref="mesh" :radius="2.5" :width-segments="200" :height-segments="200" >
        <StandardMaterial :displacement-scale="0.2">
          <Texture src="https://troisjs.github.io/trois/textures/Wood_Tiles_002_basecolor.jpg" />
          <Texture src="https://troisjs.github.io/trois/textures/Wood_Tiles_002_height.png" id="displacementMap" />
          <Texture src="https://troisjs.github.io/trois/textures/Wood_Tiles_002_normal.jpg" id="normalMap" />
          <Texture src="https://troisjs.github.io/trois/textures/Wood_Tiles_002_roughness.jpg" id="roughnessMap" />
          <Texture src="https://troisjs.github.io/trois/textures/Wood_Tiles_002_ambientOcclusion.jpg" id="aoMap" />
        </StandardMaterial>
      </Sphere>
    </Scene>
  </Renderer>
</template>

<script>
// textures from https://3dtextures.me/2019/04/26/wood-tiles-002/
export default {
  mounted() {
    const renderer = this.$refs.renderer;
    const mesh = this.$refs.mesh.mesh;
    renderer.onBeforeRender(() => {
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.011;
    });
  },
};
</script>
