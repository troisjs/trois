import { FontLoader, MeshStandardMaterial, TextBufferGeometry } from 'three';
import { watch } from 'vue';
import Mesh from '../meshes/Mesh.js';
import TextProps from '../meshes/TextProps.js';
import snoise2 from '../glsl/snoise2.glsl.js';

export default {
  extends: Mesh,
  props: {
    ...TextProps,
    color: {
      type: [String, Number],
      default: 0xffffff,
    },
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

    // uniform
    this.time = { value: 0 };

    const loader = new FontLoader();
    loader.load(this.fontSrc, (font) => {
      this.font = font;
      this.createGeometry();
      this.createMaterial();
      this.initMesh();

      const startTime = Date.now();
      this.three.onBeforeRender(() => {
        this.time.value = (Date.now() - startTime) / 1000;
      });
    });
  },
  methods: {
    createMaterial() {
      this.material = new MeshStandardMaterial({ color: this.color });
      this.material.onBeforeCompile = (shader) => {
        shader.uniforms.time = this.time;
        shader.vertexShader = `
          uniform float time;
          ${snoise2}
        ` + shader.vertexShader;

        shader.vertexShader = shader.vertexShader.replace(
          '#include <begin_vertex>',
          `
            vec3 p = vec3(position * 0.01);
            p.x += time;
            float noise = snoise(p.xy);
            vec3 transformed = vec3(position);
            transformed.z += noise * 10.0;
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
};
