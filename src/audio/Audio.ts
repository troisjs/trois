import { Audio as StaticAudio, PositionalAudio, AudioLoader } from 'three'
import { defineComponent, watch } from 'vue'
import Object3D from '../core/Object3D'

type ConcreteAudio = StaticAudio | PositionalAudio

export interface AudioSetupInterface {
  audio?: ConcreteAudio
  streamedAudio?: HTMLAudioElement
}

export default defineComponent({
  extends: Object3D,
  name: 'Audio',
  props: {
    src:  { type: String, required: false },
    volume: { type: Number, default: 1.0 },
    isStreamed: { type: Boolean, default: true }
  },
  setup (): AudioSetupInterface {
    let streamedAudio = new Audio();
    return { streamedAudio }
  },
  watch: {
    volume: function(value) {
        this.audio?.setVolume(value)
    },
    src: function(value) {
        this.stop()
        this.loadAudioAndPlay()
    }
  },
  methods: {
    initAudio(audio: ConcreteAudio) {
      this.audio = audio
      this.initObject3D(this.audio)
      this.loadAudioAndPlay()
    },
    loadAudioAndPlay() {
      if (!this.src) return undefined

      if (this.isStreamed) {
        this.loadAudioFromStream()
      } else {
        this.loadAudioFromMemory()
      }
    },
    loadAudioFromMemory() {
        const audioLoader = new AudioLoader();
        const instance = this
        audioLoader.load(this.src!, function( buffer ) {
            console.log('loaded audio from memory')
            instance.audio?.setBuffer( buffer );
            instance.play()
        });
    },
    loadAudioFromStream() {
        this.streamedAudio = new Audio(this.src);
        this.streamedAudio.loop = true;
        this.streamedAudio.preload = 'metadata';
        this.streamedAudio.crossOrigin = 'anonymous';
        const instance = this
        this.streamedAudio.addEventListener("loadedmetadata", function(_event) {
            console.log('loaded audio from stream')
            instance.play()
        });
        this.audio?.setMediaElementSource(this.streamedAudio)
    },
    play() {
        if (this.isStreamed) {
            this.streamedAudio?.play()
        } else {
            this.audio?.play()
        }
    },
    stop() {
        if (this.isStreamed) {
            if (!this.streamedAudio) { return }
            this.streamedAudio.pause()
            this.streamedAudio.currentTime = 0;
        } else {
            this.audio?.stop()
        }
    }
  },
  __hmrId: 'Audio',
})
