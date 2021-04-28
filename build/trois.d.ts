import * as vue from 'vue';
import { InjectionKey, PropType, ComponentPublicInstance, ComponentPropsOptions, App } from 'vue';
import * as three from 'three';
import { Mesh as Mesh$1, InstancedMesh, Vector2, Vector3, Intersection, WebGLRenderer, Camera, Scene, Object3D, OrthographicCamera, PerspectiveCamera, Group, WebGLCubeRenderTarget, CubeCamera, BufferGeometry, Material, Curve, Light, Texture, MeshBasicMaterial, MeshLambertMaterial, MeshMatcapMaterial, MeshPhongMaterial, MeshPhysicalMaterial, ShaderMaterial, MeshStandardMaterial, MeshToonMaterial, TextGeometry, Font, SpriteMaterial, Sprite, TextureLoader } from 'three';
import { EffectComposer as EffectComposer$1 } from 'three/examples/jsm/postprocessing/EffectComposer';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
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
declare type PointerCallbackType = (e: PointerEventInterface) => void;
declare type PointerIntersectCallbackType = (e: PointerIntersectEventInterface) => void;
declare type IntersectObject = Mesh$1 | InstancedMesh;
interface PointerPublicConfigInterface {
    intersectMode?: 'frame';
    touch?: boolean;
    resetOnEnd?: boolean;
    resetPosition?: Vector2;
    resetPositionV3?: Vector3;
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
    intersectObjects: IntersectObject[];
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
    addIntersectObject(o: IntersectObject): void;
    removeIntersectObject(o: IntersectObject): void;
}

declare type CallbackType<T> = (event: T) => void;
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
declare type InitCallbackType = CallbackType<EventInterface>;
declare type MountedCallbackType = CallbackType<EventInterface>;
declare type RenderCallbackType = CallbackType<RenderEventInterface>;
declare type ResizeCallbackType = CallbackType<ResizeEventInterface>;
interface EventCallbackMap {
    'init': InitCallbackType;
    'mounted': MountedCallbackType;
    'beforerender': RenderCallbackType;
    'afterrender': RenderCallbackType;
    'resize': ResizeCallbackType;
}
interface RendererSetupInterface {
    canvas: HTMLCanvasElement;
    three: ThreeInterface;
    renderer: WebGLRenderer;
    size: SizeInterface;
    renderFn(): void;
    raf: boolean;
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
declare const RendererInjectionKey: InjectionKey<RendererInterface>;
declare const _default$1a: vue.DefineComponent<{
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
    xr: BooleanConstructor;
    onReady: PropType<(r: RendererInterface) => void>;
    onClick: PropType<(this: HTMLCanvasElement, ev: MouseEvent) => any>;
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
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    resize: string | boolean;
    pointer: boolean | PointerPublicConfigInterface;
    alpha: boolean;
    antialias: boolean;
    autoClear: boolean;
    orbitCtrl: boolean | Record<string, unknown>;
    shadow: boolean;
    xr: boolean;
} & {
    onClick?: ((this: HTMLCanvasElement, ev: MouseEvent) => any) | undefined;
    width?: string | undefined;
    height?: string | undefined;
    onReady?: ((r: RendererInterface) => void) | undefined;
}>, {
    resize: string | boolean;
    pointer: boolean | PointerPublicConfigInterface;
    alpha: boolean;
    antialias: boolean;
    autoClear: boolean;
    orbitCtrl: boolean | Record<string, unknown>;
    shadow: boolean;
    xr: boolean;
}>;

interface Object3DSetupInterface {
    renderer?: RendererInterface;
    scene?: Scene;
    o3d?: Object3D;
    parent?: ComponentPublicInstance;
}
interface Vector2PropInterface {
    x?: number;
    y?: number;
}
interface Vector3PropInterface extends Vector2PropInterface {
    z?: number;
}
interface EulerPropInterface extends Vector3PropInterface {
    order?: 'XYZ' | 'YZX' | 'ZXY' | 'XZY' | 'YXZ' | 'ZYX';
}
declare const _default$19: vue.DefineComponent<{
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
    autoRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: Object3D): void;
    getParent(): undefined | ComponentPublicInstance;
    addToParent(o?: Object3D | undefined): boolean;
    removeFromParent(o?: Object3D | undefined): boolean;
    add(o: Object3D): void;
    remove(o: Object3D): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
} & {}>, {
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
}>;

declare const _default$18: vue.DefineComponent<{
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
    renderer: RendererInterface;
    camera: OrthographicCamera;
} | undefined, unknown, {}, {}, vue.ComponentOptionsMixin, vue.DefineComponent<{}, {}, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, vue.EmitsOptions, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {}>, {}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    left: number;
    right: number;
    bottom: number;
    top: number;
    position: Vector3PropInterface;
    zoom: number;
    near: number;
    far: number;
} & {}>, {
    left: number;
    right: number;
    bottom: number;
    top: number;
    position: Vector3PropInterface;
    zoom: number;
    near: number;
    far: number;
}>;

declare const _default$17: vue.DefineComponent<{
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
    renderer: RendererInterface;
    camera: PerspectiveCamera;
} | undefined, unknown, {}, {}, vue.ComponentOptionsMixin, vue.DefineComponent<{}, {}, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, vue.EmitsOptions, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {}>, {}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    position: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    near: number;
    far: number;
    aspect: number;
    fov: number;
} & {}>, {
    position: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    near: number;
    far: number;
    aspect: number;
    fov: number;
}>;

declare const _default$16: vue.DefineComponent<{}, {
    group: Group;
}, {}, {}, {}, vue.ComponentOptionsMixin, vue.DefineComponent<{
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
    autoRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | undefined;
    addToParent(o?: three.Object3D | undefined): boolean;
    removeFromParent(o?: three.Object3D | undefined): boolean;
    add(o: three.Object3D): void;
    remove(o: three.Object3D): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
} & {}>, {
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
}>, vue.EmitsOptions, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {}>, {}>;

declare const SceneInjectionKey: InjectionKey<Scene>;
declare const _default$15: vue.DefineComponent<{
    background: (ObjectConstructor | StringConstructor | NumberConstructor)[];
}, {
    scene: Scene;
    add: (o: Object3D) => void;
    remove: (o: Object3D) => void;
} | undefined, unknown, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {
    background?: unknown;
}>, {}>;

interface RaycasterSetupInterface {
    renderer?: RendererInterface;
    pointer?: PointerInterface;
}
declare const _default$14: vue.DefineComponent<{
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
}, RaycasterSetupInterface, unknown, {}, {
    getIntersectObjects(): IntersectObject[];
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    onClick: PointerIntersectCallbackType;
    onPointerEnter: PointerIntersectCallbackType;
    onPointerOver: PointerIntersectCallbackType;
    onPointerMove: PointerIntersectCallbackType;
    onPointerLeave: PointerIntersectCallbackType;
    intersectMode: string;
} & {}>, {
    onClick: PointerIntersectCallbackType;
    onPointerEnter: PointerIntersectCallbackType;
    onPointerOver: PointerIntersectCallbackType;
    onPointerMove: PointerIntersectCallbackType;
    onPointerLeave: PointerIntersectCallbackType;
    intersectMode: string;
}>;

declare const _default$13: vue.DefineComponent<{
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
}, {
    cubeRT: WebGLCubeRenderTarget;
    cubeCamera: CubeCamera;
} | undefined, unknown, {}, {}, vue.ComponentOptionsMixin, vue.DefineComponent<{
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
    autoRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | undefined;
    addToParent(o?: three.Object3D | undefined): boolean;
    removeFromParent(o?: three.Object3D | undefined): boolean;
    add(o: three.Object3D): void;
    remove(o: three.Object3D): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
} & {}>, {
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    cubeRTSize: number;
    cubeCameraNear: number;
    cubeCameraFar: number;
    autoUpdate: boolean;
} & {}>, {
    cubeRTSize: number;
    cubeCameraNear: number;
    cubeCameraFar: number;
    autoUpdate: boolean;
}>;

interface MeshSetupInterface extends Object3DSetupInterface {
    mesh?: Mesh$1;
    geometry?: BufferGeometry;
    material?: Material;
    loading?: boolean;
}
interface MeshInterface extends MeshSetupInterface {
    setGeometry(g: BufferGeometry): void;
    setMaterial(m: Material): void;
}
declare const MeshInjectionKey: InjectionKey<MeshInterface>;
declare const Mesh: vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<ComponentPropsOptions>): void;
    setGeometry(geometry: BufferGeometry): void;
    setMaterial(material: Material): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
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
    autoRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | undefined;
    addToParent(o?: three.Object3D | undefined): boolean;
    removeFromParent(o?: three.Object3D | undefined): boolean;
    add(o: three.Object3D): void;
    remove(o: three.Object3D): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
} & {}>, {
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    castShadow: boolean;
    receiveShadow: boolean;
} & {
    onClick?: Function | undefined;
    onPointerEnter?: Function | undefined;
    onPointerOver?: Function | undefined;
    onPointerMove?: Function | undefined;
    onPointerLeave?: Function | undefined;
    onPointerDown?: Function | undefined;
    onPointerUp?: Function | undefined;
}>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>;

