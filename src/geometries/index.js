import { BoxBufferGeometry } from 'three';

export const BoxGeometry = {
  inject: ['parent'],
  props: {
    size: {
      type: Number,
    },
    width: {
      type: Number,
      default: 1,
    },
    height: {
      type: Number,
      default: 1,
    },
    depth: {
      type: Number,
      default: 1,
    },
  },
  mounted() {
    if (!this.parent) {
      console.error('Missing parent Mesh');
      return;
    }

    if (this.size) {
      this.parent.geometry = new BoxBufferGeometry(this.size, this.size, this.size);
    } else {
      this.parent.geometry = new BoxBufferGeometry(this.width, this.height, this.depth);
    }
  },
  render() {
    return [];
  },
};
