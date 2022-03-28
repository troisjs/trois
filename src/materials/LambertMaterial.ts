import { MeshLambertMaterial } from "three";
import { PropType } from "vue";
import { materialComponent } from "./Material";
import { LambertMaterialPropsInterface } from "./types";

export default materialComponent('LambertMaterial', 
    { props: { type: Object as PropType<LambertMaterialPropsInterface>, default: () => ({}) } }, 
    (opts) => new MeshLambertMaterial(opts));
