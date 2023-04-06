import * as vue from 'vue';
import { ComponentPublicInstance, InjectionKey, PropType, ComponentPropsOptions, WatchStopHandle, App } from 'vue';
import * as three from 'three';
import { Intersection, Vector2, Vector3, Object3D, WebGLRenderer, Camera, Scene, WebGLRendererParameters, OrthographicCamera, PerspectiveCamera, Group, Mesh as Mesh$1, WebGLCubeRenderTarget, CubeCamera, BufferGeometry, Material, Shape, ExtrudeGeometryOptions, Curve, Light, Texture, Color, ShaderMaterial, VideoTexture, MeshBasicMaterial, SpriteMaterial, Sprite, Points, TextureLoader } from 'three';
import { EffectComposer as EffectComposer$1 } from 'three/examples/jsm/postprocessing/EffectComposer';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { Font } from 'three/examples/jsm/loaders/FontLoader.js';
import * as three_examples_jsm_postprocessing_Pass from 'three/examples/jsm/postprocessing/Pass';
import { Pass } from 'three/examples/jsm/postprocessing/Pass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

interface PointerEventInterface {
    type: 'pointerenter' | 'pointermove' | 'pointerleave' | 'click';
    position?: Vector2;
    positionN?: Vector2;
    positionV3?: Vector3;
}
interface PointerIntersectEventInterface {
    type: 'pointerenter' | 'pointerover' | 'pointermove' | 'pointerleave' | 'click';
    component: any;
    over?: boolean;
    intersect?: Intersection;
}
type PointerCallbackType = (e: PointerEventInterface) => void;
type PointerIntersectCallbackType = (e: PointerIntersectEventInterface) => void;
interface PointerPublicConfigInterface {
    intersectMode?: 'frame';
    intersectRecursive?: boolean;
    touch?: boolean;
    resetOnEnd?: boolean;
    onEnter?: PointerCallbackType;
    onMove?: PointerCallbackType;
    onLeave?: PointerCallbackType;
    onClick?: PointerCallbackType;
    onIntersectEnter?: PointerIntersectCallbackType;
    onIntersectOver?: PointerIntersectCallbackType;
    onIntersectMove?: PointerIntersectCallbackType;
    onIntersectLeave?: PointerIntersectCallbackType;
    onIntersectClick?: PointerIntersectCallbackType;
}
interface PointerInterface {
    position: Vector2;
    positionN: Vector2;
    positionV3: Vector3;
    intersectObjects: Object3D[] | (() => Object3D[]);
    listeners: boolean;
    addListeners(cb: void): void;
    removeListeners(cb: void): void;
    intersect(): void;
}

interface SizeInterface {
    width: number;
    height: number;
    wWidth: number;
    wHeight: number;
    ratio: number;
}
interface ThreeConfigInterface {
    params?: WebGLRendererParameters;
    canvas?: HTMLCanvasElement;
    antialias: boolean;
    alpha: boolean;
    autoClear: boolean;
    orbitCtrl: boolean | Record<string, unknown>;
    pointer: boolean | PointerPublicConfigInterface;
    resize: boolean | string;
    width?: number;
    height?: number;
    onResize?(size: SizeInterface): void;
    [index: string]: any;
}
interface ThreeInterface {
    config: ThreeConfigInterface;
    renderer: WebGLRenderer;
    composer?: EffectComposer;
    camera?: Camera;
    cameraCtrl?: OrbitControls;
    scene?: Scene;
    pointer?: PointerInterface;
    size: SizeInterface;
    init(): boolean;
    dispose(): void;
    render(): void;
    renderC(): void;
    setSize(width: number, height: number): void;
    addIntersectObject(o: Object3D): void;
    removeIntersectObject(o: Object3D): void;
}

type CallbackType<T> = (event: T) => void;
interface EventInterface {
    type: 'init' | 'mounted';
    renderer: RendererInterface;
}
interface RenderEventInterface {
    type: 'beforerender' | 'afterrender';
    renderer: RendererInterface;
    time: number;
}
interface ResizeEventInterface {
    type: 'resize';
    renderer: RendererInterface;
    size: SizeInterface;
}
type InitCallbackType = CallbackType<EventInterface>;
type MountedCallbackType = CallbackType<EventInterface>;
type RenderCallbackType = CallbackType<RenderEventInterface>;
type ResizeCallbackType = CallbackType<ResizeEventInterface>;
interface EventCallbackMap {
    'init': InitCallbackType;
    'mounted': MountedCallbackType;
    'beforerender': RenderCallbackType;
    'afterrender': RenderCallbackType;
    'resize': ResizeCallbackType;
}
interface RenderFunctionEventInterface {
    renderer: RendererInterface;
    time: number;
}
interface RendererSetupInterface {
    canvas: HTMLCanvasElement;
    three: ThreeInterface;
    renderer: WebGLRenderer;
    size: SizeInterface;
    renderFn(e: RenderFunctionEventInterface): void;
    raf: boolean;
    $pointer?: PointerInterface;
    initCallbacks: InitCallbackType[];
    mountedCallbacks: MountedCallbackType[];
    beforeRenderCallbacks: RenderCallbackType[];
    afterRenderCallbacks: RenderCallbackType[];
    resizeCallbacks: ResizeCallbackType[];
}
interface RendererInterface extends RendererSetupInterface {
    scene?: Scene;
    camera?: Camera;
    composer?: EffectComposer$1;
    onInit(cb: InitCallbackType): void;
    onMounted(cb: MountedCallbackType): void;
    onBeforeRender(cb: RenderCallbackType): void;
    offBeforeRender(cb: RenderCallbackType): void;
    onAfterRender(cb: RenderCallbackType): void;
    offAfterRender(cb: RenderCallbackType): void;
    onResize(cb: ResizeCallbackType): void;
    offResize(cb: ResizeCallbackType): void;
    addListener<T extends keyof EventCallbackMap>(t: T, cb: EventCallbackMap[T]): void;
    removeListener<T extends keyof EventCallbackMap>(t: T, cb: EventCallbackMap[T]): void;
}
interface RendererPublicInterface extends ComponentPublicInstance, RendererInterface {
}
declare const RendererInjectionKey: InjectionKey<RendererPublicInterface>;
declare const _default$18: vue.DefineComponent<{
    params: {
        type: PropType<WebGLRendererParameters>;
        default: () => {};
    };
    antialias: BooleanConstructor;
    alpha: BooleanConstructor;
    autoClear: {
        type: BooleanConstructor;
        default: boolean;
    };
    orbitCtrl: {
        type: PropType<boolean | Record<string, unknown>>;
        default: boolean;
    };
    pointer: {
        type: PropType<boolean | PointerPublicConfigInterface>;
        default: boolean;
    };
    resize: {
        type: PropType<string | boolean>;
        default: boolean;
    };
    shadow: BooleanConstructor;
    width: StringConstructor;
    height: StringConstructor;
    pixelRatio: NumberConstructor;
    xr: BooleanConstructor;
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    onReady: PropType<(r: RendererInterface) => void>;
}, RendererSetupInterface, unknown, {
    camera: {
        get: () => Camera | undefined;
        set: (camera: Camera) => void;
    };
    scene: {
        get: () => Scene | undefined;
        set: (scene: Scene) => void;
    };
    composer: {
        get: () => EffectComposer$1 | undefined;
        set: (composer: EffectComposer$1) => void;
    };
}, {
    onInit(cb: InitCallbackType): void;
    onMounted(cb: MountedCallbackType): void;
    onBeforeRender(cb: RenderCallbackType): void;
    offBeforeRender(cb: RenderCallbackType): void;
    onAfterRender(cb: RenderCallbackType): void;
    offAfterRender(cb: RenderCallbackType): void;
    onResize(cb: ResizeCallbackType): void;
    offResize(cb: ResizeCallbackType): void;
    addListener(type: string, cb: (e?: any) => void): void;
    removeListener(type: string, cb: (e?: any) => void): void;
    getCallbacks(type: string): InitCallbackType[] | RenderCallbackType[] | ResizeCallbackType[];
    render(time: number): void;
    renderLoop(time: number): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    params: {
        type: PropType<WebGLRendererParameters>;
        default: () => {};
    };
    antialias: BooleanConstructor;
    alpha: BooleanConstructor;
    autoClear: {
        type: BooleanConstructor;
        default: boolean;
    };
    orbitCtrl: {
        type: PropType<boolean | Record<string, unknown>>;
        default: boolean;
    };
    pointer: {
        type: PropType<boolean | PointerPublicConfigInterface>;
        default: boolean;
    };
    resize: {
        type: PropType<string | boolean>;
        default: boolean;
    };
    shadow: BooleanConstructor;
    width: StringConstructor;
    height: StringConstructor;
    pixelRatio: NumberConstructor;
    xr: BooleanConstructor;
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    onReady: PropType<(r: RendererInterface) => void>;
}>>, {
    alpha: boolean;
    resize: string | boolean;
    shadow: boolean;
    params: WebGLRendererParameters;
    props: Record<string, any>;
    pointer: boolean | PointerPublicConfigInterface;
    antialias: boolean;
    autoClear: boolean;
    orbitCtrl: boolean | Record<string, unknown>;
    xr: boolean;
}>;

interface Object3DSetupInterface {
    renderer?: RendererInterface;
    scene?: Scene;
    o3d?: Object3D;
    parent?: ComponentPublicInstance;
}
interface Object3DInterface extends Object3DSetupInterface {
    addToParent(o?: Object3D): boolean;
    removeFromParent(o?: Object3D): boolean;
    add(o: Object3D): void;
    remove(o: Object3D): void;
}
interface Object3DPublicInterface extends ComponentPublicInstance, Object3DInterface {
}
interface Vector2PropInterface {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
}
interface Vector3PropInterface extends Vector2PropInterface {
    z?: number;
}
interface EulerPropInterface extends Vector3PropInterface {
    order?: 'XYZ' | 'YZX' | 'ZXY' | 'XZY' | 'YXZ' | 'ZYX';
}
declare const _default$17: vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: Object3D): void;
    getParent(): undefined | ComponentPublicInstance;
    addToParent(o?: Object3D): boolean;
    removeFromParent(o?: Object3D): boolean;
    add(o: Object3D): void;
    remove(o: Object3D): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    position: Vector3PropInterface;
    scale: Vector3PropInterface;
    visible: boolean;
    rotation: EulerPropInterface;
    props: Record<string, any>;
    lookAt: Vector3PropInterface;
    userData: Record<string, any>;
    disableAdd: boolean;
    disableRemove: boolean;
}>;

declare const _default$16: vue.DefineComponent<{
    left: {
        type: NumberConstructor;
        default: number;
    };
    right: {
        type: NumberConstructor;
        default: number;
    };
    top: {
        type: NumberConstructor;
        default: number;
    };
    bottom: {
        type: NumberConstructor;
        default: number;
    };
    near: {
        type: NumberConstructor;
        default: number;
    };
    far: {
        type: NumberConstructor;
        default: number;
    };
    zoom: {
        type: NumberConstructor;
        default: number;
    };
    position: {
        type: PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
}, {
    renderer: RendererPublicInterface;
    camera: OrthographicCamera;
} | undefined, unknown, {}, {}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
}, unknown, unknown, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
}>>, {
    props: Record<string, any>;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    left: {
        type: NumberConstructor;
        default: number;
    };
    right: {
        type: NumberConstructor;
        default: number;
    };
    top: {
        type: NumberConstructor;
        default: number;
    };
    bottom: {
        type: NumberConstructor;
        default: number;
    };
    near: {
        type: NumberConstructor;
        default: number;
    };
    far: {
        type: NumberConstructor;
        default: number;
    };
    zoom: {
        type: NumberConstructor;
        default: number;
    };
    position: {
        type: PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
}>>, {
    left: number;
    top: number;
    bottom: number;
    position: Vector3PropInterface;
    right: number;
    zoom: number;
    near: number;
    far: number;
}>;
//# sourceMappingURL=OrthographicCamera.d.ts.map

declare const _default$15: vue.DefineComponent<{
    aspect: {
        type: NumberConstructor;
        default: number;
    };
    far: {
        type: NumberConstructor;
        default: number;
    };
    fov: {
        type: NumberConstructor;
        default: number;
    };
    near: {
        type: NumberConstructor;
        default: number;
    };
    position: {
        type: PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    lookAt: {
        type: PropType<Vector3PropInterface>;
        default: null;
    };
}, {
    renderer: RendererPublicInterface;
    camera: PerspectiveCamera;
} | undefined, unknown, {}, {}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
}, unknown, unknown, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
}>>, {
    props: Record<string, any>;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    aspect: {
        type: NumberConstructor;
        default: number;
    };
    far: {
        type: NumberConstructor;
        default: number;
    };
    fov: {
        type: NumberConstructor;
        default: number;
    };
    near: {
        type: NumberConstructor;
        default: number;
    };
    position: {
        type: PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    lookAt: {
        type: PropType<Vector3PropInterface>;
        default: null;
    };
}>>, {
    position: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    near: number;
    far: number;
    aspect: number;
    fov: number;
}>;
//# sourceMappingURL=PerspectiveCamera.d.ts.map

declare const _default$14: vue.DefineComponent<{}, {
    group: Group;
}, {}, {}, {}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D<three.Event>): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string>, {}> | undefined;
    addToParent(o?: three.Object3D<three.Event> | undefined): boolean;
    removeFromParent(o?: three.Object3D<three.Event> | undefined): boolean;
    add(o: three.Object3D<three.Event>): void;
    remove(o: three.Object3D<three.Event>): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    position: Vector3PropInterface;
    scale: Vector3PropInterface;
    visible: boolean;
    rotation: EulerPropInterface;
    props: Record<string, any>;
    lookAt: Vector3PropInterface;
    userData: Record<string, any>;
    disableAdd: boolean;
    disableRemove: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{}>>, {}>;
//# sourceMappingURL=Group.d.ts.map

declare const SceneInjectionKey: InjectionKey<Scene>;
declare const _default$13: vue.DefineComponent<{
    background: (ObjectConstructor | StringConstructor | NumberConstructor)[];
}, {
    scene: Scene;
    add: (o: Object3D) => void;
    remove: (o: Object3D) => void;
} | undefined, unknown, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    background: (ObjectConstructor | StringConstructor | NumberConstructor)[];
}>>, {}>;

