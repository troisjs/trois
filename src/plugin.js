import * as TROIS from './index.js';

export const TroisJSVuePlugin = {
  install: (app) => {
    const comps = [
      'Camera',
      'PerspectiveCamera',
      'Renderer',
      'Scene',

      'BoxGeometry',
      'SphereGeometry',

      'AmbientLight',
      'PointLight',
      'SpotLight',

      'BasicMaterial',
      'LambertMaterial',
      'PhongMaterial',
      'PhysicalMaterial',
      'ShaderMaterial',
      'StandardMaterial',
      'SubSurfaceMaterial',

      'Box',
      'InstancedMesh',
      'Plane',
      'Sphere',
      'Text',

      'BokehPass',
      'EffectComposer',
      'RenderPass',
      'UnrealBloomPass',
    ];

    comps.forEach(comp => {
      app.component(comp, TROIS[comp]);
    });
  },
};
