import { createApp as _createApp } from 'vue';
import * as TROIS from './index.js';

export const TroisJSVuePlugin = {
  install: (app) => {
    const comps = [
      'Camera',
      'OrthographicCamera',
      'PerspectiveCamera',
      'Raycaster',
      'Renderer',
      'Scene',
      'Group',

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
      'ShaderMaterial',
      'StandardMaterial',
      'SubSurfaceMaterial',
      'ToonMaterial',

      'Texture',
      'CubeTexture',

      'Mesh',

      'Box', 'BoxGeometry',
      'Circle', 'CircleGeometry',
      'Cone', 'ConeGeometry',
      'Cylinder', 'CylinderGeometry',
      'Dodecahedron', 'DodecahedronGeometry',
      'Icosahedron', 'IcosahedronGeometry',
      'Lathe', 'LatheGeometry',
      'Octahedron', 'OctahedronGeometry',
      'Plane',
      'Polyhedron', 'PolyhedronGeometry',
      'Ring', 'RingGeometry',
      'Sphere', 'SphereGeometry',
      'Tetrahedron', 'TetrahedronGeometry',
      'Text',
      'Torus', 'TorusGeometry',
      'TorusKnot', 'TorusKnotGeometry',
      'Tube', 'TubeGeometry',

      'Gem',
      'Image',
      'InstancedMesh',
      'MirrorMesh',
      'RefractionMesh',
      'Sprite',

      'FBXModel',
      'GLTFModel',

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

      'GLTFViewer',
    ];

    comps.forEach(comp => {
      app.component(comp, TROIS[comp]);
    });
  },
};

export function createApp(params) {
  return _createApp(params).use(TroisJSVuePlugin);
};
