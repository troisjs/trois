# ✨ VueJS 3 + ViteJS + ThreeJS ⚡

I wanted to try to write a lib similar to [react-three-fiber](https://github.com/react-spring/react-three-fiber) but for VueJS.

Demos : https://troisjs.github.io/trois/

I started from scratch... I don't know if I will have time to maintain this, but feel free to participate :)

*Trois* is a french word, it means *Three*.

## Installation

    yarn add troisjs

## PoC

I first made a simple *Proof of Concept*, take a look at [Test1.vue](/src/components/Test1.vue) :

```html
<Renderer ref="renderer">
  <Camera :position="{ z: 100 }"></Camera>
  <LambertMaterial id="material"></LambertMaterial>
  <Scene>
    <PointLight :position="{ x: 0, y: 50, z: 50 }"></PointLight>
    <Box ref="box" :size="10" :rotation="{ y: Math.PI / 4, z: Math.PI / 4 }" material="material"></Box>
  </Scene>
</Renderer>
```

## InstancedMesh

Take a look at [Test2.vue](/src/components/Test2.vue).

### Template

```html
<Renderer ref="renderer" :orbit-ctrl="{ enableDamping: true, dampingFactor: 0.05 }" mouse-move="body" :mouse-raycast="true">
  <Camera :position="{ z: 200 }"></Camera>
  <StandardMaterial id="material" :transparent="true" :opacity="0.9" :metalness="0.8" :roughness="0.5"></StandardMaterial>
  <Scene id="scene1" background="#000000">
    <AmbientLight color="#808080"></AmbientLight>
    <PointLight ref="light" color="#ff6000"></PointLight>
    <PointLight ref="light" color="#0060ff" :intensity="0.5" :position="{ z: 200 }"></PointLight>
    <InstancedMesh ref="imesh" material="material" :count="NUM_INSTANCES">
      <BoxGeometry :width="2" :height="2" :depth="10"></BoxGeometry>
    </InstancedMesh>
  </Scene>
</Renderer>
```

## GLTF

Take a look at [TestGLTF.vue](/src/components/TestGLTF.vue).

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
