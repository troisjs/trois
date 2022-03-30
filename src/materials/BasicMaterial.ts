import { materialComponent } from "./Material";
import { PropType } from 'vue';
import { BasicMaterialPropsInterface } from "./types";
import { MeshBasicMaterial } from "three";

export default materialComponent('BasicMaterial', 
    { props: { type: Object as PropType<BasicMaterialPropsInterface>, default: () => ({}) } }, 
    (opts) => new MeshBasicMaterial(opts))