interface RaycasterSetupInterface {
    renderer?: RendererInterface;
    pointer?: PointerInterface;
}
declare const _default$12: vue.DefineComponent<{
    onPointerEnter: {
        type: PropType<PointerIntersectCallbackType>;
        default: PointerIntersectCallbackType;
    };
    onPointerOver: {
        type: PropType<PointerIntersectCallbackType>;
        default: PointerIntersectCallbackType;
    };
    onPointerMove: {
        type: PropType<PointerIntersectCallbackType>;
        default: PointerIntersectCallbackType;
    };
    onPointerLeave: {
        type: PropType<PointerIntersectCallbackType>;
        default: PointerIntersectCallbackType;
    };
    onClick: {
        type: PropType<PointerIntersectCallbackType>;
        default: PointerIntersectCallbackType;
    };
    intersectMode: {
        type: StringConstructor;
        default: string;
    };
    intersectRecursive: {
        type: BooleanConstructor;
        default: boolean;
    };
}, RaycasterSetupInterface, unknown, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    onPointerEnter: {
        type: PropType<PointerIntersectCallbackType>;
        default: PointerIntersectCallbackType;
    };
    onPointerOver: {
        type: PropType<PointerIntersectCallbackType>;
        default: PointerIntersectCallbackType;
    };
    onPointerMove: {
        type: PropType<PointerIntersectCallbackType>;
        default: PointerIntersectCallbackType;
    };
    onPointerLeave: {
        type: PropType<PointerIntersectCallbackType>;
        default: PointerIntersectCallbackType;
    };
    onClick: {
        type: PropType<PointerIntersectCallbackType>;
        default: PointerIntersectCallbackType;
    };
    intersectMode: {
        type: StringConstructor;
        default: string;
    };
    intersectRecursive: {
        type: BooleanConstructor;
        default: boolean;
    };
}>>, {
    onClick: PointerIntersectCallbackType;
    intersectRecursive: boolean;
    onPointerEnter: PointerIntersectCallbackType;
    onPointerOver: PointerIntersectCallbackType;
    onPointerMove: PointerIntersectCallbackType;
    onPointerLeave: PointerIntersectCallbackType;
    intersectMode: string;
}>;
//# sourceMappingURL=Raycaster.d.ts.map

interface CubeCameraSetupInterface {
    cubeRT?: WebGLCubeRenderTarget;
    cubeCamera?: CubeCamera;
    updateRT?: {
        (): void;
    };
}
declare const _default$11: vue.DefineComponent<{
    cubeRTSize: {
        type: NumberConstructor;
        default: number;
    };
    cubeCameraNear: {
        type: NumberConstructor;
        default: number;
    };
    cubeCameraFar: {
        type: NumberConstructor;
        default: number;
    };
    autoUpdate: BooleanConstructor;
    hideMeshes: {
        type: PropType<Mesh$1<three.BufferGeometry, three.Material | three.Material[]>[]>;
        default: () => never[];
    };
}, CubeCameraSetupInterface, unknown, {}, {}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D<three.Event>): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string>, {}> | undefined;
    addToParent(o?: three.Object3D<three.Event> | undefined): boolean;
    removeFromParent(o?: three.Object3D<three.Event> | undefined): boolean;
    add(o: three.Object3D<three.Event>): void;
    remove(o: three.Object3D<three.Event>): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    position: Vector3PropInterface;
    scale: Vector3PropInterface;
    visible: boolean;
    rotation: EulerPropInterface;
    props: Record<string, any>;
    lookAt: Vector3PropInterface;
    userData: Record<string, any>;
    disableAdd: boolean;
    disableRemove: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    cubeRTSize: {
        type: NumberConstructor;
        default: number;
    };
    cubeCameraNear: {
        type: NumberConstructor;
        default: number;
    };
    cubeCameraFar: {
        type: NumberConstructor;
        default: number;
    };
    autoUpdate: BooleanConstructor;
    hideMeshes: {
        type: PropType<Mesh$1<three.BufferGeometry, three.Material | three.Material[]>[]>;
        default: () => never[];
    };
}>>, {
    cubeRTSize: number;
    cubeCameraNear: number;
    cubeCameraFar: number;
    autoUpdate: boolean;
    hideMeshes: Mesh$1<three.BufferGeometry, three.Material | three.Material[]>[];
}>;
//# sourceMappingURL=CubeCamera.d.ts.map

interface MeshSetupInterface extends Object3DSetupInterface {
    mesh?: Mesh$1;
    geometry?: BufferGeometry;
    material?: Material | Material[];
    loading?: boolean;
}
interface MeshInterface extends MeshSetupInterface {
    setGeometry(g: BufferGeometry): void;
    setMaterial(m: Material): void;
}
interface MeshPublicInterface extends ComponentPublicInstance, MeshInterface {
}
declare const MeshInjectionKey: InjectionKey<MeshPublicInterface>;
declare const Mesh: vue.DefineComponent<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<ComponentPropsOptions>): void;
    setGeometry(geometry: BufferGeometry): void;
    setMaterial(material: Material | Material[]): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D<three.Event>): void;
    getParent(): ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string>, {}> | undefined;
    addToParent(o?: three.Object3D<three.Event> | undefined): boolean;
    removeFromParent(o?: three.Object3D<three.Event> | undefined): boolean;
    add(o: three.Object3D<three.Event>): void;
    remove(o: three.Object3D<three.Event>): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    position: Vector3PropInterface;
    scale: Vector3PropInterface;
    visible: boolean;
    rotation: EulerPropInterface;
    props: Record<string, any>;
    lookAt: Vector3PropInterface;
    userData: Record<string, any>;
    disableAdd: boolean;
    disableRemove: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}>>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>;

interface GeometrySetupInterface {
    mesh?: MeshInterface;
    geometry?: BufferGeometry;
    watchProps?: string[];
}
interface GeometryAttributeInterface {
    name: string;
    array: ArrayLike<number>;
    itemSize: number;
    normalized?: boolean;
}
declare const Geometry: vue.DefineComponent<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "created"[], "created", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}>> & {
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    attributes: GeometryAttributeInterface[];
}>;

declare const _default$10: vue.DefineComponent<{
    readonly size: NumberConstructor;
    readonly width: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly height: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly depth: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly widthSegments: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly heightSegments: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly depthSegments: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
}, unknown, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: vue.PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "created"[], "created", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: vue.PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}>> & {
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    attributes: GeometryAttributeInterface[];
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly size: NumberConstructor;
    readonly width: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly height: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly depth: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly widthSegments: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly heightSegments: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly depthSegments: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
}>>, {
    readonly height: number;
    readonly width: number;
    readonly depth: number;
    readonly widthSegments: number;
    readonly heightSegments: number;
    readonly depthSegments: number;
}>;

declare const _default$$: vue.DefineComponent<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly segments: {
        readonly type: NumberConstructor;
        readonly default: 8;
    };
    readonly thetaStart: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly thetaLength: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
}, unknown, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: vue.PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "created"[], "created", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: vue.PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}>> & {
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    attributes: GeometryAttributeInterface[];
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly segments: {
        readonly type: NumberConstructor;
        readonly default: 8;
    };
    readonly thetaStart: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly thetaLength: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
}>>, {
    readonly segments: number;
    readonly radius: number;
    readonly thetaStart: number;
    readonly thetaLength: number;
}>;

declare const _default$_: vue.DefineComponent<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly height: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly radialSegments: {
        readonly type: NumberConstructor;
        readonly default: 8;
    };
    readonly heightSegments: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly openEnded: {
        readonly type: BooleanConstructor;
        readonly default: false;
    };
    readonly thetaStart: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly thetaLength: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
}, unknown, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: vue.PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "created"[], "created", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: vue.PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}>> & {
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    attributes: GeometryAttributeInterface[];
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly height: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly radialSegments: {
        readonly type: NumberConstructor;
        readonly default: 8;
    };
    readonly heightSegments: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly openEnded: {
        readonly type: BooleanConstructor;
        readonly default: false;
    };
    readonly thetaStart: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly thetaLength: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
}>>, {
    readonly height: number;
    readonly radius: number;
    readonly heightSegments: number;
    readonly thetaStart: number;
    readonly thetaLength: number;
    readonly radialSegments: number;
    readonly openEnded: boolean;
}>;

declare const _default$Z: vue.DefineComponent<{
    readonly radiusTop: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly radiusBottom: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly height: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly radialSegments: {
        readonly type: NumberConstructor;
        readonly default: 8;
    };
    readonly heightSegments: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly openEnded: {
        readonly type: BooleanConstructor;
        readonly default: false;
    };
    readonly thetaStart: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly thetaLength: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
}, unknown, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: vue.PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "created"[], "created", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: vue.PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}>> & {
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    attributes: GeometryAttributeInterface[];
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly radiusTop: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly radiusBottom: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly height: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly radialSegments: {
        readonly type: NumberConstructor;
        readonly default: 8;
    };
    readonly heightSegments: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly openEnded: {
        readonly type: BooleanConstructor;
        readonly default: false;
    };
    readonly thetaStart: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly thetaLength: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
}>>, {
    readonly height: number;
    readonly heightSegments: number;
    readonly thetaStart: number;
    readonly thetaLength: number;
    readonly radialSegments: number;
    readonly openEnded: boolean;
    readonly radiusTop: number;
    readonly radiusBottom: number;
}>;

declare const _default$Y: vue.DefineComponent<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly detail: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
}, unknown, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: vue.PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "created"[], "created", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: vue.PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}>> & {
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    attributes: GeometryAttributeInterface[];
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly detail: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
}>>, {
    readonly detail: number;
    readonly radius: number;
}>;

declare const _default$X: vue.DefineComponent<{
    readonly shapes: {
        readonly type: PropType<Shape | Shape[]>;
    };
    readonly options: {
        readonly type: PropType<ExtrudeGeometryOptions>;
    };
}, unknown, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "created"[], "created", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}>> & {
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    attributes: GeometryAttributeInterface[];
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly shapes: {
        readonly type: PropType<Shape | Shape[]>;
    };
    readonly options: {
        readonly type: PropType<ExtrudeGeometryOptions>;
    };
}>>, {}>;

declare const _default$W: vue.DefineComponent<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly detail: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
}, unknown, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: vue.PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "created"[], "created", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: vue.PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}>> & {
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    attributes: GeometryAttributeInterface[];
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly detail: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
}>>, {
    readonly detail: number;
    readonly radius: number;
}>;

declare const _default$V: vue.DefineComponent<{
    readonly points: ArrayConstructor;
    readonly segments: {
        readonly type: NumberConstructor;
        readonly default: 12;
    };
    readonly phiStart: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly phiLength: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
}, unknown, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: vue.PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "created"[], "created", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: vue.PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}>> & {
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    attributes: GeometryAttributeInterface[];
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly points: ArrayConstructor;
    readonly segments: {
        readonly type: NumberConstructor;
        readonly default: 12;
    };
    readonly phiStart: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly phiLength: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
}>>, {
    readonly segments: number;
    readonly phiStart: number;
    readonly phiLength: number;
}>;

declare const _default$U: vue.DefineComponent<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly detail: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
}, unknown, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: vue.PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "created"[], "created", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: vue.PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}>> & {
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    attributes: GeometryAttributeInterface[];
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly detail: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
}>>, {
    readonly detail: number;
    readonly radius: number;
}>;

declare const _default$T: vue.DefineComponent<{
    readonly width: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly height: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly widthSegments: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly heightSegments: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
}, unknown, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: vue.PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "created"[], "created", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: vue.PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}>> & {
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    attributes: GeometryAttributeInterface[];
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly width: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly height: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly widthSegments: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly heightSegments: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
}>>, {
    readonly height: number;
    readonly width: number;
    readonly widthSegments: number;
    readonly heightSegments: number;
}>;

declare const _default$S: vue.DefineComponent<{
    readonly vertices: ArrayConstructor;
    readonly indices: ArrayConstructor;
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly detail: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
}, unknown, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: vue.PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "created"[], "created", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: vue.PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}>> & {
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    attributes: GeometryAttributeInterface[];
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly vertices: ArrayConstructor;
    readonly indices: ArrayConstructor;
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly detail: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
}>>, {
    readonly detail: number;
    readonly radius: number;
}>;

declare const _default$R: vue.DefineComponent<{
    readonly innerRadius: {
        readonly type: NumberConstructor;
        readonly default: 0.5;
    };
    readonly outerRadius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly thetaSegments: {
        readonly type: NumberConstructor;
        readonly default: 8;
    };
    readonly phiSegments: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly thetaStart: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly thetaLength: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
}, unknown, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: vue.PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "created"[], "created", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: vue.PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}>> & {
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    attributes: GeometryAttributeInterface[];
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly innerRadius: {
        readonly type: NumberConstructor;
        readonly default: 0.5;
    };
    readonly outerRadius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly thetaSegments: {
        readonly type: NumberConstructor;
        readonly default: 8;
    };
    readonly phiSegments: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly thetaStart: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly thetaLength: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
}>>, {
    readonly thetaStart: number;
    readonly thetaLength: number;
    readonly innerRadius: number;
    readonly outerRadius: number;
    readonly thetaSegments: number;
    readonly phiSegments: number;
}>;

declare const _default$Q: vue.DefineComponent<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly widthSegments: {
        readonly type: NumberConstructor;
        readonly default: 12;
    };
    readonly heightSegments: {
        readonly type: NumberConstructor;
        readonly default: 12;
    };
    readonly phiStart: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly phiLength: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
    readonly thetaStart: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly thetaLength: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
}, unknown, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: vue.PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "created"[], "created", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: vue.PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}>> & {
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    attributes: GeometryAttributeInterface[];
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly widthSegments: {
        readonly type: NumberConstructor;
        readonly default: 12;
    };
    readonly heightSegments: {
        readonly type: NumberConstructor;
        readonly default: 12;
    };
    readonly phiStart: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly phiLength: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
    readonly thetaStart: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly thetaLength: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
}>>, {
    readonly radius: number;
    readonly widthSegments: number;
    readonly heightSegments: number;
    readonly thetaStart: number;
    readonly thetaLength: number;
    readonly phiStart: number;
    readonly phiLength: number;
}>;

declare const _default$P: vue.DefineComponent<{
    readonly shapes: {
        readonly type: PropType<Shape | Shape[]>;
    };
    readonly curveSegments: {
        readonly type: NumberConstructor;
    };
}, unknown, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "created"[], "created", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}>> & {
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    attributes: GeometryAttributeInterface[];
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly shapes: {
        readonly type: PropType<Shape | Shape[]>;
    };
    readonly curveSegments: {
        readonly type: NumberConstructor;
    };
}>>, {}>;

declare const _default$O: vue.DefineComponent<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly detail: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
}, unknown, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: vue.PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "created"[], "created", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: vue.PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}>> & {
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    attributes: GeometryAttributeInterface[];
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly detail: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
}>>, {
    readonly detail: number;
    readonly radius: number;
}>;

