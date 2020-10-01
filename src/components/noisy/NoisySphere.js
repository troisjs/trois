import { watch } from 'vue';
import Sphere from '../../meshes/Sphere.js';
import snoise4 from '../../glsl/snoise4.glsl.js';

export default {
  extends: Sphere,
  props: {
    radius: { type: Number, default: 20 },
    widthSegments: { type: Number, default: 128 },
    heightSegments: { type: Number, default: 128 },
    timeCoef: { type: Number, default: 0.001 },
    noiseCoef: { type: Number, default: 0.05 },
    dispCoef: { type: Number, default: 5 },
  },
  setup(props) {
    // uniforms
    const uTime = { value: 0 };
    const uNoiseCoef = { value: props.noiseCoef };
    watch(() => props.noiseCoef, (value) => { uNoiseCoef.value = value; });
    const uDispCoef = { value: props.dispCoef };
    watch(() => props.dispCoef, (value) => { uDispCoef.value = value; });

    return {
      uTime, uNoiseCoef, uDispCoef,
    };
  },
  mounted() {
    this.updateMaterial();

    const startTime = Date.now();
    this.three.onBeforeRender(() => {
      this.uTime.value = (Date.now() - startTime) * this.timeCoef;
    });
  },
  methods: {
    updateMaterial() {
      this.material.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = this.uTime;
        shader.uniforms.uNoiseCoef = this.uNoiseCoef;
        shader.uniforms.uDispCoef = this.uDispCoef;
        shader.vertexShader = `
          uniform float uTime;
          uniform float uNoiseCoef;
          uniform float uDispCoef;
          varying float vNoise;
          ${snoise4}
        ` + shader.vertexShader;

        shader.vertexShader = shader.vertexShader.replace(
          '#include <begin_vertex>',
          `
            vec4 p = vec4(vec3(position * uNoiseCoef), uTime);
            vNoise = snoise(p);
            vec3 transformed = vec3(position);
            transformed += normalize(position) * vNoise * uDispCoef;
          `
        );
        this.materialShader = shader;
      };
      this.material.needsupdate = true;
    },
  },
  __hmrId: 'NoisySphere',
};
