import { Color, ShaderMaterial as TShaderMaterial, UniformsUtils } from 'three';
import ShaderMaterial from './ShaderMaterial.js';
import SubsurfaceScatteringShader from './SubsurfaceScatteringShader.js';

export default {
  extends: ShaderMaterial,
  props: {
    diffuse: {
      type: String,
      default: '#ffffff',
    },
    thicknessColor: {
      type: String,
      default: '#ffffff',
    },
    thicknessDistortion: {
      type: Number,
      default: 0.4,
    },
    thicknessAmbient: {
      type: Number,
      default: 0.01,
    },
    thicknessAttenuation: {
      type: Number,
      default: 0.7,
    },
    thicknessPower: {
      type: Number,
      default: 2,
    },
    thicknessScale: {
      type: Number,
      default: 4,
    },
  },
  created() {
    const params = SubsurfaceScatteringShader;
    const uniforms = UniformsUtils.clone(params.uniforms);
    Object.entries(this.$props).forEach(([key, value]) => {
      if (key === 'diffuse' || key === 'thicknessColor') {
        value = new Color(value);
      }
      if (key !== 'id') uniforms[key].value = value;
    });

    this.material = new TShaderMaterial({
      ...params,
      uniforms,
      lights: true,
      transparent: true,
    });
  },
};
