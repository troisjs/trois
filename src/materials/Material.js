import { watch } from 'vue';
import { Color, FrontSide } from 'three';

export default {
  inject: ['three', 'mesh'],
  props: {
    id: String,
    color: { type: [String, Number], default: '#ffffff' },
    depthTest: { type: Boolean, default: true },
    depthWrite: { type: Boolean, default: true },
    flatShading: Boolean,
    fog: { type: Boolean, default: true },
    opacity: { type: Number, default: 1 },
    side: { type: Number, default: FrontSide },
    transparent: Boolean,
    vertexColors: Boolean,
  },
  created() {
    if (this.id) this.three.materials[this.id] = this.material;
    if (this.mesh) this.mesh.material = this.material;

    // won't work for flatShading
    ['color', 'depthTest', 'depthWrite', 'fog', 'opacity', 'transparent'].forEach(p => {
      watch(() => this[p], () => {
        if (p === 'color') {
          this.material.color = new Color(this.color);
        } else {
          this.material[p] = this[p];
        }
      });
    });
  },
  unmounted() {
    this.material.dispose();
    delete this.three.materials[this.id];
  },
  render() {
    return [];
  },
  __hmrId: 'Material',
};
