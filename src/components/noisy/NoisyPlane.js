import { MeshLambertMaterial } from 'three';
import { watch } from 'vue';
import Plane from '../../meshes/Plane.js';
import snoise3 from '../../glsl/snoise3.glsl.js';

export default {
  extends: Plane,
  props: {
    timeCoef: { type: Number, default: 0.001 },
    noiseCoef: { type: Number, default: 1 },
    zCoef: { type: Number, default: 5 },
  },
  setup(props) {
    // uniforms
    const uTime = { value: 0 };
    const uNoiseCoef = { value: props.noiseCoef };
    watch(() => props.noiseCoef, (value) => { uNoiseCoef.value = value; });
    const uZCoef = { value: props.zCoef };
    watch(() => props.zCoef, (value) => { uZCoef.value = value; });

    return {
      uTime, uNoiseCoef, uZCoef,
    };
  },
  created() {
    this.createMaterial();
    const startTime = Date.now();
    this.three.onBeforeRender(() => {
      this.uTime.value = (Date.now() - startTime) * this.timeCoef;
    });
  },
  methods: {
    createMaterial() {
      this.material = new MeshLambertMaterial({});
      this.material.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = this.uTime;
        shader.uniforms.uNoiseCoef = this.uNoiseCoef;
        shader.uniforms.uZCoef = this.uZCoef;
        shader.vertexShader = `
          uniform float uTime;
          uniform float uNoiseCoef;
          uniform float uZCoef;
          varying float vNoise;
          ${snoise3}
        ` + shader.vertexShader;

        shader.vertexShader = shader.vertexShader.replace(
          '#include <begin_vertex>',
          `         
            vec3 p = vec3(position * uNoiseCoef);
            vNoise = snoise(vec3(p.x, p.y, uTime));
            vec3 transformed = vec3(position);
            transformed.z += vNoise * uZCoef;
          `
        );

        this.materialShader = shader;
      };
    },
  },
  __hmrId: 'NoisyPlane',
};
