<template>
  <Renderer ref="renderer" :orbit-ctrl="{ enableDamping: true, dampingFactor: 0.05 }">
    <Camera :position="{ x: -0, y: -120, z: 30 }" />
    <Scene background="#ffffff">
      <PointLight ref="light1" color="#0E09DC" :intensity="0.85" :position="{ x: 0, y: 0, z: 50 }" />
      <PointLight ref="light2" color="#1CD1E1" :intensity="0.85" :position="{ x: 0, y: 0, z: 50 }" />
      <PointLight ref="light3" color="#18C02C" :intensity="0.85" :position="{ x: 0, y: 0, z: 50 }" />
      <PointLight ref="light4" color="#ee3bcf" :intensity="0.85" :position="{ x: 0, y: 0, z: 50 }" />

      <!-- <NoisyText
        text="TroisJS"
        font-src="helvetiker_regular.typeface.json"
        align="center"
        :size="10"
        :height="2"
        :noise-coef="0.03"
        :z-coef="5"
        :position="{ x: 0, y: 0, z: 30 }"
        :rotation="{ x: Math.PI / 2, y: 0, z: 0 }"
      >
        <PhysicalMaterial />
      </NoisyText> -->

      <NoisyPlane
        :width="200" :width-segments="200"
        :height="200" :height-segments="200"
        :time-coef="0.0003"
        :noise-coef="0.03"
        :z-coef="7"
        :position="{ x: 0, y: 0, z: 0 }"
      >
        <PhysicalMaterial flat-shading />
      </NoisyPlane>

      <!-- <NoisySphere
        :radius="10"
        :time-coef="0.0003"
        :noise-coef="0.07"
        :disp-coef="2"
        :position="{ x: 0, y: 0, z: 30 }"
      >
        <PhysicalMaterial flat-shading />
      </NoisySphere> -->

      <MirrorMesh ref="mesh1" :position="{ x: -30, y: -15, z: 20 }" auto-update>
        <DodecahedronGeometry :radius="8" />
        <StandardMaterial color="#ffffff" :metalness="1" :roughness="0" />
      </MirrorMesh>

      <RefractionMesh ref="mesh2" :position="{ x: 0, y: -15, z: 20 }" auto-update>
        <TorusGeometry :radius="8" :tube="3" />
        <StandardMaterial color="#ffffff" :metalness="1" :roughness="0" />
      </RefractionMesh>

      <Gem ref="mesh3" :position="{ x: 30, y: -15, z: 20 }" auto-update>
        <DodecahedronGeometry :radius="8" />
        <StandardMaterial color="#0000ff" :metalness="1" :roughness="0" />
      </Gem>

    </Scene>
  </Renderer>
</template>

<script>
import NoisyPlane from '../noisy/NoisyPlane.js';
import NoisySphere from '../noisy/NoisySphere.js';
import NoisyText from '../noisy/NoisyText.js';

export default {
  components: { NoisyPlane, NoisySphere, NoisyText },
  mounted() {
    const renderer = this.$refs.renderer;
    const light1 = this.$refs.light1.light;
    const light2 = this.$refs.light2.light;
    const light3 = this.$refs.light3.light;
    const light4 = this.$refs.light4.light;
    const mesh1 = this.$refs.mesh1.mesh;
    const mesh2 = this.$refs.mesh2.mesh;
    const mesh3 = this.$refs.mesh3.mesh;
    const mesh4 = this.$refs.mesh3.meshBack;

    renderer.onBeforeRender(() => {
      const time = Date.now() * 0.001;
      const d = 100;
      light1.position.x = Math.sin(time * 0.1) * d;
      light1.position.y = Math.cos(time * 0.2) * d;
      light2.position.x = Math.cos(time * 0.3) * d;
      light2.position.y = Math.sin(time * 0.4) * d;
      light3.position.x = Math.sin(time * 0.5) * d;
      light3.position.y = Math.sin(time * 0.6) * d;
      light4.position.x = Math.sin(time * 0.7) * d;
      light4.position.y = Math.cos(time * 0.8) * d;
      mesh1.rotation.x += 0.015; mesh1.rotation.y += 0.008;
      mesh2.rotation.x += 0.02; mesh2.rotation.y += 0.01;
      mesh3.rotation.x += 0.007; mesh3.rotation.y += 0.013;
      mesh4.rotation.x = mesh3.rotation.x; mesh4.rotation.y = mesh3.rotation.y;
    });
  },
};
</script>
