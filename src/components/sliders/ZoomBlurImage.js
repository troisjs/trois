import {
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  Vector2,
} from 'three'

export default function ZoomBlurImage(renderer) {
  let geometry, material, mesh

  const uMap = { value: null }
  const uCenter = { value: new Vector2(0.5, 0.5) }
  const uStrength = { value: 0 }
  const uUVOffset = { value: new Vector2(0, 0) }
  const uUVScale = { value: new Vector2(1, 1) }

  init()

  return { geometry, material, mesh, uCenter, uStrength, setMap, updateUV }

  function init() {
    geometry = new PlaneGeometry(2, 2, 1, 1)

    material = new ShaderMaterial({
      transparent: true,
      uniforms: {
        map: uMap,
        center: uCenter,
        strength: uStrength,
        uvOffset: uUVOffset,
        uvScale: uUVScale,
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      // adapted from https://github.com/evanw/glfx.js
      fragmentShader: `
        uniform sampler2D map;
        uniform vec2 center;
        uniform float strength;
        uniform vec2 uvOffset;
        uniform vec2 uvScale;
        varying vec2 vUv;

        float random(vec3 scale, float seed) {
          /* use the fragment position for a different seed per-pixel */
          return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
        }
        
        void main() {
          vec2 tUv = vUv * uvScale + uvOffset;
          if (abs(strength) > 0.001) {
            vec4 color = vec4(0.0);
            float total = 0.0;
            vec2 toCenter = center * uvScale + uvOffset - tUv;
            
            /* randomize the lookup values to hide the fixed number of samples */
            float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);
            
            for (float t = 0.0; t <= 20.0; t++) {
              float percent = (t + offset) / 20.0;
              float weight = 2.0 * (percent - percent * percent);
              vec4 texel = texture2D(map, tUv + toCenter * percent * strength);

              /* switch to pre-multiplied alpha to correctly blur transparent images */
              texel.rgb *= texel.a;

              color += texel * weight;
              total += weight;
            }

            gl_FragColor = color / total;

            /* switch back from pre-multiplied alpha */
            gl_FragColor.rgb /= gl_FragColor.a + 0.00001;
            gl_FragColor.a = 1.0 - abs(strength);
          } else {
            gl_FragColor = texture2D(map, tUv);
          }
        }
      `,
    })

    mesh = new Mesh(geometry, material)
  }

  function setMap(value) {
    uMap.value = value
    updateUV()
  }

  function updateUV() {
    const ratio = renderer.size.ratio
    const iRatio = uMap.value.image.width / uMap.value.image.height
    uUVOffset.value.set(0, 0)
    uUVScale.value.set(1, 1)
    if (iRatio > ratio) {
      uUVScale.value.x = ratio / iRatio
      uUVOffset.value.x = (1 - uUVScale.value.x) / 2
    } else {
      uUVScale.value.y = iRatio / ratio
      uUVOffset.value.y = (1 - uUVScale.value.y) / 2
    }
  }
}
