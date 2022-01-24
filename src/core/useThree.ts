import { Camera, Object3D, OrthographicCamera, PerspectiveCamera, Scene, WebGLRenderer, WebGLRendererParameters } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import usePointer, { PointerConfigInterface, PointerPublicConfigInterface, PointerInterface } from './usePointer'

export interface SizeInterface {
  width: number
  height: number
  wWidth: number
  wHeight: number
  ratio: number
}

export interface ThreeConfigInterface {
  params?: WebGLRendererParameters
  canvas?: HTMLCanvasElement
  antialias: boolean
  alpha: boolean
  autoClear: boolean
  orbitCtrl: boolean | Record<string, unknown>
  pointer: boolean | PointerPublicConfigInterface
  resize: boolean | string
  width?: number
  height?: number
  onResize?(size: SizeInterface): void
  [index:string]: any
}

export interface ThreeInterface {
  config: ThreeConfigInterface
  renderer: WebGLRenderer
  composer?: EffectComposer
  camera?: Camera
  cameraCtrl?: OrbitControls
  scene?: Scene
  pointer?: PointerInterface
  size: SizeInterface
  init(): boolean
  dispose(): void
  render(): void
  renderC(): void
  setSize(width: number, height: number): void
  addIntersectObject(o: Object3D): void
  removeIntersectObject(o: Object3D): void
}

/**
 * Three.js helper
 */
export default function useThree(params: ThreeConfigInterface): ThreeInterface {
  // default config
  const config: ThreeConfigInterface = {
    antialias: true,
    alpha: false,
    autoClear: true,
    orbitCtrl: false,
    pointer: false,
    resize: false,
    width: 300,
    height: 150,
  }

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      config[key] = value
    })
  }

  // size
  const size: SizeInterface = {
    width: 1, height: 1,
    wWidth: 1, wHeight: 1,
    ratio: 1,
  }

  const beforeRenderCallbacks: {(): void}[] = []

  const intersectObjects: Object3D[] = []

  const renderer = createRenderer()

  // returned object
  const obj: ThreeInterface = {
    config,
    renderer,
    size,
    init,
    dispose,
    render,
    renderC,
    setSize,
    addIntersectObject, removeIntersectObject,
  }

  return obj

  /**
   * create WebGLRenderer
   */
  function createRenderer(): WebGLRenderer {
    const renderer = new WebGLRenderer({ canvas: config.canvas, antialias: config.antialias, alpha: config.alpha, ...config.params })
    renderer.autoClear = config.autoClear
    return renderer
  }

  /**
   * init three
   */
  function init() {
    if (!obj.scene) {
      console.error('Missing Scene')
      return false
    }

    if (!obj.camera) {
      console.error('Missing Camera')
      return false
    }

    if (config.resize) {
      onResize()
      window.addEventListener('resize', onResize)
    } else if (config.width && config.height) {
      setSize(config.width, config.height)
    }

    initPointer()

    if (config.orbitCtrl) {
      const cameraCtrl = new OrbitControls(obj.camera, obj.renderer.domElement)
      if (config.orbitCtrl instanceof Object) {
        Object.entries(config.orbitCtrl).forEach(([key, value]) => {
          // @ts-ignore
          cameraCtrl[key] = value
        })
      }
      onBeforeRender(() => { cameraCtrl.update() })
      obj.cameraCtrl = cameraCtrl
    }

    return true
  }

  /**
   * init pointer
   */
  function initPointer() {
    let pointerConf: PointerConfigInterface = {
      camera: obj.camera!,
      domElement: obj.renderer!.domElement,
      intersectObjects,
    }

    if (config.pointer && config.pointer instanceof Object) {
      pointerConf = { ...pointerConf, ...config.pointer }
    }

    const pointer = obj.pointer = usePointer(pointerConf)
    if (config.pointer || intersectObjects.length) {
      pointer.addListeners()
      if (pointerConf.intersectMode === 'frame') {
        onBeforeRender(pointer.intersect)
      }
    }
  }

  /**
   * add before render callback
   */
  function onBeforeRender(cb: {(): void}) {
    beforeRenderCallbacks.push(cb)
  }

  /**
   * default render
   */
  function render() {
    // if (obj.cameraCtrl) obj.cameraCtrl.update()
    beforeRenderCallbacks.forEach(c => c())
    obj.renderer!.render(obj.scene!, obj.camera!)
  }

  /**
   * composer render
   */
  function renderC() {
    // if (obj.cameraCtrl) obj.cameraCtrl.update()
    beforeRenderCallbacks.forEach(c => c())
    obj.composer!.render()
  }

  /**
   * add intersect object
   */
  function addIntersectObject(o: Object3D) {
    if (intersectObjects.indexOf(o) === -1) {
      intersectObjects.push(o)
    }
    // add listeners if needed
    if (obj.pointer && !obj.pointer.listeners) {
      obj.pointer.addListeners()
    }
  }

  /**
   * remove intersect object
   */
  function removeIntersectObject(o: Object3D) {
    const i = intersectObjects.indexOf(o)
    if (i !== -1) {
      intersectObjects.splice(i, 1)
    }
    // remove listeners if needed
    if (obj.pointer && !config.pointer && intersectObjects.length === 0) {
      obj.pointer.removeListeners()
    }
  }

  /**
   * remove listeners and dispose
   */
  function dispose() {
    // beforeRenderCallbacks = []
    window.removeEventListener('resize', onResize)
    if (obj.pointer) obj.pointer.removeListeners()
    if (obj.cameraCtrl) obj.cameraCtrl.dispose()
    if (obj.renderer) obj.renderer.dispose()
  }

  /**
   * resize listener
   */
  function onResize() {
    if (config.resize === 'window') {
      setSize(window.innerWidth, window.innerHeight)
    } else {
      const elt = obj.renderer!.domElement.parentNode as Element
      if (elt) setSize(elt.clientWidth, elt.clientHeight)
    }
    config.onResize?.(size)
  }

  /**
   * update renderer size and camera
   */
  function setSize(width: number, height: number) {
    size.width = width
    size.height = height
    size.ratio = width / height

    obj.renderer!.setSize(width, height, false)

    // already done in EffectComposer
    // if (obj.composer) {
    //   obj.composer.setSize(width, height)
    // }

    const camera = (<Camera>obj.camera!)
    if (camera.type === 'PerspectiveCamera') {
      const pCamera = (<PerspectiveCamera>camera)
      pCamera.aspect = size.ratio
      pCamera.updateProjectionMatrix()
    }

    if (camera.type === 'OrthographicCamera') {
      const oCamera = (<OrthographicCamera>camera)
      size.wWidth = oCamera.right - oCamera.left
      size.wHeight = oCamera.top - oCamera.bottom
    } else {
      const wsize = getCameraSize()
      size.wWidth = wsize[0]
      size.wHeight = wsize[1]
    }
  }

  /**
   * calculate camera visible area size
   */
  function getCameraSize() {
    const camera = (<PerspectiveCamera>obj.camera!)
    const vFOV = (camera.fov * Math.PI) / 180
    const h = 2 * Math.tan(vFOV / 2) * Math.abs(camera.position.z)
    const w = h * camera.aspect
    return [w, h]
  }
}
