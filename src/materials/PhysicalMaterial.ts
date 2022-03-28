import { MeshPhysicalMaterial } from "three";
import { PropType } from "vue";
import { materialComponent } from "./Material";
import { PhysicalMaterialPropsInterface } from "./types";

export default materialComponent('PhysicalMaterial', 
    { props: { type: Object as PropType<PhysicalMaterialPropsInterface>, default: () => ({}) } }, 
    (opts) => new MeshPhysicalMaterial(opts))
