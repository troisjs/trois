import { MeshBasicMaterial } from 'three';
import { propsValues } from '../tools.js';
import Material from './Material';

export default {
  extends: Material,
  setup(props) {
    const material = new MeshBasicMaterial(propsValues(props, ['id']));
    return { material };
  },
  __hmrId: 'BasicMaterial',
};
