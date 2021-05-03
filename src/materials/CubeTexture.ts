import { defineComponent, PropType, watch } from 'vue'
import { CubeReflectionMapping, CubeTextureLoader } from 'three'
import Texture from './Texture'

export default defineComponent({
  extends: Texture,
  props: {
    name: { type: String, default: 'envMap' },
    path: { type: String, required: true },
    urls: {
      type: Array as PropType<string[]>,
      default: () => ['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'],
    },
    props: { type: Object, default: () => ({ mapping: CubeReflectionMapping }) },
  },
  created() {
    watch(() => this.path, this.refreshTexture)
    watch(() => this.urls, this.refreshTexture)
  },
  methods: {
    createTexture() {
      return new CubeTextureLoader()
        .setPath(this.path)
        .load(this.urls, this.onLoaded, this.onProgress, this.onError)
    },
  },
})