interface GeometrySetupInterface {
    mesh?: MeshInterface;
    geometry?: BufferGeometry;
    watchProps?: string[];
}

declare const _default$12: vue.DefineComponent<{
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
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {
    rotateX?: number | undefined;
    rotateY?: number | undefined;
    rotateZ?: number | undefined;
}>, {}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    width: number;
    height: number;
    depth: number;
    widthSegments: number;
    heightSegments: number;
    depthSegments: number;
} & {
    size?: number | undefined;
}>, {
    width: number;
    height: number;
    depth: number;
    widthSegments: number;
    heightSegments: number;
    depthSegments: number;
}>;

declare const _default$11: vue.DefineComponent<{
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
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {
    rotateX?: number | undefined;
    rotateY?: number | undefined;
    rotateZ?: number | undefined;
}>, {}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    segments: number;
    radius: number;
    thetaStart: number;
    thetaLength: number;
} & {}>, {
    segments: number;
    radius: number;
    thetaStart: number;
    thetaLength: number;
}>;

declare const _default$10: vue.DefineComponent<{
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
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {
    rotateX?: number | undefined;
    rotateY?: number | undefined;
    rotateZ?: number | undefined;
}>, {}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    height: number;
    heightSegments: number;
    radius: number;
    thetaStart: number;
    thetaLength: number;
    radialSegments: number;
    openEnded: boolean;
} & {}>, {
    height: number;
    heightSegments: number;
    radius: number;
    thetaStart: number;
    thetaLength: number;
    radialSegments: number;
    openEnded: boolean;
}>;

declare const _default$$: vue.DefineComponent<{
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
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {
    rotateX?: number | undefined;
    rotateY?: number | undefined;
    rotateZ?: number | undefined;
}>, {}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    height: number;
    heightSegments: number;
    thetaStart: number;
    thetaLength: number;
    radialSegments: number;
    openEnded: boolean;
    radiusTop: number;
    radiusBottom: number;
} & {}>, {
    height: number;
    heightSegments: number;
    thetaStart: number;
    thetaLength: number;
    radialSegments: number;
    openEnded: boolean;
    radiusTop: number;
    radiusBottom: number;
}>;

declare const _default$_: vue.DefineComponent<{
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
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {
    rotateX?: number | undefined;
    rotateY?: number | undefined;
    rotateZ?: number | undefined;
}>, {}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    radius: number;
    detail: number;
} & {}>, {
    radius: number;
    detail: number;
}>;

declare const _default$Z: vue.DefineComponent<{
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
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {
    rotateX?: number | undefined;
    rotateY?: number | undefined;
    rotateZ?: number | undefined;
}>, {}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    radius: number;
    detail: number;
} & {}>, {
    radius: number;
    detail: number;
}>;

declare const _default$Y: vue.DefineComponent<{
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
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {
    rotateX?: number | undefined;
    rotateY?: number | undefined;
    rotateZ?: number | undefined;
}>, {}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    segments: number;
    phiStart: number;
    phiLength: number;
} & {
    points?: unknown[] | undefined;
}>, {
    segments: number;
    phiStart: number;
    phiLength: number;
}>;

declare const _default$X: vue.DefineComponent<{
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
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {
    rotateX?: number | undefined;
    rotateY?: number | undefined;
    rotateZ?: number | undefined;
}>, {}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    radius: number;
    detail: number;
} & {}>, {
    radius: number;
    detail: number;
}>;

declare const _default$W: vue.DefineComponent<{
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
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {
    rotateX?: number | undefined;
    rotateY?: number | undefined;
    rotateZ?: number | undefined;
}>, {}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    width: number;
    height: number;
    widthSegments: number;
    heightSegments: number;
} & {}>, {
    width: number;
    height: number;
    widthSegments: number;
    heightSegments: number;
}>;

declare const _default$V: vue.DefineComponent<{
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
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {
    rotateX?: number | undefined;
    rotateY?: number | undefined;
    rotateZ?: number | undefined;
}>, {}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    radius: number;
    detail: number;
} & {
    vertices?: unknown[] | undefined;
    indices?: unknown[] | undefined;
}>, {
    radius: number;
    detail: number;
}>;

declare const _default$U: vue.DefineComponent<{
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
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {
    rotateX?: number | undefined;
    rotateY?: number | undefined;
    rotateZ?: number | undefined;
}>, {}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    thetaStart: number;
    thetaLength: number;
    innerRadius: number;
    outerRadius: number;
    thetaSegments: number;
    phiSegments: number;
} & {}>, {
    thetaStart: number;
    thetaLength: number;
    innerRadius: number;
    outerRadius: number;
    thetaSegments: number;
    phiSegments: number;
}>;

declare const _default$T: vue.DefineComponent<{
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
}, unknown, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    rotateX: NumberConstructor;
    rotateY: NumberConstructor;
    rotateZ: NumberConstructor;
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {
    rotateX?: number | undefined;
    rotateY?: number | undefined;
    rotateZ?: number | undefined;
}>, {}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    widthSegments: number;
    heightSegments: number;
    radius: number;
} & {}>, {
    widthSegments: number;
    heightSegments: number;
    radius: number;
}>;

declare const _default$S: vue.DefineComponent<{
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
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {
    rotateX?: number | undefined;
    rotateY?: number | undefined;
    rotateZ?: number | undefined;
}>, {}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    radius: number;
    detail: number;
} & {}>, {
    radius: number;
    detail: number;
}>;

declare const _default$R: vue.DefineComponent<{
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
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {
    rotateX?: number | undefined;
    rotateY?: number | undefined;
    rotateZ?: number | undefined;
}>, {}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    radius: number;
    radialSegments: number;
    tube: number;
    tubularSegments: number;
    arc: number;
} & {}>, {
    radius: number;
    radialSegments: number;
    tube: number;
    tubularSegments: number;
    arc: number;
}>;

declare const _default$Q: vue.DefineComponent<{
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
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {
    rotateX?: number | undefined;
    rotateY?: number | undefined;
    rotateZ?: number | undefined;
}>, {}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    p: number;
    q: number;
    radius: number;
    radialSegments: number;
    tube: number;
    tubularSegments: number;
} & {}>, {
    p: number;
    q: number;
    radius: number;
    radialSegments: number;
    tube: number;
    tubularSegments: number;
}>;

declare const _default$P: vue.DefineComponent<{
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
}, GeometrySetupInterface, unknown, {}, {
    createGeometry(): void;
    rotateGeometry(): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {
    rotateX?: number | undefined;
    rotateY?: number | undefined;
    rotateZ?: number | undefined;
}>, {}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    closed: boolean;
    radius: number;
    radialSegments: number;
    tubularSegments: number;
} & {
    path?: Curve<three.Vector> | undefined;
    points?: unknown[] | undefined;
}>, {
    closed: boolean;
    radius: number;
    radialSegments: number;
    tubularSegments: number;
}>;

interface LightSetupInterface {
    light?: Light;
}

declare const _default$O: vue.DefineComponent<{}, {}, {}, {}, {}, vue.ComponentOptionsMixin, vue.DefineComponent<{
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
    autoRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | undefined;
    addToParent(o?: three.Object3D | undefined): boolean;
    removeFromParent(o?: three.Object3D | undefined): boolean;
    add(o: three.Object3D): void;
    remove(o: three.Object3D): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
} & {}>, {
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    color: string;
    castShadow: boolean;
    intensity: number;
    shadowMapSize: Vector2PropInterface;
    shadowCamera: Record<string, any>;
} & {}>, {
    color: string;
    castShadow: boolean;
    intensity: number;
    shadowMapSize: Vector2PropInterface;
    shadowCamera: Record<string, any>;
}>, vue.EmitsOptions, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {}>, {}>;

