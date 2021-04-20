import { WebGLRenderer } from 'three'
import { defineComponent } from 'vue'
import useThree, { SizeInterface, ThreeConfigInterface, ThreeInterface } from './useThree'

type CallbackType<T> = (e?: T) => void

interface EventInterface<T> {
  renderer: T
}

interface RenderEventInterface<T> extends EventInterface<T> {
  time: number
}

interface RendererSetupInterface {
  canvas: HTMLCanvasElement
  three: ThreeInterface
  renderer: WebGLRenderer
  size: SizeInterface
  renderFn(): void
  raf: boolean
  onMountedCallbacks: CallbackType<EventInterface<this>>[]
  beforeRenderCallbacks: CallbackType<RenderEventInterface<this>>[]
  afterRenderCallbacks: CallbackType<RenderEventInterface<this>>[]
  // pointerPosition?: Vector2
  // pointerPositionN?: Vector2
  // pointerPositionV3?: Vector3
}

export interface RendererInterface extends RendererSetupInterface {
  onMounted(cb: CallbackType<EventInterface<this>>): void
  onBeforeRender(cb: CallbackType<RenderEventInterface<this>>): void
  offBeforeRender(cb: CallbackType<RenderEventInterface<this>>): void
  onAfterRender(cb: CallbackType<RenderEventInterface<this>>): void
  offAfterRender(cb: CallbackType<RenderEventInterface<this>>): void
}

export default defineComponent({
  name: 'Renderer',
  props: {
    antialias: Boolean,
    alpha: Boolean,
    autoClear: { type: Boolean, default: true },
    orbitCtrl: { type: [Boolean, Object], default: false },
    pointer: { type: [Boolean, Object], default: false },
    resize: { type: [Boolean, String], default: false },
    shadow: Boolean,
    width: String,
    height: String,
    xr: Boolean,
    onReady: Function,
    // onFrame: Function,
  },
  setup(props): RendererSetupInterface {
    const canvas = document.createElement('canvas')
    const config: ThreeConfigInterface = {
      canvas,
      antialias: props.antialias,
      alpha: props.alpha,
      autoClear: props.autoClear,
      orbitCtrl: props.orbitCtrl,
      pointer: props.pointer,
      resize: props.resize,
    }

    if (props.width) config.width = parseInt(props.width)
    if (props.height) config.height = parseInt(props.height)

    const three = useThree(config)

    const renderFn: {(): void} = () => {}

    const onMountedCallbacks: {(): void}[] = []
    const beforeRenderCallbacks: {(): void}[] = []
    const afterRenderCallbacks: {(): void}[] = []

    return {
      canvas,
      three,
      renderer: three.renderer,
      size: three.size,
      renderFn,
      raf: true,
      onMountedCallbacks,
      beforeRenderCallbacks,
      afterRenderCallbacks,
    }
  },
  provide() {
    return {
      renderer: this,
      three: this.three,
    }
  },
  mounted() {
    // appendChild won't work on reload
    this.$el.parentNode.insertBefore(this.canvas, this.$el)

    if (this.three.init()) {
      this.onReady?.(this)

      // if (this.three.pointer) {
      //   this.pointerPosition = this.three.pointer.position
      //   this.pointerPositionN = this.three.pointer.positionN
      //   this.pointerPositionV3 = this.three.pointer.positionV3
      // }

      this.renderer.shadowMap.enabled = this.shadow

      this.renderFn = this.three.composer ? this.three.renderC : this.three.render

      if (this.xr) {
        this.renderer.xr.enabled = true
        this.renderer.setAnimationLoop(this.render)
      } else {
        requestAnimationFrame(this.renderLoop)
      }
    }

    this.onMountedCallbacks.forEach(c => c({ renderer: this }))
  },
  beforeUnmount() {
    this.canvas.remove()
    this.beforeRenderCallbacks = []
    this.afterRenderCallbacks = []
    this.raf = false
    this.three.dispose()
  },
  methods: {
    onMounted(cb: {(): void}) {
      this.onMountedCallbacks.push(cb)
    },
    onBeforeRender(cb: {(): void}) {
      this.beforeRenderCallbacks.push(cb)
    },
    offBeforeRender(cb: {(): void}) {
      this.beforeRenderCallbacks = this.beforeRenderCallbacks.filter(c => c !== cb)
    },
    onAfterRender(cb: {(): void}) {
      this.afterRenderCallbacks.push(cb)
    },
    offAfterRender(cb: {(): void}) {
      this.afterRenderCallbacks = this.afterRenderCallbacks.filter(c => c !== cb)
    },
    onAfterResize(cb: {(): void}) {
      this.three.onAfterResize(cb)
    },
    offAfterResize(cb: {(): void}) {
      this.three.offAfterResize(cb)
    },
    render(time: number) {
      const cbParams = { time, renderer: this }
      this.beforeRenderCallbacks.forEach(cb => cb(cbParams))
      // this.onFrame?.(cbParams)
      this.renderFn()
      this.afterRenderCallbacks.forEach(cb => cb(cbParams))
    },
    renderLoop(time: number) {
      if (this.raf) requestAnimationFrame(this.renderLoop)
      this.render(time)
    },
  },
  render() {
    return this.$slots.default ? this.$slots.default() : []
  },
  __hmrId: 'Renderer',
})
