import { defineComponent } from "vue"
import Model from "./Model"
import { ThreeMFLoader } from "three/examples/jsm/loaders/3MFLoader"

export default defineComponent({
  extends: Model,
  created() {
    const loader: ThreeMFLoader = new ThreeMFLoader()
    this.$emit('before-load', loader)
    loader.load(this.src, (threeMF) => {
      this.onLoad(threeMF)
      this.initObject3D(threeMF)
    }, this.onProgress, this.onError)
  },
})
