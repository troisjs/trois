import {
  DoubleSide,
  InstancedBufferAttribute,
  InstancedMesh,
  MathUtils,
  MeshBasicMaterial,
  Object3D,
  Vector2,
  Vector3,
} from 'three'

import { Geometry, Face3 } from 'three/examples/jsm/deprecated/Geometry.js'

export default class AnimatedPlane {
  constructor(params) {
    Object.entries(params).forEach(([key, value]) => {
      this[key] = value
    })

    this.o3d = new Object3D()
    this.uProgress = { value: 0 }
    this.uvScale = new Vector2()

    this.initMaterial()
    this.initPlane()
  }

  initMaterial() {
    this.material = new MeshBasicMaterial({
      side: DoubleSide,
      transparent: true,
      map: this.texture,
      onBeforeCompile: shader => {
        shader.uniforms.progress = this.uProgress
        shader.uniforms.uvScale = { value: this.uvScale }
        shader.vertexShader = `
          uniform float progress;
          uniform vec2 uvScale;

          attribute vec3 offset;
          attribute vec3 rotation;
          attribute vec2 uvOffset;

          mat3 rotationMatrixXYZ(vec3 r)
          {
            float cx = cos(r.x);
            float sx = sin(r.x);
            float cy = cos(r.y);
            float sy = sin(r.y);
            float cz = cos(r.z);
            float sz = sin(r.z);

            return mat3(
               cy * cz, cx * sz + sx * sy * cz, sx * sz - cx * sy * cz,
              -cy * sz, cx * cz - sx * sy * sz, sx * cz + cx * sy * sz,
                    sy,               -sx * cy,                cx * cy
            );
          }
        ` + shader.vertexShader

        shader.vertexShader = shader.vertexShader.replace('#include <uv_vertex>', `
          #include <uv_vertex>
          vUv = vUv * uvScale + uvOffset;
        `)

        shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', `
          mat3 rotMat = rotationMatrixXYZ(progress * rotation);
          transformed = rotMat * transformed;

          vec4 mvPosition = vec4(transformed, 1.0);
          #ifdef USE_INSTANCING
            mvPosition = instanceMatrix * mvPosition;
          #endif

          mvPosition.xyz += progress * offset;

          mvPosition = modelViewMatrix * mvPosition;
          gl_Position = projectionMatrix * mvPosition;
        `)
      },
    })
  }

  initPlane() {
    const { width, wWidth, wHeight } = this.screen
    this.wSize = this.size * wWidth / width
    this.nx = Math.ceil(wWidth / this.wSize) + 1
    this.ny = Math.ceil(wHeight / this.wSize) + 1
    this.icount = this.nx * this.ny

    this.initGeometry()
    this.initUV()
    this.initAnimAttributes()

    if (this.imesh) {
      this.o3d.remove(this.imesh)
    }
    this.imesh = new InstancedMesh(this.bGeometry, this.material, this.icount)
    this.o3d.add(this.imesh)

    const dummy = new Object3D()
    let index = 0
    let x = -(wWidth - (wWidth - this.nx * this.wSize)) / 2 + this.dx
    for (let i = 0; i < this.nx; i++) {
      let y = -(wHeight - (wHeight - this.ny * this.wSize)) / 2 + this.dy
      for (let j = 0; j < this.ny; j++) {
        dummy.position.set(x, y, 0)
        dummy.updateMatrix()
        this.imesh.setMatrixAt(index++, dummy.matrix)
        y += this.wSize
      }
      x += this.wSize
    }
  }

  initGeometry() {
    // square
    const geometry = new Geometry()
    geometry.vertices.push(new Vector3(0, 0, 0))
    geometry.vertices.push(new Vector3(this.wSize, 0, 0))
    geometry.vertices.push(new Vector3(0, this.wSize, 0))
    geometry.vertices.push(new Vector3(this.wSize, this.wSize, 0))
    geometry.faces.push(new Face3(0, 2, 1))
    geometry.faces.push(new Face3(2, 3, 1))

    geometry.faceVertexUvs[0].push([
      new Vector2(0, 0),
      new Vector2(0, 1),
      new Vector2(1, 0),
    ])
    geometry.faceVertexUvs[0].push([
      new Vector2(0, 1),
      new Vector2(1, 1),
      new Vector2(1, 0),
    ])

    // geometry.computeFaceNormals();
    // geometry.computeVertexNormals();

    // center
    this.dx = this.wSize / 2
    this.dy = this.wSize / 2
    geometry.translate(-this.dx, -this.dy, 0)

    this.bGeometry = geometry.toBufferGeometry()
  }

  initAnimAttributes() {
    const { randFloat: rnd, randFloatSpread: rndFS } = MathUtils
    const v3 = new Vector3()

    const offsets = new Float32Array(this.icount * 3)
    for (let i = 0; i < offsets.length; i += 3) {
      if (this.anim === 1) v3.set(rndFS(10), rnd(50, 100), rnd(20, 50)).toArray(offsets, i)
      else v3.set(rndFS(20), rndFS(20), rnd(20, 200)).toArray(offsets, i)
    }
    this.bGeometry.setAttribute('offset', new InstancedBufferAttribute(offsets, 3))

    const rotations = new Float32Array(this.icount * 3)
    const angle = Math.PI * 4
    for (let i = 0; i < rotations.length; i += 3) {
      rotations[i] = rndFS(angle)
      rotations[i + 1] = rndFS(angle)
      rotations[i + 2] = rndFS(angle)
    }
    this.bGeometry.setAttribute('rotation', new InstancedBufferAttribute(rotations, 3))
  }

  initUV() {
    const ratio = this.nx / this.ny
    const tRatio = this.texture.image.width / this.texture.image.height
    if (ratio > tRatio) this.uvScale.set(1 / this.nx, (tRatio / ratio) / this.ny)
    else this.uvScale.set((ratio / tRatio) / this.nx, 1 / this.ny)
    const nW = this.uvScale.x * this.nx
    const nH = this.uvScale.y * this.ny

    const v2 = new Vector2()
    const uvOffsets = new Float32Array(this.icount * 2)
    for (let i = 0; i < this.nx; i++) {
      for (let j = 0; j < this.ny; j++) {
        v2.set(
          this.uvScale.x * i + (1 - nW) / 2,
          this.uvScale.y * j + (1 - nH) / 2
        ).toArray(uvOffsets, (i * this.ny + j) * 2)
      }
    }
    this.bGeometry.setAttribute('uvOffset', new InstancedBufferAttribute(uvOffsets, 2))
  }

  setTexture(texture) {
    this.texture = texture
    this.material.map = texture
    this.initUV()
  }

  resize() {
    this.initPlane()
  }
}
