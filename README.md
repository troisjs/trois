# ✨ ThreeJS + VueJS 3 + ViteJS ⚡
[![NPM Package][npm]][npm-url]
[![Build Size][build-size]][build-size-url]
[![NPM Downloads][npm-downloads]][npmtrends-url]
[![Twitter][twitter]][twitter-url]

[npm]: https://img.shields.io/npm/v/troisjs
[npm-url]: https://www.npmjs.com/package/troisjs
[build-size]: https://badgen.net/bundlephobia/minzip/troisjs
[build-size-url]: https://bundlephobia.com/result?p=troisjs
[npm-downloads]: https://img.shields.io/npm/dw/troisjs
[npmtrends-url]: https://www.npmtrends.com/troisjs
[twitter]: https://img.shields.io/twitter/follow/soju22?label=&style=social
[twitter-url]: https://twitter.com/soju22

<p style="text-align:center;">
  <a href="https://troisjs-flower.pages.dev"><img src="/screenshots/troisjs_15.jpg" width="24%" /></a>
  <a href="https://troisjs-water.pages.dev"><img src="/screenshots/troisjs_14.jpg" width="24%" /></a>
  <a href="https://troisjs-dof-test.pages.dev"><img src="/screenshots/troisjs_13.jpg" width="24%" /></a>
  <a href="https://troisjs.github.io/little-planet/"><img src="/screenshots/little-planet.jpg" width="24%" /></a>
  <a href="https://troisjs.github.io/examples/physics/1.html"><img src="/screenshots/troisjs_10.jpg" width="24%" /></a>
  <a href="https://troisjs-trails.pages.dev"><img src="/screenshots/troisjs_12.jpg" width="24%" /></a>
  <a href="https://troisjs.github.io/examples/demos/2.html"><img src="/screenshots/troisjs_5.jpg" width="24%" /></a>
  <a href="https://troisjs.github.io/examples/materials/2.html"><img src="/screenshots/troisjs_2.jpg" width="24%" /></a>
  <a href="https://troisjs.github.io/examples/loop.html"><img src="/screenshots/troisjs_6.jpg" width="24%" /></a>
  <a href="https://troisjs.github.io/examples/shadows.html"><img src="/screenshots/troisjs_7.jpg" width="24%" /></a>
  <a href="https://troisjs.github.io/examples/demos/5.html"><img src="/screenshots/troisjs_8.jpg" width="24%" /></a>
  <a href="https://troisjs.github.io/examples/lights.html"><img src="/screenshots/troisjs_9.jpg" width="24%" /></a>
</p>

- 💻 Examples (wip) : https://troisjs.github.io/ ([sources](https://github.com/troisjs/troisjs.github.io/tree/master/src/components))
- 📖 Doc (wip) : https://troisjs.github.io/guide/ ([repo](https://github.com/troisjs/troisjs.github.io))
- 🚀 Codepen examples : https://codepen.io/collection/AxoWoz

I wanted to code something similar to *react-three-fiber* but for VueJS.

I started from scratch, I will rewrite some of my [WebGL demos](https://codepen.io/collection/AGZywR) to see if this little toy can do the job.

*Trois* is a french word, it means *Three*.

## Sponsors (Thanks 💙 !!!)

<a href="https://github.com/avaer">
  <img src="https://github.com/avaer.png" width="50px" />
</a>
<a href="https://github.com/designori-llc">
  <img src="https://github.com/designori-llc.png" width="50px" />
</a>
<a href="https://github.com/okydk">
  <img src="https://github.com/okydk.png" width="50px" />
</a>

## Contributors (Thanks 💙 !!!)

<a href="https://github.com/klevron">
  <img src="https://github.com/klevron.png" width="50px" />
</a>
<a href="https://github.com/SaFrMo">
  <img src="https://github.com/SaFrMo.png" width="50px" />
</a>
<a href="https://github.com/yoanngueny">
  <img src="https://github.com/yoanngueny.png" width="50px" />
</a>
<a href="https://github.com/xcchcaptain">
  <img src="https://github.com/xcchcaptain.png" width="50px" />
</a>
<a href="https://github.com/oneWaveAdrian">
  <img src="https://github.com/oneWaveAdrian.png" width="50px" />
</a>

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
  import { createApp } from 'https://unpkg.com/troisjs@0.3.2/build/trois.module.cdn.min.js';
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