declare const _default$N: vue.DefineComponent<{
    target: {
        type: PropType<Vector2PropInterface>;
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
    autoRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | undefined;
    addToParent(o?: three.Object3D | undefined): boolean;
    removeFromParent(o?: three.Object3D | undefined): boolean;
    add(o: three.Object3D): void;
    remove(o: three.Object3D): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
} & {}>, {
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    color: string;
    castShadow: boolean;
    intensity: number;
    shadowMapSize: Vector2PropInterface;
    shadowCamera: Record<string, any>;
} & {}>, {
    color: string;
    castShadow: boolean;
    intensity: number;
    shadowMapSize: Vector2PropInterface;
    shadowCamera: Record<string, any>;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    target: Vector2PropInterface;
} & {}>, {
    target: Vector2PropInterface;
}>;

declare const _default$M: vue.DefineComponent<{
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
    autoRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | undefined;
    addToParent(o?: three.Object3D | undefined): boolean;
    removeFromParent(o?: three.Object3D | undefined): boolean;
    add(o: three.Object3D): void;
    remove(o: three.Object3D): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
} & {}>, {
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    color: string;
    castShadow: boolean;
    intensity: number;
    shadowMapSize: Vector2PropInterface;
    shadowCamera: Record<string, any>;
} & {}>, {
    color: string;
    castShadow: boolean;
    intensity: number;
    shadowMapSize: Vector2PropInterface;
    shadowCamera: Record<string, any>;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    groundColor: string;
} & {}>, {
    groundColor: string;
}>;

declare const _default$L: vue.DefineComponent<{
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
    autoRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | undefined;
    addToParent(o?: three.Object3D | undefined): boolean;
    removeFromParent(o?: three.Object3D | undefined): boolean;
    add(o: three.Object3D): void;
    remove(o: three.Object3D): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
} & {}>, {
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    color: string;
    castShadow: boolean;
    intensity: number;
    shadowMapSize: Vector2PropInterface;
    shadowCamera: Record<string, any>;
} & {}>, {
    color: string;
    castShadow: boolean;
    intensity: number;
    shadowMapSize: Vector2PropInterface;
    shadowCamera: Record<string, any>;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    distance: number;
    decay: number;
} & {}>, {
    distance: number;
    decay: number;
}>;

declare const _default$K: vue.DefineComponent<{
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
    autoRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | undefined;
    addToParent(o?: three.Object3D | undefined): boolean;
    removeFromParent(o?: three.Object3D | undefined): boolean;
    add(o: three.Object3D): void;
    remove(o: three.Object3D): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
} & {}>, {
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    color: string;
    castShadow: boolean;
    intensity: number;
    shadowMapSize: Vector2PropInterface;
    shadowCamera: Record<string, any>;
} & {}>, {
    color: string;
    castShadow: boolean;
    intensity: number;
    shadowMapSize: Vector2PropInterface;
    shadowCamera: Record<string, any>;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    width: number;
    height: number;
    helper: boolean;
} & {}>, {
    width: number;
    height: number;
    helper: boolean;
}>;

declare const _default$J: vue.DefineComponent<{
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
    autoRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | undefined;
    addToParent(o?: three.Object3D | undefined): boolean;
    removeFromParent(o?: three.Object3D | undefined): boolean;
    add(o: three.Object3D): void;
    remove(o: three.Object3D): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
} & {}>, {
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    color: string;
    castShadow: boolean;
    intensity: number;
    shadowMapSize: Vector2PropInterface;
    shadowCamera: Record<string, any>;
} & {}>, {
    color: string;
    castShadow: boolean;
    intensity: number;
    shadowMapSize: Vector2PropInterface;
    shadowCamera: Record<string, any>;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    distance: number;
    decay: number;
    angle: number;
    penumbra: number;
} & {
    target?: Record<string, any> | undefined;
}>, {
    distance: number;
    decay: number;
    angle: number;
    penumbra: number;
}>;

interface MaterialSetupInterface {
    mesh?: MeshInterface;
    material?: Material;
    createMaterial?(): Material;
}
interface MaterialInterface extends MaterialSetupInterface {
    setProp(key: string, value: unknown, needsUpdate: boolean): void;
    setTexture(texture: Texture | null, key: string): void;
}
declare const MaterialInjectionKey: InjectionKey<MaterialInterface>;
declare const _default$I: vue.DefineComponent<{
    color: {
        type: (StringConstructor | NumberConstructor)[];
        default: string;
    };
    depthTest: {
        type: BooleanConstructor;
        default: boolean;
    };
    depthWrite: {
        type: BooleanConstructor;
        default: boolean;
    };
    fog: {
        type: BooleanConstructor;
        default: boolean;
    };
    opacity: {
        type: NumberConstructor;
        default: number;
    };
    side: {
        type: NumberConstructor;
        default: three.Side;
    };
    transparent: BooleanConstructor;
    vertexColors: BooleanConstructor;
}, MaterialSetupInterface, unknown, {}, {
    setProp(key: string, value: any, needsUpdate?: boolean): void;
    setTexture(texture: Texture | null, key?: string): void;
    addWatchers(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    transparent: boolean;
    color: string | number;
    depthTest: boolean;
    depthWrite: boolean;
    fog: boolean;
    opacity: number;
    side: number;
    vertexColors: boolean;
} & {}>, {
    transparent: boolean;
    color: string | number;
    depthTest: boolean;
    depthWrite: boolean;
    fog: boolean;
    opacity: number;
    side: number;
    vertexColors: boolean;
}>;

declare const _default$H: vue.DefineComponent<{
    wireframe: {
        type: BooleanConstructor;
        default: boolean;
    };
    wireframeLinewidth: {
        type: NumberConstructor;
        default: number;
    };
}, unknown, unknown, {}, {
    createMaterial(): MeshBasicMaterial;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    color: {
        type: (StringConstructor | NumberConstructor)[];
        default: string;
    };
    depthTest: {
        type: BooleanConstructor;
        default: boolean;
    };
    depthWrite: {
        type: BooleanConstructor;
        default: boolean;
    };
    fog: {
        type: BooleanConstructor;
        default: boolean;
    };
    opacity: {
        type: NumberConstructor;
        default: number;
    };
    side: {
        type: NumberConstructor;
        default: three.Side;
    };
    transparent: BooleanConstructor;
    vertexColors: BooleanConstructor;
}, MaterialSetupInterface, unknown, {}, {
    setProp(key: string, value: any, needsUpdate?: boolean): void;
    setTexture(texture: three.Texture | null, key?: string): void;
    addWatchers(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    transparent: boolean;
    color: string | number;
    depthTest: boolean;
    depthWrite: boolean;
    fog: boolean;
    opacity: number;
    side: number;
    vertexColors: boolean;
} & {}>, {
    transparent: boolean;
    color: string | number;
    depthTest: boolean;
    depthWrite: boolean;
    fog: boolean;
    opacity: number;
    side: number;
    vertexColors: boolean;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    wireframe: boolean;
    wireframeLinewidth: number;
} & {}>, {
    wireframe: boolean;
    wireframeLinewidth: number;
}>;

declare const _default$G: vue.DefineComponent<{
    wireframe: {
        type: BooleanConstructor;
        default: boolean;
    };
    wireframeLinewidth: {
        type: NumberConstructor;
        default: number;
    };
}, unknown, unknown, {}, {
    createMaterial(): MeshLambertMaterial;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    color: {
        type: (StringConstructor | NumberConstructor)[];
        default: string;
    };
    depthTest: {
        type: BooleanConstructor;
        default: boolean;
    };
    depthWrite: {
        type: BooleanConstructor;
        default: boolean;
    };
    fog: {
        type: BooleanConstructor;
        default: boolean;
    };
    opacity: {
        type: NumberConstructor;
        default: number;
    };
    side: {
        type: NumberConstructor;
        default: three.Side;
    };
    transparent: BooleanConstructor;
    vertexColors: BooleanConstructor;
}, MaterialSetupInterface, unknown, {}, {
    setProp(key: string, value: any, needsUpdate?: boolean): void;
    setTexture(texture: three.Texture | null, key?: string): void;
    addWatchers(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    transparent: boolean;
    color: string | number;
    depthTest: boolean;
    depthWrite: boolean;
    fog: boolean;
    opacity: number;
    side: number;
    vertexColors: boolean;
} & {}>, {
    transparent: boolean;
    color: string | number;
    depthTest: boolean;
    depthWrite: boolean;
    fog: boolean;
    opacity: number;
    side: number;
    vertexColors: boolean;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    wireframe: boolean;
    wireframeLinewidth: number;
} & {}>, {
    wireframe: boolean;
    wireframeLinewidth: number;
}>;

declare const _default$F: vue.DefineComponent<{
    src: StringConstructor;
    name: {
        type: StringConstructor;
        default: string;
    };
    flatShading: BooleanConstructor;
}, unknown, unknown, {}, {
    createMaterial(): MeshMatcapMaterial;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    color: {
        type: (StringConstructor | NumberConstructor)[];
        default: string;
    };
    depthTest: {
        type: BooleanConstructor;
        default: boolean;
    };
    depthWrite: {
        type: BooleanConstructor;
        default: boolean;
    };
    fog: {
        type: BooleanConstructor;
        default: boolean;
    };
    opacity: {
        type: NumberConstructor;
        default: number;
    };
    side: {
        type: NumberConstructor;
        default: three.Side;
    };
    transparent: BooleanConstructor;
    vertexColors: BooleanConstructor;
}, MaterialSetupInterface, unknown, {}, {
    setProp(key: string, value: any, needsUpdate?: boolean): void;
    setTexture(texture: three.Texture | null, key?: string): void;
    addWatchers(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    transparent: boolean;
    color: string | number;
    depthTest: boolean;
    depthWrite: boolean;
    fog: boolean;
    opacity: number;
    side: number;
    vertexColors: boolean;
} & {}>, {
    transparent: boolean;
    color: string | number;
    depthTest: boolean;
    depthWrite: boolean;
    fog: boolean;
    opacity: number;
    side: number;
    vertexColors: boolean;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    name: string;
    flatShading: boolean;
} & {
    src?: string | undefined;
}>, {
    name: string;
    flatShading: boolean;
}>;

declare const _default$E: vue.DefineComponent<{
    wireframe: {
        type: BooleanConstructor;
        default: boolean;
    };
    wireframeLinewidth: {
        type: NumberConstructor;
        default: number;
    };
    emissive: {
        type: (StringConstructor | NumberConstructor)[];
        default: number;
    };
    emissiveIntensity: {
        type: NumberConstructor;
        default: number;
    };
    reflectivity: {
        type: NumberConstructor;
        default: number;
    };
    shininess: {
        type: NumberConstructor;
        default: number;
    };
    specular: {
        type: (StringConstructor | NumberConstructor)[];
        default: number;
    };
    flatShading: BooleanConstructor;
}, unknown, unknown, {}, {
    createMaterial(): MeshPhongMaterial;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    color: {
        type: (StringConstructor | NumberConstructor)[];
        default: string;
    };
    depthTest: {
        type: BooleanConstructor;
        default: boolean;
    };
    depthWrite: {
        type: BooleanConstructor;
        default: boolean;
    };
    fog: {
        type: BooleanConstructor;
        default: boolean;
    };
    opacity: {
        type: NumberConstructor;
        default: number;
    };
    side: {
        type: NumberConstructor;
        default: three.Side;
    };
    transparent: BooleanConstructor;
    vertexColors: BooleanConstructor;
}, MaterialSetupInterface, unknown, {}, {
    setProp(key: string, value: any, needsUpdate?: boolean): void;
    setTexture(texture: three.Texture | null, key?: string): void;
    addWatchers(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    transparent: boolean;
    color: string | number;
    depthTest: boolean;
    depthWrite: boolean;
    fog: boolean;
    opacity: number;
    side: number;
    vertexColors: boolean;
} & {}>, {
    transparent: boolean;
    color: string | number;
    depthTest: boolean;
    depthWrite: boolean;
    fog: boolean;
    opacity: number;
    side: number;
    vertexColors: boolean;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    wireframe: boolean;
    wireframeLinewidth: number;
    flatShading: boolean;
    emissive: string | number;
    emissiveIntensity: number;
    reflectivity: number;
    shininess: number;
    specular: string | number;
} & {}>, {
    wireframe: boolean;
    wireframeLinewidth: number;
    flatShading: boolean;
    emissive: string | number;
    emissiveIntensity: number;
    reflectivity: number;
    shininess: number;
    specular: string | number;
}>;

declare const _default$D: vue.DefineComponent<{
    flatShading: BooleanConstructor;
}, unknown, unknown, {}, {
    createMaterial(): MeshPhysicalMaterial;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    wireframe: {
        type: BooleanConstructor;
        default: boolean;
    };
    wireframeLinewidth: {
        type: NumberConstructor;
        default: number;
    };
    aoMapIntensity: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    bumpScale: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    displacementBias: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    displacementScale: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    emissive: {
        readonly type: vue.PropType<string | number>;
        readonly default: 0;
    };
    emissiveIntensity: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    envMapIntensity: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    lightMapIntensity: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    metalness: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    normalScale: {
        readonly type: vue.PropType<Vector2PropInterface>;
        readonly default: () => {
            x: number;
            y: number;
        };
    };
    roughness: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    refractionRatio: {
        readonly type: NumberConstructor;
        readonly default: 0.98;
    };
    flatShading: BooleanConstructor;
}, unknown, unknown, {}, {
    createMaterial(): three.MeshStandardMaterial;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    color: {
        type: (StringConstructor | NumberConstructor)[];
        default: string;
    };
    depthTest: {
        type: BooleanConstructor;
        default: boolean;
    };
    depthWrite: {
        type: BooleanConstructor;
        default: boolean;
    };
    fog: {
        type: BooleanConstructor;
        default: boolean;
    };
    opacity: {
        type: NumberConstructor;
        default: number;
    };
    side: {
        type: NumberConstructor;
        default: three.Side;
    };
    transparent: BooleanConstructor;
    vertexColors: BooleanConstructor;
}, MaterialSetupInterface, unknown, {}, {
    setProp(key: string, value: any, needsUpdate?: boolean): void;
    setTexture(texture: three.Texture | null, key?: string): void;
    addWatchers(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    transparent: boolean;
    color: string | number;
    depthTest: boolean;
    depthWrite: boolean;
    fog: boolean;
    opacity: number;
    side: number;
    vertexColors: boolean;
} & {}>, {
    transparent: boolean;
    color: string | number;
    depthTest: boolean;
    depthWrite: boolean;
    fog: boolean;
    opacity: number;
    side: number;
    vertexColors: boolean;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    wireframe: boolean;
    wireframeLinewidth: number;
    flatShading: boolean;
    emissive: string | number;
    emissiveIntensity: number;
    aoMapIntensity: number;
    bumpScale: number;
    displacementBias: number;
    displacementScale: number;
    envMapIntensity: number;
    lightMapIntensity: number;
    metalness: number;
    normalScale: Vector2PropInterface;
    roughness: number;
    refractionRatio: number;
} & {}>, {
    wireframe: boolean;
    wireframeLinewidth: number;
    flatShading: boolean;
    emissive: string | number;
    emissiveIntensity: number;
    aoMapIntensity: number;
    bumpScale: number;
    displacementBias: number;
    displacementScale: number;
    envMapIntensity: number;
    lightMapIntensity: number;
    metalness: number;
    normalScale: Vector2PropInterface;
    roughness: number;
    refractionRatio: number;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    flatShading: boolean;
} & {}>, {
    flatShading: boolean;
}>;

declare const _default$C: vue.DefineComponent<{
    uniforms: {
        type: ObjectConstructor;
        default: () => {};
    };
    vertexShader: {
        type: StringConstructor;
        default: string;
    };
    fragmentShader: {
        type: StringConstructor;
        default: string;
    };
}, unknown, unknown, {}, {
    createMaterial(): ShaderMaterial;
    addWatchers(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    color: {
        type: (StringConstructor | NumberConstructor)[];
        default: string;
    };
    depthTest: {
        type: BooleanConstructor;
        default: boolean;
    };
    depthWrite: {
        type: BooleanConstructor;
        default: boolean;
    };
    fog: {
        type: BooleanConstructor;
        default: boolean;
    };
    opacity: {
        type: NumberConstructor;
        default: number;
    };
    side: {
        type: NumberConstructor;
        default: three.Side;
    };
    transparent: BooleanConstructor;
    vertexColors: BooleanConstructor;
}, MaterialSetupInterface, unknown, {}, {
    setProp(key: string, value: any, needsUpdate?: boolean): void;
    setTexture(texture: three.Texture | null, key?: string): void;
    addWatchers(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    transparent: boolean;
    color: string | number;
    depthTest: boolean;
    depthWrite: boolean;
    fog: boolean;
    opacity: number;
    side: number;
    vertexColors: boolean;
} & {}>, {
    transparent: boolean;
    color: string | number;
    depthTest: boolean;
    depthWrite: boolean;
    fog: boolean;
    opacity: number;
    side: number;
    vertexColors: boolean;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    uniforms: Record<string, any>;
    vertexShader: string;
    fragmentShader: string;
} & {}>, {
    uniforms: Record<string, any>;
    vertexShader: string;
    fragmentShader: string;
}>;

declare const _default$B: vue.DefineComponent<{
    wireframe: {
        type: BooleanConstructor;
        default: boolean;
    };
    wireframeLinewidth: {
        type: NumberConstructor;
        default: number;
    };
    aoMapIntensity: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    bumpScale: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    displacementBias: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    displacementScale: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    emissive: {
        readonly type: PropType<string | number>;
        readonly default: 0;
    };
    emissiveIntensity: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    envMapIntensity: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    lightMapIntensity: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    metalness: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    normalScale: {
        readonly type: PropType<Vector2PropInterface>;
        readonly default: () => {
            x: number;
            y: number;
        };
    };
    roughness: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    refractionRatio: {
        readonly type: NumberConstructor;
        readonly default: 0.98;
    };
    flatShading: BooleanConstructor;
}, unknown, unknown, {}, {
    createMaterial(): MeshStandardMaterial;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    color: {
        type: (StringConstructor | NumberConstructor)[];
        default: string;
    };
    depthTest: {
        type: BooleanConstructor;
        default: boolean;
    };
    depthWrite: {
        type: BooleanConstructor;
        default: boolean;
    };
    fog: {
        type: BooleanConstructor;
        default: boolean;
    };
    opacity: {
        type: NumberConstructor;
        default: number;
    };
    side: {
        type: NumberConstructor;
        default: three.Side;
    };
    transparent: BooleanConstructor;
    vertexColors: BooleanConstructor;
}, MaterialSetupInterface, unknown, {}, {
    setProp(key: string, value: any, needsUpdate?: boolean): void;
    setTexture(texture: three.Texture | null, key?: string): void;
    addWatchers(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    transparent: boolean;
    color: string | number;
    depthTest: boolean;
    depthWrite: boolean;
    fog: boolean;
    opacity: number;
    side: number;
    vertexColors: boolean;
} & {}>, {
    transparent: boolean;
    color: string | number;
    depthTest: boolean;
    depthWrite: boolean;
    fog: boolean;
    opacity: number;
    side: number;
    vertexColors: boolean;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    wireframe: boolean;
    wireframeLinewidth: number;
    flatShading: boolean;
    emissive: string | number;
    emissiveIntensity: number;
    aoMapIntensity: number;
    bumpScale: number;
    displacementBias: number;
    displacementScale: number;
    envMapIntensity: number;
    lightMapIntensity: number;
    metalness: number;
    normalScale: Vector2PropInterface;
    roughness: number;
    refractionRatio: number;
} & {}>, {
    wireframe: boolean;
    wireframeLinewidth: number;
    flatShading: boolean;
    emissive: string | number;
    emissiveIntensity: number;
    aoMapIntensity: number;
    bumpScale: number;
    displacementBias: number;
    displacementScale: number;
    envMapIntensity: number;
    lightMapIntensity: number;
    metalness: number;
    normalScale: Vector2PropInterface;
    roughness: number;
    refractionRatio: number;
}>;

declare const _default$A: vue.DefineComponent<{
    readonly color: {
        readonly type: PropType<string | number>;
        readonly default: "#ffffff";
    };
    readonly thicknessColor: {
        readonly type: PropType<string | number>;
        readonly default: "#ffffff";
    };
    readonly thicknessDistortion: {
        readonly type: NumberConstructor;
        readonly default: 0.4;
    };
    readonly thicknessAmbient: {
        readonly type: NumberConstructor;
        readonly default: 0.01;
    };
    readonly thicknessAttenuation: {
        readonly type: NumberConstructor;
        readonly default: 0.7;
    };
    readonly thicknessPower: {
        readonly type: NumberConstructor;
        readonly default: 2;
    };
    readonly thicknessScale: {
        readonly type: NumberConstructor;
        readonly default: 4;
    };
}, unknown, unknown, {}, {
    createMaterial(): ShaderMaterial;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    color: {
        type: (StringConstructor | NumberConstructor)[];
        default: string;
    };
    depthTest: {
        type: BooleanConstructor;
        default: boolean;
    };
    depthWrite: {
        type: BooleanConstructor;
        default: boolean;
    };
    fog: {
        type: BooleanConstructor;
        default: boolean;
    };
    opacity: {
        type: NumberConstructor;
        default: number;
    };
    side: {
        type: NumberConstructor;
        default: three.Side;
    };
    transparent: BooleanConstructor;
    vertexColors: BooleanConstructor;
}, MaterialSetupInterface, unknown, {}, {
    setProp(key: string, value: any, needsUpdate?: boolean): void;
    setTexture(texture: three.Texture | null, key?: string): void;
    addWatchers(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    transparent: boolean;
    color: string | number;
    depthTest: boolean;
    depthWrite: boolean;
    fog: boolean;
    opacity: number;
    side: number;
    vertexColors: boolean;
} & {}>, {
    transparent: boolean;
    color: string | number;
    depthTest: boolean;
    depthWrite: boolean;
    fog: boolean;
    opacity: number;
    side: number;
    vertexColors: boolean;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    color: string | number;
    thicknessColor: string | number;
    thicknessDistortion: number;
    thicknessAmbient: number;
    thicknessAttenuation: number;
    thicknessPower: number;
    thicknessScale: number;
} & {}>, {
    color: string | number;
    thicknessColor: string | number;
    thicknessDistortion: number;
    thicknessAmbient: number;
    thicknessAttenuation: number;
    thicknessPower: number;
    thicknessScale: number;
}>;

declare const _default$z: vue.DefineComponent<{
    wireframe: {
        type: BooleanConstructor;
        default: boolean;
    };
    wireframeLinewidth: {
        type: NumberConstructor;
        default: number;
    };
}, unknown, unknown, {}, {
    createMaterial(): MeshToonMaterial;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    color: {
        type: (StringConstructor | NumberConstructor)[];
        default: string;
    };
    depthTest: {
        type: BooleanConstructor;
        default: boolean;
    };
    depthWrite: {
        type: BooleanConstructor;
        default: boolean;
    };
    fog: {
        type: BooleanConstructor;
        default: boolean;
    };
    opacity: {
        type: NumberConstructor;
        default: number;
    };
    side: {
        type: NumberConstructor;
        default: three.Side;
    };
    transparent: BooleanConstructor;
    vertexColors: BooleanConstructor;
}, MaterialSetupInterface, unknown, {}, {
    setProp(key: string, value: any, needsUpdate?: boolean): void;
    setTexture(texture: three.Texture | null, key?: string): void;
    addWatchers(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    transparent: boolean;
    color: string | number;
    depthTest: boolean;
    depthWrite: boolean;
    fog: boolean;
    opacity: number;
    side: number;
    vertexColors: boolean;
} & {}>, {
    transparent: boolean;
    color: string | number;
    depthTest: boolean;
    depthWrite: boolean;
    fog: boolean;
    opacity: number;
    side: number;
    vertexColors: boolean;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    wireframe: boolean;
    wireframeLinewidth: number;
} & {}>, {
    wireframe: boolean;
    wireframeLinewidth: number;
}>;

interface TexureInterface {
    material?: MaterialInterface;
    texture?: Texture;
}
declare const _default$y: vue.DefineComponent<{
    name: {
        type: StringConstructor;
        default: string;
    };
    uniform: StringConstructor;
    src: StringConstructor;
    onLoad: PropType<(t: Texture) => void>;
    onProgress: PropType<(e: ProgressEvent) => void>;
    onError: PropType<(e: ErrorEvent) => void>;
    mapping: {
        type: NumberConstructor;
        default: three.Mapping;
    };
    wrapS: {
        type: NumberConstructor;
        default: three.Wrapping;
    };
    wrapT: {
        type: NumberConstructor;
        default: three.Wrapping;
    };
    magFilter: {
        type: NumberConstructor;
        default: three.TextureFilter;
    };
    minFilter: {
        type: NumberConstructor;
        default: three.TextureFilter;
    };
    repeat: {
        type: PropType<Vector2PropInterface>;
        default: () => {
            x: number;
            y: number;
        };
    };
    rotation: {
        type: NumberConstructor;
        default: number;
    };
    center: {
        type: PropType<Vector2PropInterface>;
        default: () => {
            x: number;
            y: number;
        };
    };
}, TexureInterface, unknown, {}, {
    createTexture(): Texture | undefined;
    refreshTexture(): void;
    onLoaded(t: Texture): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    repeat: Vector2PropInterface;
    center: Vector2PropInterface;
    name: string;
    rotation: number;
    mapping: number;
    wrapS: number;
    wrapT: number;
    magFilter: number;
    minFilter: number;
} & {
    onError?: ((e: ErrorEvent) => void) | undefined;
    onLoad?: ((t: Texture) => void) | undefined;
    onProgress?: ((e: ProgressEvent) => void) | undefined;
    src?: string | undefined;
    uniform?: string | undefined;
}>, {
    repeat: Vector2PropInterface;
    center: Vector2PropInterface;
    name: string;
    rotation: number;
    mapping: number;
    wrapS: number;
    wrapT: number;
    magFilter: number;
    minFilter: number;
}>;

declare const _default$x: vue.DefineComponent<{
    path: {
        type: StringConstructor;
        required: true;
    };
    urls: {
        type: PropType<string[]>;
        default: () => string[];
    };
    mapping: {
        type: NumberConstructor;
        default: three.Mapping;
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
    mapping: {
        type: NumberConstructor;
        default: three.Mapping;
    };
    wrapS: {
        type: NumberConstructor;
        default: three.Wrapping;
    };
    wrapT: {
        type: NumberConstructor;
        default: three.Wrapping;
    };
    magFilter: {
        type: NumberConstructor;
        default: three.TextureFilter;
    };
    minFilter: {
        type: NumberConstructor;
        default: three.TextureFilter;
    };
    repeat: {
        type: PropType<Vector2PropInterface>;
        default: () => {
            x: number;
            y: number;
        };
    };
    rotation: {
        type: NumberConstructor;
        default: number;
    };
    center: {
        type: PropType<Vector2PropInterface>;
        default: () => {
            x: number;
            y: number;
        };
    };
}, TexureInterface, unknown, {}, {
    createTexture(): three.Texture | undefined;
    refreshTexture(): void;
    onLoaded(t: three.Texture): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    repeat: Vector2PropInterface;
    center: Vector2PropInterface;
    name: string;
    rotation: number;
    mapping: number;
    wrapS: number;
    wrapT: number;
    magFilter: number;
    minFilter: number;
} & {
    onError?: ((e: ErrorEvent) => void) | undefined;
    onLoad?: ((t: three.Texture) => void) | undefined;
    onProgress?: ((e: ProgressEvent<EventTarget>) => void) | undefined;
    src?: string | undefined;
    uniform?: string | undefined;
}>, {
    repeat: Vector2PropInterface;
    center: Vector2PropInterface;
    name: string;
    rotation: number;
    mapping: number;
    wrapS: number;
    wrapT: number;
    magFilter: number;
    minFilter: number;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    path: string;
    mapping: number;
    urls: string[];
} & {}>, {
    mapping: number;
    urls: string[];
}>;

declare const _default$w: vue.DefineComponent<{
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
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
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
    autoRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | undefined;
    addToParent(o?: three.Object3D | undefined): boolean;
    removeFromParent(o?: three.Object3D | undefined): boolean;
    add(o: three.Object3D): void;
    remove(o: three.Object3D): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
} & {}>, {
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    castShadow: boolean;
    receiveShadow: boolean;
} & {
    onClick?: Function | undefined;
    onPointerEnter?: Function | undefined;
    onPointerOver?: Function | undefined;
    onPointerMove?: Function | undefined;
    onPointerLeave?: Function | undefined;
    onPointerDown?: Function | undefined;
    onPointerUp?: Function | undefined;
}>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    width: number;
    height: number;
    depth: number;
    widthSegments: number;
    heightSegments: number;
    depthSegments: number;
} & {
    size?: number | undefined;
}>, {
    width: number;
    height: number;
    depth: number;
    widthSegments: number;
    heightSegments: number;
    depthSegments: number;
}>;

declare const _default$v: vue.DefineComponent<{
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
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
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
    autoRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | undefined;
    addToParent(o?: three.Object3D | undefined): boolean;
    removeFromParent(o?: three.Object3D | undefined): boolean;
    add(o: three.Object3D): void;
    remove(o: three.Object3D): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
} & {}>, {
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    castShadow: boolean;
    receiveShadow: boolean;
} & {
    onClick?: Function | undefined;
    onPointerEnter?: Function | undefined;
    onPointerOver?: Function | undefined;
    onPointerMove?: Function | undefined;
    onPointerLeave?: Function | undefined;
    onPointerDown?: Function | undefined;
    onPointerUp?: Function | undefined;
}>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    segments: number;
    radius: number;
    thetaStart: number;
    thetaLength: number;
} & {}>, {
    segments: number;
    radius: number;
    thetaStart: number;
    thetaLength: number;
}>;

declare const _default$u: vue.DefineComponent<{
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
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
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
    autoRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | undefined;
    addToParent(o?: three.Object3D | undefined): boolean;
    removeFromParent(o?: three.Object3D | undefined): boolean;
    add(o: three.Object3D): void;
    remove(o: three.Object3D): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
} & {}>, {
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    castShadow: boolean;
    receiveShadow: boolean;
} & {
    onClick?: Function | undefined;
    onPointerEnter?: Function | undefined;
    onPointerOver?: Function | undefined;
    onPointerMove?: Function | undefined;
    onPointerLeave?: Function | undefined;
    onPointerDown?: Function | undefined;
    onPointerUp?: Function | undefined;
}>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    height: number;
    heightSegments: number;
    radius: number;
    thetaStart: number;
    thetaLength: number;
    radialSegments: number;
    openEnded: boolean;
} & {}>, {
    height: number;
    heightSegments: number;
    radius: number;
    thetaStart: number;
    thetaLength: number;
    radialSegments: number;
    openEnded: boolean;
}>;

declare const _default$t: vue.DefineComponent<{
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
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
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
    autoRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | undefined;
    addToParent(o?: three.Object3D | undefined): boolean;
    removeFromParent(o?: three.Object3D | undefined): boolean;
    add(o: three.Object3D): void;
    remove(o: three.Object3D): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
} & {}>, {
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    castShadow: boolean;
    receiveShadow: boolean;
} & {
    onClick?: Function | undefined;
    onPointerEnter?: Function | undefined;
    onPointerOver?: Function | undefined;
    onPointerMove?: Function | undefined;
    onPointerLeave?: Function | undefined;
    onPointerDown?: Function | undefined;
    onPointerUp?: Function | undefined;
}>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    height: number;
    heightSegments: number;
    thetaStart: number;
    thetaLength: number;
    radialSegments: number;
    openEnded: boolean;
    radiusTop: number;
    radiusBottom: number;
} & {}>, {
    height: number;
    heightSegments: number;
    thetaStart: number;
    thetaLength: number;
    radialSegments: number;
    openEnded: boolean;
    radiusTop: number;
    radiusBottom: number;
}>;

declare const _default$s: vue.DefineComponent<{
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
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
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
    autoRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | undefined;
    addToParent(o?: three.Object3D | undefined): boolean;
    removeFromParent(o?: three.Object3D | undefined): boolean;
    add(o: three.Object3D): void;
    remove(o: three.Object3D): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
} & {}>, {
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    castShadow: boolean;
    receiveShadow: boolean;
} & {
    onClick?: Function | undefined;
    onPointerEnter?: Function | undefined;
    onPointerOver?: Function | undefined;
    onPointerMove?: Function | undefined;
    onPointerLeave?: Function | undefined;
    onPointerDown?: Function | undefined;
    onPointerUp?: Function | undefined;
}>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    radius: number;
    detail: number;
} & {}>, {
    radius: number;
    detail: number;
}>;

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
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
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
    autoRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | undefined;
    addToParent(o?: three.Object3D | undefined): boolean;
    removeFromParent(o?: three.Object3D | undefined): boolean;
    add(o: three.Object3D): void;
    remove(o: three.Object3D): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
} & {}>, {
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    castShadow: boolean;
    receiveShadow: boolean;
} & {
    onClick?: Function | undefined;
    onPointerEnter?: Function | undefined;
    onPointerOver?: Function | undefined;
    onPointerMove?: Function | undefined;
    onPointerLeave?: Function | undefined;
    onPointerDown?: Function | undefined;
    onPointerUp?: Function | undefined;
}>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    radius: number;
    detail: number;
} & {}>, {
    radius: number;
    detail: number;
}>;

declare const _default$q: vue.DefineComponent<{
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
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
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
    autoRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | undefined;
    addToParent(o?: three.Object3D | undefined): boolean;
    removeFromParent(o?: three.Object3D | undefined): boolean;
    add(o: three.Object3D): void;
    remove(o: three.Object3D): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
} & {}>, {
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    castShadow: boolean;
    receiveShadow: boolean;
} & {
    onClick?: Function | undefined;
    onPointerEnter?: Function | undefined;
    onPointerOver?: Function | undefined;
    onPointerMove?: Function | undefined;
    onPointerLeave?: Function | undefined;
    onPointerDown?: Function | undefined;
    onPointerUp?: Function | undefined;
}>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    segments: number;
    phiStart: number;
    phiLength: number;
} & {
    points?: unknown[] | undefined;
}>, {
    segments: number;
    phiStart: number;
    phiLength: number;
}>;

declare const _default$p: vue.DefineComponent<{
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
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
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
    autoRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | undefined;
    addToParent(o?: three.Object3D | undefined): boolean;
    removeFromParent(o?: three.Object3D | undefined): boolean;
    add(o: three.Object3D): void;
    remove(o: three.Object3D): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
} & {}>, {
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    castShadow: boolean;
    receiveShadow: boolean;
} & {
    onClick?: Function | undefined;
    onPointerEnter?: Function | undefined;
    onPointerOver?: Function | undefined;
    onPointerMove?: Function | undefined;
    onPointerLeave?: Function | undefined;
    onPointerDown?: Function | undefined;
    onPointerUp?: Function | undefined;
}>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    radius: number;
    detail: number;
} & {}>, {
    radius: number;
    detail: number;
}>;

declare const _default$o: vue.DefineComponent<{
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
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
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
    autoRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | undefined;
    addToParent(o?: three.Object3D | undefined): boolean;
    removeFromParent(o?: three.Object3D | undefined): boolean;
    add(o: three.Object3D): void;
    remove(o: three.Object3D): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
} & {}>, {
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    castShadow: boolean;
    receiveShadow: boolean;
} & {
    onClick?: Function | undefined;
    onPointerEnter?: Function | undefined;
    onPointerOver?: Function | undefined;
    onPointerMove?: Function | undefined;
    onPointerLeave?: Function | undefined;
    onPointerDown?: Function | undefined;
    onPointerUp?: Function | undefined;
}>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    width: number;
    height: number;
    widthSegments: number;
    heightSegments: number;
} & {}>, {
    width: number;
    height: number;
    widthSegments: number;
    heightSegments: number;
}>;

declare const _default$n: vue.DefineComponent<{
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
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
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
    autoRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | undefined;
    addToParent(o?: three.Object3D | undefined): boolean;
    removeFromParent(o?: three.Object3D | undefined): boolean;
    add(o: three.Object3D): void;
    remove(o: three.Object3D): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
} & {}>, {
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    castShadow: boolean;
    receiveShadow: boolean;
} & {
    onClick?: Function | undefined;
    onPointerEnter?: Function | undefined;
    onPointerOver?: Function | undefined;
    onPointerMove?: Function | undefined;
    onPointerLeave?: Function | undefined;
    onPointerDown?: Function | undefined;
    onPointerUp?: Function | undefined;
}>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    radius: number;
    detail: number;
} & {
    vertices?: unknown[] | undefined;
    indices?: unknown[] | undefined;
}>, {
    radius: number;
    detail: number;
}>;

declare const _default$m: vue.DefineComponent<{
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
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
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
    autoRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | undefined;
    addToParent(o?: three.Object3D | undefined): boolean;
    removeFromParent(o?: three.Object3D | undefined): boolean;
    add(o: three.Object3D): void;
    remove(o: three.Object3D): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
} & {}>, {
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    castShadow: boolean;
    receiveShadow: boolean;
} & {
    onClick?: Function | undefined;
    onPointerEnter?: Function | undefined;
    onPointerOver?: Function | undefined;
    onPointerMove?: Function | undefined;
    onPointerLeave?: Function | undefined;
    onPointerDown?: Function | undefined;
    onPointerUp?: Function | undefined;
}>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    thetaStart: number;
    thetaLength: number;
    innerRadius: number;
    outerRadius: number;
    thetaSegments: number;
    phiSegments: number;
} & {}>, {
    thetaStart: number;
    thetaLength: number;
    innerRadius: number;
    outerRadius: number;
    thetaSegments: number;
    phiSegments: number;
}>;

declare const _default$l: vue.DefineComponent<{
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
}, unknown, unknown, {}, {
    createGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
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
    autoRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | undefined;
    addToParent(o?: three.Object3D | undefined): boolean;
    removeFromParent(o?: three.Object3D | undefined): boolean;
    add(o: three.Object3D): void;
    remove(o: three.Object3D): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
} & {}>, {
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    castShadow: boolean;
    receiveShadow: boolean;
} & {
    onClick?: Function | undefined;
    onPointerEnter?: Function | undefined;
    onPointerOver?: Function | undefined;
    onPointerMove?: Function | undefined;
    onPointerLeave?: Function | undefined;
    onPointerDown?: Function | undefined;
    onPointerUp?: Function | undefined;
}>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    widthSegments: number;
    heightSegments: number;
    radius: number;
} & {}>, {
    widthSegments: number;
    heightSegments: number;
    radius: number;
}>;

