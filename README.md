# ✨ VueJS 3 + ViteJS + ThreeJS ⚡

I wanted to try to write a lib similar to [react-three-fiber](https://github.com/react-spring/react-three-fiber) but for VueJS.

<p>
  <img src="/screenshots/troisjs1.jpg" width="45%" />
  <img src="/screenshots/troisjs2.jpg" width="45%" />
  <img src="/screenshots/troisjs3.jpg" width="45%" />
</p>

Demos : https://troisjs.github.io/trois/

I started from scratch... I don't know if I will have time to maintain this, but feel free to participate :)

I will try to rewrite some of my [WebGL demos](https://codepen.io/collection/AGZywR) to see if this little toy can do the job.

*Trois* is a french word, it means *Three*.

## HMR

Thanks to VueJS/ViteJS, **TroisJS use watchers and HMR to update ThreeJS objects when you update a template**. This means the result in your browser will be automatically updated without reloading all the stuff. **This is really helpful when you are creating a TroisJS Scene**.

- [ ] HMR
  - [x] Scene : add or remove objects (lights, meshes)
  - [x] PerspectiveCamera : aspect, far, fov, near, position
  - [x] Light : castShadow, color, intensity, position, target
    - [x] SpotLight : angle, decay, distance, penumbra
    - [ ] ...
  - [x] Material : color, depthTest, depthWrite, fog, opacity, transparent
    - [x] StandardMaterial : emissive, emissiveIntensity, metalness, roughness
    - [ ] ...
  - [x] Mesh : materialId, position, rotation, scale, castShadow, receiveShadow
    - [x] Box (geometry replace) : size, width, height, depth
    - [x] Plane (geometry replace) : width, height, widthSegments, heightSegments
    - [x] Sphere (geometry replace) : radius, widthSegments, heightSegments
    - [x] Text (geometry replace) : all props except fontSrc (wip)
    - [ ] ...
  - [ ] PostProcessing
    - [x] BokehPass : focus, aperture, maxblur
    - [x] FilmPass : noiseIntensity, scanlinesIntensity, scanlinesCount, grayscale
    - [x] HalftonePass : shape, radius, rotateR, rotateG, rotateB, scatter
    - [x] UnrealBloomPass : strength, radius, threshold
    - [ ] ...
  - [ ] ...

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
  - [x] Phong
  - [x] Standard
  - [x] Physical
  - [x] SubSurface
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
- [ ] Meshes
  - [x] Box
  - [x] Circle
  - [x] Cone
  - [x] Cylinder
  - [x] Dodecahedron
  - [x] Icosahedron
  - [ ] Image (wip)
  - [x] InstancedMesh
  - [x] Lathe
  - [x] Octahedron
  - [x] Plane
  - [x] Polyhedron
  - [x] Ring
  - [x] Sphere
  - [x] Sprite
  - [x] Tetrahedron
  - [x] Text
  - [x] Torus
  - [x] TorusKnot
  - [x] Tube
  - [ ] ...
- [ ] Post Processing
  - [x] EffectComposer
    - [x] BokehPass
    - [x] FilmPass
    - [x] HalftonePass
    - [x] Renderpass
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

I first made a simple *Proof of Concept*, take a look at [Demo1.vue](/src/components/demos/Demo1.vue) :

```html
<template>
  <Renderer ref="renderer">
    <Camera :position="{ z: 100 }" />
    <LambertMaterial id="material" />
    <Scene>
      <PointLight :position="{ y: 50, z: 50 }" />
      <Box ref="box" :size="10" :rotation="{ y: Math.PI / 4, z: Math.PI / 4 }" material="material" />
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

## InstancedMesh

Take a look at [Demo2.vue](/src/components/demos/Demo2.vue).

## GLTF

Take a look at [DemoGLTF.vue](/src/components/demos/DemoGLTF.vue).

```html
<GLTFViewer src="test.glb" :camera-position="{ z: 1 }">
  <AmbientLight />
</GLTFViewer>
```

## Dev

    git clone https://github.com/troisjs/trois
    cd trois
    yarn
    yarn dev
