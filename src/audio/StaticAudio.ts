import { defineComponent, inject } from 'vue'
import { Audio as StaticAudio } from 'three'
import Audio from './Audio'

export default defineComponent({
  extends: Audio,
  name: 'StaticAudio',
  created() {
    
    if (!this.renderer) {
        console.error('Renderer not found')
        return
    }

    if (!this.renderer.audioListener) {
        console.error("No AudioListener component found in the Renderer's child components tree!")
        return
    }

    const staticAudio = new StaticAudio(this.renderer.audioListener)
    this.initAudio( staticAudio )
  },
  __hmrId: 'StaticAudio',
})