declare const _default$N: vue.DefineComponent<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly tube: {
        readonly type: NumberConstructor;
        readonly default: 0.4;
    };
    readonly radialSegments: {
        readonly type: NumberConstructor;
        readonly default: 8;
    };
    readonly tubularSegments: {
        readonly type: NumberConstructor;
        readonly default: 6;
    };
    readonly arc: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
}, unknown, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: vue.PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "created"[], "created", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: vue.PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}>> & {
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    attributes: GeometryAttributeInterface[];
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly tube: {
        readonly type: NumberConstructor;
        readonly default: 0.4;
    };
    readonly radialSegments: {
        readonly type: NumberConstructor;
        readonly default: 8;
    };
    readonly tubularSegments: {
        readonly type: NumberConstructor;
        readonly default: 6;
    };
    readonly arc: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
}>>, {
    readonly radius: number;
    readonly radialSegments: number;
    readonly tube: number;
    readonly tubularSegments: number;
    readonly arc: number;
}>;

declare const _default$M: vue.DefineComponent<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly tube: {
        readonly type: NumberConstructor;
        readonly default: 0.4;
    };
    readonly tubularSegments: {
        readonly type: NumberConstructor;
        readonly default: 64;
    };
    readonly radialSegments: {
        readonly type: NumberConstructor;
        readonly default: 8;
    };
    readonly p: {
        readonly type: NumberConstructor;
        readonly default: 2;
    };
    readonly q: {
        readonly type: NumberConstructor;
        readonly default: 3;
    };
}, unknown, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: vue.PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "created"[], "created", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: vue.PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}>> & {
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    attributes: GeometryAttributeInterface[];
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly tube: {
        readonly type: NumberConstructor;
        readonly default: 0.4;
    };
    readonly tubularSegments: {
        readonly type: NumberConstructor;
        readonly default: 64;
    };
    readonly radialSegments: {
        readonly type: NumberConstructor;
        readonly default: 8;
    };
    readonly p: {
        readonly type: NumberConstructor;
        readonly default: 2;
    };
    readonly q: {
        readonly type: NumberConstructor;
        readonly default: 3;
    };
}>>, {
    readonly p: number;
    readonly q: number;
    readonly radius: number;
    readonly radialSegments: number;
    readonly tube: number;
    readonly tubularSegments: number;
}>;

declare const _default$L: vue.DefineComponent<{
    readonly points: ArrayConstructor;
    readonly path: typeof Curve;
    readonly tubularSegments: {
        readonly type: NumberConstructor;
        readonly default: 64;
    };
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly radialSegments: {
        readonly type: NumberConstructor;
        readonly default: 8;
    };
    readonly closed: {
        readonly type: BooleanConstructor;
        readonly default: false;
    };
}, unknown, unknown, {}, {
    createGeometry(): void;
    updatePoints(points: Vector3[]): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: vue.PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "created"[], "created", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
    attributes: {
        type: vue.PropType<GeometryAttributeInterface[]>;
        default: () => never[];
    };
}>> & {
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    attributes: GeometryAttributeInterface[];
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly points: ArrayConstructor;
    readonly path: typeof Curve;
    readonly tubularSegments: {
        readonly type: NumberConstructor;
        readonly default: 64;
    };
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly radialSegments: {
        readonly type: NumberConstructor;
        readonly default: 8;
    };
    readonly closed: {
        readonly type: BooleanConstructor;
        readonly default: false;
    };
}>>, {
    readonly closed: boolean;
    readonly radius: number;
    readonly radialSegments: number;
    readonly tubularSegments: number;
}>;

interface LightSetupInterface {
    light?: Light;
}

declare const _default$K: vue.DefineComponent<{}, {}, {}, {}, {}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    color: {
        type: StringConstructor;
        default: string;
    };
    intensity: {
        type: NumberConstructor;
        default: number;
    };
    castShadow: {
        type: BooleanConstructor;
        default: boolean;
    };
    shadowMapSize: {
        type: vue.PropType<Vector2PropInterface>;
        default: () => {
            x: number;
            y: number;
        };
    };
    shadowCamera: {
        type: ObjectConstructor;
        default: () => {};
    };
}, LightSetupInterface, unknown, {}, {
    initLight(light: three.Light): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D<three.Event>): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string>, {}> | undefined;
    addToParent(o?: three.Object3D<three.Event> | undefined): boolean;
    removeFromParent(o?: three.Object3D<three.Event> | undefined): boolean;
    add(o: three.Object3D<three.Event>): void;
    remove(o: three.Object3D<three.Event>): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    position: Vector3PropInterface;
    scale: Vector3PropInterface;
    visible: boolean;
    rotation: EulerPropInterface;
    props: Record<string, any>;
    lookAt: Vector3PropInterface;
    userData: Record<string, any>;
    disableAdd: boolean;
    disableRemove: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    color: {
        type: StringConstructor;
        default: string;
    };
    intensity: {
        type: NumberConstructor;
        default: number;
    };
    castShadow: {
        type: BooleanConstructor;
        default: boolean;
    };
    shadowMapSize: {
        type: vue.PropType<Vector2PropInterface>;
        default: () => {
            x: number;
            y: number;
        };
    };
    shadowCamera: {
        type: ObjectConstructor;
        default: () => {};
    };
}>>, {
    color: string;
    castShadow: boolean;
    intensity: number;
    shadowMapSize: Vector2PropInterface;
    shadowCamera: Record<string, any>;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{}>>, {}>;
//# sourceMappingURL=AmbientLight.d.ts.map

declare const _default$J: vue.DefineComponent<{
    target: {
        type: PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
}, unknown, unknown, {}, {}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    color: {
        type: StringConstructor;
        default: string;
    };
    intensity: {
        type: NumberConstructor;
        default: number;
    };
    castShadow: {
        type: BooleanConstructor;
        default: boolean;
    };
    shadowMapSize: {
        type: PropType<Vector2PropInterface>;
        default: () => {
            x: number;
            y: number;
        };
    };
    shadowCamera: {
        type: ObjectConstructor;
        default: () => {};
    };
}, LightSetupInterface, unknown, {}, {
    initLight(light: three.Light): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D<three.Event>): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string>, {}> | undefined;
    addToParent(o?: three.Object3D<three.Event> | undefined): boolean;
    removeFromParent(o?: three.Object3D<three.Event> | undefined): boolean;
    add(o: three.Object3D<three.Event>): void;
    remove(o: three.Object3D<three.Event>): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    position: Vector3PropInterface;
    scale: Vector3PropInterface;
    visible: boolean;
    rotation: EulerPropInterface;
    props: Record<string, any>;
    lookAt: Vector3PropInterface;
    userData: Record<string, any>;
    disableAdd: boolean;
    disableRemove: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    color: {
        type: StringConstructor;
        default: string;
    };
    intensity: {
        type: NumberConstructor;
        default: number;
    };
    castShadow: {
        type: BooleanConstructor;
        default: boolean;
    };
    shadowMapSize: {
        type: PropType<Vector2PropInterface>;
        default: () => {
            x: number;
            y: number;
        };
    };
    shadowCamera: {
        type: ObjectConstructor;
        default: () => {};
    };
}>>, {
    color: string;
    castShadow: boolean;
    intensity: number;
    shadowMapSize: Vector2PropInterface;
    shadowCamera: Record<string, any>;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    target: {
        type: PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
}>>, {
    target: Vector3PropInterface;
}>;
//# sourceMappingURL=DirectionalLight.d.ts.map

declare const _default$I: vue.DefineComponent<{
    groundColor: {
        type: StringConstructor;
        default: string;
    };
}, unknown, unknown, {}, {}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    color: {
        type: StringConstructor;
        default: string;
    };
    intensity: {
        type: NumberConstructor;
        default: number;
    };
    castShadow: {
        type: BooleanConstructor;
        default: boolean;
    };
    shadowMapSize: {
        type: vue.PropType<Vector2PropInterface>;
        default: () => {
            x: number;
            y: number;
        };
    };
    shadowCamera: {
        type: ObjectConstructor;
        default: () => {};
    };
}, LightSetupInterface, unknown, {}, {
    initLight(light: three.Light): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D<three.Event>): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string>, {}> | undefined;
    addToParent(o?: three.Object3D<three.Event> | undefined): boolean;
    removeFromParent(o?: three.Object3D<three.Event> | undefined): boolean;
    add(o: three.Object3D<three.Event>): void;
    remove(o: three.Object3D<three.Event>): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    position: Vector3PropInterface;
    scale: Vector3PropInterface;
    visible: boolean;
    rotation: EulerPropInterface;
    props: Record<string, any>;
    lookAt: Vector3PropInterface;
    userData: Record<string, any>;
    disableAdd: boolean;
    disableRemove: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    color: {
        type: StringConstructor;
        default: string;
    };
    intensity: {
        type: NumberConstructor;
        default: number;
    };
    castShadow: {
        type: BooleanConstructor;
        default: boolean;
    };
    shadowMapSize: {
        type: vue.PropType<Vector2PropInterface>;
        default: () => {
            x: number;
            y: number;
        };
    };
    shadowCamera: {
        type: ObjectConstructor;
        default: () => {};
    };
}>>, {
    color: string;
    castShadow: boolean;
    intensity: number;
    shadowMapSize: Vector2PropInterface;
    shadowCamera: Record<string, any>;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    groundColor: {
        type: StringConstructor;
        default: string;
    };
}>>, {
    groundColor: string;
}>;
//# sourceMappingURL=HemisphereLight.d.ts.map

declare const _default$H: vue.DefineComponent<{
    distance: {
        type: NumberConstructor;
        default: number;
    };
    decay: {
        type: NumberConstructor;
        default: number;
    };
}, unknown, unknown, {}, {}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    color: {
        type: StringConstructor;
        default: string;
    };
    intensity: {
        type: NumberConstructor;
        default: number;
    };
    castShadow: {
        type: BooleanConstructor;
        default: boolean;
    };
    shadowMapSize: {
        type: vue.PropType<Vector2PropInterface>;
        default: () => {
            x: number;
            y: number;
        };
    };
    shadowCamera: {
        type: ObjectConstructor;
        default: () => {};
    };
}, LightSetupInterface, unknown, {}, {
    initLight(light: three.Light): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D<three.Event>): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string>, {}> | undefined;
    addToParent(o?: three.Object3D<three.Event> | undefined): boolean;
    removeFromParent(o?: three.Object3D<three.Event> | undefined): boolean;
    add(o: three.Object3D<three.Event>): void;
    remove(o: three.Object3D<three.Event>): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    position: Vector3PropInterface;
    scale: Vector3PropInterface;
    visible: boolean;
    rotation: EulerPropInterface;
    props: Record<string, any>;
    lookAt: Vector3PropInterface;
    userData: Record<string, any>;
    disableAdd: boolean;
    disableRemove: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    color: {
        type: StringConstructor;
        default: string;
    };
    intensity: {
        type: NumberConstructor;
        default: number;
    };
    castShadow: {
        type: BooleanConstructor;
        default: boolean;
    };
    shadowMapSize: {
        type: vue.PropType<Vector2PropInterface>;
        default: () => {
            x: number;
            y: number;
        };
    };
    shadowCamera: {
        type: ObjectConstructor;
        default: () => {};
    };
}>>, {
    color: string;
    castShadow: boolean;
    intensity: number;
    shadowMapSize: Vector2PropInterface;
    shadowCamera: Record<string, any>;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    distance: {
        type: NumberConstructor;
        default: number;
    };
    decay: {
        type: NumberConstructor;
        default: number;
    };
}>>, {
    distance: number;
    decay: number;
}>;
//# sourceMappingURL=PointLight.d.ts.map

declare const _default$G: vue.DefineComponent<{
    width: {
        type: NumberConstructor;
        default: number;
    };
    height: {
        type: NumberConstructor;
        default: number;
    };
    helper: BooleanConstructor;
}, unknown, unknown, {}, {}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    color: {
        type: StringConstructor;
        default: string;
    };
    intensity: {
        type: NumberConstructor;
        default: number;
    };
    castShadow: {
        type: BooleanConstructor;
        default: boolean;
    };
    shadowMapSize: {
        type: vue.PropType<Vector2PropInterface>;
        default: () => {
            x: number;
            y: number;
        };
    };
    shadowCamera: {
        type: ObjectConstructor;
        default: () => {};
    };
}, LightSetupInterface, unknown, {}, {
    initLight(light: three.Light): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D<three.Event>): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string>, {}> | undefined;
    addToParent(o?: three.Object3D<three.Event> | undefined): boolean;
    removeFromParent(o?: three.Object3D<three.Event> | undefined): boolean;
    add(o: three.Object3D<three.Event>): void;
    remove(o: three.Object3D<three.Event>): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    position: Vector3PropInterface;
    scale: Vector3PropInterface;
    visible: boolean;
    rotation: EulerPropInterface;
    props: Record<string, any>;
    lookAt: Vector3PropInterface;
    userData: Record<string, any>;
    disableAdd: boolean;
    disableRemove: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    color: {
        type: StringConstructor;
        default: string;
    };
    intensity: {
        type: NumberConstructor;
        default: number;
    };
    castShadow: {
        type: BooleanConstructor;
        default: boolean;
    };
    shadowMapSize: {
        type: vue.PropType<Vector2PropInterface>;
        default: () => {
            x: number;
            y: number;
        };
    };
    shadowCamera: {
        type: ObjectConstructor;
        default: () => {};
    };
}>>, {
    color: string;
    castShadow: boolean;
    intensity: number;
    shadowMapSize: Vector2PropInterface;
    shadowCamera: Record<string, any>;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    width: {
        type: NumberConstructor;
        default: number;
    };
    height: {
        type: NumberConstructor;
        default: number;
    };
    helper: BooleanConstructor;
}>>, {
    height: number;
    width: number;
    helper: boolean;
}>;
//# sourceMappingURL=RectAreaLight.d.ts.map

