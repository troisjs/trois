# ✨ ThreeJS + VueJS 3 + ViteJS ⚡

I wanted to code something similar to [react-three-fiber](https://github.com/react-spring/react-three-fiber) but for VueJS.

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

I started from scratch, I will rewrite some of my [WebGL demos](https://codepen.io/collection/AGZywR) to see if this little toy can do the job.

*Trois* is a french word, it means *Three*.

## HMR

Thanks to VueJS/ViteJS, **TroisJS use watchers and HMR to update ThreeJS objects when you update a template or a prop**. This means the result in your browser will be automatically updated without reloading all the stuff. **This is really helpful when you are creating a TroisJS Scene**.

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
