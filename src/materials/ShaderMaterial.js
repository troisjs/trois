import { ShaderMaterial } from 'three'
import { watch } from 'vue';
import { propsValues, defaultFragmentShader, defaultVertexShader } from '../tools.js';

export default {
  inject: ['three', 'mesh'],
  props: {
    uniforms: { type: Object, default: () => { } },
    vertexShader: { type: String, default: defaultVertexShader },
    fragmentShader: { type: String, default: defaultFragmentShader },
  },
  created() {
    this.createMaterial();
    this.mesh.setMaterial(this.material);
    if (this.addWatchers) this.addWatchers();
  },
  unmounted() {
    this.material.dispose();
  },
  methods: {
    createMaterial() {
      this.material = new ShaderMaterial(propsValues(this.$props));
    },
    addWatchers() {
      ['uniforms', 'vertexShader', 'fragmentShader'].forEach(p => {
        watch(() => this[p], (value) => {
          this.material[p] = value;

          if (p === 'vertexShader' || p === 'fragmentShader') {
            // recreate material if we change either shader
            this.material.dispose();
            this.createMaterial();
          }
        },
          // only watch deep on uniforms
          { deep: p === 'uniforms' }
        );
      });
    },
  },
  render() {
    return [];
  },
  __hmrId: 'ShaderMaterial',
};
