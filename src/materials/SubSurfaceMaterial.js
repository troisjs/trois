import { Color, ShaderMaterial as TShaderMaterial, UniformsUtils } from 'three';
import SubsurfaceScatteringShader from './SubsurfaceScatteringShader.js';
import ShaderMaterial from './ShaderMaterial.js';

export default {
  extends: ShaderMaterial,
  props: {
    diffuse: { type: String, default: '#ffffff' },
    thicknessColor: { type: String, default: '#ffffff' },
    thicknessDistortion: { type: Number, default: 0.4 },
    thicknessAmbient: { type: Number, default: 0.01 },
    thicknessAttenuation: { type: Number, default: 0.7 },
    thicknessPower: { type: Number, default: 2 },
    thicknessScale: { type: Number, default: 4 },
    transparent: { type: Boolean, default: false },
    opacity: { type: Number, default: 1 },
    vertexColors: { type: Boolean, default: false },
  },
  setup(props) {
    const params = SubsurfaceScatteringShader;
    const uniforms = UniformsUtils.clone(params.uniforms);
    Object.entries(props).forEach(([key, value]) => {
      if (key === 'diffuse' || key === 'thicknessColor') {
        value = new Color(value);
      }
      if (key !== 'id' && key !== 'transparent' && key !== 'vertexColors') {
        uniforms[key].value = value;
      }
    });

    const material = new TShaderMaterial({
      ...params,
      uniforms,
      lights: true,
      transparent: this.transparent,
      vertexColors: this.vertexColors,
    });

    return { material };
  },
  __hmrId: 'SubSurfaceMaterial',
};
