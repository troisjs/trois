# VueJS 3 + ViteJS + ThreeJS

I wanted to try to write a lib similar to [react-three-fiber](https://github.com/react-spring/react-three-fiber) but for VueJS.

## PoC

I first made a simple *Proof of Concept*, take a look at [Test.vue](/src/components/Test.vue) :

```html
  <Renderer ref="renderer" :animate="anim">
    <PerspectiveCamera :position="{ z: 100 }"></PerspectiveCamera>

    <PhongMaterial name="mat1" color="#ff0000"></PhongMaterial>
    <LambertMaterial name="mat2" color="#0000ff"></LambertMaterial>

    <Scene>
      <PointLight :position="{ x: 0, y: 50, z: 50 }"></PointLight>
      <Box ref="box" :size="10" :rotation="{ x: 0.5, y: 0.25 }" material="mat1"></Box>
      <Sphere ref="sphere" :radius="10" :position="{ x: 50 }" material="mat2"></Sphere>
    </Scene>
  </Renderer>
```

## Test

    git clone https://github.com/troisjs/trois
    cd trois
    yarn
    yarn dev
