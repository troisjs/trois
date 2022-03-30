import { MeshToonMaterial } from "three";
import { PropType } from "vue";
import { materialComponent } from "./Material";
import { ToonMaterialPropsInterface } from "./types";

export default materialComponent('ToonMaterial',
    { props: { type: Object as PropType<ToonMaterialPropsInterface>, default: () => ({}) } }, 
    (opts) => new MeshToonMaterial(opts))
