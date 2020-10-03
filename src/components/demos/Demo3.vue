<template>
  <Renderer ref="renderer" :auto-clear="false" :orbit-ctrl="{ enableDamping: true, dampingFactor: 0.05 }" mouse-move="body" :mouse-raycast="true">
    <Camera :position="{ z: 200 }" />
    <Scene>
      <AmbientLight color="#808080" />
      <PointLight color="#ff6000" />
      <PointLight ref="light" color="#0060ff" :intensity="0.5" />

      <InstancedMesh ref="imesh" material-id="material" :count="NUM_INSTANCES">
        <BoxGeometry :width="2" :height="2" :depth="10" />
        <StandardMaterial :transparent="true" :opacity="0.9" :metalness="0.8" :roughness="0.5" />
      </InstancedMesh>

      <Text
        text="TroisJS"
        font-src="helvetiker_regular.typeface.json"
        material-id="material1"
        align="center"
        :size="30"
        :height="5"
        :position="{ x: 0, y: 0, z: 0 }"
        :cast-shadow="true"
      >
        <PhongMaterial />
      </Text>
    </Scene>
    <EffectComposer>
      <RenderPass />
      <UnrealBloomPass :strength="1" />
      <HalftonePass :radius="1" :scatter="0" />
    </EffectComposer>
  </Renderer>
</template>

<script>
import { Object3D, MathUtils, Vector3 } from 'three';

const {
  randFloat: rnd,
  randFloatSpread: rndFS,
} = MathUtils;

export default {
  setup() {
    const NUM_INSTANCES = 2000;
    const instances = [];
    const target = new Vector3();
    const dummyO = new Object3D();
    const dummyV = new Vector3();

    for (let i = 0; i < NUM_INSTANCES; i++) {
      instances.push({
        position: new Vector3(rndFS(200), rndFS(200), rndFS(200)),
        scale: rnd(0.2, 1),
        scaleZ: rnd(0.1, 1),
        velocity: new Vector3(rndFS(2), rndFS(2), rndFS(2)),
        attraction: 0.03 + rnd(-0.01, 0.01),
        vlimit: 1.2 + rnd(-0.1, 0.1),
      });
    }

    return {
      NUM_INSTANCES,
      instances,
      target,
      dummyO,
      dummyV,
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
        const { position, scale, scaleZ } = this.instances[i];
        this.dummyO.position.copy(position);
        this.dummyO.scale.set(scale, scale, scaleZ);
        this.dummyO.updateMatrix();
        this.imesh.setMatrixAt(i, this.dummyO.matrix);
      }
      this.imesh.instanceMatrix.needsUpdate = true;

      // animate
      this.renderer.onBeforeRender(this.animate);
    },
    animate() {
      this.target.copy(this.renderer.three.mouseV3);
      this.light.position.copy(this.target);

      for (let i = 0; i < this.NUM_INSTANCES; i++) {
        const { position, scale, scaleZ, velocity, attraction, vlimit } = this.instances[i];

        this.dummyV.copy(this.target).sub(position).normalize().multiplyScalar(attraction);
        velocity.add(this.dummyV).clampScalar(-vlimit, vlimit);
        position.add(velocity);

        this.dummyO.position.copy(position);
        this.dummyO.scale.set(scale, scale, scaleZ);
        this.dummyO.lookAt(this.dummyV.copy(position).add(velocity));
        this.dummyO.updateMatrix();
        this.imesh.setMatrixAt(i, this.dummyO.matrix);
      }
      this.imesh.instanceMatrix.needsUpdate = true;
    },
  },
};
</script>
