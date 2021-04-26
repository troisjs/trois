import { defineComponent } from 'vue'
import { MeshMatcapMaterial, TextureLoader } from 'three'
import { propsValues, getMatcapUrl } from '../tools'
import Material from './Material'

export default defineComponent({
  extends: Material,
  props: {
    src: String,
    name: { type: String, default: '0404E8_0404B5_0404CB_3333FC' },
    flatShading: Boolean,
  },
  methods: {
    createMaterial() {
      const src = this.src ? this.src : getMatcapUrl(this.name)
      const opts = propsValues(this.$props, ['src', 'name'])
      opts.matcap = new TextureLoader().load(src)
      return new MeshMatcapMaterial(opts)
    },
  },
  __hmrId: 'MatcapMaterial',
})
