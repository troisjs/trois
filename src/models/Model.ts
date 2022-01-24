import { Object3D as TObject3D } from 'three'
import { defineComponent } from 'vue'
import Object3D from '../core/Object3D'

export default defineComponent({
  extends: Object3D,
  emits: ['before-load', 'load', 'progress', 'error'],
  props: {
    src: { type: String, required: true },
  },
  data() {
    return {
      progress: 0,
    }
  },
  methods: {
    onLoad(model: TObject3D) {
      this.$emit('load', model)
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
