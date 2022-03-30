import { MeshPhongMaterial } from "three";
import { PropType } from "vue";
import { materialComponent } from "./Material";
import { PhongMaterialPropsInterface } from "./types";

export default materialComponent('PhongMaterial', 
    { props: { type: Object as PropType<PhongMaterialPropsInterface>, default: () => ({}) } }, 
    (opts) => new MeshPhongMaterial(opts))
