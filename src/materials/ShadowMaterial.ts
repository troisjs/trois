import { ShadowMaterial } from "three";
import { PropType } from "vue";
import { materialComponent } from "./Material";
import { MaterialPropsInterface } from "./types";

export default materialComponent('ShadowMaterial', 
    { color: { type: String, default: '#000000' }, 
    props: { type: Object as PropType<MaterialPropsInterface>, default: () => ({}) } }, 
    (opts) => new ShadowMaterial(opts))
