import { Object3D, Scene } from 'three'
import { ComponentPublicInstance, defineComponent, inject, PropType, watch } from 'vue'
import { bindProp } from '../tools'
import { RendererInterface } from './Renderer'

export interface Object3DSetupInterface {
  renderer: RendererInterface
  scene: Scene
  o3d?: Object3D
  parent?: ComponentPublicInstance
}

export interface Object3DInterface extends Object3DSetupInterface {
  addToParent(o?: Object3D): boolean
  removeFromParent(o?: Object3D): boolean
  add(o: Object3D): void
  remove(o: Object3D): void
}

export function object3DSetup(): Object3DSetupInterface {
  const renderer = inject('renderer') as RendererInterface
  const scene = inject('scene') as Scene
  return { scene, renderer }
}

export interface Vector2PropInterface {
  x?: number
  y?: number
}

export interface Vector3PropInterface extends Vector2PropInterface {
  z?: number
}

export interface EulerPropInterface extends Vector3PropInterface {
  order?: 'XYZ' | 'YZX' | 'ZXY' | 'XZY' | 'YXZ' | 'ZYX'
}

export default defineComponent({
  name: 'Object3D',
  inject: ['renderer', 'scene'],
  emits: ['created', 'ready'],
  props: {
    position: { type: Object as PropType<Vector3PropInterface>, default: () => ({ x: 0, y: 0, z: 0 }) },
    rotation: { type: Object as PropType<EulerPropInterface>, default: () => ({ x: 0, y: 0, z: 0 }) },
    scale: { type: Object as PropType<Vector3PropInterface>, default: () => ({ x: 1, y: 1, z: 1, order: 'XYZ' }) },
    lookAt: { type: Object as PropType<Vector3PropInterface>, default: null },
    autoRemove: { type: Boolean, default: true },
    userData: { type: Object, default: () => ({}) },
  },
  setup() {
    return object3DSetup()
  },
  computed: {
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
      if (this.lookAt) o3d.lookAt(this.lookAt.x ?? 0, this.lookAt.y, this.lookAt.z)
      watch(() => this.lookAt, (v) => { o3d.lookAt(v.x ?? 0, v.y, v.z) }, { deep: true })

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
