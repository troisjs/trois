import { defineComponent, PropType, watch } from 'vue'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import Mesh, { MeshSetupInterface } from './Mesh'

interface TextSetupInterface extends MeshSetupInterface {
  geometry?: TextGeometry
  font?: Font
}

const props = {
  text: { type: String, required: true, default: 'Text' },
  fontSrc: { type: String, required: true },
  size: { type: Number, default: 80 },
  height: { type: Number, default: 5 },
  depth: { type: Number, default: 1 },
  curveSegments: { type: Number, default: 12 },
  bevelEnabled: { type: Boolean, default: false },
  bevelThickness: { type: Number, default: 10 },
  bevelSize: { type: Number, default: 8 },
  bevelOffset: { type: Number, default: 0 },
  bevelSegments: { type: Number, default: 5 },
  align: { type: [Boolean, String] as PropType<boolean | string>, default: false },
} as const

export default defineComponent({
  extends: Mesh,
  props,
  setup(): TextSetupInterface {
    return {}
  },
  created() {
    if (!this.fontSrc) {
      console.error('Missing required prop: "font-src"')
      return
    }
    // if (!this.text) {
    //   console.error('Missing required prop: "text"')
    //   return
    // }

    // add watchers
    const watchProps = [
      'text', 'size', 'height', 'curveSegments',
      'bevelEnabled', 'bevelThickness', 'bevelSize', 'bevelOffset', 'bevelSegments',
      'align',
    ]
    watchProps.forEach(p => {
      // @ts-ignore
      watch(() => this[p], () => {
        if (this.font) this.refreshGeometry()
      })
    })

    const loader = new FontLoader()
    this.loading = true
    loader.load(this.fontSrc, (font) => {
      this.loading = false
      this.font = font
      this.createGeometry()
      this.initMesh()
    })
  },
  methods: {
    createGeometry() {
      this.geometry = new TextGeometry(this.text, {
        // @ts-ignore
        font: this.font,
        size: this.size,
        height: this.height,
        depth: this.depth,
        curveSegments: this.curveSegments,
        bevelEnabled: this.bevelEnabled,
        bevelThickness: this.bevelThickness,
        bevelSize: this.bevelSize,
        bevelOffset: this.bevelOffset,
        bevelSegments: this.bevelSegments,
      })

      if (this.align === 'center') {
        this.geometry.center()
      }
    },
  },
})
