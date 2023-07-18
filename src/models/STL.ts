import { defineComponent } from "vue"
import Model from "./Model"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader"
import { Mesh, MeshLambertMaterial } from "three"

export default defineComponent({
  extends: Model,
  created() {
    const loader: STLLoader = new STLLoader()
    this.$emit('before-load', loader)
    loader.load(this.src, (geometry) => {
      const object3D = new Mesh(geometry, new MeshLambertMaterial())
      object3D.userData.component = this
      object3D.geometry = geometry

      this.onLoad(object3D)
      this.initObject3D(object3D)
    }, this.onProgress, this.onError)
  },
})