declare const _default$k: vue.DefineComponent<{
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
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
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
    autoRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | undefined;
    addToParent(o?: three.Object3D | undefined): boolean;
    removeFromParent(o?: three.Object3D | undefined): boolean;
    add(o: three.Object3D): void;
    remove(o: three.Object3D): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
} & {}>, {
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    castShadow: boolean;
    receiveShadow: boolean;
} & {
    onClick?: Function | undefined;
    onPointerEnter?: Function | undefined;
    onPointerOver?: Function | undefined;
    onPointerMove?: Function | undefined;
    onPointerLeave?: Function | undefined;
    onPointerDown?: Function | undefined;
    onPointerUp?: Function | undefined;
}>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    radius: number;
    detail: number;
} & {}>, {
    radius: number;
    detail: number;
}>;

interface TextSetupInterface extends MeshSetupInterface {
    geometry?: TextGeometry;
    font?: Font;
}
declare const _default$j: vue.DefineComponent<{
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
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
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
    autoRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | undefined;
    addToParent(o?: three.Object3D | undefined): boolean;
    removeFromParent(o?: three.Object3D | undefined): boolean;
    add(o: three.Object3D): void;
    remove(o: three.Object3D): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
} & {}>, {
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    castShadow: boolean;
    receiveShadow: boolean;
} & {
    onClick?: Function | undefined;
    onPointerEnter?: Function | undefined;
    onPointerOver?: Function | undefined;
    onPointerMove?: Function | undefined;
    onPointerLeave?: Function | undefined;
    onPointerDown?: Function | undefined;
    onPointerUp?: Function | undefined;
}>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    text: string;
    size: number;
    height: number;
    depth: number;
    fontSrc: string;
    curveSegments: number;
    bevelEnabled: boolean;
    bevelThickness: number;
    bevelSize: number;
    bevelOffset: number;
    bevelSegments: number;
    align: string | boolean;
} & {}>, {
    text: string;
    size: number;
    height: number;
    depth: number;
    curveSegments: number;
    bevelEnabled: boolean;
    bevelThickness: number;
    bevelSize: number;
    bevelOffset: number;
    bevelSegments: number;
    align: string | boolean;
}>;

