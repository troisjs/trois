# VueJS 3 + ViteJS + ThreeJS

I wanted to try to write a lib similar to [react-three-fiber](https://github.com/react-spring/react-three-fiber) but for VueJS.

## PoC

I first made a simple *Proof of Concept*, take a look at [Test1.vue](/src/components/Test1.vue) :

```html
  <Renderer>
    <PerspectiveCamera :position="{ z: 100 }"></PerspectiveCamera>

    <PhongMaterial name="material1" color="#ff0000"></PhongMaterial>
    <LambertMaterial name="material2" color="#0000ff"></LambertMaterial>

    <Scene>
      <PointLight :position="{ y: 50, z: 50 }"></PointLight>
      <Box ref="box" :size="10" material="material1"></Box>
      <Sphere ref="sphere" :radius="10" :position="{ x: 50 }" material="material2"></Sphere>
    </Scene>
  </Renderer>
```

## Test

    git clone https://github.com/troisjs/trois
    cd trois
    yarn
    yarn dev
