import { Object3D, Scene } from 'three'
import { ComponentPublicInstance, defineComponent, inject, watch } from 'vue'
import { bindProp } from '../tools'
import { RendererInterface } from './Renderer'
import { ThreeInterface } from './useThree'

interface Object3DSetupInterface {
  three: ThreeInterface
  scene: Scene
  renderer: RendererInterface
  o3d?: Object3D
  parent?: ComponentPublicInstance
}

export interface Object3DInterface extends Object3DSetupInterface {
  addToParent(o?: Object3D): boolean
  removeFromParent(o?: Object3D): boolean
  add(o: Object3D): void
  remove(o: Object3D): void
}

export default defineComponent({
  name: 'Object3D',
  inject: ['three', 'scene', 'renderer'],
  emits: ['created', 'ready'],
  props: {
    position: { type: Object, default: () => ({ x: 0, y: 0, z: 0 }) },
    rotation: { type: Object, default: () => ({ x: 0, y: 0, z: 0 }) },
    scale: { type: Object, default: () => ({ x: 1, y: 1, z: 1 }) },
    lookAt: { type: Object, default: null },
    autoRemove: { type: Boolean, default: true },
    userData: { type: Object, default: () => ({}) },
  },
  setup(): Object3DSetupInterface {
    const three = inject('three') as ThreeInterface
    const scene = inject('scene') as Scene
    const renderer = inject('renderer') as RendererInterface
    return { three, scene, renderer }
  },
  unmounted() {
    if (this.autoRemove) this.removeFromParent()
  },
  methods: {
    initObject3D(o3d: Object3D) {
      this.o3d = o3d

      this.$emit('created', o3d)

      bindProp(this, 'position', o3d)
      bindProp(this, 'rotation', o3d)
      bindProp(this, 'scale', o3d)
      bindProp(this, 'userData', o3d.userData)

      // TODO : fix lookat.x
      if (this.lookAt) o3d.lookAt(this.lookAt.x, this.lookAt.y, this.lookAt.z)
      watch(() => this.lookAt, (v) => { o3d.lookAt(v.x, v.y, v.z) }, { deep: true })

      this.parent = this.getParent()
      if (this.addToParent()) this.$emit('ready', this)
      else console.error('Missing parent (Scene, Group...)')
    },
    getParent(): undefined | ComponentPublicInstance {
      let parent = this.$parent
      while (parent) {
        if ((parent as any).add) return parent
        parent = parent.$parent
      }
      return undefined
    },
    addToParent(o?: Object3D) {
      const o3d = o || this.o3d
      if (this.parent) {
        (this.parent as any).add(o3d)
        return true
      }
      return false
    },
    removeFromParent(o?: Object3D) {
      const o3d = o || this.o3d
      if (this.parent) {
        (this.parent as any).remove(o3d)
        return true
      }
      return false
    },
    add(o: Object3D) { this.o3d?.add(o) },
    remove(o: Object3D) { this.o3d?.remove(o) },
  },
  render() {
    return this.$slots.default ? this.$slots.default() : []
  },
  __hmrId: 'Object3D',
})
