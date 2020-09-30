import { DoubleSide, MeshBasicMaterial, PlaneBufferGeometry, TextureLoader } from 'three';
import { watch } from 'vue';
import Mesh from './Mesh.js';

export default {
  emits: ['loaded'],
  extends: Mesh,
  props: {
    src: String,
    width: Number,
    height: Number,
    keepSize: Boolean,
  },
  created() {
    this.createGeometry();
    this.createMaterial();
    this.initMesh();

    watch(() => this.src, this.refreshTexture);

    ['width', 'height'].forEach(p => {
      watch(() => this[p], this.resize);
    });

    if (this.keepSize) this.three.onAfterResize(this.resize);
  },
  methods: {
    createGeometry() {
      this.geometry = new PlaneBufferGeometry(1, 1, 1, 1);
    },
    createMaterial() {
      this.material = new MeshBasicMaterial({ side: DoubleSide, map: this.loadTexture() });
    },
    loadTexture() {
      return new TextureLoader().load(this.src, this.onLoaded);
    },
    refreshTexture() {
      if (this.texture) this.texture.dispose();
      this.material.map = this.loadTexture();
      this.material.needsUpdate = true;
    },
    onLoaded(texture) {
      this.texture = texture;
      this.resize();
      this.$emit('loaded');
    },
    resize() {
      if (!this.texture) return;
      const screen = this.three.size;
      const iW = this.texture.image.width;
      const iH = this.texture.image.height;
      const iRatio = iW / iH;
      let w, h;
      if (this.width && this.height) {
        w = this.width * screen.wWidth / screen.width;
        h = this.height * screen.wHeight / screen.height;
      } else if (this.width) {
        w = this.width * screen.wWidth / screen.width;
        h = w / iRatio;
      } else if (this.height) {
        h = this.height * screen.wHeight / screen.height;
        w = h * iRatio;
      }
      this.mesh.scale.x = w;
      this.mesh.scale.y = h;
    },
  },
  __hmrId: 'Image',
};
