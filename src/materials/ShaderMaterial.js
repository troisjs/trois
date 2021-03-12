import { ShaderMaterial } from 'three';
import { watch } from 'vue';
import { propsValues, defaultFragmentShader, defaultVertexShader } from '../tools.js';

export default {
  inject: ['three', 'mesh'],
  props: {
    uniforms: { type: Object, default: () => { return {}; } },
    vertexShader: { type: String, default: defaultVertexShader },
    fragmentShader: { type: String, default: defaultFragmentShader },
  },
  created() {
    this.createMaterial();
    console.log(this.uniforms);
    ['vertexShader', 'fragmentShader'].forEach(p => {
      watch(() => this[p], () => {
        // recreate material if we change either shader
        this.material.dispose();
        this.createMaterial();
      });
    });
  },
  unmounted() {
    this.material.dispose();
  },
  methods: {
    createMaterial() {
      this.material = new ShaderMaterial(propsValues(this.$props));
      this.mesh.setMaterial(this.material);
    },
  },
  render() {
    return [];
  },
  __hmrId: 'ShaderMaterial',
};
