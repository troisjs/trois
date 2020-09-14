import { Mesh } from 'three';
import { setFromProp } from '../tools.js';

export default {
  inject: ['three', 'scene'],
  props: {
    material: String,
    position: Object,
    rotation: Object,
    scale: Object,
  },
  mounted() {
    this.mesh = new Mesh(this.geometry, this.three.materials[this.material]);
    setFromProp(this.mesh.position, this.position);
    setFromProp(this.mesh.rotation, this.rotation);
    setFromProp(this.mesh.scale, this.scale);
    this.scene.add(this.mesh);
  },
  render() {
    return [];
  },
};
