import { defineComponent, inject } from 'vue'
import { PositionalAudio } from 'three'
import Audio from './Audio'
import { bindProp } from '../tools'

export default defineComponent({
  extends: Audio,
  name: 'PositionalAudio',
  props: {
    refDistance: { type: Number, default: 1.0 },
    rolloffFactor: { type: Number, default: 1.0 }
  },
  created() {

    if (!this.renderer) {
        console.error('Renderer not found')
        return
    }

    if (!this.renderer.audioListener) {
        console.error("No AudioListener component found in the Renderer's child components tree!")
        return
    }

    const positionalAudio = new PositionalAudio(this.renderer.audioListener)
    this.initAudio(positionalAudio)
    this.bindProps()
  },
  methods: {
    bindProps(audio: PositionalAudio) {
      ['refDistance', 'rolloffFactor'].forEach(p => {
        bindProp(this.$props, p, this.audio)
      })
    },
  },
  __hmrId: 'AudioTest',
})
