import { defineComponent } from 'vue'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import Model from './Model'

export default defineComponent({
  extends: Model,
  props: {
    dracoPath: { type: String, required: true },
  },
  created() {
    const loader = new GLTFLoader()
    if (this.dracoPath) {
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath(this.dracoPath)
      loader.setDRACOLoader(dracoLoader)
    }
    this.$emit('before-load', loader)
    loader.load(this.src, (gltf) => {
      this.onLoad(gltf)
      this.initObject3D(gltf.scene)
    }, this.onProgress, this.onError)
  },
})
