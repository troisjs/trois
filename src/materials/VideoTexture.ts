import { defineComponent, watch } from 'vue'
import { VideoTexture } from 'three'
import Texture from './Texture'

export default defineComponent({
  extends: Texture,
  props: {
    videoId: {
      type: String,
      required: true,
    },
  },
  created() {
    watch(() => this.videoId, this.refreshTexture)
  },
  methods: {
    createTexture() {
      const video = document.getElementById(this.videoId) as HTMLVideoElement
      return new VideoTexture(video)
    },
  },
})