declare const _default$F: vue.DefineComponent<{
    angle: {
        type: NumberConstructor;
        default: number;
    };
    decay: {
        type: NumberConstructor;
        default: number;
    };
    distance: {
        type: NumberConstructor;
        default: number;
    };
    penumbra: {
        type: NumberConstructor;
        default: number;
    };
    target: ObjectConstructor;
}, unknown, unknown, {}, {}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    color: {
        type: StringConstructor;
        default: string;
    };
    intensity: {
        type: NumberConstructor;
        default: number;
    };
    castShadow: {
        type: BooleanConstructor;
        default: boolean;
    };
    shadowMapSize: {
        type: vue.PropType<Vector2PropInterface>;
        default: () => {
            x: number;
            y: number;
        };
    };
    shadowCamera: {
        type: ObjectConstructor;
        default: () => {};
    };
}, LightSetupInterface, unknown, {}, {
    initLight(light: three.Light): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D<three.Event>): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string>, {}> | undefined;
    addToParent(o?: three.Object3D<three.Event> | undefined): boolean;
    removeFromParent(o?: three.Object3D<three.Event> | undefined): boolean;
    add(o: three.Object3D<three.Event>): void;
    remove(o: three.Object3D<three.Event>): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    position: Vector3PropInterface;
    scale: Vector3PropInterface;
    visible: boolean;
    rotation: EulerPropInterface;
    props: Record<string, any>;
    lookAt: Vector3PropInterface;
    userData: Record<string, any>;
    disableAdd: boolean;
    disableRemove: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    color: {
        type: StringConstructor;
        default: string;
    };
    intensity: {
        type: NumberConstructor;
        default: number;
    };
    castShadow: {
        type: BooleanConstructor;
        default: boolean;
    };
    shadowMapSize: {
        type: vue.PropType<Vector2PropInterface>;
        default: () => {
            x: number;
            y: number;
        };
    };
    shadowCamera: {
        type: ObjectConstructor;
        default: () => {};
    };
}>>, {
    color: string;
    castShadow: boolean;
    intensity: number;
    shadowMapSize: Vector2PropInterface;
    shadowCamera: Record<string, any>;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    angle: {
        type: NumberConstructor;
        default: number;
    };
    decay: {
        type: NumberConstructor;
        default: number;
    };
    distance: {
        type: NumberConstructor;
        default: number;
    };
    penumbra: {
        type: NumberConstructor;
        default: number;
    };
    target: ObjectConstructor;
}>>, {
    distance: number;
    decay: number;
    angle: number;
    penumbra: number;
}>;
//# sourceMappingURL=SpotLight.d.ts.map

interface MaterialPropsInterface {
    alphaTest?: number;
    blending?: number;
    color?: number | string;
    depthTest?: boolean;
    depthWrite?: boolean;
    fog?: boolean;
    opacity?: number;
    side?: number;
    toneMapped?: boolean;
    transparent?: boolean;
    vertexColors?: boolean;
    visible?: boolean;
    [index: string]: any;
}
interface AlphaPropsInterface {
    alphaMap?: Texture;
}
interface AOPropsInterface {
    aoMap?: Texture;
    aoMapIntensity?: number;
}
interface BumpPropsInterface {
    bumpMap?: Texture;
    bumpScale?: number;
}
interface DisplacementPropsInterface {
    displacementMap?: Texture;
    displacementScale?: number;
    displacementBias?: number;
}
interface EmissivePropsInterface {
    emissive?: number | string;
    emissiveIntensity?: number;
    emissiveMap?: Texture;
}
interface EnvPropsInterface {
    envMap?: Texture;
    envMapIntensity?: number;
    reflectivity?: number;
    refractionRatio?: number;
}
interface LightPropsInterface {
    lightMap?: Texture;
    lightMapIntensity?: number;
}
interface WireframePropsInterface {
    wireframe?: boolean;
    wireframeLinewidth?: number;
}
interface BasicMaterialPropsInterface extends MaterialPropsInterface, AlphaPropsInterface, AOPropsInterface, EnvPropsInterface, WireframePropsInterface {
}
interface LambertMaterialPropsInterface extends MaterialPropsInterface, AlphaPropsInterface, AOPropsInterface, EmissivePropsInterface, EnvPropsInterface, LightPropsInterface, WireframePropsInterface {
}
interface PhongMaterialPropsInterface extends MaterialPropsInterface, AlphaPropsInterface, AOPropsInterface, DisplacementPropsInterface, EmissivePropsInterface, EnvPropsInterface, LightPropsInterface, WireframePropsInterface {
    flatShading?: boolean;
    shininess?: number;
    specular?: number | string;
}
interface PhysicalMaterialPropsInterface extends MaterialPropsInterface {
    clearcoat?: number;
    clearcoatMap?: Texture;
    clearcoatRoughness?: number;
    clearcoatRoughnessMap?: Texture;
    clearcoatNormalScale?: Vector2;
    clearcoatNormalMap?: Texture;
    ior?: number;
    reflectivity?: number;
    sheen?: Color;
    transmission?: number;
    transmissionMap?: Texture | null;
}
interface PointsMaterialPropsInterface extends MaterialPropsInterface, AlphaPropsInterface {
    size?: number;
    sizeAttenuation?: boolean;
}
interface StandardMaterialPropsInterface extends MaterialPropsInterface, AlphaPropsInterface, AOPropsInterface, BumpPropsInterface, DisplacementPropsInterface, EmissivePropsInterface, EnvPropsInterface, LightPropsInterface, WireframePropsInterface {
    flatShading?: boolean;
    metalness?: number;
    metalnessMap?: Texture;
    roughness?: number;
    roughnessMap?: Texture;
}
interface ToonMaterialPropsInterface extends MaterialPropsInterface, AlphaPropsInterface, AOPropsInterface, BumpPropsInterface, DisplacementPropsInterface, EmissivePropsInterface, LightPropsInterface, WireframePropsInterface {
}

interface MaterialSetupInterface {
    mesh?: MeshInterface;
    material?: Material;
    createMaterial?(): Material;
}
interface MaterialInterface extends MaterialSetupInterface {
    setTexture(texture: Texture | null, key: string): void;
}
interface MaterialPublicInterface extends ComponentPublicInstance, MaterialInterface {
}
declare const MaterialInjectionKey: InjectionKey<MaterialPublicInterface>;
declare const BaseMaterial: vue.DefineComponent<{
    color: {
        type: StringConstructor;
        default: string;
    };
    props: {
        type: PropType<MaterialPropsInterface>;
        default: () => {};
    };
}, MaterialSetupInterface, unknown, {}, {
    getMaterialParams(): {
        [x: string]: any;
        alphaTest?: number | undefined;
        blending?: number | undefined;
        color?: string | number | undefined;
        depthTest?: boolean | undefined;
        depthWrite?: boolean | undefined;
        fog?: boolean | undefined;
        opacity?: number | undefined;
        side?: number | undefined;
        toneMapped?: boolean | undefined;
        transparent?: boolean | undefined;
        vertexColors?: boolean | undefined;
        visible?: boolean | undefined;
    };
    setProp(material: any, key: string, value: any, needsUpdate?: boolean): void;
    setTexture(texture: Texture | null, key?: string): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "created"[], "created", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    color: {
        type: StringConstructor;
        default: string;
    };
    props: {
        type: PropType<MaterialPropsInterface>;
        default: () => {};
    };
}>> & {
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    color: string;
    props: MaterialPropsInterface;
}>;

declare const BasicMaterial: vue.DefineComponent<{
    props: {
        type: PropType<BasicMaterialPropsInterface>;
        default: () => {};
    };
}, unknown, unknown, {}, {
    createMaterial(): Material;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    color: {
        type: StringConstructor;
        default: string;
    };
    props: {
        type: PropType<MaterialPropsInterface>;
        default: () => {};
    };
}, MaterialSetupInterface, unknown, {}, {
    getMaterialParams(): {
        [x: string]: any;
        alphaTest?: number | undefined;
        blending?: number | undefined;
        color?: string | number | undefined;
        depthTest?: boolean | undefined;
        depthWrite?: boolean | undefined;
        fog?: boolean | undefined;
        opacity?: number | undefined;
        side?: number | undefined;
        toneMapped?: boolean | undefined;
        transparent?: boolean | undefined;
        vertexColors?: boolean | undefined;
        visible?: boolean | undefined;
    };
    setProp(material: any, key: string, value: any, needsUpdate?: boolean): void;
    setTexture(texture: Texture | null, key?: string): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "created"[], "created", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    color: {
        type: StringConstructor;
        default: string;
    };
    props: {
        type: PropType<MaterialPropsInterface>;
        default: () => {};
    };
}>> & {
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    color: string;
    props: MaterialPropsInterface;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    props: {
        type: PropType<BasicMaterialPropsInterface>;
        default: () => {};
    };
}>>, {
    props: BasicMaterialPropsInterface;
}>;
declare const LambertMaterial: vue.DefineComponent<{
    props: {
        type: PropType<LambertMaterialPropsInterface>;
        default: () => {};
    };
}, unknown, unknown, {}, {
    createMaterial(): Material;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    color: {
        type: StringConstructor;
        default: string;
    };
    props: {
        type: PropType<MaterialPropsInterface>;
        default: () => {};
    };
}, MaterialSetupInterface, unknown, {}, {
    getMaterialParams(): {
        [x: string]: any;
        alphaTest?: number | undefined;
        blending?: number | undefined;
        color?: string | number | undefined;
        depthTest?: boolean | undefined;
        depthWrite?: boolean | undefined;
        fog?: boolean | undefined;
        opacity?: number | undefined;
        side?: number | undefined;
        toneMapped?: boolean | undefined;
        transparent?: boolean | undefined;
        vertexColors?: boolean | undefined;
        visible?: boolean | undefined;
    };
    setProp(material: any, key: string, value: any, needsUpdate?: boolean): void;
    setTexture(texture: Texture | null, key?: string): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "created"[], "created", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    color: {
        type: StringConstructor;
        default: string;
    };
    props: {
        type: PropType<MaterialPropsInterface>;
        default: () => {};
    };
}>> & {
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    color: string;
    props: MaterialPropsInterface;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    props: {
        type: PropType<LambertMaterialPropsInterface>;
        default: () => {};
    };
}>>, {
    props: LambertMaterialPropsInterface;
}>;
declare const PhongMaterial: vue.DefineComponent<{
    props: {
        type: PropType<PhongMaterialPropsInterface>;
        default: () => {};
    };
}, unknown, unknown, {}, {
    createMaterial(): Material;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    color: {
        type: StringConstructor;
        default: string;
    };
    props: {
        type: PropType<MaterialPropsInterface>;
        default: () => {};
    };
}, MaterialSetupInterface, unknown, {}, {
    getMaterialParams(): {
        [x: string]: any;
        alphaTest?: number | undefined;
        blending?: number | undefined;
        color?: string | number | undefined;
        depthTest?: boolean | undefined;
        depthWrite?: boolean | undefined;
        fog?: boolean | undefined;
        opacity?: number | undefined;
        side?: number | undefined;
        toneMapped?: boolean | undefined;
        transparent?: boolean | undefined;
        vertexColors?: boolean | undefined;
        visible?: boolean | undefined;
    };
    setProp(material: any, key: string, value: any, needsUpdate?: boolean): void;
    setTexture(texture: Texture | null, key?: string): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "created"[], "created", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    color: {
        type: StringConstructor;
        default: string;
    };
    props: {
        type: PropType<MaterialPropsInterface>;
        default: () => {};
    };
}>> & {
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    color: string;
    props: MaterialPropsInterface;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    props: {
        type: PropType<PhongMaterialPropsInterface>;
        default: () => {};
    };
}>>, {
    props: PhongMaterialPropsInterface;
}>;
declare const PhysicalMaterial: vue.DefineComponent<{
    props: {
        type: PropType<PhysicalMaterialPropsInterface>;
        default: () => {};
    };
}, unknown, unknown, {}, {
    createMaterial(): Material;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    color: {
        type: StringConstructor;
        default: string;
    };
    props: {
        type: PropType<MaterialPropsInterface>;
        default: () => {};
    };
}, MaterialSetupInterface, unknown, {}, {
    getMaterialParams(): {
        [x: string]: any;
        alphaTest?: number | undefined;
        blending?: number | undefined;
        color?: string | number | undefined;
        depthTest?: boolean | undefined;
        depthWrite?: boolean | undefined;
        fog?: boolean | undefined;
        opacity?: number | undefined;
        side?: number | undefined;
        toneMapped?: boolean | undefined;
        transparent?: boolean | undefined;
        vertexColors?: boolean | undefined;
        visible?: boolean | undefined;
    };
    setProp(material: any, key: string, value: any, needsUpdate?: boolean): void;
    setTexture(texture: Texture | null, key?: string): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "created"[], "created", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    color: {
        type: StringConstructor;
        default: string;
    };
    props: {
        type: PropType<MaterialPropsInterface>;
        default: () => {};
    };
}>> & {
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    color: string;
    props: MaterialPropsInterface;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    props: {
        type: PropType<PhysicalMaterialPropsInterface>;
        default: () => {};
    };
}>>, {
    props: PhysicalMaterialPropsInterface;
}>;
declare const PointsMaterial: vue.DefineComponent<{
    props: {
        type: PropType<PointsMaterialPropsInterface>;
        default: () => {};
    };
}, unknown, unknown, {}, {
    createMaterial(): Material;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    color: {
        type: StringConstructor;
        default: string;
    };
    props: {
        type: PropType<MaterialPropsInterface>;
        default: () => {};
    };
}, MaterialSetupInterface, unknown, {}, {
    getMaterialParams(): {
        [x: string]: any;
        alphaTest?: number | undefined;
        blending?: number | undefined;
        color?: string | number | undefined;
        depthTest?: boolean | undefined;
        depthWrite?: boolean | undefined;
        fog?: boolean | undefined;
        opacity?: number | undefined;
        side?: number | undefined;
        toneMapped?: boolean | undefined;
        transparent?: boolean | undefined;
        vertexColors?: boolean | undefined;
        visible?: boolean | undefined;
    };
    setProp(material: any, key: string, value: any, needsUpdate?: boolean): void;
    setTexture(texture: Texture | null, key?: string): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "created"[], "created", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    color: {
        type: StringConstructor;
        default: string;
    };
    props: {
        type: PropType<MaterialPropsInterface>;
        default: () => {};
    };
}>> & {
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    color: string;
    props: MaterialPropsInterface;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    props: {
        type: PropType<PointsMaterialPropsInterface>;
        default: () => {};
    };
}>>, {
    props: PointsMaterialPropsInterface;
}>;
declare const ShadowMaterial: vue.DefineComponent<{
    color: {
        type: StringConstructor;
        default: string;
    };
    props: {
        type: PropType<MaterialPropsInterface>;
        default: () => {};
    };
}, unknown, unknown, {}, {
    createMaterial(): Material;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    color: {
        type: StringConstructor;
        default: string;
    };
    props: {
        type: PropType<MaterialPropsInterface>;
        default: () => {};
    };
}, MaterialSetupInterface, unknown, {}, {
    getMaterialParams(): {
        [x: string]: any;
        alphaTest?: number | undefined;
        blending?: number | undefined;
        color?: string | number | undefined;
        depthTest?: boolean | undefined;
        depthWrite?: boolean | undefined;
        fog?: boolean | undefined;
        opacity?: number | undefined;
        side?: number | undefined;
        toneMapped?: boolean | undefined;
        transparent?: boolean | undefined;
        vertexColors?: boolean | undefined;
        visible?: boolean | undefined;
    };
    setProp(material: any, key: string, value: any, needsUpdate?: boolean): void;
    setTexture(texture: Texture | null, key?: string): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "created"[], "created", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    color: {
        type: StringConstructor;
        default: string;
    };
    props: {
        type: PropType<MaterialPropsInterface>;
        default: () => {};
    };
}>> & {
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    color: string;
    props: MaterialPropsInterface;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    color: {
        type: StringConstructor;
        default: string;
    };
    props: {
        type: PropType<MaterialPropsInterface>;
        default: () => {};
    };
}>>, {
    color: string;
    props: MaterialPropsInterface;
}>;
declare const StandardMaterial: vue.DefineComponent<{
    props: {
        type: PropType<StandardMaterialPropsInterface>;
        default: () => {};
    };
}, unknown, unknown, {}, {
    createMaterial(): Material;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    color: {
        type: StringConstructor;
        default: string;
    };
    props: {
        type: PropType<MaterialPropsInterface>;
        default: () => {};
    };
}, MaterialSetupInterface, unknown, {}, {
    getMaterialParams(): {
        [x: string]: any;
        alphaTest?: number | undefined;
        blending?: number | undefined;
        color?: string | number | undefined;
        depthTest?: boolean | undefined;
        depthWrite?: boolean | undefined;
        fog?: boolean | undefined;
        opacity?: number | undefined;
        side?: number | undefined;
        toneMapped?: boolean | undefined;
        transparent?: boolean | undefined;
        vertexColors?: boolean | undefined;
        visible?: boolean | undefined;
    };
    setProp(material: any, key: string, value: any, needsUpdate?: boolean): void;
    setTexture(texture: Texture | null, key?: string): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "created"[], "created", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    color: {
        type: StringConstructor;
        default: string;
    };
    props: {
        type: PropType<MaterialPropsInterface>;
        default: () => {};
    };
}>> & {
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    color: string;
    props: MaterialPropsInterface;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    props: {
        type: PropType<StandardMaterialPropsInterface>;
        default: () => {};
    };
}>>, {
    props: StandardMaterialPropsInterface;
}>;
declare const ToonMaterial: vue.DefineComponent<{
    props: {
        type: PropType<ToonMaterialPropsInterface>;
        default: () => {};
    };
}, unknown, unknown, {}, {
    createMaterial(): Material;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    color: {
        type: StringConstructor;
        default: string;
    };
    props: {
        type: PropType<MaterialPropsInterface>;
        default: () => {};
    };
}, MaterialSetupInterface, unknown, {}, {
    getMaterialParams(): {
        [x: string]: any;
        alphaTest?: number | undefined;
        blending?: number | undefined;
        color?: string | number | undefined;
        depthTest?: boolean | undefined;
        depthWrite?: boolean | undefined;
        fog?: boolean | undefined;
        opacity?: number | undefined;
        side?: number | undefined;
        toneMapped?: boolean | undefined;
        transparent?: boolean | undefined;
        vertexColors?: boolean | undefined;
        visible?: boolean | undefined;
    };
    setProp(material: any, key: string, value: any, needsUpdate?: boolean): void;
    setTexture(texture: Texture | null, key?: string): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "created"[], "created", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    color: {
        type: StringConstructor;
        default: string;
    };
    props: {
        type: PropType<MaterialPropsInterface>;
        default: () => {};
    };
}>> & {
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    color: string;
    props: MaterialPropsInterface;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    props: {
        type: PropType<ToonMaterialPropsInterface>;
        default: () => {};
    };
}>>, {
    props: ToonMaterialPropsInterface;
}>;