declare const _default$i: vue.DefineComponent<{
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
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
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
    autoRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | undefined;
    addToParent(o?: three.Object3D | undefined): boolean;
    removeFromParent(o?: three.Object3D | undefined): boolean;
    add(o: three.Object3D): void;
    remove(o: three.Object3D): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
} & {}>, {
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    castShadow: boolean;
    receiveShadow: boolean;
} & {
    onClick?: Function | undefined;
    onPointerEnter?: Function | undefined;
    onPointerOver?: Function | undefined;
    onPointerMove?: Function | undefined;
    onPointerLeave?: Function | undefined;
    onPointerDown?: Function | undefined;
    onPointerUp?: Function | undefined;
}>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    radius: number;
    radialSegments: number;
    tube: number;
    tubularSegments: number;
    arc: number;
} & {}>, {
    radius: number;
    radialSegments: number;
    tube: number;
    tubularSegments: number;
    arc: number;
}>;

declare const _default$h: vue.DefineComponent<{
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
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
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
    autoRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | undefined;
    addToParent(o?: three.Object3D | undefined): boolean;
    removeFromParent(o?: three.Object3D | undefined): boolean;
    add(o: three.Object3D): void;
    remove(o: three.Object3D): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
} & {}>, {
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    castShadow: boolean;
    receiveShadow: boolean;
} & {
    onClick?: Function | undefined;
    onPointerEnter?: Function | undefined;
    onPointerOver?: Function | undefined;
    onPointerMove?: Function | undefined;
    onPointerLeave?: Function | undefined;
    onPointerDown?: Function | undefined;
    onPointerUp?: Function | undefined;
}>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    p: number;
    q: number;
    radius: number;
    radialSegments: number;
    tube: number;
    tubularSegments: number;
} & {}>, {
    p: number;
    q: number;
    radius: number;
    radialSegments: number;
    tube: number;
    tubularSegments: number;
}>;

