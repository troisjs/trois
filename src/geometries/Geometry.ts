import { BufferGeometry } from 'three'
import { defineComponent, inject, watch } from 'vue'

interface MeshInterface {
  setGeometry(geometry: BufferGeometry): void
}

interface GeometryInterface {
  geometry?: BufferGeometry
  mesh?: MeshInterface
  watchProps: string[]
}

function defaultSetup(): GeometryInterface {
  const mesh = inject('mesh') as MeshInterface
  const watchProps: string[] = []
  return { mesh, watchProps }
}

const Geometry = defineComponent({
  props: {
    rotateX: Number,
    rotateY: Number,
    rotateZ: Number,
  },
  setup() {
    return defaultSetup()
  },
  created() {
    if (!this.mesh) {
      console.error('Missing parent Mesh')
      return
    }

    Object.entries(this.$props).forEach(e => this.watchProps.push(e[0]))

    this.createGeometry()
    this.rotateGeometry()
    if (this.geometry) this.mesh.setGeometry(this.geometry)

    this.addWatchers()
  },
  unmounted() {
    this.geometry?.dispose()
  },
  methods: {
    createGeometry() {},
    addWatchers() {
      this.watchProps.forEach(prop => {
        // @ts-ignore
        watch(() => this[prop], () => {
          this.refreshGeometry()
        })
      })
    },
    rotateGeometry() {
      if (this.rotateX) this.geometry?.rotateX(this.rotateX)
      if (this.rotateY) this.geometry?.rotateY(this.rotateY)
      if (this.rotateZ) this.geometry?.rotateZ(this.rotateZ)
    },
    refreshGeometry() {
      const oldGeo = this.geometry
      this.createGeometry()
      this.rotateGeometry()
      if (this.geometry) this.mesh?.setGeometry(this.geometry)
      oldGeo?.dispose()
    },
  },
  render() { return [] },
})

export default Geometry

export function geometryComponent(name, props, createGeometry) {
  return defineComponent({
    name,
    extends: Geometry,
    props,
    setup() {
      return defaultSetup()
    },
    methods: {
      createGeometry() {
        this.geometry = createGeometry(this)
      },
    },
    // __hmrId: name,
  })
}
