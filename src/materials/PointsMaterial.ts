import { PointsMaterial } from "three";
import { PropType } from "vue";
import { materialComponent } from "./Material";
import { PointsMaterialPropsInterface } from "./types";

export default materialComponent('PointsMaterial', 
    { props: { type: Object as PropType<PointsMaterialPropsInterface>, default: () => ({}) } }, 
    (opts) => new PointsMaterial(opts))
