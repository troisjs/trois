import { defineComponent } from 'vue'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Model from './Model'

export default defineComponent({
  extends: Model,
  created() {
    const loader = new GLTFLoader()
    this.$emit('before-load', loader)
    loader.load(this.src, (gltf) => {
      this.onLoad(gltf)
      this.initObject3D(gltf.scene)
    }, this.onProgress, this.onError)
  },
})
