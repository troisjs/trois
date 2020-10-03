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
  beforeMount() {
    this.createMaterial();
    if (this.id) this.three.materials[this.id] = this.material;
    this.mesh.setMaterial(this.material);
  },
  mounted() {
    this._addWatchers();
    if (this.addWatchers) this.addWatchers();
  },
  unmounted() {
    this.material.dispose();
    if (this.id) delete this.three.materials[this.id];
  },
  methods: {
    _addWatchers() {
      // don't work for flatShading
      ['color', 'depthTest', 'depthWrite', 'fog', 'opacity', 'side', 'transparent'].forEach(p => {
        watch(() => this[p], () => {
          if (p === 'color') {
            this.material.color.set(this.color);
          } else {
            this.material[p] = this[p];
          }
        });
      });
    },
  },
  render() {
    return [];
  },
  __hmrId: 'Material',
};
