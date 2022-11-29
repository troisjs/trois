import { defineComponent, ComponentPublicInstance, InjectionKey, inject } from 'vue'
import { AudioListener } from 'three'
import Object3D from '../core/Object3D'

//TODO: currently the AudioListener is inheriting Object3D so it must be a 
// child of Scene. However the AudioListener should actually be possible to be 
// a child of Camera... Then again Camera is said to extend Object3D in the
// future... so might be better to refactor Camera first?

export interface AudioListenerSetupInterface {
    audioListener?: AudioListener
  }

export default defineComponent({
  extends: Object3D,
  name: 'AudioListener',
  setup():AudioListenerSetupInterface {
    return {}
  },
  created() {
    this.audioListener = new AudioListener()
    this.initObject3D(this.audioListener)
    
    if (!this.renderer) {
        console.error('Renderer not found')
        return
    }
    this.renderer.audioListener = this.audioListener
  },
  __hmrId: 'AudioListener',
})
