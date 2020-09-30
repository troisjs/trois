import { FontLoader, MeshPhongMaterial, MeshStandardMaterial, TextBufferGeometry } from 'three';
import { watch } from 'vue';
import Mesh from '../../meshes/Mesh.js';
import TextProps from '../../meshes/TextProps.js';
import snoise2 from '../../glsl/snoise2.glsl.js';

export default {
  extends: Mesh,
  props: {
    ...TextProps,
    color: { type: [String, Number], default: 0xffffff },
    timeCoef: { type: Number, default: 0.001 },
    noiseCoef: { type: Number, default: 0.015 },
    zCoef: { type: Number, default: 10 },
  },
  created() {
    // add watchers
    const watchProps = [
      'text', 'size', 'height', 'curveSegments',
      'bevelEnabled', 'bevelThickness', 'bevelSize', 'bevelOffset', 'bevelSegments',
      'align',
    ];
    watchProps.forEach(p => {
      watch(() => this[p], () => {
        if (this.font) this.refreshGeometry();
      });
    });

    // uniforms
    this.uTime = { value: 0 };
    this.uNoiseCoef = { value: this.noiseCoef };
    watch(() => this.noiseCoef, (value) => { this.uNoiseCoef.value = value; });
    this.uZCoef = { value: this.zCoef };
    watch(() => this.zCoef, (value) => { this.uZCoef.value = value; });

    const loader = new FontLoader();
    loader.load(this.fontSrc, (font) => {
      this.font = font;
      this.createGeometry();
      this.createMaterial();
      this.initMesh();

      const startTime = Date.now();
      this.three.onBeforeRender(() => {
        this.uTime.value = (Date.now() - startTime) * this.timeCoef;
      });
    });
  },
  methods: {
    createMaterial() {
      this.material = new MeshPhongMaterial({ color: this.color });
      this.material.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = this.uTime;
        shader.uniforms.uNoiseCoef = this.uNoiseCoef;
        shader.uniforms.uZCoef = this.uZCoef;
        shader.vertexShader = `
          uniform float uTime;
          uniform float uNoiseCoef;
          uniform float uZCoef;
          ${snoise2}
        ` + shader.vertexShader;

        shader.vertexShader = shader.vertexShader.replace(
          '#include <begin_vertex>',
          `         
            vec3 p = vec3(position * uNoiseCoef);
            p.x += uTime;
            float noise = snoise(p.xy);
            vec3 transformed = vec3(position);
            transformed.z += noise * uZCoef;
          `
        );
        this.materialShader = shader;
      };
    },
    createGeometry() {
      this.geometry = new TextBufferGeometry(this.text, {
        font: this.font,
        size: this.size,
        height: this.height,
        depth: this.depth,
        curveSegments: this.curveSegments,
        bevelEnabled: this.bevelEnabled,
        bevelThickness: this.bevelThickness,
        bevelSize: this.bevelSize,
        bevelOffset: this.bevelOffset,
        bevelSegments: this.bevelSegments,
      });

      if (this.align === 'center') {
        this.geometry.center();
      }
    },
  },
  __hmrId: 'NoisyText',
};
