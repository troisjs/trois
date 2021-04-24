<template>
  <Renderer ref="renderer" antialias resize>
    <Camera ref="camera" :position="{ z: 150 }"></Camera>
    <Scene ref="scene">
    </Scene>
  </Renderer>
</template>

<script>
import { defineComponent } from 'vue'
import { Object3D } from 'three'
import { gsap, Power4 } from 'gsap'

import { lerp, useTextures, Camera, Renderer, Scene } from '../../../build/trois.module.js'
import AnimatedPlane from './AnimatedPlane.js'

export default defineComponent({
  components: { Camera, Renderer, Scene },
  props: {
    images: Array,
    events: { type: Object, default: () => { return { wheel: true, click: true, keyup: true } } },
  },
  setup() {
    const loader = useTextures()
    return {
      loader,
      progress: 0,
      targetProgress: 0,
    }
  },
  mounted() {
    this.renderer = this.$refs.renderer
    this.three = this.renderer.three

    if (this.images.length < 2) {
      console.error('This slider needs at least 2 images.')
    } else {
      this.loader.loadTextures(this.images, this.init)
    }
  },
  unmounted() {
    this.loader.dispose()
    const domElement = this.renderer.renderer.domElement
    domElement.removeEventListener('click', this.onClick)
    domElement.removeEventListener('wheel', this.onWheel)
    document.removeEventListener('keyup', this.onKeyup)
  },
  methods: {
    init() {
      this.initScene()

      gsap.fromTo(this.plane1.uProgress,
        {
          value: -2,
        },
        {
          value: 0,
          duration: 2.5,
          ease: Power4.easeOut,
        }
      )

      const domElement = this.renderer.renderer.domElement
      if (this.events.click) domElement.addEventListener('click', this.onClick)
      if (this.events.wheel) domElement.addEventListener('wheel', this.onWheel)
      if (this.events.keyup) document.addEventListener('keyup', this.onKeyup)
      this.renderer.onBeforeRender(this.updateProgress)
      this.renderer.onResize(this.onResize)
    },
    initScene() {
      const renderer = this.renderer.renderer
      const scene = this.$refs.scene.scene

      this.plane1 = new AnimatedPlane({
        renderer, screen: this.renderer.size,
        size: 10,
        anim: 1,
        texture: this.loader.textures[0],
      })

      this.plane2 = new AnimatedPlane({
        renderer, screen: this.renderer.size,
        size: 10,
        anim: 2,
        texture: this.loader.textures[1],
      })

      this.setPlanesProgress(0)
      this.planes = new Object3D()
      this.planes.add(this.plane1.o3d)
      this.planes.add(this.plane2.o3d)
      scene.add(this.planes)
    },
    onResize() {
      this.plane1.resize()
      this.plane2.resize()
    },
    onWheel(e) {
      // e.preventDefault()
      if (e.deltaY > 0) {
        this.setTargetProgress(this.targetProgress + 1 / 20)
      } else {
        this.setTargetProgress(this.targetProgress - 1 / 20)
      }
    },
    onClick(e) {
      if (e.clientY < this.renderer.size.height / 2) {
        this.navPrevious()
      } else {
        this.navNext()
      }
    },
    onKeyup(e) {
      if (e.keyCode === 37 || e.keyCode === 38) {
        this.navPrevious()
      } else if (e.keyCode === 39 || e.keyCode === 40) {
        this.navNext()
      }
    },
    navNext() {
      if (Number.isInteger(this.targetProgress)) this.setTargetProgress(this.targetProgress + 1)
      else this.setTargetProgress(Math.ceil(this.targetProgress))
    },
    navPrevious() {
      if (Number.isInteger(this.targetProgress)) this.setTargetProgress(this.targetProgress - 1)
      else this.setTargetProgress(Math.floor(this.targetProgress))
    },
    setTargetProgress(value) {
      this.targetProgress = value
      if (this.targetProgress < 0) {
        this.progress += this.images.length
        this.targetProgress += this.images.length
      }
    },
    updateProgress() {
      const progress1 = lerp(this.progress, this.targetProgress, 0.1)
      const pdiff = progress1 - this.progress
      if (pdiff === 0) return

      const p0 = this.progress % 1
      const p1 = progress1 % 1
      if ((pdiff > 0 && p1 < p0) || (pdiff < 0 && p0 < p1)) {
        const i = Math.floor(progress1) % this.images.length
        const j = (i + 1) % this.images.length
        this.plane1.setTexture(this.loader.textures[i])
        this.plane2.setTexture(this.loader.textures[j])
      }

      this.progress = progress1
      this.setPlanesProgress(this.progress % 1)
    },
    setPlanesProgress(progress) {
      this.plane1.uProgress.value = progress
      this.plane2.uProgress.value = -1 + progress
      this.plane1.material.opacity = 1 - progress
      this.plane2.material.opacity = progress
      this.plane1.o3d.position.z = progress
      this.plane2.o3d.position.z = progress - 1
    },
  },
})
</script>
