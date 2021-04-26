/**
 * ------------------------------------------------------------------------------------------
 * Subsurface Scattering shader
 * Based on three/examples/jsm/shaders/SubsurfaceScatteringShader.js
 * Based on GDC 2011 – Approximating Translucency for a Fast, Cheap and Convincing Subsurface Scattering Look
 * https://colinbarrebrisebois.com/2011/03/07/gdc-2011-approximating-translucency-for-a-fast-cheap-and-convincing-subsurface-scattering-look/
 *------------------------------------------------------------------------------------------
 */
import {
  Color,
  ShaderChunk,
  ShaderLib,
  UniformsUtils,
} from 'three'

function replaceAll(string: string, find: string, replace: string) {
  return string.split(find).join(replace)
}

const meshphongFragHead = ShaderChunk.meshphong_frag.slice(0, ShaderChunk.meshphong_frag.indexOf('void main() {'))
const meshphongFragBody = ShaderChunk.meshphong_frag.slice(ShaderChunk.meshphong_frag.indexOf('void main() {'))

const SubsurfaceScatteringShader = {

  uniforms: UniformsUtils.merge([
    ShaderLib.phong.uniforms,
    {
      thicknessColor: { value: new Color(0xffffff) },
      thicknessDistortion: { value: 0.1 },
      thicknessAmbient: { value: 0.0 },
      thicknessAttenuation: { value: 0.1 },
      thicknessPower: { value: 2.0 },
      thicknessScale: { value: 10.0 },
    },
  ]),

  vertexShader: `
    #define USE_UV
    ${ShaderChunk.meshphong_vert}
  `,

  fragmentShader: `
    #define USE_UV
    #define SUBSURFACE

    ${meshphongFragHead}

    uniform float thicknessPower;
    uniform float thicknessScale;
    uniform float thicknessDistortion;
    uniform float thicknessAmbient;
    uniform float thicknessAttenuation;
    uniform vec3 thicknessColor;

    void RE_Direct_Scattering(const in IncidentLight directLight, const in vec2 uv, const in GeometricContext geometry, inout ReflectedLight reflectedLight) {
      #ifdef USE_COLOR
        vec3 thickness = vColor * thicknessColor;
      #else
        vec3 thickness = thicknessColor;
      #endif
      vec3 scatteringHalf = normalize(directLight.direction + (geometry.normal * thicknessDistortion));
      float scatteringDot = pow(saturate(dot(geometry.viewDir, -scatteringHalf)), thicknessPower) * thicknessScale;
      vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * thickness;
      reflectedLight.directDiffuse += scatteringIllu * thicknessAttenuation * directLight.color;
    }
  ` + meshphongFragBody.replace(
    '#include <lights_fragment_begin>',
    replaceAll(
      ShaderChunk.lights_fragment_begin,
      'RE_Direct( directLight, geometry, material, reflectedLight );',
      `
        RE_Direct( directLight, geometry, material, reflectedLight );
        #if defined( SUBSURFACE ) && defined( USE_UV )
          RE_Direct_Scattering(directLight, vUv, geometry, reflectedLight);
        #endif
      `
    )
  ),
}

export default SubsurfaceScatteringShader
