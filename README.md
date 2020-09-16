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
  <Renderer>
    <PerspectiveCamera :position="{ z: 100 }"></PerspectiveCamera>
    <PhongMaterial id="material1" color="#ff0000"></PhongMaterial>
    <LambertMaterial id="material2" color="#0000ff"></LambertMaterial>
    <Scene>
      <PointLight :position="{ y: 50, z: 50 }"></PointLight>
      <Box ref="box" :size="10" material="material1"></Box>
      <Sphere ref="sphere" :radius="10" :position="{ x: 50 }" material="material2"></Sphere>
    </Scene>
  </Renderer>
```

## InstancedMesh

Take a look at [Test3.vue](/src/components/Test3.vue).

### Template

```html
<Renderer ref="renderer" :orbit-ctrl="{ enableDamping: true, dampingFactor: 0.05 }">
  <Camera :position="{ z: 100 }"></Camera>
  <PhongMaterial id="material" color="#ffffff"></PhongMaterial>
  <Scene id="scene1">
    <PointLight color="#ffffff" :intensity="0.5" :position="{ y: 50, z: 50 }"></PointLight>
    <PointLight color="#ff0000" :intensity="0.5" :position="{ y: -50, z: 50 }"></PointLight>
    <InstancedMesh ref="imesh" material="material" :count="1000">
      <SphereGeometry :radius="2"></SphereGeometry>
    </InstancedMesh>
  </Scene>
</Renderer>
```

### Script : init instanceMatrix

```js
const { randFloat: rnd, randFloatSpread: rndFS } = MathUtils;
const imesh = this.$refs.imesh.mesh;
const dummy = new Object3D();
for (let i = 0; i < 1000; i++) {
  dummy.position.set(rndFS(100), rndFS(100), rndFS(100));
  const scale = rnd(0.2, 1);
  dummy.scale.set(scale, scale, scale);
  dummy.updateMatrix();
  imesh.setMatrixAt(i, dummy.matrix);
}
imesh.instanceMatrix.needsUpdate = true;
```

## GLTF

Take a look at [TestGLTF.vue](/src/components/TestGLTF.vue).

```html
<GLTFViewer src="test.glb" :camera-position="{ z: 1 }">
  <AmbientLight></AmbientLight>
</GLTFViewer>
```

## Test

    git clone https://github.com/troisjs/trois
    cd trois
    yarn
    yarn dev
