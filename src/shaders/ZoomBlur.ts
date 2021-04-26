// From https://github.com/evanw/glfx.js
import { Vector2 } from 'three'
import DefaultShader from './default'

export default {
  uniforms: {
    tDiffuse: { value: null },
    center: { value: new Vector2(0.5, 0.5) },
    strength: { value: 0 },
  },
  vertexShader: DefaultShader.vertexShader,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 center;
    uniform float strength;
    varying vec2 vUv;

    float random(vec3 scale, float seed) {
      /* use the fragment position for a different seed per-pixel */
      return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
    }
    
    void main() {
      vec4 color = vec4(0.0);
      float total = 0.0;
      vec2 toCenter = center - vUv;
      
      /* randomize the lookup values to hide the fixed number of samples */
      float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);
      
      for (float t = 0.0; t <= 40.0; t++) {
        float percent = (t + offset) / 40.0;
        float weight = 4.0 * (percent - percent * percent);
        vec4 texel = texture2D(tDiffuse, vUv + toCenter * percent * strength);

        /* switch to pre-multiplied alpha to correctly blur transparent images */
        texel.rgb *= texel.a;

        color += texel * weight;
        total += weight;
      }

      gl_FragColor = color / total;

      /* switch back from pre-multiplied alpha */
      gl_FragColor.rgb /= gl_FragColor.a + 0.00001;
    }
  `,
}
