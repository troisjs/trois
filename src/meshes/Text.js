import { FontLoader, TextBufferGeometry } from 'three';
import { watch } from 'vue';
import Mesh from './Mesh.js';
import TextProps from './TextProps.js';

export default {
  extends: Mesh,
  props: {
    ...TextProps,
  },
  created() {
    // add watchers
    const watchProps = [
      'text', 'size', 'height', 'curveSegments',
      'bevelEnabled', 'bevelThickness', 'bevelSize', 'bevelOffset', 'bevelSegments',
      'align',
    ];
    watchProps.forEach(p => {
      watch(() => this[p], () => {
        if (this.font) this.refreshGeometry();
      });
    });

    const loader = new FontLoader();
    loader.load(this.fontSrc, (font) => {
      this.font = font;
      this.createGeometry();
      this.initMesh();
    });
  },
  methods: {
    createGeometry() {
      this.geometry = new TextBufferGeometry(this.text, {
        font: this.font,
        size: this.size,
        height: this.height,
        depth: this.depth,
        curveSegments: this.curveSegments,
        bevelEnabled: this.bevelEnabled,
        bevelThickness: this.bevelThickness,
        bevelSize: this.bevelSize,
        bevelOffset: this.bevelOffset,
        bevelSegments: this.bevelSegments,
      });

      if (this.align === 'center') {
        this.geometry.center();
      }
    },
  },
};
