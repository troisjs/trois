import { MeshMatcapMaterial, TextureLoader } from 'three';
// import { watch } from 'vue';
import { propsValues, getMatcapUrl } from '../tools.js';
import Material from './Material';

export default {
  extends: Material,
  props: {
    src: String,
    name: String,
  },
  methods: {
    createMaterial() {
      const src = this.name ? getMatcapUrl(this.name) : this.src;
      const opts = propsValues(this.$props, ['src', 'name']);
      opts.matcap = new TextureLoader().load(src);
      this.material = new MeshMatcapMaterial(opts);
    },
  },
  __hmrId: 'MatcapMaterial',
};
