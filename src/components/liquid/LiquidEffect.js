import {
  FloatType,
  Mesh,
  NearestFilter,
  OrthographicCamera,
  PlaneGeometry,
  RGBAFormat,
  ShaderMaterial,
  Uniform,
  Vector2,
  WebGLRenderTarget,
} from 'three'

// shaders from https://github.com/evanw/webgl-water
function LiquidEffect(renderer) {
  this.renderer = renderer
  this.width = 512
  this.height = 512
  // this.delta = new Vector2(this.width / Math.pow(width, 2), this.height / Math.pow(height, 2));
  this.delta = new Vector2(1 / this.width, 1 / this.height)

  const targetOptions = {
    minFilter: NearestFilter,
    magFilter: NearestFilter,
    type: FloatType,
    format: RGBAFormat,
    depthBuffer: false,
  }

  this.hMap = new WebGLRenderTarget(this.width, this.height, targetOptions)
  this.hMap1 = new WebGLRenderTarget(this.width, this.height, targetOptions)
  this.fsQuad = new FullScreenQuad()

  this.initShaders()
}

LiquidEffect.prototype.initShaders = function () {
  const defaultVertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  this.copyMat = new ShaderMaterial({
    uniforms: { tDiffuse: { value: null } },
    vertexShader: defaultVertexShader,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      varying vec2 vUv;
      void main() {
        gl_FragColor = texture2D(tDiffuse, vUv);
      }
    `,
  })

  this.updateMat = new ShaderMaterial({
    uniforms: {
      tDiffuse: { value: null },
      delta: new Uniform(this.delta),
    },
    vertexShader: defaultVertexShader,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform vec2 delta;
      varying vec2 vUv;
      void main() {
        vec4 texel = texture2D(tDiffuse, vUv);

        vec2 dx = vec2(delta.x, 0.0);
        vec2 dy = vec2(0.0, delta.y);
        float average = (
          texture2D(tDiffuse, vUv - dx).r +
          texture2D(tDiffuse, vUv - dy).r +
          texture2D(tDiffuse, vUv + dx).r +
          texture2D(tDiffuse, vUv + dy).r
        ) * 0.25;
        texel.g += (average - texel.r) * 2.0;
        texel.g *= 0.995;
        texel.r += texel.g;

        gl_FragColor = texel;
      }
    `,
  })

  this.normalsMat = new ShaderMaterial({
    uniforms: {
      tDiffuse: { value: null },
      delta: new Uniform(this.delta),
    },
    vertexShader: defaultVertexShader,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform vec2 delta;
      varying vec2 vUv;
      void main() {
        vec4 texel = texture2D(tDiffuse, vUv);
        vec3 dx = vec3(delta.x, texture2D(tDiffuse, vec2(vUv.x + delta.x, vUv.y)).r - texel.r, 0.0);
        vec3 dy = vec3(0.0, texture2D(tDiffuse, vec2(vUv.x, vUv.y + delta.y)).r - texel.r, delta.y);
        texel.ba = normalize(cross(dy, dx)).xz;
        gl_FragColor = texel;
      }
    `,
  })

  this.dropMat = new ShaderMaterial({
    uniforms: {
      tDiffuse: { value: null },
      center: new Uniform(new Vector2()),
      radius: { value: 0.05 },
      strength: { value: 0.5 },
    },
    vertexShader: defaultVertexShader,
    fragmentShader: `
      const float PI = 3.1415926535897932384626433832795;
      uniform sampler2D tDiffuse;
      uniform vec2 center;
      uniform float radius;
      uniform float strength;
      varying vec2 vUv;
      void main() {
        vec4 texel = texture2D(tDiffuse, vUv);
        float drop = max(0.0, 1.0 - length(center * 0.5 + 0.5 - vUv) / radius);
        drop = 0.5 - cos(drop * PI) * 0.5;
        texel.r += drop * strength;
        // texel.r = clamp(texel.r, -2.0, 2.0);
        gl_FragColor = texel;
      }
    `,
  })
}

LiquidEffect.prototype.update = function () {
  this.updateHMap()
  // this.updateHMap();
  this.updateHMapNormals()
}

LiquidEffect.prototype.updateHMap = function () {
  this.updateMat.uniforms.tDiffuse.value = this.hMap.texture
  this.renderShaderMat(this.updateMat, this.hMap1)
  this.swapBuffers()
}

LiquidEffect.prototype.updateHMapNormals = function () {
  this.normalsMat.uniforms.tDiffuse.value = this.hMap.texture
  this.renderShaderMat(this.normalsMat, this.hMap1)
  this.swapBuffers()
}

LiquidEffect.prototype.addDrop = function (x, y, radius, strength) {
  this.dropMat.uniforms.tDiffuse.value = this.hMap.texture
  this.dropMat.uniforms.center.value.set(x, y)
  this.dropMat.uniforms.radius.value = radius
  this.dropMat.uniforms.strength.value = strength
  this.renderShaderMat(this.dropMat, this.hMap1)
  this.swapBuffers()
}

// LiquidEffect.prototype.renderBuffer = function (buffer, target) {
//   this.copyMat.uniforms.tDiffuse.value = buffer.texture;
//   this.renderShaderMat(this.copyMat, target);
// };

LiquidEffect.prototype.renderShaderMat = function (mat, target) {
  this.fsQuad.material = mat
  const oldTarget = this.renderer.getRenderTarget()
  this.renderer.setRenderTarget(target)
  this.fsQuad.render(this.renderer)
  this.renderer.setRenderTarget(oldTarget)
}

LiquidEffect.prototype.swapBuffers = function () {
  const temp = this.hMap
  this.hMap = this.hMap1
  this.hMap1 = temp
}

// from https://threejs.org/examples/js/postprocessing/EffectComposer.js
const FullScreenQuad = (function () {
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const geometry = new PlaneGeometry(2, 2)

  const FullScreenQuad = function (material) {
    this._mesh = new Mesh(geometry, material)
  }

  Object.defineProperty(FullScreenQuad.prototype, 'material', {
    get: function () { return this._mesh.material },
    set: function (value) { this._mesh.material = value },
  })

  Object.assign(FullScreenQuad.prototype, {
    render: function (renderer) {
      renderer.render(this._mesh, camera)
    },
  })

  return FullScreenQuad
})()

export default LiquidEffect