declare const _default$g: vue.DefineComponent<{
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
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
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
    autoRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | undefined;
    addToParent(o?: three.Object3D | undefined): boolean;
    removeFromParent(o?: three.Object3D | undefined): boolean;
    add(o: three.Object3D): void;
    remove(o: three.Object3D): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
} & {}>, {
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    castShadow: boolean;
    receiveShadow: boolean;
} & {
    onClick?: Function | undefined;
    onPointerEnter?: Function | undefined;
    onPointerOver?: Function | undefined;
    onPointerMove?: Function | undefined;
    onPointerLeave?: Function | undefined;
    onPointerDown?: Function | undefined;
    onPointerUp?: Function | undefined;
}>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    closed: boolean;
    radius: number;
    radialSegments: number;
    tubularSegments: number;
} & {
    path?: three.Curve<three.Vector> | undefined;
    points?: unknown[] | undefined;
}>, {
    closed: boolean;
    radius: number;
    radialSegments: number;
    tubularSegments: number;
}>;

interface ImageSetupInterface extends MeshSetupInterface {
    material?: MeshBasicMaterial;
    texture?: Texture;
}
declare const _default$f: vue.DefineComponent<{
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
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
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
    autoRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | undefined;
    addToParent(o?: three.Object3D | undefined): boolean;
    removeFromParent(o?: three.Object3D | undefined): boolean;
    add(o: three.Object3D): void;
    remove(o: three.Object3D): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
} & {}>, {
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    castShadow: boolean;
    receiveShadow: boolean;
} & {
    onClick?: Function | undefined;
    onPointerEnter?: Function | undefined;
    onPointerOver?: Function | undefined;
    onPointerMove?: Function | undefined;
    onPointerLeave?: Function | undefined;
    onPointerDown?: Function | undefined;
    onPointerUp?: Function | undefined;
}>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, "loaded"[], "loaded", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    widthSegments: number;
    heightSegments: number;
    src: string;
    keepSize: boolean;
} & {
    width?: number | undefined;
    height?: number | undefined;
}>, {
    widthSegments: number;
    heightSegments: number;
    keepSize: boolean;
}>;