declare const _default$E: vue.DefineComponent<{
    src: StringConstructor;
    name: {
        type: StringConstructor;
        default: string;
    };
}, unknown, unknown, {}, {
    createMaterial(): three.Material;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    color: {
        type: StringConstructor;
        default: string;
    };
    props: {
        type: vue.PropType<MaterialPropsInterface>;
        default: () => {};
    };
}, MaterialSetupInterface, unknown, {}, {
    getMaterialParams(): {
        [x: string]: any;
        alphaTest?: number | undefined;
        blending?: number | undefined;
        color?: string | number | undefined;
        depthTest?: boolean | undefined;
        depthWrite?: boolean | undefined;
        fog?: boolean | undefined;
        opacity?: number | undefined;
        side?: number | undefined;
        toneMapped?: boolean | undefined;
        transparent?: boolean | undefined;
        vertexColors?: boolean | undefined;
        visible?: boolean | undefined;
    };
    setProp(material: any, key: string, value: any, needsUpdate?: boolean): void;
    setTexture(texture: three.Texture | null, key?: string): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "created"[], "created", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    color: {
        type: StringConstructor;
        default: string;
    };
    props: {
        type: vue.PropType<MaterialPropsInterface>;
        default: () => {};
    };
}>> & {
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    color: string;
    props: MaterialPropsInterface;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    src: StringConstructor;
    name: {
        type: StringConstructor;
        default: string;
    };
}>>, {
    name: string;
}>;
//# sourceMappingURL=MatcapMaterial.d.ts.map

declare const _default$D: vue.DefineComponent<{
    props: {
        type: ObjectConstructor;
        default: () => {
            uniforms: {};
            vertexShader: string;
            fragmentShader: string;
        };
    };
}, unknown, unknown, {}, {
    createMaterial(): three.Material;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    color: {
        type: StringConstructor;
        default: string;
    };
    props: {
        type: vue.PropType<MaterialPropsInterface>;
        default: () => {};
    };
}, MaterialSetupInterface, unknown, {}, {
    getMaterialParams(): {
        [x: string]: any;
        alphaTest?: number | undefined;
        blending?: number | undefined;
        color?: string | number | undefined;
        depthTest?: boolean | undefined;
        depthWrite?: boolean | undefined;
        fog?: boolean | undefined;
        opacity?: number | undefined;
        side?: number | undefined;
        toneMapped?: boolean | undefined;
        transparent?: boolean | undefined;
        vertexColors?: boolean | undefined;
        visible?: boolean | undefined;
    };
    setProp(material: any, key: string, value: any, needsUpdate?: boolean): void;
    setTexture(texture: three.Texture | null, key?: string): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "created"[], "created", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    color: {
        type: StringConstructor;
        default: string;
    };
    props: {
        type: vue.PropType<MaterialPropsInterface>;
        default: () => {};
    };
}>> & {
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    color: string;
    props: MaterialPropsInterface;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    props: {
        type: ObjectConstructor;
        default: () => {
            uniforms: {};
            vertexShader: string;
            fragmentShader: string;
        };
    };
}>>, {
    props: Record<string, any>;
}>;
//# sourceMappingURL=ShaderMaterial.d.ts.map

interface SubSurfaceMaterialUniformsInterface {
    diffuse?: string | number;
    thicknessColor?: string | number;
    thicknessDistortion?: number;
    thicknessAmbient?: number;
    thicknessAttenuation?: number;
    thicknessPower?: number;
    thicknessScale?: number;
}
declare const _default$C: vue.DefineComponent<{
    uniforms: {
        type: PropType<SubSurfaceMaterialUniformsInterface>;
        default: () => {
            diffuse: string;
            thicknessColor: string;
            thicknessDistortion: number;
            thicknessAmbient: number;
            thicknessAttenuation: number;
            thicknessPower: number;
            thicknessScale: number;
        };
    };
}, unknown, unknown, {}, {
    createMaterial(): ShaderMaterial;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    color: {
        type: StringConstructor;
        default: string;
    };
    props: {
        type: PropType<MaterialPropsInterface>;
        default: () => {};
    };
}, MaterialSetupInterface, unknown, {}, {
    getMaterialParams(): {
        [x: string]: any;
        alphaTest?: number | undefined;
        blending?: number | undefined;
        color?: string | number | undefined;
        depthTest?: boolean | undefined;
        depthWrite?: boolean | undefined;
        fog?: boolean | undefined;
        opacity?: number | undefined;
        side?: number | undefined;
        toneMapped?: boolean | undefined;
        transparent?: boolean | undefined;
        vertexColors?: boolean | undefined;
        visible?: boolean | undefined;
    };
    setProp(material: any, key: string, value: any, needsUpdate?: boolean): void;
    setTexture(texture: three.Texture | null, key?: string): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "created"[], "created", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    color: {
        type: StringConstructor;
        default: string;
    };
    props: {
        type: PropType<MaterialPropsInterface>;
        default: () => {};
    };
}>> & {
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    color: string;
    props: MaterialPropsInterface;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    uniforms: {
        type: PropType<SubSurfaceMaterialUniformsInterface>;
        default: () => {
            diffuse: string;
            thicknessColor: string;
            thicknessDistortion: number;
            thicknessAmbient: number;
            thicknessAttenuation: number;
            thicknessPower: number;
            thicknessScale: number;
        };
    };
}>>, {
    uniforms: SubSurfaceMaterialUniformsInterface;
}>;

interface TexureInterface {
    material?: MaterialInterface;
    texture?: Texture;
}
declare const _default$B: vue.DefineComponent<{
    name: {
        type: StringConstructor;
        default: string;
    };
    uniform: StringConstructor;
    src: StringConstructor;
    onLoad: PropType<(t: Texture) => void>;
    onProgress: PropType<(e: ProgressEvent) => void>;
    onError: PropType<(e: ErrorEvent) => void>;
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
}, TexureInterface, unknown, {}, {
    createTexture(): Texture | undefined;
    initTexture(): void;
    refreshTexture(): void;
    onLoaded(t: Texture): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    name: {
        type: StringConstructor;
        default: string;
    };
    uniform: StringConstructor;
    src: StringConstructor;
    onLoad: PropType<(t: Texture) => void>;
    onProgress: PropType<(e: ProgressEvent) => void>;
    onError: PropType<(e: ErrorEvent) => void>;
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
}>>, {
    name: string;
    props: Record<string, any>;
}>;

declare const _default$A: vue.DefineComponent<{
    name: {
        type: StringConstructor;
        default: string;
    };
    path: {
        type: StringConstructor;
        required: true;
    };
    urls: {
        type: PropType<string[]>;
        default: () => string[];
    };
    props: {
        type: ObjectConstructor;
        default: () => {
            mapping: three.Mapping;
        };
    };
}, unknown, unknown, {}, {
    createTexture(): three.CubeTexture;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    name: {
        type: StringConstructor;
        default: string;
    };
    uniform: StringConstructor;
    src: StringConstructor;
    onLoad: PropType<(t: three.Texture) => void>;
    onProgress: PropType<(e: ProgressEvent<EventTarget>) => void>;
    onError: PropType<(e: ErrorEvent) => void>;
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
}, TexureInterface, unknown, {}, {
    createTexture(): three.Texture | undefined;
    initTexture(): void;
    refreshTexture(): void;
    onLoaded(t: three.Texture): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    name: {
        type: StringConstructor;
        default: string;
    };
    uniform: StringConstructor;
    src: StringConstructor;
    onLoad: PropType<(t: three.Texture) => void>;
    onProgress: PropType<(e: ProgressEvent<EventTarget>) => void>;
    onError: PropType<(e: ErrorEvent) => void>;
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
}>>, {
    name: string;
    props: Record<string, any>;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    name: {
        type: StringConstructor;
        default: string;
    };
    path: {
        type: StringConstructor;
        required: true;
    };
    urls: {
        type: PropType<string[]>;
        default: () => string[];
    };
    props: {
        type: ObjectConstructor;
        default: () => {
            mapping: three.Mapping;
        };
    };
}>>, {
    name: string;
    props: Record<string, any>;
    urls: string[];
}>;
//# sourceMappingURL=CubeTexture.d.ts.map

declare const _default$z: vue.DefineComponent<{
    videoId: {
        type: StringConstructor;
        required: true;
    };
}, unknown, unknown, {}, {
    createTexture(): VideoTexture;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    name: {
        type: StringConstructor;
        default: string;
    };
    uniform: StringConstructor;
    src: StringConstructor;
    onLoad: vue.PropType<(t: three.Texture) => void>;
    onProgress: vue.PropType<(e: ProgressEvent<EventTarget>) => void>;
    onError: vue.PropType<(e: ErrorEvent) => void>;
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
}, TexureInterface, unknown, {}, {
    createTexture(): three.Texture | undefined;
    initTexture(): void;
    refreshTexture(): void;
    onLoaded(t: three.Texture): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    name: {
        type: StringConstructor;
        default: string;
    };
    uniform: StringConstructor;
    src: StringConstructor;
    onLoad: vue.PropType<(t: three.Texture) => void>;
    onProgress: vue.PropType<(e: ProgressEvent<EventTarget>) => void>;
    onError: vue.PropType<(e: ErrorEvent) => void>;
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
}>>, {
    name: string;
    props: Record<string, any>;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    videoId: {
        type: StringConstructor;
        required: true;
    };
}>>, {}>;
//# sourceMappingURL=VideoTexture.d.ts.map

declare const _default$y: vue.DefineComponent<{
    readonly size: NumberConstructor;
    readonly width: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly height: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly depth: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly widthSegments: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly heightSegments: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly depthSegments: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
}, unknown, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material | three.Material[]): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D<three.Event>): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string>, {}> | undefined;
    addToParent(o?: three.Object3D<three.Event> | undefined): boolean;
    removeFromParent(o?: three.Object3D<three.Event> | undefined): boolean;
    add(o: three.Object3D<three.Event>): void;
    remove(o: three.Object3D<three.Event>): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    position: Vector3PropInterface;
    scale: Vector3PropInterface;
    visible: boolean;
    rotation: EulerPropInterface;
    props: Record<string, any>;
    lookAt: Vector3PropInterface;
    userData: Record<string, any>;
    disableAdd: boolean;
    disableRemove: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}>>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly size: NumberConstructor;
    readonly width: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly height: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly depth: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly widthSegments: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly heightSegments: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly depthSegments: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
}>>, {
    readonly height: number;
    readonly width: number;
    readonly depth: number;
    readonly widthSegments: number;
    readonly heightSegments: number;
    readonly depthSegments: number;
}>;
//# sourceMappingURL=Box.d.ts.map

