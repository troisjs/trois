<template>
  <Renderer ref="renderer">
    <Camera ref="camera" :position="{ z: 150 }"></Camera>
    <Scene ref="scene">
    </Scene>
  </Renderer>
</template>

<script>
import { Object3D } from 'three';
import { gsap, Power4 } from 'gsap';
import { lerp, limit } from '../../tools.js';
import AnimatedPlane from './AnimatedPlane.js';
import useTextures from './useTextures';

export default {
  props: {
    images: Array,
    events: { type: Object, default: () => { return { wheel: true, click: true, keyup: true }; } },
  },
  setup() {
    const { textures, loadTextures } = useTextures();
    return {
      textures,
      loadTextures,
      progress: 0,
      targetProgress: 0,
    };
  },
  mounted() {
    this.three = this.$refs.renderer.three;

    if (this.images.length < 2) {
      console.error('This slider needs at least 2 images.');
    } else {
      this.loadTextures(this.images, this.init);
    }
  },
  unmounted() {
    document.removeEventListener('click', this.onClick);
    document.removeEventListener('keyup', this.onKeyup);
    window.removeEventListener('wheel', this.onWheel);
  },
  methods: {
    init() {
      this.initScene();

      gsap.fromTo(this.plane1.uProgress,
        {
          value: -2,
        },
        {
          value: 0,
          duration: 2.5,
          ease: Power4.easeOut,
        }
      );

      if (this.events.click) document.addEventListener('click', this.onClick);
      if (this.events.keyup) document.addEventListener('keyup', this.onKeyup);
      if (this.events.wheel) window.addEventListener('wheel', this.onWheel);
      this.three.onBeforeRender(this.updateProgress);
      this.three.onAfterResize(this.onResize);
    },
    initScene() {
      const renderer = this.three.renderer;
      const scene = this.$refs.scene.scene;

      this.plane1 = new AnimatedPlane({
        renderer, screen: this.three.size,
        size: 10,
        anim: 1,
        texture: this.textures[0],
      });

      this.plane2 = new AnimatedPlane({
        renderer, screen: this.three.size,
        size: 10,
        anim: 2,
        texture: this.textures[1],
      });

      this.setPlanesProgress(0);
      this.planes = new Object3D();
      this.planes.add(this.plane1.o3d);
      this.planes.add(this.plane2.o3d);
      scene.add(this.planes);
    },
    onResize() {
      this.plane1.resize();
      this.plane2.resize();
    },
    onWheel(e) {
      // e.preventDefault();
      if (e.deltaY > 0) {
        this.targetProgress = limit(this.targetProgress + 1 / 20, 0, this.images.length - 1);
      } else {
        this.targetProgress = limit(this.targetProgress - 1 / 20, 0, this.images.length - 1);
      }
    },
    onClick(e) {
      if (e.clientY < this.three.size.height / 2) {
        this.navPrevious();
      } else {
        this.navNext();
      }
    },
    onKeyup(e) {
      if (e.keyCode === 37 || e.keyCode === 38) {
        this.navPrevious();
      } else if (e.keyCode === 39 || e.keyCode === 40) {
        this.navNext();
      }
    },
    navNext() {
      if (Number.isInteger(this.targetProgress)) this.targetProgress += 1;
      else this.targetProgress = Math.ceil(this.targetProgress);
      this.targetProgress = limit(this.targetProgress, 0, this.images.length - 1);
    },
    navPrevious() {
      if (Number.isInteger(this.targetProgress)) this.targetProgress -= 1;
      else this.targetProgress = Math.floor(this.targetProgress);
      this.targetProgress = limit(this.targetProgress, 0, this.images.length - 1);
    },
    updateProgress() {
      const progress1 = lerp(this.progress, this.targetProgress, 0.1);
      const pdiff = progress1 - this.progress;
      if (pdiff === 0) return;

      const p0 = this.progress % 1;
      const p1 = progress1 % 1;
      if ((pdiff > 0 && p1 < p0) || (pdiff < 0 && p0 < p1)) {
        const i = Math.floor(progress1);
        this.plane1.setTexture(this.textures[i]);
        this.plane2.setTexture(this.textures[i + 1]);
      }

      this.progress = progress1;
      this.setPlanesProgress(this.progress % 1);
    },
    setPlanesProgress(progress) {
      this.plane1.uProgress.value = progress;
      this.plane2.uProgress.value = -1 + progress;
      this.plane1.material.opacity = 1 - progress;
      this.plane2.material.opacity = progress;
      this.plane1.o3d.position.z = progress;
      this.plane2.o3d.position.z = progress - 1;
    },
  },
};
</script>
