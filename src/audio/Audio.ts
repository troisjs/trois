import { Audio as StaticAudio, PositionalAudio, AudioLoader } from 'three'
import { defineComponent } from 'vue'
import Object3D from '../core/Object3D'
import { bindProp } from '../tools'

export interface AudioSetupInterface {
  streamMediaElement?: HTMLAudioElement
}

type ConcreteAudio = StaticAudio | PositionalAudio

export default defineComponent({
  extends: Object3D,
  name: 'Audio',
  props: {
    src: String,
    volume: { type: Number, default: 1.0 },
    isStreamed: { type: Boolean, default: true }
  },
  setup (): AudioSetupInterface {
    let streamMediaElement = new Audio();
    return { streamMediaElement }
  },
  methods: {
    initAudio(audio: ConcreteAudio) {
      this.initObject3D(audio)
      this.bindProps(audio)
      this.loadAudioAndPlay(audio)
    },
    bindProps(audio: ConcreteAudio) {
      ['volume', 'isStreamed'].forEach(p => {
        bindProp(this.$props, p, audio)
      })
    },
    loadAudioAndPlay(audio: ConcreteAudio) {
      if (!this.src) return undefined

      if (this.isStreamed) {
        this.loadAudioFromStream(audio, this.src)
      } else {
        this.loadAudioFromMemory(audio, this.src)
      }
    },
    loadAudioFromMemory(audio:ConcreteAudio, src:string) {
        const audioLoader = new AudioLoader();
        const instance = this
        audioLoader.load( src, function( buffer ) {
          audio.setBuffer( buffer );
          instance.play(audio)
        });
    },
    loadAudioFromStream(audio:ConcreteAudio, src:string) {
        this.streamMediaElement = new Audio(src);
        this.streamMediaElement.loop = true;
        this.streamMediaElement.preload = 'metadata';
        this.streamMediaElement.crossOrigin = 'anonymous';
        const instance = this
        this.streamMediaElement.addEventListener("loadedmetadata", function(_event) {
            console.log('loaded the stream')
            instance.play(audio)
        });
        audio.setMediaElementSource(this.streamMediaElement)
    },
    play(audio:ConcreteAudio) {
        if (this.isStreamed) {
            if (!this.streamMediaElement) { return }
            this.streamMediaElement.play()
        } else {
            audio.play()
        }
    },
    stop(audio:ConcreteAudio) {
        if (this.isStreamed) {
            if (!this.streamMediaElement) { return }
            this.streamMediaElement.pause()
            this.streamMediaElement.currentTime = 0;
        } else {
            audio.stop()
        }
    }
  },
  __hmrId: 'Audio',
})
