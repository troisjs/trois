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
  - [x] PerspectiveCamera : aspect, far, fov, near, position
  - [x] Light : position
  - [x] Material : color, depthTest, depthWrite, fog, opacity, transparent
  - [x] Mesh : position, rotation, scale
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
  - [x] Sphere
  - [ ] ...
- [ ] Meshes
  - [x] Box
  - [ ] Image (wip)
  - [x] InstancedMesh
  - [x] Plane
  - [x] Sphere
  - [x] Sprite
  - [x] Text
  - [ ] ...
- [ ] Post Processing
  - [x] EffectComposer
  - [x] Renderpass
  - [x] UnrealBloomPass
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
    <Camera :position="{ z: 100 }"></Camera>
    <LambertMaterial id="material"></LambertMaterial>
    <Scene>
      <PointLight :position="{ y: 50, z: 50 }"></PointLight>
      <Box ref="box" :size="10" :rotation="{ y: Math.PI / 4, z: Math.PI / 4 }" material="material"></Box>
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

### Template

```html
<Renderer ref="renderer" :orbit-ctrl="{ enableDamping: true, dampingFactor: 0.05 }" mouse-move="body" :mouse-raycast="true">
  <Camera :position="{ z: 200 }"></Camera>
  <StandardMaterial id="material" :transparent="true" :opacity="0.9" :metalness="0.8" :roughness="0.5"></StandardMaterial>
  <Scene id="scene1" background="#000000">
    <AmbientLight color="#808080"></AmbientLight>
    <PointLight color="#ff6000"></PointLight>
    <PointLight ref="light" color="#0060ff" :intensity="0.5" :position="{ z: 200 }"></PointLight>
    <InstancedMesh ref="imesh" material="material" :count="NUM_INSTANCES">
      <BoxGeometry :width="2" :height="2" :depth="10"></BoxGeometry>
    </InstancedMesh>
  </Scene>
</Renderer>
```

## GLTF

Take a look at [DemoGLTF.vue](/src/components/demos/DemoGLTF.vue).

```html
<GLTFViewer src="test.glb" :camera-position="{ z: 1 }">
  <AmbientLight></AmbientLight>
</GLTFViewer>
```

## Dev

    git clone https://github.com/troisjs/trois
    cd trois
    yarn
    yarn dev