declare const _default$x: vue.DefineComponent<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly segments: {
        readonly type: NumberConstructor;
        readonly default: 8;
    };
    readonly thetaStart: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly thetaLength: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
}, unknown, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material | three.Material[]): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D<three.Event>): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string>, {}> | undefined;
    addToParent(o?: three.Object3D<three.Event> | undefined): boolean;
    removeFromParent(o?: three.Object3D<three.Event> | undefined): boolean;
    add(o: three.Object3D<three.Event>): void;
    remove(o: three.Object3D<three.Event>): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    position: Vector3PropInterface;
    scale: Vector3PropInterface;
    visible: boolean;
    rotation: EulerPropInterface;
    props: Record<string, any>;
    lookAt: Vector3PropInterface;
    userData: Record<string, any>;
    disableAdd: boolean;
    disableRemove: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}>>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly segments: {
        readonly type: NumberConstructor;
        readonly default: 8;
    };
    readonly thetaStart: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly thetaLength: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
}>>, {
    readonly segments: number;
    readonly radius: number;
    readonly thetaStart: number;
    readonly thetaLength: number;
}>;
//# sourceMappingURL=Circle.d.ts.map

declare const _default$w: vue.DefineComponent<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly height: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly radialSegments: {
        readonly type: NumberConstructor;
        readonly default: 8;
    };
    readonly heightSegments: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly openEnded: {
        readonly type: BooleanConstructor;
        readonly default: false;
    };
    readonly thetaStart: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly thetaLength: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
}, unknown, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material | three.Material[]): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D<three.Event>): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string>, {}> | undefined;
    addToParent(o?: three.Object3D<three.Event> | undefined): boolean;
    removeFromParent(o?: three.Object3D<three.Event> | undefined): boolean;
    add(o: three.Object3D<three.Event>): void;
    remove(o: three.Object3D<three.Event>): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    position: Vector3PropInterface;
    scale: Vector3PropInterface;
    visible: boolean;
    rotation: EulerPropInterface;
    props: Record<string, any>;
    lookAt: Vector3PropInterface;
    userData: Record<string, any>;
    disableAdd: boolean;
    disableRemove: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}>>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly height: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly radialSegments: {
        readonly type: NumberConstructor;
        readonly default: 8;
    };
    readonly heightSegments: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly openEnded: {
        readonly type: BooleanConstructor;
        readonly default: false;
    };
    readonly thetaStart: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly thetaLength: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
}>>, {
    readonly height: number;
    readonly radius: number;
    readonly heightSegments: number;
    readonly thetaStart: number;
    readonly thetaLength: number;
    readonly radialSegments: number;
    readonly openEnded: boolean;
}>;
//# sourceMappingURL=Cone.d.ts.map

declare const _default$v: vue.DefineComponent<{
    readonly radiusTop: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly radiusBottom: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly height: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly radialSegments: {
        readonly type: NumberConstructor;
        readonly default: 8;
    };
    readonly heightSegments: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly openEnded: {
        readonly type: BooleanConstructor;
        readonly default: false;
    };
    readonly thetaStart: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly thetaLength: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
}, unknown, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material | three.Material[]): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D<three.Event>): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string>, {}> | undefined;
    addToParent(o?: three.Object3D<three.Event> | undefined): boolean;
    removeFromParent(o?: three.Object3D<three.Event> | undefined): boolean;
    add(o: three.Object3D<three.Event>): void;
    remove(o: three.Object3D<three.Event>): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    position: Vector3PropInterface;
    scale: Vector3PropInterface;
    visible: boolean;
    rotation: EulerPropInterface;
    props: Record<string, any>;
    lookAt: Vector3PropInterface;
    userData: Record<string, any>;
    disableAdd: boolean;
    disableRemove: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}>>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly radiusTop: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly radiusBottom: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly height: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly radialSegments: {
        readonly type: NumberConstructor;
        readonly default: 8;
    };
    readonly heightSegments: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly openEnded: {
        readonly type: BooleanConstructor;
        readonly default: false;
    };
    readonly thetaStart: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly thetaLength: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
}>>, {
    readonly height: number;
    readonly heightSegments: number;
    readonly thetaStart: number;
    readonly thetaLength: number;
    readonly radialSegments: number;
    readonly openEnded: boolean;
    readonly radiusTop: number;
    readonly radiusBottom: number;
}>;
//# sourceMappingURL=Cylinder.d.ts.map

declare const _default$u: vue.DefineComponent<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly detail: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
}, unknown, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material | three.Material[]): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D<three.Event>): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string>, {}> | undefined;
    addToParent(o?: three.Object3D<three.Event> | undefined): boolean;
    removeFromParent(o?: three.Object3D<three.Event> | undefined): boolean;
    add(o: three.Object3D<three.Event>): void;
    remove(o: three.Object3D<three.Event>): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    position: Vector3PropInterface;
    scale: Vector3PropInterface;
    visible: boolean;
    rotation: EulerPropInterface;
    props: Record<string, any>;
    lookAt: Vector3PropInterface;
    userData: Record<string, any>;
    disableAdd: boolean;
    disableRemove: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}>>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly detail: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
}>>, {
    readonly detail: number;
    readonly radius: number;
}>;
//# sourceMappingURL=Dodecahedron.d.ts.map

declare const _default$t: vue.DefineComponent<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly detail: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
}, unknown, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material | three.Material[]): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D<three.Event>): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string>, {}> | undefined;
    addToParent(o?: three.Object3D<three.Event> | undefined): boolean;
    removeFromParent(o?: three.Object3D<three.Event> | undefined): boolean;
    add(o: three.Object3D<three.Event>): void;
    remove(o: three.Object3D<three.Event>): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    position: Vector3PropInterface;
    scale: Vector3PropInterface;
    visible: boolean;
    rotation: EulerPropInterface;
    props: Record<string, any>;
    lookAt: Vector3PropInterface;
    userData: Record<string, any>;
    disableAdd: boolean;
    disableRemove: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}>>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly detail: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
}>>, {
    readonly detail: number;
    readonly radius: number;
}>;
//# sourceMappingURL=Icosahedron.d.ts.map

declare const _default$s: vue.DefineComponent<{
    readonly points: ArrayConstructor;
    readonly segments: {
        readonly type: NumberConstructor;
        readonly default: 12;
    };
    readonly phiStart: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly phiLength: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
}, unknown, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material | three.Material[]): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D<three.Event>): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string>, {}> | undefined;
    addToParent(o?: three.Object3D<three.Event> | undefined): boolean;
    removeFromParent(o?: three.Object3D<three.Event> | undefined): boolean;
    add(o: three.Object3D<three.Event>): void;
    remove(o: three.Object3D<three.Event>): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    position: Vector3PropInterface;
    scale: Vector3PropInterface;
    visible: boolean;
    rotation: EulerPropInterface;
    props: Record<string, any>;
    lookAt: Vector3PropInterface;
    userData: Record<string, any>;
    disableAdd: boolean;
    disableRemove: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}>>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly points: ArrayConstructor;
    readonly segments: {
        readonly type: NumberConstructor;
        readonly default: 12;
    };
    readonly phiStart: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly phiLength: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
}>>, {
    readonly segments: number;
    readonly phiStart: number;
    readonly phiLength: number;
}>;
//# sourceMappingURL=Lathe.d.ts.map

declare const _default$r: vue.DefineComponent<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly detail: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
}, unknown, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material | three.Material[]): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D<three.Event>): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string>, {}> | undefined;
    addToParent(o?: three.Object3D<three.Event> | undefined): boolean;
    removeFromParent(o?: three.Object3D<three.Event> | undefined): boolean;
    add(o: three.Object3D<three.Event>): void;
    remove(o: three.Object3D<three.Event>): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    position: Vector3PropInterface;
    scale: Vector3PropInterface;
    visible: boolean;
    rotation: EulerPropInterface;
    props: Record<string, any>;
    lookAt: Vector3PropInterface;
    userData: Record<string, any>;
    disableAdd: boolean;
    disableRemove: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}>>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly detail: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
}>>, {
    readonly detail: number;
    readonly radius: number;
}>;
//# sourceMappingURL=Octahedron.d.ts.map

declare const _default$q: vue.DefineComponent<{
    readonly width: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly height: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly widthSegments: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly heightSegments: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
}, unknown, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material | three.Material[]): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D<three.Event>): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string>, {}> | undefined;
    addToParent(o?: three.Object3D<three.Event> | undefined): boolean;
    removeFromParent(o?: three.Object3D<three.Event> | undefined): boolean;
    add(o: three.Object3D<three.Event>): void;
    remove(o: three.Object3D<three.Event>): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    position: Vector3PropInterface;
    scale: Vector3PropInterface;
    visible: boolean;
    rotation: EulerPropInterface;
    props: Record<string, any>;
    lookAt: Vector3PropInterface;
    userData: Record<string, any>;
    disableAdd: boolean;
    disableRemove: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}>>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly width: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly height: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly widthSegments: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly heightSegments: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
}>>, {
    readonly height: number;
    readonly width: number;
    readonly widthSegments: number;
    readonly heightSegments: number;
}>;
//# sourceMappingURL=Plane.d.ts.map

declare const _default$p: vue.DefineComponent<{
    readonly vertices: ArrayConstructor;
    readonly indices: ArrayConstructor;
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly detail: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
}, unknown, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material | three.Material[]): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D<three.Event>): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string>, {}> | undefined;
    addToParent(o?: three.Object3D<three.Event> | undefined): boolean;
    removeFromParent(o?: three.Object3D<three.Event> | undefined): boolean;
    add(o: three.Object3D<three.Event>): void;
    remove(o: three.Object3D<three.Event>): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    position: Vector3PropInterface;
    scale: Vector3PropInterface;
    visible: boolean;
    rotation: EulerPropInterface;
    props: Record<string, any>;
    lookAt: Vector3PropInterface;
    userData: Record<string, any>;
    disableAdd: boolean;
    disableRemove: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}>>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly vertices: ArrayConstructor;
    readonly indices: ArrayConstructor;
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly detail: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
}>>, {
    readonly detail: number;
    readonly radius: number;
}>;
//# sourceMappingURL=Polyhedron.d.ts.map

declare const _default$o: vue.DefineComponent<{
    readonly innerRadius: {
        readonly type: NumberConstructor;
        readonly default: 0.5;
    };
    readonly outerRadius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly thetaSegments: {
        readonly type: NumberConstructor;
        readonly default: 8;
    };
    readonly phiSegments: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly thetaStart: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly thetaLength: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
}, unknown, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material | three.Material[]): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D<three.Event>): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string>, {}> | undefined;
    addToParent(o?: three.Object3D<three.Event> | undefined): boolean;
    removeFromParent(o?: three.Object3D<three.Event> | undefined): boolean;
    add(o: three.Object3D<three.Event>): void;
    remove(o: three.Object3D<three.Event>): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    position: Vector3PropInterface;
    scale: Vector3PropInterface;
    visible: boolean;
    rotation: EulerPropInterface;
    props: Record<string, any>;
    lookAt: Vector3PropInterface;
    userData: Record<string, any>;
    disableAdd: boolean;
    disableRemove: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}>>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly innerRadius: {
        readonly type: NumberConstructor;
        readonly default: 0.5;
    };
    readonly outerRadius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly thetaSegments: {
        readonly type: NumberConstructor;
        readonly default: 8;
    };
    readonly phiSegments: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly thetaStart: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly thetaLength: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
}>>, {
    readonly thetaStart: number;
    readonly thetaLength: number;
    readonly innerRadius: number;
    readonly outerRadius: number;
    readonly thetaSegments: number;
    readonly phiSegments: number;
}>;
//# sourceMappingURL=Ring.d.ts.map

declare const _default$n: vue.DefineComponent<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly widthSegments: {
        readonly type: NumberConstructor;
        readonly default: 12;
    };
    readonly heightSegments: {
        readonly type: NumberConstructor;
        readonly default: 12;
    };
    readonly phiStart: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly phiLength: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
    readonly thetaStart: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly thetaLength: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
}, unknown, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material | three.Material[]): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D<three.Event>): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string>, {}> | undefined;
    addToParent(o?: three.Object3D<three.Event> | undefined): boolean;
    removeFromParent(o?: three.Object3D<three.Event> | undefined): boolean;
    add(o: three.Object3D<three.Event>): void;
    remove(o: three.Object3D<three.Event>): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    position: Vector3PropInterface;
    scale: Vector3PropInterface;
    visible: boolean;
    rotation: EulerPropInterface;
    props: Record<string, any>;
    lookAt: Vector3PropInterface;
    userData: Record<string, any>;
    disableAdd: boolean;
    disableRemove: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}>>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly widthSegments: {
        readonly type: NumberConstructor;
        readonly default: 12;
    };
    readonly heightSegments: {
        readonly type: NumberConstructor;
        readonly default: 12;
    };
    readonly phiStart: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly phiLength: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
    readonly thetaStart: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly thetaLength: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
}>>, {
    readonly radius: number;
    readonly widthSegments: number;
    readonly heightSegments: number;
    readonly thetaStart: number;
    readonly thetaLength: number;
    readonly phiStart: number;
    readonly phiLength: number;
}>;
//# sourceMappingURL=Sphere.d.ts.map

declare const _default$m: vue.DefineComponent<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly detail: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
}, unknown, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material | three.Material[]): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D<three.Event>): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string>, {}> | undefined;
    addToParent(o?: three.Object3D<three.Event> | undefined): boolean;
    removeFromParent(o?: three.Object3D<three.Event> | undefined): boolean;
    add(o: three.Object3D<three.Event>): void;
    remove(o: three.Object3D<three.Event>): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    position: Vector3PropInterface;
    scale: Vector3PropInterface;
    visible: boolean;
    rotation: EulerPropInterface;
    props: Record<string, any>;
    lookAt: Vector3PropInterface;
    userData: Record<string, any>;
    disableAdd: boolean;
    disableRemove: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}>>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly detail: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
}>>, {
    readonly detail: number;
    readonly radius: number;
}>;
//# sourceMappingURL=Tetrahedron.d.ts.map

