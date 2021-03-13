import Object3D from '../core/Object3D.js';

export default {
  extends: Object3D,
  emits: ['load', 'progress', 'error'],
  data() {
    return {
      progress: 0,
    };
  },
  methods: {
    onLoad(model) {
      this.$emit('load', model);
      this.initObject3D(model);
    },
    onProgress(progress) {
      this.progress = progress.loaded / progress.total;
      this.$emit('progress', progress);
    },
    onError(error) {
      this.$emit('error', error);
    },
  },
};
