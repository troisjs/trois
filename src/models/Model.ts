import { Object3D as TObject3D, Group, Material, Mesh, MeshStandardMaterial } from 'three'
import { defineComponent } from 'vue'
import Object3D from '../core/Object3D'

function isMesh(toCheck: TObject3D): toCheck is Mesh {
  return toCheck.type === 'Mesh'
}
function isMeshStandardMaterial(
  toCheck: Material
): toCheck is MeshStandardMaterial {
  return (toCheck as MeshStandardMaterial).metalness !== undefined
}

export default defineComponent({
  extends: Object3D,
  emits: ['load', 'progress', 'error'],
  props: {
    src: { type: String, required: true },
    metalness: { type: [Boolean, Number], default: false }
  },
  data() {
    return {
      progress: 0,
    }
  },
  mounted() {
    // set all metalness to desired value
    if (this.metalness !== false) {
      // figure out target metalness (default = 0)
      let targetMetalness = typeof this.metalness === 'boolean' ? 0 : this.metalness

      // for all children in the hierarchy, set their metalness to desired value
      // OR keep traversing down if childn is a group.
      this.allChildren((child: Group | Mesh) => {
        if (isMesh(child)) {
          if (Array.isArray(child.material)) {
            // handle multiple materials
            child.material.forEach((mat) => {
              if (isMeshStandardMaterial(mat)) {
                mat.metalness = targetMetalness
              }
            })
          } else if (isMeshStandardMaterial(child.material)) {
            // handle single material
            child.material.metalness = targetMetalness
          }
        }
      })
    }
  },
  methods: {
    onLoad(model: TObject3D) {
      this.$emit('load', model)
      this.initObject3D(model)
    },
    onProgress(progress: ProgressEvent) {
      this.progress = progress.loaded / progress.total
      this.$emit('progress', progress)
    },
    onError(error: ErrorEvent) {
      this.$emit('error', error)
    },
  },
})
