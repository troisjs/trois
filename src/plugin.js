import * as TROIS from './index.js';

export const TroisJSVuePlugin = {
  install: (app) => {
    const comps = [
      'Camera',
      'PerspectiveCamera',
      'Renderer',
      'Scene',
      // 'Texture',
      // 'CubeTexture',

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
      'PointLight',
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

      'Map',
      'EnvMap',
      'RefractionMap',

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
      'HalftonePass',
      'RenderPass',
      'SAOPass',
      'UnrealBloomPass',

      'GLTFViewer',
    ];

    comps.forEach(comp => {
      app.component(comp, TROIS[comp]);
    });
  },
};