interface TextSetupInterface extends MeshSetupInterface {
    geometry?: TextGeometry;
    font?: Font;
}
declare const _default$l: vue.DefineComponent<{
    readonly text: {
        readonly type: StringConstructor;
        readonly required: true;
        readonly default: "Text";
    };
    readonly fontSrc: {
        readonly type: StringConstructor;
        readonly required: true;
    };
    readonly size: {
        readonly type: NumberConstructor;
        readonly default: 80;
    };
    readonly height: {
        readonly type: NumberConstructor;
        readonly default: 5;
    };
    readonly depth: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly curveSegments: {
        readonly type: NumberConstructor;
        readonly default: 12;
    };
    readonly bevelEnabled: {
        readonly type: BooleanConstructor;
        readonly default: false;
    };
    readonly bevelThickness: {
        readonly type: NumberConstructor;
        readonly default: 10;
    };
    readonly bevelSize: {
        readonly type: NumberConstructor;
        readonly default: 8;
    };
    readonly bevelOffset: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly bevelSegments: {
        readonly type: NumberConstructor;
        readonly default: 5;
    };
    readonly align: {
        readonly type: PropType<string | boolean>;
        readonly default: false;
    };
}, TextSetupInterface, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material | three.Material[]): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D<three.Event>): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string>, {}> | undefined;
    addToParent(o?: three.Object3D<three.Event> | undefined): boolean;
    removeFromParent(o?: three.Object3D<three.Event> | undefined): boolean;
    add(o: three.Object3D<three.Event>): void;
    remove(o: three.Object3D<three.Event>): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    position: Vector3PropInterface;
    scale: Vector3PropInterface;
    visible: boolean;
    rotation: EulerPropInterface;
    props: Record<string, any>;
    lookAt: Vector3PropInterface;
    userData: Record<string, any>;
    disableAdd: boolean;
    disableRemove: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}>>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly text: {
        readonly type: StringConstructor;
        readonly required: true;
        readonly default: "Text";
    };
    readonly fontSrc: {
        readonly type: StringConstructor;
        readonly required: true;
    };
    readonly size: {
        readonly type: NumberConstructor;
        readonly default: 80;
    };
    readonly height: {
        readonly type: NumberConstructor;
        readonly default: 5;
    };
    readonly depth: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly curveSegments: {
        readonly type: NumberConstructor;
        readonly default: 12;
    };
    readonly bevelEnabled: {
        readonly type: BooleanConstructor;
        readonly default: false;
    };
    readonly bevelThickness: {
        readonly type: NumberConstructor;
        readonly default: 10;
    };
    readonly bevelSize: {
        readonly type: NumberConstructor;
        readonly default: 8;
    };
    readonly bevelOffset: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly bevelSegments: {
        readonly type: NumberConstructor;
        readonly default: 5;
    };
    readonly align: {
        readonly type: PropType<string | boolean>;
        readonly default: false;
    };
}>>, {
    readonly height: number;
    readonly text: string;
    readonly size: number;
    readonly depth: number;
    readonly align: string | boolean;
    readonly curveSegments: number;
    readonly bevelEnabled: boolean;
    readonly bevelThickness: number;
    readonly bevelSize: number;
    readonly bevelOffset: number;
    readonly bevelSegments: number;
}>;
//# sourceMappingURL=Text.d.ts.map

declare const _default$k: vue.DefineComponent<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly tube: {
        readonly type: NumberConstructor;
        readonly default: 0.4;
    };
    readonly radialSegments: {
        readonly type: NumberConstructor;
        readonly default: 8;
    };
    readonly tubularSegments: {
        readonly type: NumberConstructor;
        readonly default: 6;
    };
    readonly arc: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
}, unknown, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material | three.Material[]): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D<three.Event>): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string>, {}> | undefined;
    addToParent(o?: three.Object3D<three.Event> | undefined): boolean;
    removeFromParent(o?: three.Object3D<three.Event> | undefined): boolean;
    add(o: three.Object3D<three.Event>): void;
    remove(o: three.Object3D<three.Event>): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    position: Vector3PropInterface;
    scale: Vector3PropInterface;
    visible: boolean;
    rotation: EulerPropInterface;
    props: Record<string, any>;
    lookAt: Vector3PropInterface;
    userData: Record<string, any>;
    disableAdd: boolean;
    disableRemove: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}>>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly tube: {
        readonly type: NumberConstructor;
        readonly default: 0.4;
    };
    readonly radialSegments: {
        readonly type: NumberConstructor;
        readonly default: 8;
    };
    readonly tubularSegments: {
        readonly type: NumberConstructor;
        readonly default: 6;
    };
    readonly arc: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
}>>, {
    readonly radius: number;
    readonly radialSegments: number;
    readonly tube: number;
    readonly tubularSegments: number;
    readonly arc: number;
}>;
//# sourceMappingURL=Torus.d.ts.map

declare const _default$j: vue.DefineComponent<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly tube: {
        readonly type: NumberConstructor;
        readonly default: 0.4;
    };
    readonly tubularSegments: {
        readonly type: NumberConstructor;
        readonly default: 64;
    };
    readonly radialSegments: {
        readonly type: NumberConstructor;
        readonly default: 8;
    };
    readonly p: {
        readonly type: NumberConstructor;
        readonly default: 2;
    };
    readonly q: {
        readonly type: NumberConstructor;
        readonly default: 3;
    };
}, unknown, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material | three.Material[]): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D<three.Event>): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string>, {}> | undefined;
    addToParent(o?: three.Object3D<three.Event> | undefined): boolean;
    removeFromParent(o?: three.Object3D<three.Event> | undefined): boolean;
    add(o: three.Object3D<three.Event>): void;
    remove(o: three.Object3D<three.Event>): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    position: Vector3PropInterface;
    scale: Vector3PropInterface;
    visible: boolean;
    rotation: EulerPropInterface;
    props: Record<string, any>;
    lookAt: Vector3PropInterface;
    userData: Record<string, any>;
    disableAdd: boolean;
    disableRemove: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}>>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly tube: {
        readonly type: NumberConstructor;
        readonly default: 0.4;
    };
    readonly tubularSegments: {
        readonly type: NumberConstructor;
        readonly default: 64;
    };
    readonly radialSegments: {
        readonly type: NumberConstructor;
        readonly default: 8;
    };
    readonly p: {
        readonly type: NumberConstructor;
        readonly default: 2;
    };
    readonly q: {
        readonly type: NumberConstructor;
        readonly default: 3;
    };
}>>, {
    readonly p: number;
    readonly q: number;
    readonly radius: number;
    readonly radialSegments: number;
    readonly tube: number;
    readonly tubularSegments: number;
}>;
//# sourceMappingURL=TorusKnot.d.ts.map

declare const _default$i: vue.DefineComponent<{
    readonly points: ArrayConstructor;
    readonly path: typeof three.Curve;
    readonly tubularSegments: {
        readonly type: NumberConstructor;
        readonly default: 64;
    };
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly radialSegments: {
        readonly type: NumberConstructor;
        readonly default: 8;
    };
    readonly closed: {
        readonly type: BooleanConstructor;
        readonly default: false;
    };
}, unknown, unknown, {}, {
    createGeometry(): void;
    updatePoints(points: Vector3[]): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material | three.Material[]): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D<three.Event>): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string>, {}> | undefined;
    addToParent(o?: three.Object3D<three.Event> | undefined): boolean;
    removeFromParent(o?: three.Object3D<three.Event> | undefined): boolean;
    add(o: three.Object3D<three.Event>): void;
    remove(o: three.Object3D<three.Event>): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    position: Vector3PropInterface;
    scale: Vector3PropInterface;
    visible: boolean;
    rotation: EulerPropInterface;
    props: Record<string, any>;
    lookAt: Vector3PropInterface;
    userData: Record<string, any>;
    disableAdd: boolean;
    disableRemove: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}>>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly points: ArrayConstructor;
    readonly path: typeof three.Curve;
    readonly tubularSegments: {
        readonly type: NumberConstructor;
        readonly default: 64;
    };
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly radialSegments: {
        readonly type: NumberConstructor;
        readonly default: 8;
    };
    readonly closed: {
        readonly type: BooleanConstructor;
        readonly default: false;
    };
}>>, {
    readonly closed: boolean;
    readonly radius: number;
    readonly radialSegments: number;
    readonly tubularSegments: number;
}>;
//# sourceMappingURL=Tube.d.ts.map

interface ImageSetupInterface extends MeshSetupInterface {
    material?: MeshBasicMaterial;
    texture?: Texture;
}
declare const _default$h: vue.DefineComponent<{
    src: {
        type: StringConstructor;
        required: true;
    };
    width: NumberConstructor;
    height: NumberConstructor;
    widthSegments: {
        type: NumberConstructor;
        default: number;
    };
    heightSegments: {
        type: NumberConstructor;
        default: number;
    };
    keepSize: BooleanConstructor;
}, ImageSetupInterface, unknown, {}, {
    loadTexture(): Texture;
    refreshTexture(): void;
    onLoaded(texture: Texture): void;
    resize(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material | three.Material[]): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D<three.Event>): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string>, {}> | undefined;
    addToParent(o?: three.Object3D<three.Event> | undefined): boolean;
    removeFromParent(o?: three.Object3D<three.Event> | undefined): boolean;
    add(o: three.Object3D<three.Event>): void;
    remove(o: three.Object3D<three.Event>): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    position: Vector3PropInterface;
    scale: Vector3PropInterface;
    visible: boolean;
    rotation: EulerPropInterface;
    props: Record<string, any>;
    lookAt: Vector3PropInterface;
    userData: Record<string, any>;
    disableAdd: boolean;
    disableRemove: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}>>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, "loaded"[], "loaded", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    src: {
        type: StringConstructor;
        required: true;
    };
    width: NumberConstructor;
    height: NumberConstructor;
    widthSegments: {
        type: NumberConstructor;
        default: number;
    };
    heightSegments: {
        type: NumberConstructor;
        default: number;
    };
    keepSize: BooleanConstructor;
}>> & {
    onLoaded?: ((...args: any[]) => any) | undefined;
}, {
    widthSegments: number;
    heightSegments: number;
    keepSize: boolean;
}>;
//# sourceMappingURL=Image.d.ts.map

declare const _default$g: vue.DefineComponent<{
    count: {
        type: NumberConstructor;
        required: true;
    };
}, unknown, unknown, {}, {
    initMesh(): false | undefined;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material | three.Material[]): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D<three.Event>): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string>, {}> | undefined;
    addToParent(o?: three.Object3D<three.Event> | undefined): boolean;
    removeFromParent(o?: three.Object3D<three.Event> | undefined): boolean;
    add(o: three.Object3D<three.Event>): void;
    remove(o: three.Object3D<three.Event>): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    position: Vector3PropInterface;
    scale: Vector3PropInterface;
    visible: boolean;
    rotation: EulerPropInterface;
    props: Record<string, any>;
    lookAt: Vector3PropInterface;
    userData: Record<string, any>;
    disableAdd: boolean;
    disableRemove: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}>>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    count: {
        type: NumberConstructor;
        required: true;
    };
}>>, {}>;
//# sourceMappingURL=InstancedMesh.d.ts.map

interface SpriteSetupInterface extends Object3DSetupInterface {
    texture?: Texture;
    material?: SpriteMaterial;
    sprite?: Sprite;
}
declare const _default$f: vue.DefineComponent<{
    src: {
        type: StringConstructor;
        required: true;
    };
}, SpriteSetupInterface, unknown, {}, {
    onLoaded(): void;
    updateUV(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D<three.Event>): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string>, {}> | undefined;
    addToParent(o?: three.Object3D<three.Event> | undefined): boolean;
    removeFromParent(o?: three.Object3D<three.Event> | undefined): boolean;
    add(o: three.Object3D<three.Event>): void;
    remove(o: three.Object3D<three.Event>): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    position: Vector3PropInterface;
    scale: Vector3PropInterface;
    visible: boolean;
    rotation: EulerPropInterface;
    props: Record<string, any>;
    lookAt: Vector3PropInterface;
    userData: Record<string, any>;
    disableAdd: boolean;
    disableRemove: boolean;
}>, "loaded"[], "loaded", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    src: {
        type: StringConstructor;
        required: true;
    };
}>> & {
    onLoaded?: ((...args: any[]) => any) | undefined;
}, {}>;
//# sourceMappingURL=Sprite.d.ts.map

interface PointsSetupInterface extends Object3DSetupInterface {
    mesh?: Points;
    points?: Points;
    geometry?: BufferGeometry;
    material?: Material;
}
declare const _default$e: vue.DefineComponent<{}, PointsSetupInterface, {}, {}, {
    setGeometry(geometry: BufferGeometry): void;
    setMaterial(material: Material): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D<three.Event>): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string>, {}> | undefined;
    addToParent(o?: three.Object3D<three.Event> | undefined): boolean;
    removeFromParent(o?: three.Object3D<three.Event> | undefined): boolean;
    add(o: three.Object3D<three.Event>): void;
    remove(o: three.Object3D<three.Event>): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    position: Vector3PropInterface;
    scale: Vector3PropInterface;
    visible: boolean;
    rotation: EulerPropInterface;
    props: Record<string, any>;
    lookAt: Vector3PropInterface;
    userData: Record<string, any>;
    disableAdd: boolean;
    disableRemove: boolean;
}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{}>>, {}>;

declare const _default$d: vue.DefineComponent<{}, {}, {}, {}, {}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    src: {
        type: StringConstructor;
        required: true;
    };
}, unknown, {
    progress: number;
}, {}, {
    onLoad(model: three.Object3D<three.Event>): void;
    onProgress(progress: ProgressEvent<EventTarget>): void;
    onError(error: ErrorEvent): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D<three.Event>): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string>, {}> | undefined;
    addToParent(o?: three.Object3D<three.Event> | undefined): boolean;
    removeFromParent(o?: three.Object3D<three.Event> | undefined): boolean;
    add(o: three.Object3D<three.Event>): void;
    remove(o: three.Object3D<three.Event>): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    position: Vector3PropInterface;
    scale: Vector3PropInterface;
    visible: boolean;
    rotation: EulerPropInterface;
    props: Record<string, any>;
    lookAt: Vector3PropInterface;
    userData: Record<string, any>;
    disableAdd: boolean;
    disableRemove: boolean;
}>, ("progress" | "error" | "load" | "before-load")[], "progress" | "error" | "load" | "before-load", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    src: {
        type: StringConstructor;
        required: true;
    };
}>> & {
    onError?: ((...args: any[]) => any) | undefined;
    onLoad?: ((...args: any[]) => any) | undefined;
    onProgress?: ((...args: any[]) => any) | undefined;
    "onBefore-load"?: ((...args: any[]) => any) | undefined;
}, {}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{}>>, {}>;
//# sourceMappingURL=GLTF.d.ts.map

