import { ComponentPropsOptions, ComponentPublicInstance, defineComponent, InjectionKey, PropType, watch } from 'vue'
import { Color, Material, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, MeshPhysicalMaterial, MeshStandardMaterial, MeshToonMaterial, PointsMaterial as TPointsMaterial, Texture, ShadowMaterial as TShadowMaterial } from 'three'
import { MeshInjectionKey, MeshInterface } from '../meshes/Mesh'
import { bindObjectProp, propsValues } from '../tools'
import { BasicMaterialPropsInterface, LambertMaterialPropsInterface, MaterialPropsInterface, PhongMaterialPropsInterface, PhysicalMaterialPropsInterface, PointsMaterialPropsInterface, StandardMaterialPropsInterface, ToonMaterialPropsInterface } from './types'

export interface MaterialSetupInterface {
  mesh?: MeshInterface
  material?: Material
  createMaterial?(): Material
}

export interface MaterialInterface extends MaterialSetupInterface {
  setTexture(texture: Texture | null, key: string): void
}

export interface MaterialPublicInterface extends ComponentPublicInstance, MaterialInterface {}

export const MaterialInjectionKey: InjectionKey<MaterialPublicInterface> = Symbol('Material')

const BaseMaterial = defineComponent({
  emits: ['created'],
  props: {
    color: { type: String, default: '#ffffff' },
    props: { type: Object as PropType<MaterialPropsInterface>, default: () => ({}) },
  },
  inject: {
    mesh: MeshInjectionKey as symbol,
  },
  setup(): MaterialSetupInterface {
    return {}
  },
  provide() {
    return {
      [MaterialInjectionKey as symbol]: this,
    }
  },
  created() {
    if (!this.mesh) {
      console.error('Missing parent Mesh')
      return
    }

    if (this.createMaterial) {
      const material = this.material = this.createMaterial()
      // @ts-ignore
      watch(() => this.color, (value) => { material.color.set(value) })
      bindObjectProp(this, 'props', material, false, this.setProp)
      this.$emit('created', material)
      this.mesh.setMaterial(material)
    }
  },
  unmounted() {
    this.material?.dispose()
  },
  methods: {
    getMaterialParams() {
      return { ...propsValues(this.$props, ['props']), ...this.props }
    },
    setProp(material: any, key: string, value: any, needsUpdate = false) {
      const dstVal = material[key]
      if (dstVal instanceof Color) dstVal.set(value)
      else material[key] = value
      material.needsUpdate = needsUpdate
    },
    setTexture(texture: Texture | null, key = 'map') {
      this.setProp(this.material, key, texture, true)
    },
  },
  render() {
    return this.$slots.default ? this.$slots.default() : []
  },
  __hmrId: 'Material',
})

export default BaseMaterial

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function materialComponent<P extends Readonly<ComponentPropsOptions>>(
  name: string,
  props: P,
  createMaterial: {(opts: any): Material}
) {
  return defineComponent({
    name,
    extends: BaseMaterial,
    props,
    methods: {
      createMaterial() {
        return createMaterial(this.getMaterialParams())
      },
    },
  })
}
