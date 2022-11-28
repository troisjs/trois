import { defineComponent, inject } from 'vue'
import { Audio as StaticAudio } from 'three'
import { RendererInjectionKey } from './../core/Renderer'
import Audio from './Audio'

export default defineComponent({
  extends: Audio,
  name: 'StaticAudio',
  created() {
    const renderer = inject(RendererInjectionKey)
    
    if (!renderer) {
        console.error('Renderer not found')
        return
    }

    if (!renderer.audioListener) {
        console.error("No AudioListener component found in the Renderer's child components tree!")
        return
    }

    const staticAudio = new StaticAudio(renderer.audioListener)
    this.initAudio( staticAudio )
  },
  __hmrId: 'StaticAudio',
})
