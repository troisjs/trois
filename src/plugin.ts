import { App, createApp as _createApp } from 'vue'
import * as TROIS from './index'

export const TroisJSVuePlugin = {
  install(app: App): void {
    const comps = [
      'Camera',
      'OrthographicCamera',
      'PerspectiveCamera',
      'Raycaster',
      'Renderer',
      'Scene',
      'Group',

      'CubeCamera',

      'AmbientLight',
      'DirectionalLight',
      'HemisphereLight',
      'PointLight',
      'RectAreaLight',
      'SpotLight',

      'BasicMaterial',
      'LambertMaterial',
      'MatcapMaterial',
      'PhongMaterial',
      'PhysicalMaterial',
      'PointsMaterial',
      'ShaderMaterial',
      'StandardMaterial',
      'SubSurfaceMaterial',
      'ToonMaterial',

      'Texture',
      'CubeTexture',

      'BufferGeometry',

      'Mesh',

      'Box', 'BoxGeometry',
      'Circle', 'CircleGeometry',
      'Cone', 'ConeGeometry',
      'Cylinder', 'CylinderGeometry',
      'Dodecahedron', 'DodecahedronGeometry',
      'Icosahedron', 'IcosahedronGeometry',
      'Lathe', 'LatheGeometry',
      'Octahedron', 'OctahedronGeometry',
      'Plane', 'PlaneGeometry',
      'Polyhedron', 'PolyhedronGeometry',
      'Ring', 'RingGeometry',
      'Sphere', 'SphereGeometry',
      'Tetrahedron', 'TetrahedronGeometry',
      'Text',
      'Torus', 'TorusGeometry',
      'TorusKnot', 'TorusKnotGeometry',
      'Tube', 'TubeGeometry',

      'Image',
      'InstancedMesh',
      'Points',
      'Sprite',

      'FbxModel',
      'GltfModel',

      'BokehPass',
      'EffectComposer',
      'FilmPass',
      'FXAAPass',
      'HalftonePass',
      'RenderPass',
      'SAOPass',
      'SMAAPass',
      'SSAOPass',
      'TiltShiftPass',
      'UnrealBloomPass',
      'ZoomBlurPass',
    ]

    comps.forEach(comp => {
      // @ts-ignore
      app.component(comp, TROIS[comp])
    })
  },
}

export function createApp(params: any): App {
  return _createApp(params).use(TroisJSVuePlugin)
}
