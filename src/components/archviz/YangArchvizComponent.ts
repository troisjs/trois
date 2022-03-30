import { defineComponent, h } from "vue";
import { PerspectiveCamera, Renderer, Scene } from "../../core";
import { AmbientLight } from "../../lights";
import { YangGLTF } from "../../models";

export default defineComponent({
    name: "YangArchvizComponent",
    props: {
        gltfUrl : String
    },
    components: { },
    setup(props, { slots, expose }){
        const url : String = props.gltfUrl ?? "";

        const gltfProps = {
            src : url
        }

        //@ts-ignore
        const gltfVNode = h( YangGLTF, gltfProps );

        return () =>h( Renderer, {  
                        resize : "window" ,  
                        alpha : true
                    }, () => 
                    [
                        h( PerspectiveCamera, {
                            position: { z: 10 }
                        }, () => 
                        [ 
                            h( Scene , {}, () =>
                            [ 
                                h( AmbientLight ),
                                gltfVNode
                            ])
                        ]), 
                    ]);
    }, 
});