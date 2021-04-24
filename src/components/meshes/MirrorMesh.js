import { defineComponent } from 'vue'
import {
  CubeCamera,
  LinearMipmapLinearFilter,
  RGBFormat,
  WebGLCubeRenderTarget,
} from 'three'

import { Mesh } from '../../../build/trois.module.js'

export default defineComponent({
  extends: Mesh,
  props: {
    cubeRTSize: { type: Number, default: 256 },
    cubeCameraNear: { type: Number, default: 0.1 },
    cubeCameraFar: { type: Number, default: 2000 },
    autoUpdate: Boolean,
  },
  mounted() {
    this.initMirrorMesh()
    if (this.autoUpdate) this.renderer.onBeforeRender(this.updateCubeRT)
    else this.renderer.onMounted(this.updateCubeRT)
  },
  unmounted() {
    this.renderer.offBeforeRender(this.updateCubeRT)
    if (this.cubeCamera) this.removeFromParent(this.cubeCamera)
  },
  methods: {
    initMirrorMesh() {
      const cubeRT = new WebGLCubeRenderTarget(this.cubeRTSize, { format: RGBFormat, generateMipmaps: true, minFilter: LinearMipmapLinearFilter })
      this.cubeCamera = new CubeCamera(this.cubeCameraNear, this.cubeCameraFar, cubeRT)
      this.addToParent(this.cubeCamera)

      this.material.envMap = cubeRT.texture
      this.material.needsUpdate = true
    },
    updateCubeRT() {
      this.mesh.visible = false
      this.cubeCamera.update(this.renderer.renderer, this.scene)
      this.mesh.visible = true
    },
  },
  __hmrId: 'MirrorMesh',
})
