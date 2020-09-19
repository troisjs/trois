<template>
  <Renderer
    ref="renderer"
    :orbit-ctrl="{ enableDamping: true, dampingFactor: 0.05 }"
    mouse-move="body"
    :mouse-raycast="true"
    @click="updateColors"
  >
    <Camera :fov="50" :position="{ z: 200 }"></Camera>
    <SubSurfaceMaterial id="material" thicknessColor="#808080" :vertex-colors="true"></SubSurfaceMaterial>
    <Scene id="scene1" background="#000000">
      <!-- <AmbientLight color="#111111"></AmbientLight> -->
      <!-- <PointLight color="#ff0000" :intensity="0.25" :position="{ z: -200 }"></PointLight> -->
      <PointLight ref="light" color="#FFC0C0" :intensity="1"></PointLight>
      <InstancedMesh ref="imesh" material-id="material" :count="NUM_INSTANCES">
        <SphereGeometry :radius="5"></SphereGeometry>
      </InstancedMesh>
    </Scene>
    <EffectComposer>
      <RenderPass></RenderPass>
      <UnrealBloomPass :strength="0.75"></UnrealBloomPass>
    </EffectComposer>
  </Renderer>
</template>

<script>
import chroma from 'chroma-js';
import { Color, MathUtils, InstancedBufferAttribute, Object3D, Vector3 } from 'three';

const {
  randFloat: rnd,
  randFloatSpread: rndFS,
} = MathUtils;

export default {
  setup() {
    const NUM_INSTANCES = 2000;
    const instances = [];
    const target = new Vector3();
    const dummy = new Object3D();

    for (let i = 0; i < NUM_INSTANCES; i++) {
      instances.push({
        position: new Vector3(rndFS(200), rndFS(200), rndFS(200)),
        scale: rnd(0.2, 1),
        velocity: new Vector3(rndFS(2), rndFS(2), rndFS(2)),
        attraction: 0.02 + rnd(-0.01, 0.01),
        vlimit: 1 + rnd(-0.1, 0.1),
      });
    }

    return {
      NUM_INSTANCES,
      instances,
      target,
      dummy,
    };
  },
  mounted() {
    this.renderer = this.$refs.renderer;
    this.imesh = this.$refs.imesh.mesh;
    this.light = this.$refs.light.light;
    this.init();
  },
  methods: {
    init() {
      // init instanced mesh matrix
      for (let i = 0; i < this.NUM_INSTANCES; i++) {
        const { position, scale } = this.instances[i];
        this.dummy.position.copy(position);
        this.dummy.scale.set(scale, scale, scale);
        this.dummy.updateMatrix();
        this.imesh.setMatrixAt(i, this.dummy.matrix);
      }
      this.imesh.instanceMatrix.needsUpdate = true;

      // init instances colors
      this.updateColors();

      // animate
      this.renderer.onBeforeRender(this.animate);
    },
    updateColors() {
      const cscale = chroma.scale([chroma.random(), chroma.random()]);
      const colors = [];
      for (let i = 0; i < this.NUM_INSTANCES; i++) {
        // const color = new Color(rnd(0, 0xffffff));
        const color = new Color(cscale(rnd(0, 1)).hex());
        colors.push(color.r, color.g, color.b);
      }
      this.imesh.geometry.setAttribute('color', new InstancedBufferAttribute(new Float32Array(colors), 3));
    },
    animate() {
      this.target.copy(this.renderer.three.mouseV3);
      this.light.position.copy(this.target);

      const v = new Vector3();
      for (let i = 0; i < this.NUM_INSTANCES; i++) {
        const { position, scale, velocity, attraction, vlimit } = this.instances[i];

        v.copy(this.target).sub(position).normalize().multiplyScalar(attraction);
        velocity.add(v).clampScalar(-vlimit, vlimit);
        position.add(velocity);

        this.dummy.position.copy(position);
        this.dummy.scale.set(scale, scale, scale);
        this.dummy.updateMatrix();
        this.imesh.setMatrixAt(i, this.dummy.matrix);
      }
      this.imesh.instanceMatrix.needsUpdate = true;
    },
  },
};
</script>