declare const _default$e: vue.DefineComponent<{
    count: {
        type: NumberConstructor;
        required: true;
    };
}, unknown, unknown, {}, {
    initMesh(): false | undefined;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    onPointerEnter: FunctionConstructor;
    onPointerOver: FunctionConstructor;
    onPointerMove: FunctionConstructor;
    onPointerLeave: FunctionConstructor;
    onPointerDown: FunctionConstructor;
    onPointerUp: FunctionConstructor;
    onClick: FunctionConstructor;
    castShadow: BooleanConstructor;
    receiveShadow: BooleanConstructor;
}, MeshSetupInterface, unknown, {}, {
    initMesh(): void;
    createGeometry(): void;
    addGeometryWatchers(props: Readonly<vue.ComponentPropsOptions<{
        [x: string]: unknown;
    }>>): void;
    setGeometry(geometry: three.BufferGeometry): void;
    setMaterial(material: three.Material): void;
    refreshGeometry(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
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
    autoRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | undefined;
    addToParent(o?: three.Object3D | undefined): boolean;
    removeFromParent(o?: three.Object3D | undefined): boolean;
    add(o: three.Object3D): void;
    remove(o: three.Object3D): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
} & {}>, {
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    castShadow: boolean;
    receiveShadow: boolean;
} & {
    onClick?: Function | undefined;
    onPointerEnter?: Function | undefined;
    onPointerOver?: Function | undefined;
    onPointerMove?: Function | undefined;
    onPointerLeave?: Function | undefined;
    onPointerDown?: Function | undefined;
    onPointerUp?: Function | undefined;
}>, {
    castShadow: boolean;
    receiveShadow: boolean;
}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    count: number;
} & {}>, {}>;

