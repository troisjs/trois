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
      'DirectionalLight',
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
      'Image',
      'Plane',
      'Sphere',
      'Text',

      'InstancedMesh',

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
