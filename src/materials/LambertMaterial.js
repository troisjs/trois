import { MeshLambertMaterial } from 'three';
import { propsValues } from '../tools.js';
import Material from './Material';

export default {
  extends: Material,
  setup(props) {
    const material = new MeshLambertMaterial(propsValues(props, ['id']));
    return { material };
  },
  __hmrId: 'LambertMaterial',
};