interface SpriteSetupInterface extends Object3DSetupInterface {
    texture?: Texture;
    material?: SpriteMaterial;
    sprite?: Sprite;
}
declare const _default$d: vue.DefineComponent<{
    src: {
        type: StringConstructor;
        required: true;
    };
}, SpriteSetupInterface, unknown, {}, {
    onLoaded(): void;
    updateUV(): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
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
    autoRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | undefined;
    addToParent(o?: three.Object3D | undefined): boolean;
    removeFromParent(o?: three.Object3D | undefined): boolean;
    add(o: three.Object3D): void;
    remove(o: three.Object3D): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
} & {}>, {
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
}>, "loaded"[], "loaded", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    src: string;
} & {}>, {}>;

declare const _default$c: vue.DefineComponent<{}, {}, {}, {}, {}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    src: {
        type: StringConstructor;
        required: true;
    };
}, unknown, {
    progress: number;
}, {}, {
    onLoad(model: three.Object3D): void;
    onProgress(progress: ProgressEvent<EventTarget>): void;
    onError(error: ErrorEvent): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
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
    autoRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | undefined;
    addToParent(o?: three.Object3D | undefined): boolean;
    removeFromParent(o?: three.Object3D | undefined): boolean;
    add(o: three.Object3D): void;
    remove(o: three.Object3D): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
} & {}>, {
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
}>, ("error" | "progress" | "load")[], "error" | "progress" | "load", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    src: string;
} & {}>, {}>, vue.EmitsOptions, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {}>, {}>;

declare const _default$b: vue.DefineComponent<{}, {}, {}, {}, {}, vue.ComponentOptionsMixin, vue.DefineComponent<{
    src: {
        type: StringConstructor;
        required: true;
    };
}, unknown, {
    progress: number;
}, {}, {
    onLoad(model: three.Object3D): void;
    onProgress(progress: ProgressEvent<EventTarget>): void;
    onError(error: ErrorEvent): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{
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
    autoRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    userData: {
        type: ObjectConstructor;
        default: () => {};
    };
}, Object3DSetupInterface, unknown, {}, {
    initObject3D(o3d: three.Object3D): void;
    getParent(): vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | undefined;
    addToParent(o?: three.Object3D | undefined): boolean;
    removeFromParent(o?: three.Object3D | undefined): boolean;
    add(o: three.Object3D): void;
    remove(o: three.Object3D): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("created" | "ready")[], "created" | "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
} & {}>, {
    position: Vector3PropInterface;
    rotation: EulerPropInterface;
    scale: Vector3PropInterface;
    lookAt: Vector3PropInterface;
    autoRemove: boolean;
    userData: Record<string, any>;
}>, ("error" | "progress" | "load")[], "error" | "progress" | "load", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    src: string;
} & {}>, {}>, vue.EmitsOptions, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {}>, {}>;

interface EffectComposerSetupInterface {
    renderer?: RendererInterface;
    composer?: EffectComposer;
}
interface EffectComposerInterface extends EffectComposerSetupInterface {
    addPass(pass: Pass): void;
    removePass(pass: Pass): void;
}
declare const ComposerInjectionKey: InjectionKey<EffectComposerInterface>;
declare const _default$a: vue.DefineComponent<{}, EffectComposerSetupInterface, {}, {}, {
    addPass(pass: Pass): void;
    removePass(pass: Pass): void;
    resize(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, vue.EmitsOptions, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {}>, {}>;

interface EffectSetupInterface {
    renderer?: RendererInterface;
    composer?: EffectComposerInterface;
    pass?: Pass;
}

declare const _default$9: vue.DefineComponent<{}, {}, {}, {}, {}, vue.ComponentOptionsMixin, vue.DefineComponent<{}, EffectSetupInterface, {}, {}, {
    initEffectPass(pass: three_examples_jsm_postprocessing_Pass.Pass): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "ready"[], "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {}>, {}>, vue.EmitsOptions, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {}>, {}>;

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
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "ready"[], "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {}>, {}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    focus: number;
    aperture: number;
    maxblur: number;
} & {}>, {
    focus: number;
    aperture: number;
    maxblur: number;
}>;

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
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "ready"[], "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {}>, {}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    noiseIntensity: number;
    scanlinesIntensity: number;
    scanlinesCount: number;
    grayscale: number;
} & {}>, {
    noiseIntensity: number;
    scanlinesIntensity: number;
    scanlinesCount: number;
    grayscale: number;
}>;

declare const _default$6: vue.DefineComponent<{}, {}, {}, {}, {
    resize({ size }: {
        size: SizeInterface;
    }): void;
}, vue.ComponentOptionsMixin, vue.DefineComponent<{}, EffectSetupInterface, {}, {}, {
    initEffectPass(pass: three_examples_jsm_postprocessing_Pass.Pass): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "ready"[], "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {}>, {}>, vue.EmitsOptions, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {}>, {}>;

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
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "ready"[], "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {}>, {}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    radius: number;
    shape: number;
    rotateR: number;
    rotateG: number;
    rotateB: number;
    scatter: number;
} & {}>, {
    radius: number;
    shape: number;
    rotateR: number;
    rotateG: number;
    rotateB: number;
    scatter: number;
}>;

declare const _default$4: vue.DefineComponent<{}, {}, {}, {}, {}, vue.ComponentOptionsMixin, vue.DefineComponent<{}, EffectSetupInterface, {}, {}, {
    initEffectPass(pass: three_examples_jsm_postprocessing_Pass.Pass): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "ready"[], "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {}>, {}>, vue.EmitsOptions, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {}>, {}>;

declare const _default$3: vue.DefineComponent<{
    options: {
        type: ObjectConstructor;
        default: () => {};
    };
}, unknown, unknown, {}, {}, vue.ComponentOptionsMixin, vue.DefineComponent<{}, EffectSetupInterface, {}, {}, {
    initEffectPass(pass: three_examples_jsm_postprocessing_Pass.Pass): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "ready"[], "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {}>, {}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    options: Record<string, any>;
} & {}>, {
    options: Record<string, any>;
}>;

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
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "ready"[], "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {}>, {}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    end: Vector2PropInterface;
    start: Vector2PropInterface;
    blurRadius: number;
    gradientRadius: number;
} & {}>, {
    end: Vector2PropInterface;
    start: Vector2PropInterface;
    blurRadius: number;
    gradientRadius: number;
}>;

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
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "ready"[], "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {}>, {}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    radius: number;
    strength: number;
    threshold: number;
} & {}>, {
    radius: number;
    strength: number;
    threshold: number;
}>;

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
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "ready"[], "ready", vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{} & {}>, {}>, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    center: Vector2PropInterface;
    strength: number;
} & {}>, {
    center: Vector2PropInterface;
    strength: number;
}>;

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

export { _default$O as AmbientLight, _default$H as BasicMaterial, _default$8 as BokehPass, _default$w as Box, _default$12 as BoxGeometry, _default$17 as Camera, _default$v as Circle, _default$11 as CircleGeometry, ComposerInjectionKey, _default$u as Cone, _default$10 as ConeGeometry, _default$13 as CubeCamera, _default$x as CubeTexture, _default$t as Cylinder, _default$$ as CylinderGeometry, _default$N as DirectionalLight, _default$s as Dodecahedron, _default$_ as DodecahedronGeometry, _default$a as EffectComposer, _default$b as FBXModel, _default$6 as FXAAPass, _default$7 as FilmPass, _default$c as GLTFModel, _default$16 as Group, _default$5 as HalftonePass, _default$M as HemisphereLight, _default$r as Icosahedron, _default$Z as IcosahedronGeometry, _default$f as Image, _default$e as InstancedMesh, _default$G as LambertMaterial, _default$q as Lathe, _default$Y as LatheGeometry, _default$F as MatcapMaterial, _default$I as Material, MaterialInjectionKey, Mesh, MeshInjectionKey, _default$19 as Object3D, _default$p as Octahedron, _default$X as OctahedronGeometry, _default$18 as OrthographicCamera, _default$17 as PerspectiveCamera, _default$E as PhongMaterial, _default$D as PhysicalMaterial, _default$o as Plane, _default$W as PlaneGeometry, _default$L as PointLight, _default$n as Polyhedron, _default$V as PolyhedronGeometry, _default$14 as Raycaster, _default$K as RectAreaLight, _default$9 as RenderPass, _default$1a as Renderer, RendererInjectionKey, _default$m as Ring, _default$U as RingGeometry, _default$4 as SMAAPass, _default$3 as SSAOPass, _default$15 as Scene, SceneInjectionKey, _default$C as ShaderMaterial, _default$l as Sphere, _default$T as SphereGeometry, _default$J as SpotLight, _default$d as Sprite, _default$B as StandardMaterial, _default$A as SubSurfaceMaterial, _default$k as Tetrahedron, _default$S as TetrahedronGeometry, _default$j as Text, _default$y as Texture, _default$2 as TiltShiftPass, _default$z as ToonMaterial, _default$i as Torus, _default$R as TorusGeometry, _default$h as TorusKnot, _default$Q as TorusKnotGeometry, TroisJSVuePlugin, _default$g as Tube, _default$P as TubeGeometry, _default$1 as UnrealBloomPass, _default as ZoomBlurPass, bindProp, bindProps, createApp, getMatcapUrl, lerp, limit, propsValues, setFromProp, useTextures };