declare const _default$c: vue.DefineComponent<{}, {}, {}, {}, {}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    src: {
        type: StringConstructor;
        required: true;
    };
}, unknown, {
    progress: number;
}, {}, {
    onLoad(model: three.Object3D<three.Event>): void;
    onProgress(progress: ProgressEvent<EventTarget>): void;
    onError(error: ErrorEvent): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D<three.Event>): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string>, {}> | undefined;
    addToParent(o?: three.Object3D<three.Event> | undefined): boolean;
    removeFromParent(o?: three.Object3D<three.Event> | undefined): boolean;
    add(o: three.Object3D<three.Event>): void;
    remove(o: three.Object3D<three.Event>): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    position: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    rotation: {
        type: vue.PropType<EulerPropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
        };
    };
    scale: {
        type: vue.PropType<Vector3PropInterface>;
        default: () => {
            x: number;
            y: number;
            z: number;
            order: string;
        };
    };
    lookAt: {
        type: vue.PropType<Vector3PropInterface>;
        default: null;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
    visible: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: {
        type: ObjectConstructor;
        default: () => {};
    };
    disableAdd: {
        type: BooleanConstructor;
        default: boolean;
    };
    disableRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
    onCreated?: ((...args: any[]) => any) | undefined;
}, {
    position: Vector3PropInterface;
    scale: Vector3PropInterface;
    visible: boolean;
    rotation: EulerPropInterface;
    props: Record<string, any>;
    lookAt: Vector3PropInterface;
    userData: Record<string, any>;
    disableAdd: boolean;
    disableRemove: boolean;
}>, ("progress" | "error" | "load" | "before-load")[], "progress" | "error" | "load" | "before-load", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    src: {
        type: StringConstructor;
        required: true;
    };
}>> & {
    onError?: ((...args: any[]) => any) | undefined;
    onLoad?: ((...args: any[]) => any) | undefined;
    onProgress?: ((...args: any[]) => any) | undefined;
    "onBefore-load"?: ((...args: any[]) => any) | undefined;
}, {}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{}>>, {}>;
//# sourceMappingURL=FBX.d.ts.map

interface EffectComposerSetupInterface {
    renderer?: RendererInterface;
    composer?: EffectComposer;
}
interface EffectComposerInterface extends EffectComposerSetupInterface {
    addPass(pass: Pass): void;
    removePass(pass: Pass): void;
}
declare const ComposerInjectionKey: InjectionKey<EffectComposerInterface>;
declare const _default$b: vue.DefineComponent<{}, EffectComposerSetupInterface, {}, {}, {
    addPass(pass: Pass): void;
    removePass(pass: Pass): void;
    resize(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{}>>, {}>;

interface EffectSetupInterface {
    renderer?: RendererInterface;
    composer?: EffectComposerInterface;
    pass?: Pass;
}
declare const _default$a: vue.DefineComponent<{}, EffectSetupInterface, {}, {}, {
    initEffectPass(pass: Pass): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "ready"[], "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
}, {}>;

declare const _default$9: vue.DefineComponent<{}, {}, {}, {}, {}, vue.ComponentOptionsMixin, vue.DefineComponent<{}, EffectSetupInterface, {}, {}, {
    initEffectPass(pass: three_examples_jsm_postprocessing_Pass.Pass): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "ready"[], "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
}, {}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{}>>, {}>;
//# sourceMappingURL=RenderPass.d.ts.map

declare const _default$8: vue.DefineComponent<{
    readonly focus: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly aperture: {
        readonly type: NumberConstructor;
        readonly default: 0.025;
    };
    readonly maxblur: {
        readonly type: NumberConstructor;
        readonly default: 0.01;
    };
}, unknown, unknown, {}, {}, vue.ComponentOptionsMixin, vue.DefineComponent<{}, EffectSetupInterface, {}, {}, {
    initEffectPass(pass: three_examples_jsm_postprocessing_Pass.Pass): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "ready"[], "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
}, {}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly focus: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly aperture: {
        readonly type: NumberConstructor;
        readonly default: 0.025;
    };
    readonly maxblur: {
        readonly type: NumberConstructor;
        readonly default: 0.01;
    };
}>>, {
    readonly focus: number;
    readonly aperture: number;
    readonly maxblur: number;
}>;
//# sourceMappingURL=BokehPass.d.ts.map

declare const _default$7: vue.DefineComponent<{
    readonly noiseIntensity: {
        readonly type: NumberConstructor;
        readonly default: 0.5;
    };
    readonly scanlinesIntensity: {
        readonly type: NumberConstructor;
        readonly default: 0.05;
    };
    readonly scanlinesCount: {
        readonly type: NumberConstructor;
        readonly default: 4096;
    };
    readonly grayscale: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
}, unknown, unknown, {}, {}, vue.ComponentOptionsMixin, vue.DefineComponent<{}, EffectSetupInterface, {}, {}, {
    initEffectPass(pass: three_examples_jsm_postprocessing_Pass.Pass): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "ready"[], "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
}, {}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly noiseIntensity: {
        readonly type: NumberConstructor;
        readonly default: 0.5;
    };
    readonly scanlinesIntensity: {
        readonly type: NumberConstructor;
        readonly default: 0.05;
    };
    readonly scanlinesCount: {
        readonly type: NumberConstructor;
        readonly default: 4096;
    };
    readonly grayscale: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
}>>, {
    readonly noiseIntensity: number;
    readonly scanlinesIntensity: number;
    readonly scanlinesCount: number;
    readonly grayscale: number;
}>;
//# sourceMappingURL=FilmPass.d.ts.map

declare const _default$6: vue.DefineComponent<{}, {}, {}, {}, {
    resize({ size }: {
        size: SizeInterface;
    }): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{}, EffectSetupInterface, {}, {}, {
    initEffectPass(pass: three_examples_jsm_postprocessing_Pass.Pass): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "ready"[], "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
}, {}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{}>>, {}>;
//# sourceMappingURL=FXAAPass.d.ts.map

declare const _default$5: vue.DefineComponent<{
    readonly shape: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 4;
    };
    readonly rotateR: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
    readonly rotateG: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
    readonly rotateB: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
    readonly scatter: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
}, unknown, unknown, {}, {}, vue.ComponentOptionsMixin, vue.DefineComponent<{}, EffectSetupInterface, {}, {}, {
    initEffectPass(pass: three_examples_jsm_postprocessing_Pass.Pass): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "ready"[], "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
}, {}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly shape: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 4;
    };
    readonly rotateR: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
    readonly rotateG: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
    readonly rotateB: {
        readonly type: NumberConstructor;
        readonly default: number;
    };
    readonly scatter: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
}>>, {
    readonly shape: number;
    readonly radius: number;
    readonly rotateR: number;
    readonly rotateG: number;
    readonly rotateB: number;
    readonly scatter: number;
}>;
//# sourceMappingURL=HalftonePass.d.ts.map

declare const _default$4: vue.DefineComponent<{}, {}, {}, {}, {}, vue.ComponentOptionsMixin, vue.DefineComponent<{}, EffectSetupInterface, {}, {}, {
    initEffectPass(pass: three_examples_jsm_postprocessing_Pass.Pass): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "ready"[], "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
}, {}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{}>>, {}>;
//# sourceMappingURL=SMAAPass.d.ts.map

declare const _default$3: vue.DefineComponent<{
    options: {
        type: ObjectConstructor;
        default: () => {};
    };
}, unknown, unknown, {}, {}, vue.ComponentOptionsMixin, vue.DefineComponent<{}, EffectSetupInterface, {}, {}, {
    initEffectPass(pass: three_examples_jsm_postprocessing_Pass.Pass): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "ready"[], "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
}, {}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    options: {
        type: ObjectConstructor;
        default: () => {};
    };
}>>, {
    options: Record<string, any>;
}>;
//# sourceMappingURL=SSAOPass.d.ts.map

interface TiltShiftPassSetupInterface {
    uniforms1: {
        [name: string]: {
            value: any;
        };
    };
    uniforms2: {
        [name: string]: {
            value: any;
        };
    };
    pass1?: ShaderPass;
    pass2?: ShaderPass;
}
declare const _default$2: vue.DefineComponent<{
    readonly blurRadius: {
        readonly type: NumberConstructor;
        readonly default: 10;
    };
    readonly gradientRadius: {
        readonly type: NumberConstructor;
        readonly default: 100;
    };
    readonly start: {
        readonly type: PropType<Vector2PropInterface>;
        readonly default: () => {
            x: number;
            y: number;
        };
    };
    readonly end: {
        readonly type: PropType<Vector2PropInterface>;
        readonly default: () => {
            x: number;
            y: number;
        };
    };
}, TiltShiftPassSetupInterface, unknown, {}, {
    updateFocusLine(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{}, EffectSetupInterface, {}, {}, {
    initEffectPass(pass: three_examples_jsm_postprocessing_Pass.Pass): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "ready"[], "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
}, {}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly blurRadius: {
        readonly type: NumberConstructor;
        readonly default: 10;
    };
    readonly gradientRadius: {
        readonly type: NumberConstructor;
        readonly default: 100;
    };
    readonly start: {
        readonly type: PropType<Vector2PropInterface>;
        readonly default: () => {
            x: number;
            y: number;
        };
    };
    readonly end: {
        readonly type: PropType<Vector2PropInterface>;
        readonly default: () => {
            x: number;
            y: number;
        };
    };
}>>, {
    readonly end: Vector2PropInterface;
    readonly start: Vector2PropInterface;
    readonly blurRadius: number;
    readonly gradientRadius: number;
}>;
//# sourceMappingURL=TiltShiftPass.d.ts.map

declare const _default$1: vue.DefineComponent<{
    readonly strength: {
        readonly type: NumberConstructor;
        readonly default: 1.5;
    };
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly threshold: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
}, unknown, unknown, {}, {}, vue.ComponentOptionsMixin, vue.DefineComponent<{}, EffectSetupInterface, {}, {}, {
    initEffectPass(pass: three_examples_jsm_postprocessing_Pass.Pass): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "ready"[], "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
}, {}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    readonly strength: {
        readonly type: NumberConstructor;
        readonly default: 1.5;
    };
    readonly radius: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly threshold: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
}>>, {
    readonly threshold: number;
    readonly radius: number;
    readonly strength: number;
}>;
//# sourceMappingURL=UnrealBloomPass.d.ts.map

declare const _default: vue.DefineComponent<{
    center: {
        type: PropType<Vector2PropInterface>;
        default: () => {
            x: number;
            y: number;
        };
    };
    strength: {
        type: NumberConstructor;
        default: number;
    };
}, unknown, unknown, {}, {}, vue.ComponentOptionsMixin, vue.DefineComponent<{}, EffectSetupInterface, {}, {}, {
    initEffectPass(pass: three_examples_jsm_postprocessing_Pass.Pass): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "ready"[], "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
}, {}>, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    center: {
        type: PropType<Vector2PropInterface>;
        default: () => {
            x: number;
            y: number;
        };
    };
    strength: {
        type: NumberConstructor;
        default: number;
    };
}>>, {
    center: Vector2PropInterface;
    strength: number;
}>;
//# sourceMappingURL=ZoomBlurPass.d.ts.map

type OptionSetter = (dst: any, key: string, value: any) => void;
declare function applyObjectProps(dst: any, options: Record<string, unknown>, setter?: OptionSetter): void;
declare function bindObjectProp(src: any, prop: string, dst: any, apply?: boolean, setter?: OptionSetter): WatchStopHandle;
declare function bindObjectProps(src: any, dst: any, apply?: boolean, setter?: OptionSetter): WatchStopHandle;
declare function setFromProp(o: Record<string, unknown>, prop: Record<string, unknown>): void;
declare function bindProps(src: any, props: string[], dst: any): void;
declare function bindProp(src: any, srcProp: string, dst: any, dstProp?: string): void;
declare function propsValues(props: Record<string, unknown>, exclude?: string[]): Record<string, unknown>;
declare function lerp(value1: number, value2: number, amount: number): number;
declare function limit(val: number, min: number, max: number): number;
declare function getMatcapUrl(hash?: string, format?: number): string;

declare const TroisJSVuePlugin: {
    install(app: App): void;
};
declare function createApp(params: any): App;

interface TextureConfigInterface {
    src: string;
}
interface TexturesInterface {
    loader: TextureLoader;
    count: number;
    textures: Texture[];
    loadProgress: number;
    loadTextures(images: TextureConfigInterface[], cb: {
        (): void;
    }): void;
    dispose(): void;
}
declare function useTextures(): TexturesInterface;

export { _default$K as AmbientLight, BasicMaterial, _default$8 as BokehPass, _default$y as Box, _default$10 as BoxGeometry, Geometry as BufferGeometry, _default$15 as Camera, _default$x as Circle, _default$$ as CircleGeometry, ComposerInjectionKey, _default$w as Cone, _default$_ as ConeGeometry, _default$11 as CubeCamera, _default$A as CubeTexture, _default$v as Cylinder, _default$Z as CylinderGeometry, _default$J as DirectionalLight, _default$u as Dodecahedron, _default$Y as DodecahedronGeometry, _default$b as EffectComposer, _default$a as EffectPass, _default$X as ExtrudeGeometry, _default$6 as FXAAPass, _default$c as FbxModel, _default$7 as FilmPass, _default$d as GltfModel, _default$14 as Group, _default$5 as HalftonePass, _default$I as HemisphereLight, _default$t as Icosahedron, _default$W as IcosahedronGeometry, _default$h as Image, _default$g as InstancedMesh, LambertMaterial, _default$s as Lathe, _default$V as LatheGeometry, _default$E as MatcapMaterial, BaseMaterial as Material, MaterialInjectionKey, MaterialPublicInterface, Mesh, MeshInjectionKey, MeshPublicInterface, _default$17 as Object3D, Object3DPublicInterface, _default$r as Octahedron, _default$U as OctahedronGeometry, _default$16 as OrthographicCamera, _default$15 as PerspectiveCamera, PhongMaterial, PhysicalMaterial, _default$q as Plane, _default$T as PlaneGeometry, _default$H as PointLight, _default$e as Points, PointsMaterial, _default$p as Polyhedron, _default$S as PolyhedronGeometry, _default$12 as Raycaster, _default$G as RectAreaLight, _default$9 as RenderPass, _default$18 as Renderer, RendererInjectionKey, RendererPublicInterface, _default$o as Ring, _default$R as RingGeometry, _default$4 as SMAAPass, _default$3 as SSAOPass, _default$13 as Scene, SceneInjectionKey, _default$D as ShaderMaterial, ShadowMaterial, _default$P as ShapeGeometry, _default$n as Sphere, _default$Q as SphereGeometry, _default$F as SpotLight, _default$f as Sprite, StandardMaterial, _default$C as SubSurfaceMaterial, _default$m as Tetrahedron, _default$O as TetrahedronGeometry, _default$l as Text, _default$B as Texture, _default$2 as TiltShiftPass, ToonMaterial, _default$k as Torus, _default$N as TorusGeometry, _default$j as TorusKnot, _default$M as TorusKnotGeometry, TroisJSVuePlugin, _default$i as Tube, _default$L as TubeGeometry, _default$1 as UnrealBloomPass, _default$z as VideoTexture, _default as ZoomBlurPass, applyObjectProps, bindObjectProp, bindObjectProps, bindProp, bindProps, createApp, getMatcapUrl, lerp, limit, propsValues, setFromProp, useTextures };
