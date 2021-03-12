import { ShaderMaterial } from 'three'
import { propsValues, defaultFragmentShader, defaultVertexShader } from '../tools.js';

export default {
  inject: ['three', 'mesh'],
  props: {
    uniforms: Object,
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
  },
  render() {
    return [];
  },
  __hmrId: 'ShaderMaterial',
};
