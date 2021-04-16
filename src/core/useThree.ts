/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Camera, OrthographicCamera, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import usePointer, { IntersectObject, PointerConfigInterface, PointerInterface } from './usePointer'

export interface ThreeConfigInterface {
  canvas?: HTMLCanvasElement
  antialias: boolean
  alpha: boolean
  autoClear: boolean
  orbitCtrl: boolean | Record<string, unknown>
  pointer: boolean | PointerConfigInterface
  resize: boolean | string
  width?: number
  height?: number
  [index:string]: any
}

export interface SizeInterface {
  width: number
  height: number
  wWidth: number
  wHeight: number
  ratio: number
}

export interface ThreeInterface {
  conf: ThreeConfigInterface
  renderer?: WebGLRenderer
  camera?: Camera
  cameraCtrl?: OrbitControls
  scene?: Scene
  pointer?: PointerInterface
  size: SizeInterface
  composer?: EffectComposer
  init(config: ThreeConfigInterface): boolean
  dispose(): void
  render(): void
  renderC(): void
  setSize(width: number, height: number): void
  onAfterInit(callback: {(): void}): void
  onAfterResize(callback: {(): void}): void
  offAfterResize(callback: {(): void}): void
  addIntersectObject(o: IntersectObject): void
  removeIntersectObject(o: IntersectObject): void
}

/**
 * Three.js helper
 */
export default function useThree(): ThreeInterface {
  // default conf
  const conf: ThreeConfigInterface = {
    antialias: true,
    alpha: false,
    autoClear: true,
    orbitCtrl: false,
    pointer: false,
    resize: false,
    width: 300,
    height: 150,
  }

  // size
  const size: SizeInterface = {
    width: 1, height: 1,
    wWidth: 1, wHeight: 1,
    ratio: 1,
  }

  // handlers
  // const afterInitCallbacks: void[] = []
  // let afterResizeCallbacks: void[] = []
  // let beforeRenderCallbacks: void[] = []
  const afterInitCallbacks: {(): void}[] = []
  let afterResizeCallbacks: {(): void}[] = []
  let beforeRenderCallbacks: {(): void}[] = []

  const intersectObjects: IntersectObject[] = []

  // returned object
  const obj: ThreeInterface = {
    conf,
    size,
    init,
    dispose,
    render,
    renderC,
    setSize,
    onAfterInit,
    onAfterResize, offAfterResize,
    addIntersectObject, removeIntersectObject,
  }

  return obj

  /**
   * init three
   */
  function init(params: ThreeConfigInterface) {
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        conf[key] = value
      })
    }

    if (!obj.scene) {
      console.error('Missing Scene')
      return false
    }

    if (!obj.camera) {
      console.error('Missing Camera')
      return false
    }

    obj.renderer = new WebGLRenderer({ canvas: conf.canvas, antialias: conf.antialias, alpha: conf.alpha })
    obj.renderer.autoClear = conf.autoClear

    if (conf.resize) {
      onResize()
      window.addEventListener('resize', onResize)
    } else {
      setSize(conf.width!, conf.height!)
    }

    initPointer()

    if (conf.orbitCtrl) {
      obj.cameraCtrl = new OrbitControls(obj.camera, obj.renderer.domElement)
      if (conf.orbitCtrl instanceof Object) {
        Object.entries(conf.orbitCtrl).forEach(([key, value]) => {
          // @ts-ignore
          obj.cameraCtrl[key] = value
        })
      }
    }

    afterInitCallbacks.forEach(c => c())

    return true
  }

  function initPointer() {
    let pointerConf: PointerConfigInterface = {
      camera: obj.camera!,
      domElement: obj.renderer!.domElement,
      intersectObjects,
    }

    if (conf.pointer && conf.pointer instanceof Object) {
      pointerConf = { ...pointerConf, ...conf.pointer }
    }

    const pointer = obj.pointer = usePointer(pointerConf)
    if (conf.pointer || intersectObjects.length) {
      pointer.addListeners()
      if (pointerConf.intersectMode === 'frame') {
        onBeforeRender(pointer.intersect)
      }
    }
  }

  /**
   * add after init callback
   */
  function onAfterInit(callback: {(): void}) {
    afterInitCallbacks.push(callback)
  }

  /**
   * add after resize callback
   */
  function onAfterResize(callback: {(): void}) {
    afterResizeCallbacks.push(callback)
  }

  /**
   * remove after resize callback
   */
  function offAfterResize(callback: {(): void}) {
    afterResizeCallbacks = afterResizeCallbacks.filter(c => c !== callback)
  }

  /**
   * add before render callback
   */
  function onBeforeRender(callback: {(): void}) {
    beforeRenderCallbacks.push(callback)
  }

  /**
   * remove before render callback
   */
  // function offBeforeRender(callback: void) {
  //   beforeRenderCallbacks = beforeRenderCallbacks.filter(c => c !== callback)
  // }

  /**
   * default render
   */
  function render() {
    if (obj.cameraCtrl) obj.cameraCtrl.update()
    beforeRenderCallbacks.forEach(c => c())
    obj.renderer!.render(obj.scene!, obj.camera!)
  }

  /**
   * composer render
   */
  function renderC() {
    if (obj.cameraCtrl) obj.cameraCtrl.update()
    beforeRenderCallbacks.forEach(c => c())
    obj.composer!.render()
  }

  /**
   * add intersect object
   */
  function addIntersectObject(o: IntersectObject) {
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
  function removeIntersectObject(o: IntersectObject) {
    const i = intersectObjects.indexOf(o)
    if (i !== -1) {
      intersectObjects.splice(i, 1)
    }
    // remove listeners if needed
    if (obj.pointer && !conf.pointer && intersectObjects.length === 0) {
      obj.pointer.removeListeners()
    }
  }

  /**
   * remove listeners and dispose
   */
  function dispose() {
    beforeRenderCallbacks = []
    window.removeEventListener('resize', onResize)
    if (obj.pointer) obj.pointer.removeListeners()
    if (obj.cameraCtrl) obj.cameraCtrl.dispose()
    if (obj.renderer) obj.renderer.dispose()
  }

  /**
   * resize listener
   */
  function onResize() {
    if (conf.resize === 'window') {
      setSize(window.innerWidth, window.innerHeight)
    } else {
      const elt = obj.renderer!.domElement.parentNode as Element
      if (elt) setSize(elt.clientWidth, elt.clientHeight)
    }
    afterResizeCallbacks.forEach(c => c())
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
