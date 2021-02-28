# ✨ VueJS 3 + ViteJS + ThreeJS ⚡

I wanted to try to write a lib similar to [react-three-fiber](https://github.com/react-spring/react-three-fiber) but for VueJS.

<p>
  <a href="https://troisjs.github.io/trois/"><img src="/screenshots/troisjs1.jpg" width="45%" /></a>
  <a href="https://troisjs.github.io/trois/"><img src="/screenshots/troisjs3.jpg" width="45%" /></a>
  <a href="https://troisjs.github.io/trois/"><img src="/screenshots/troisjs4.jpg" width="45%" /></a>
  <a href="https://troisjs.github.io/trois/"><img src="/screenshots/troisjs5.jpg" width="45%" /></a>
</p>

- 💻 Examples (wip) : https://troisjs.netlify.app/
- 📖 Doc (wip) : https://troisjs.netlify.app/guide/

I started from scratch... I don't know if I will have time to maintain this, but feel free to participate :)

I will try to rewrite some of my [WebGL demos](https://codepen.io/collection/AGZywR) to see if this little toy can do the job.

*Trois* is a french word, it means *Three*.

## HMR

Thanks to VueJS/ViteJS, **TroisJS use watchers and HMR to update ThreeJS objects when you update a template**. This means the result in your browser will be automatically updated without reloading all the stuff. **This is really helpful when you are creating a TroisJS Scene**.

## Features

- [ ] Lights
  - [x] AmbientLight
  - [x] DirectionalLight
  - [x] PointLight
  - [x] SpotLight
  - [ ] ...
- [ ] Materials
  - [x] Basic
  - [x] Lambert
  - [x] Mapcat
  - [x] Phong
  - [x] Physical
  - [x] Standard
  - [x] SubSurface
  - [x] Toon
  - [ ] ...
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
  - [ ] ...
- [ ] Post Processing
  - [x] EffectComposer
    - [x] BokehPass
    - [x] FilmPass
    - [x] FXAAPass
    - [x] HalftonePass
    - [x] Renderpass
    - [x] SMAAPass
    - [x] UnrealBloomPass
    - [ ] ...
- [ ] ...

## Installation

    yarn add troisjs

## Vue plugin

```js
import { TroisJSVuePlugin } from 'troisjs';
app.use(TroisJSVuePlugin);
```

## PoC

I first made a simple *Proof of Concept*, take a look at [Example1.vue](/src/components/examples/Example1.vue) :

```html
<template>
  <Renderer ref="renderer">
    <Camera :position="{ z: 10 }" />
    <Scene>
      <PointLight :position="{ y: 50, z: 50 }" />
      <Box ref="box" :size="1" :rotation="{ y: Math.PI / 4, z: Math.PI / 4 }">
        <LambertMaterial />
      </Box>
    </Scene>
  </Renderer>
</template>

<script>
export default {
  mounted() {
    const renderer = this.$refs.renderer;
    const box = this.$refs.box.mesh;
    renderer.onBeforeRender(() => {
      box.rotation.x += 0.01;
    });
  },
};
</script>
```

## Dev

    git clone https://github.com/troisjs/trois
    cd trois
    yarn
    yarn dev
