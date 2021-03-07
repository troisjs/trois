# ✨ ThreeJS + VueJS 3 + ViteJS ⚡

*Trois* is a french word, it means *Three*.

<p>
  <a href="https://troisjs.github.io/examples/demos/3.html"><img src="/screenshots/troisjs_1.jpg" width="30%" /></a>
  <a href="https://troisjs.github.io/examples/demos/4.html"><img src="/screenshots/troisjs_3.jpg" width="30%" /></a>
  <a href="https://troisjs.github.io/examples/demos/1.html"><img src="/screenshots/troisjs_4.jpg" width="30%" /></a>
  <a href="https://troisjs.github.io/examples/demos/2.html"><img src="/screenshots/troisjs_5.jpg" width="30%" /></a>
  <a href="https://troisjs.github.io/examples/materials/2.html"><img src="/screenshots/troisjs_2.jpg" width="30%" /></a>
  <a href="https://troisjs.github.io/examples/loop.html"><img src="/screenshots/troisjs_6.jpg" width="30%" /></a>
  <a href="https://troisjs.github.io/examples/shadows.html"><img src="/screenshots/troisjs_7.jpg" width="30%" /></a>
  <a href="https://troisjs.github.io/examples/demos/5.html"><img src="/screenshots/troisjs_8.jpg" width="30%" /></a>
  <a href="https://troisjs.github.io/examples/lights.html"><img src="/screenshots/troisjs_9.jpg" width="30%" /></a>

</p>

- 💻 Examples (wip) : https://troisjs.github.io/ ([sources](https://github.com/troisjs/troisjs.github.io/tree/master/src/components))
- 📖 Doc (wip) : https://troisjs.github.io/guide/ ([repo](https://github.com/troisjs/troisjs.github.io))
- 🚀 Codepen examples : https://codepen.io/collection/AxoWoz

I wanted to code something similar to *react-three-fiber* but for VueJS.

I started from scratch, I will rewrite some of my [WebGL demos](https://codepen.io/collection/AGZywR) to see if this little toy can do the job.

## Usage (CDN)

TroisJS is really simple and easy to use :

```html
<div id="app">
  <renderer ref="renderer" antialias orbit-ctrl resize="window">
    <camera :position="{ z: 10 }"></camera>
    <scene>
      <point-light :position="{ y: 50, z: 50 }"></point-light>
      <box ref="box" :rotation="{ y: Math.PI / 4, z: Math.PI / 4 }">
        <lambert-material></lambert-material>
      </box>
    </scene>
  </renderer>
</div>

<script type="module">
  import { createApp } from 'https://unpkg.com/troisjs@0.1.12/build/trois.module.cdn.min.js';
  createApp({
    mounted() {
      const renderer = this.$refs.renderer;
      const box = this.$refs.box.mesh;
      renderer.onBeforeRender(() => {
        box.rotation.x += 0.01;
      });
    }
  }).mount('#app');;
</script>
```

Read more on https://troisjs.github.io/guide/

## HMR

Thanks to VueJS/ViteJS, **TroisJS use watchers and HMR to update ThreeJS objects when you update a template or a prop**. This means the result in your browser will be automatically updated without reloading all the stuff. **This is really helpful when you are creating a TroisJS Scene**.

## Features

- [ ] Lights
  - [x] AmbientLight
  - [x] DirectionalLight
  - [x] HemisphereLight
  - [x] PointLight
  - [x] RectAreaLight
  - [x] SpotLight
- [ ] Materials
  - [x] Basic
  - [x] Lambert
  - [x] Mapcap
  - [x] Phong
  - [x] Physical
  - [x] Standard
  - [x] SubSurface
  - [x] Toon
- [ ] Geometries
  - [x] Box
  - [x] Circle
  - [x] Cone
  - [x] Cylinder
  - [x] Dodecahedron
  - [x] Icosahedron
  - [x] Lathe
  - [x] Octahedron
  - [x] Polyhedron
  - [x] Ring
  - [x] Sphere
  - [x] Tetrahedron
  - [x] Torus
  - [x] TorusKnot
  - [x] Tube
- [ ] Post Processing
  - [x] EffectComposer
    - [x] BokehPass
    - [x] FilmPass
    - [x] FXAAPass
    - [x] HalftonePass
    - [x] Renderpass
    - [x] SMAAPass
    - [x] UnrealBloomPass
    - [x] TiltShiftPass
    - [x] ZoomBlurPass
