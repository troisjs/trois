import { defineComponent } from 'vue'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import Model from './Model'

export default defineComponent({
  extends: Model,
  created() {
    const loader = new FBXLoader()
    loader.load(this.src, (fbx) => {
      this.onLoad(fbx)
    }, this.onProgress, this.onError)
  },
})
