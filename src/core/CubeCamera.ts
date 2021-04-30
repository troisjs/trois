import { defineComponent, inject, onUnmounted, PropType } from 'vue'
import { CubeCamera, LinearMipmapLinearFilter, Mesh, RGBFormat, WebGLCubeRenderTarget } from 'three'
import Object3D from './Object3D'
import { RendererInjectionKey } from './Renderer'

interface CubeCameraSetupInterface {
  cubeRT?: WebGLCubeRenderTarget
  cubeCamera?: CubeCamera
  updateRT?: {(): void}
}

export default defineComponent({
  extends: Object3D,
  props: {
    cubeRTSize: { type: Number, default: 256 },
    cubeCameraNear: { type: Number, default: 0.1 },
    cubeCameraFar: { type: Number, default: 2000 },
    autoUpdate: Boolean,
    hideMeshes: { type: Array as PropType<Mesh[]>, default: () => ([]) },
  },
  setup(props): CubeCameraSetupInterface {
    const rendererC = inject(RendererInjectionKey)
    if (!rendererC || !rendererC.scene) {
      console.error('Missing Renderer / Scene')
      return {}
    }

    const renderer = rendererC.renderer, scene = rendererC.scene
    const cubeRT = new WebGLCubeRenderTarget(props.cubeRTSize, { format: RGBFormat, generateMipmaps: true, minFilter: LinearMipmapLinearFilter })
    const cubeCamera = new CubeCamera(props.cubeCameraNear, props.cubeCameraFar, cubeRT)
    const updateRT = () => {
      props.hideMeshes.forEach(m => { m.visible = false })
      cubeCamera.update(renderer, scene)
      props.hideMeshes.forEach(m => { m.visible = true })
    }

    if (props.autoUpdate) {
      rendererC.onBeforeRender(updateRT)
      onUnmounted(() => { rendererC.offBeforeRender(updateRT) })
    } else {
      rendererC.onMounted(updateRT)
    }

    return { cubeRT, cubeCamera, updateRT }
  },
  created() {
    if (this.cubeCamera) this.initObject3D(this.cubeCamera)
  },
  render() {
    return []
  },
  __hmrId: 'CubeCamera',
})
