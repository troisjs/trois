import { defineComponent } from 'vue'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import Model from './Model'

export default defineComponent({
  extends: Model,
  created() {
    const loader = new FBXLoader()
    this.$emit('before-load', loader)
    loader.load(this.src, (fbx) => {
      this.onLoad(fbx)
      this.initObject3D(fbx)
    }, this.onProgress, this.onError)
  },
})
