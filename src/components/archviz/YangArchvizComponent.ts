import { defineComponent, h } from "vue";
import { PerspectiveCamera, Renderer, Scene } from "../../core";
import { PointLight } from "../../lights";
import { LambertMaterial } from "../../materials";
import { Box } from "../../meshes";

export default defineComponent({
    name: "YangArchvizComponent",
    components: {
        PerspectiveCamera, 
        Renderer, 
        Scene,
        PointLight,
        LambertMaterial,
        Box,
    },
    setup(props, { slots }){

        return () =>h( Renderer, {  
                        resize : "window" ,  
                    }, () => 
                    [
                        h( PerspectiveCamera, {
                            position: { z: 10 }
                        }),
                        h( Scene , {}, () =>
                        [
                            h( PointLight, {
                                position: { y: 50, z: 50 }
                            }),
                            h( Box, {
                                size : 1,
                                rotation : { y: Math.PI / 4, z: Math.PI / 4 },
                            }, () =>
                            [
                                h( LambertMaterial )
                            ])
                        ])
                    ]);
    }, 
});