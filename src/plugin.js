import { createApp as _createApp } from 'vue';
import * as TROIS from './index.js';

export const TroisJSVuePlugin = {
  install: (app) => {
    const comps = [
      'Camera',
      'OrthographicCamera',
      'PerspectiveCamera',
      'Renderer',
      'Scene',
      'Group',

      'BoxGeometry',
      'CircleGeometry',
      'ConeGeometry',
      'CylinderGeometry',
      'DodecahedronGeometry',
      'IcosahedronGeometry',
      'LatheGeometry',
      'OctahedronGeometry',
      'PolyhedronGeometry',
      'RingGeometry',
      'SphereGeometry',
      'TetrahedronGeometry',
      'TorusGeometry',
      'TorusKnotGeometry',
      'TubeGeometry',

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

      'Box',
      'Circle',
      'Cone',
      'Cylinder',
      'Dodecahedron',
      'Icosahedron',
      'Mesh',
      'Lathe',
      'Octahedron',
      'Plane',
      'Polyhedron',
      'Ring',
      'Sphere',
      'Tetrahedron',
      'Text',
      'Torus',
      'TorusKnot',
      'Tube',

      'Gem',
      'Image',
      'InstancedMesh',
      'MirrorMesh',
      'RefractionMesh',
      'Sprite',

      'BokehPass',
      'EffectComposer',
      'FilmPass',
      'FXAAPass',
      'HalftonePass',
      'RenderPass',
      'SAOPass',
      'SMAAPass',
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
