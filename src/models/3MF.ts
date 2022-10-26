import { defineComponent } from 'vue'
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader.js'
import Model from './Model'

export default defineComponent({
  extends: Model,
  created() {
    const loader = new ThreeMFLoader()
    this.$emit('before-load', loader)
    loader.load(this.src, (threeMF) => {
      this.onLoad(threeMF)
      this.initObject3D(threeMF)
    }, this.onProgress, this.onError)
  },
})
