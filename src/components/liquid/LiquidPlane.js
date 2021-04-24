import { defineComponent, watch } from 'vue'
import { DoubleSide, Mesh, MeshStandardMaterial, PlaneGeometry } from 'three'
import { bindProps, Object3D } from '../../../build/trois.module.js'
import LiquidEffect from './LiquidEffect.js'

export default defineComponent({
  extends: Object3D,
  props: {
    width: { type: Number, default: 10 },
    height: { type: Number, default: 10 },
    widthSegments: { type: Number, default: 200 },
    heightSegments: { type: Number, default: 200 },
    color: { type: [Number, String], default: '#ffffff' },
    metalness: { type: Number, default: 0.75 },
    roughness: { type: Number, default: 0.25 },
  },
  mounted() {
    this.liquidEffect = new LiquidEffect(this.renderer.renderer)
    this.renderer.onMounted(() => {
      this.liquidEffect.renderer = this.renderer.renderer
      this.renderer.onBeforeRender(this.update)
    })

    this.material = new MeshStandardMaterial({
      color: this.color, side: DoubleSide, metalness: this.metalness, roughness: this.roughness,
      onBeforeCompile: shader => {
        shader.uniforms.hmap = { value: this.liquidEffect.hMap.texture }
        shader.vertexShader = "uniform sampler2D hmap;\n" + shader.vertexShader
        const token = '#include <begin_vertex>'
        const customTransform = `
          vec3 transformed = vec3(position);
          vec4 info = texture2D(hmap, uv);
          vNormal = vec3(info.b, sqrt(1.0 - dot(info.ba, info.ba)), info.a).xzy;
          transformed.z = 20. * info.r;
        `
        shader.vertexShader = shader.vertexShader.replace(token, customTransform)
      },
    })
    bindProps(this, ['metalness', 'roughness'], this.material)
    watch(() => this.color, (value) => this.material.color.set(value))

    this.geometry = new PlaneGeometry(this.width, this.height, this.widthSegments, this.heightSegments)
    this.mesh = new Mesh(this.geometry, this.material)
    this.initObject3D(this.mesh)
  },
  unmounted() {
    this.renderer.offBeforeRender(this.update)
  },
  methods: {
    update() {
      this.liquidEffect.update()
    },
  },
})
