import { MeshStandardMaterial } from "three";
import { PropType } from "vue";
import { materialComponent } from "./Material";
import { StandardMaterialPropsInterface } from "./types";

export default materialComponent('StandardMaterial', 
    { props: { type: Object as PropType<StandardMaterialPropsInterface>, default: () => ({}) } }, 
    (opts) => new MeshStandardMaterial(opts))
