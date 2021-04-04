import { defineComponent } from 'vue';
import { MeshMatcapMaterial, TextureLoader } from 'three';
import { propsValues, getMatcapUrl } from '../tools';
import Material from './Material';

export default defineComponent({
  extends: Material,
  props: {
    src: String,
    name: String,
    flatShading: Boolean,
  },
  methods: {
    createMaterial() {
      const src = this.name ? getMatcapUrl(this.name) : this.src;
      const opts = propsValues(this.$props, ['src', 'name']);
      opts.matcap = new TextureLoader().load(src);
      this.material = new MeshMatcapMaterial(opts);
    },
    addWatchers() {
      // TODO
    },
  },
  __hmrId: 'MatcapMaterial',
});
