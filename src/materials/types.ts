import { Color, Texture, Vector2 } from 'three'

export interface MaterialPropsInterface {
  alphaTest?: number
  blending?: number
  color?: number | string
  depthTest?: boolean
  depthWrite?: boolean
  fog?: boolean
  opacity?: number
  side?: number
  toneMapped?: boolean
  transparent?: boolean
  vertexColors?: boolean
  visible?: boolean
  [index: string]: any
}

export interface AlphaPropsInterface {
  alphaMap?: Texture
}

export interface AOPropsInterface {
  aoMap?: Texture
  aoMapIntensity?: number
}

export interface BumpPropsInterface {
  bumpMap?: Texture
  bumpScale?: number
}

export interface DisplacementPropsInterface {
  displacementMap?: Texture
  displacementScale?: number
  displacementBias?: number
}

export interface EmissivePropsInterface {
  emissive?: number | string
  emissiveIntensity?: number
  emissiveMap?: Texture
}

export interface EnvPropsInterface {
  envMap?: Texture
  envMapIntensity?: number
  reflectivity?: number
  refractionRatio?: number
}

export interface LightPropsInterface {
  lightMap?: Texture
  lightMapIntensity?: number
}

export interface WireframePropsInterface {
  wireframe?: boolean
  // not needed for WebGL
  // wireframeLinecap?: string
  // wireframeLinejoin?: string
  wireframeLinewidth?: number // not really useful
}

export interface BasicMaterialPropsInterface extends
  MaterialPropsInterface,
  AlphaPropsInterface,
  AOPropsInterface,
  EnvPropsInterface,
  WireframePropsInterface {}

export interface LambertMaterialPropsInterface extends
  MaterialPropsInterface,
  AlphaPropsInterface,
  AOPropsInterface,
  EmissivePropsInterface,
  EnvPropsInterface,
  LightPropsInterface,
  WireframePropsInterface {}

export interface PhongMaterialPropsInterface extends
  MaterialPropsInterface,
  AlphaPropsInterface,
  AOPropsInterface,
  DisplacementPropsInterface,
  EmissivePropsInterface,
  EnvPropsInterface,
  LightPropsInterface,
  WireframePropsInterface
{
  flatShading?: boolean
  shininess?: number
  specular?: number | string
}

export interface PhysicalMaterialPropsInterface extends MaterialPropsInterface {
  clearcoat?: number
  clearcoatMap?: Texture
  clearcoatRoughness?: number
  clearcoatRoughnessMap?: Texture
  clearcoatNormalScale?: Vector2
  clearcoatNormalMap?: Texture
  ior?: number
  reflectivity?: number
  sheen?: Color
  transmission?: number
  transmissionMap?: Texture | null
}

export interface PointsMaterialPropsInterface extends MaterialPropsInterface, AlphaPropsInterface {
  size?: number
  sizeAttenuation?: boolean
}

export interface StandardMaterialPropsInterface extends
  MaterialPropsInterface,
  AlphaPropsInterface,
  AOPropsInterface,
  BumpPropsInterface,
  DisplacementPropsInterface,
  EmissivePropsInterface,
  EnvPropsInterface,
  LightPropsInterface,
  WireframePropsInterface
{
  flatShading?: boolean
  metalness?: number
  metalnessMap?: Texture
  roughness?: number
  roughnessMap?: Texture
}

export interface ToonMaterialPropsInterface extends
  MaterialPropsInterface,
  AlphaPropsInterface,
  AOPropsInterface,
  BumpPropsInterface,
  DisplacementPropsInterface,
  EmissivePropsInterface,
  LightPropsInterface,
  WireframePropsInterface {}
