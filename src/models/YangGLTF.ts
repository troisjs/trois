import { PerspectiveCamera } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { defineComponent } from "vue";
import { RendererInjectionKey } from "../core";
import Model from "./Model";


export default defineComponent({
    name: "YangGLTF",
    extends: Model,
    inject: {
        renderer: RendererInjectionKey as symbol,
    },
    created() {
      const loader = new GLTFLoader();
      this.$emit('before-load', loader);

      loader.load(this.src, (gltf) => {
        this.onLoad(gltf);

        const gltfCamera : PerspectiveCamera = gltf.cameras[0] as PerspectiveCamera;
        if(!this.renderer){
          console.error("Please wrap renderer around YangGLTF");
          return;
        }
        
        this.renderer!.camera = gltfCamera;

        this.initObject3D(gltf.scene);
      }, this.onProgress, this.onError)
    },  
});