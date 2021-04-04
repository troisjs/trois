import { defineComponent, h, toRef, watch, createApp as createApp$1 } from 'vue';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { Vector3, Raycaster as Raycaster$1, Plane as Plane$1, Vector2, InstancedMesh as InstancedMesh$1, WebGLRenderer, OrthographicCamera as OrthographicCamera$1, PerspectiveCamera as PerspectiveCamera$1, Group as Group$1, Scene as Scene$1, Color, BoxGeometry as BoxGeometry$1, CircleGeometry as CircleGeometry$1, ConeGeometry as ConeGeometry$1, CylinderGeometry as CylinderGeometry$1, DodecahedronGeometry as DodecahedronGeometry$1, IcosahedronGeometry as IcosahedronGeometry$1, LatheGeometry as LatheGeometry$1, OctahedronGeometry as OctahedronGeometry$1, PolyhedronGeometry as PolyhedronGeometry$1, RingGeometry as RingGeometry$1, SphereGeometry as SphereGeometry$1, TetrahedronGeometry as TetrahedronGeometry$1, TorusGeometry as TorusGeometry$1, TorusKnotGeometry as TorusKnotGeometry$1, TubeGeometry as TubeGeometry$1, Curve, CatmullRomCurve3, AmbientLight as AmbientLight$1, DirectionalLight as DirectionalLight$1, HemisphereLight as HemisphereLight$1, PointLight as PointLight$1, RectAreaLight as RectAreaLight$1, SpotLight as SpotLight$1, FrontSide, MeshBasicMaterial, MeshLambertMaterial, TextureLoader, MeshMatcapMaterial, MeshPhongMaterial, MeshStandardMaterial, MeshPhysicalMaterial, ShaderMaterial as ShaderMaterial$1, ShaderChunk, UniformsUtils, ShaderLib, MeshToonMaterial, UVMapping, ClampToEdgeWrapping, LinearFilter, LinearMipmapLinearFilter, CubeTextureLoader, CubeRefractionMapping, Mesh as Mesh$1, PlaneGeometry, FontLoader, TextGeometry, WebGLCubeRenderTarget, RGBFormat, CubeCamera, BackSide, DoubleSide, SpriteMaterial, Sprite as Sprite$1 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { EffectComposer as EffectComposer$1 } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass as RenderPass$1 } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass as BokehPass$1 } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { FilmPass as FilmPass$1 } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { HalftonePass as HalftonePass$1 } from 'three/examples/jsm/postprocessing/HalftonePass.js';
import { SMAAPass as SMAAPass$1 } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { SSAOPass as SSAOPass$1 } from 'three/examples/jsm/postprocessing/SSAOPass.js';
import { UnrealBloomPass as UnrealBloomPass$1 } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

function useRaycaster(options) {
  const {
    camera,
    resetPosition = new Vector3(0, 0, 0),
  } = options;

  const raycaster = new Raycaster$1();
  const position = resetPosition.clone();
  const plane = new Plane$1(new Vector3(0, 0, 1), 0);

  const updatePosition = (coords) => {
    raycaster.setFromCamera(coords, camera);
    camera.getWorldDirection(plane.normal);
    raycaster.ray.intersectPlane(plane, position);
  };

  const intersect = (coords, objects) => {
    raycaster.setFromCamera(coords, camera);
    return raycaster.intersectObjects(objects);
  };

  return {
    position,
    updatePosition,
    intersect,
  };
}

function usePointer(options) {
  const {
    camera,
    domElement,
    intersectObjects,
    touch = true,
    resetOnEnd = false,
    resetPosition = new Vector2(0, 0),
    resetPositionV3 = new Vector3(0, 0, 0),
    onEnter = () => {},
    onMove = () => {},
    onLeave = () => {},
    onIntersectEnter = () => {},
    onIntersectOver = () => {},
    onIntersectMove = () => {},
    onIntersectLeave = () => {},
    onIntersectClick = () => {},
  } = options;

  const position = resetPosition.clone();
  const positionN = new Vector2(0, 0);

  const raycaster = useRaycaster({ camera });
  const positionV3 = raycaster.position;

  const obj = {
    position,
    positionN,
    positionV3,
    intersectObjects,
    listeners: false,
    addListeners,
    removeListeners,
    intersect,
  };

  return obj;

  function reset() {
    position.copy(resetPosition);
    positionV3.copy(resetPositionV3);
  }
  function updatePosition(event) {
    let x, y;
    if (event.touches && event.touches.length > 0) {
      x = event.touches[0].clientX;
      y = event.touches[0].clientY;
    } else {
      x = event.clientX;
      y = event.clientY;
    }

    const rect = domElement.getBoundingClientRect();
    position.x = x - rect.left;
    position.y = y - rect.top;
    positionN.x = (position.x / rect.width) * 2 - 1;
    positionN.y = -(position.y / rect.height) * 2 + 1;
    raycaster.updatePosition(positionN);
  }
  function intersect() {
    if (intersectObjects.length) {
      const intersects = raycaster.intersect(positionN, intersectObjects);
      const offObjects = [...intersectObjects];
      const iMeshes = [];

      intersects.forEach(intersect => {
        const { object } = intersect;
        const { component } = object;

        // only once for InstancedMesh
        if (object instanceof InstancedMesh$1) {
          if (iMeshes.indexOf(object) !== -1) return;
          iMeshes.push(object);
        }

        if (!object.over) {
          object.over = true;
          const overEvent = { type: 'pointerover', over: true, component, intersect };
          const enterEvent = { ...overEvent, type: 'pointerenter' };
          onIntersectOver(overEvent);
          onIntersectEnter(enterEvent);
          component.onPointerOver?.(overEvent);
          component.onPointerEnter?.(enterEvent);
        }

        const moveEvent = { type: 'pointermove', component, intersect };
        onIntersectMove(moveEvent);
        component.onPointerMove?.(moveEvent);

        offObjects.splice(offObjects.indexOf(object), 1);
      });

      offObjects.forEach(object => {
        const { component } = object;
        if (object.over) {
          object.over = false;
          const overEvent = { type: 'pointerover', over: false, component };
          const leaveEvent = { ...overEvent, type: 'pointerleave' };
          onIntersectOver(overEvent);
          onIntersectLeave(leaveEvent);
          component.onPointerOver?.(overEvent);
          component.onPointerLeave?.(leaveEvent);
        }
      });
    }
  }
  function pointerEnter(event) {
    updatePosition(event);
    onEnter({ type: 'pointerenter', position, positionN, positionV3 });
  }
  function pointerMove(event) {
    updatePosition(event);
    onMove({ type: 'pointermove', position, positionN, positionV3 });
    intersect();
  }
  function pointerClick(event) {
    updatePosition(event);
    if (intersectObjects.length) {
      const intersects = raycaster.intersect(positionN, intersectObjects);
      const iMeshes = [];
      intersects.forEach(intersect => {
        const { object } = intersect;
        const { component } = object;

        // only once for InstancedMesh
        if (object instanceof InstancedMesh$1) {
          if (iMeshes.indexOf(object) !== -1) return;
          iMeshes.push(object);
        }

        const event = { type: 'click', component, intersect };
        onIntersectClick(event);
        component.onClick?.(event);
      });
    }
  }
  function pointerLeave() {
    if (resetOnEnd) reset();
    onLeave({ type: 'pointerleave' });
  }
  function addListeners() {
    domElement.addEventListener('mouseenter', pointerEnter);
    domElement.addEventListener('mousemove', pointerMove);
    domElement.addEventListener('mouseleave', pointerLeave);
    domElement.addEventListener('click', pointerClick);
    if (touch) {
      domElement.addEventListener('touchstart', pointerEnter);
      domElement.addEventListener('touchmove', pointerMove);
      domElement.addEventListener('touchend', pointerLeave);
    }
    obj.listeners = true;
  }
  function removeListeners() {
    domElement.removeEventListener('mouseenter', pointerEnter);
    domElement.removeEventListener('mousemove', pointerMove);
    domElement.removeEventListener('mouseleave', pointerLeave);
    domElement.removeEventListener('click', pointerClick);

    domElement.removeEventListener('touchstart', pointerEnter);
    domElement.removeEventListener('touchmove', pointerMove);
    domElement.removeEventListener('touchend', pointerLeave);
    obj.listeners = false;
  }}

/**
 * Three.js helper
 */
function useThree() {
  // default conf
  const conf = {
    canvas: null,
    antialias: true,
    alpha: false,
    autoClear: true,
    orbit_ctrl: false,
    pointer: false,
    resize: false,
    width: 300,
    height: 150,
  };

  // size
  const size = {
    width: 1, height: 1,
    wWidth: 1, wHeight: 1,
    ratio: 1,
  };

  // handlers
  const afterInitCallbacks = [];
  let afterResizeCallbacks = [];
  let beforeRenderCallbacks = [];

  const intersectObjects = [];

  // returned object
  const obj = {
    conf,
    renderer: null,
    camera: null,
    cameraCtrl: null,
    scene: null,
    pointer: null,
    size,
    init,
    dispose,
    render,
    renderC,
    setSize,
    onAfterInit,
    onAfterResize, offAfterResize,
    onBeforeRender, offBeforeRender,
    addIntersectObject, removeIntersectObject,
  };

  /**
   * init three
   */
  function init(params) {
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        conf[key] = value;
      });
    }

    if (!obj.scene) {
      console.error('Missing Scene');
      return;
    }

    if (!obj.camera) {
      console.error('Missing Camera');
      return;
    }

    obj.renderer = new WebGLRenderer({ canvas: conf.canvas, antialias: conf.antialias, alpha: conf.alpha });
    obj.renderer.autoClear = conf.autoClear;

    if (conf.resize) {
      onResize();
      window.addEventListener('resize', onResize);
    } else {
      setSize(conf.width, conf.height);
    }

    initPointer();

    if (conf.orbit_ctrl) {
      obj.orbitCtrl = new OrbitControls(obj.camera, obj.renderer.domElement);
      if (conf.orbit_ctrl instanceof Object) {
        Object.entries(conf.orbit_ctrl).forEach(([key, value]) => {
          obj.orbitCtrl[key] = value;
        });
      }
    }

    afterInitCallbacks.forEach(c => c());

    return true;
  }
  function initPointer() {
    let pointerConf = {
      camera: obj.camera,
      domElement: obj.renderer.domElement,
      intersectObjects,
    };

    if (conf.pointer && conf.pointer instanceof Object) {
      pointerConf = { ...pointerConf, ...conf.pointer };
    }

    obj.pointer = usePointer(pointerConf);
    if (conf.pointer || intersectObjects.length) {
      obj.pointer.addListeners();
      if (conf.pointer.intersectMode === 'frame') {
        onBeforeRender(() => {
          obj.pointer.intersect();
        });
      }
    }
  }

  /**
   * add after init callback
   */
  function onAfterInit(callback) {
    afterInitCallbacks.push(callback);
  }

  /**
   * add after resize callback
   */
  function onAfterResize(callback) {
    afterResizeCallbacks.push(callback);
  }

  /**
   * remove after resize callback
   */
  function offAfterResize(callback) {
    afterResizeCallbacks = afterResizeCallbacks.filter(c => c !== callback);
  }

  /**
   * add before render callback
   */
  function onBeforeRender(callback) {
    beforeRenderCallbacks.push(callback);
  }

  /**
   * remove before render callback
   */
  function offBeforeRender(callback) {
    beforeRenderCallbacks = beforeRenderCallbacks.filter(c => c !== callback);
  }

  /**
   * default render
   */
  function render() {
    if (obj.orbitCtrl) obj.orbitCtrl.update();
    beforeRenderCallbacks.forEach(c => c());
    obj.renderer.render(obj.scene, obj.camera);
  }

  /**
   * composer render
   */
  function renderC() {
    if (obj.orbitCtrl) obj.orbitCtrl.update();
    beforeRenderCallbacks.forEach(c => c());
    obj.composer.render();
  }

  /**
   * add intersect object
   */
  function addIntersectObject(o) {
    if (intersectObjects.indexOf(o) === -1) {
      intersectObjects.push(o);
    }
    // add listeners if needed
    if (obj.pointer && !obj.pointer.listeners) {
      obj.pointer.addListeners();
    }
  }

  /**
   * remove intersect object
   */
  function removeIntersectObject(o) {
    const i = intersectObjects.indexOf(o);
    if (i !== -1) {
      intersectObjects.splice(i, 1);
    }
    // remove listeners if needed
    if (obj.pointer && !conf.pointer && intersectObjects.length === 0) {
      obj.pointer.removeListeners();
    }
  }

  /**
   * remove listeners and dispose
   */
  function dispose() {
    beforeRenderCallbacks = [];
    window.removeEventListener('resize', onResize);
    if (obj.pointer) obj.pointer.removeListeners();
    if (obj.orbitCtrl) obj.orbitCtrl.dispose();
    obj.renderer.dispose();
  }

  /**
   * resize listener
   */
  function onResize() {
    if (conf.resize === 'window') {
      setSize(window.innerWidth, window.innerHeight);
    } else {
      const elt = obj.renderer.domElement.parentNode;
      setSize(elt.clientWidth, elt.clientHeight);
    }
    afterResizeCallbacks.forEach(c => c());
  }

  /**
   * update renderer size and camera
   */
  function setSize(width, height) {
    size.width = width;
    size.height = height;
    size.ratio = width / height;

    obj.renderer.setSize(width, height, false);
    obj.camera.aspect = size.ratio;
    obj.camera.updateProjectionMatrix();

    if (obj.composer) {
      obj.composer.setSize(width, height);
    }

    if (obj.camera.type === 'OrthographicCamera') {
      size.wWidth = obj.camera.right - obj.camera.left;
      size.wHeight = obj.camera.top - obj.camera.bottom;
    } else {
      const wsize = getCameraSize();
      size.wWidth = wsize[0]; size.wHeight = wsize[1];
    }
  }

  /**
   * calculate camera visible area size
   */
  function getCameraSize() {
    const vFOV = (obj.camera.fov * Math.PI) / 180;
    const h = 2 * Math.tan(vFOV / 2) * Math.abs(obj.camera.position.z);
    const w = h * obj.camera.aspect;
    return [w, h];
  }

  return obj;
}

var Renderer = defineComponent({
  name: 'Renderer',
  props: {
    antialias: Boolean,
    alpha: Boolean,
    autoClear: { type: Boolean, default: true },
    orbitCtrl: { type: [Boolean, Object], default: false },
    pointer: { type: [Boolean, Object], default: false },
    resize: { type: [Boolean, String], default: false },
    shadow: Boolean,
    width: String,
    height: String,
    xr: Boolean,
  },
  setup() {
    return {
      three: useThree(),
      raf: true,
      onMountedCallbacks: [],
    };
  },
  provide() {
    return {
      three: this.three,
      // renderer: this.three.renderer,
      rendererComponent: this,
    };
  },
  mounted() {
    const params = {
      canvas: this.$el,
      antialias: this.antialias,
      alpha: this.alpha,
      autoClear: this.autoClear,
      orbit_ctrl: this.orbitCtrl,
      pointer: this.pointer,
      resize: this.resize,
      width: this.width,
      height: this.height,
    };

    if (this.three.init(params)) {
      this.renderer = this.three.renderer;
      this.renderer.shadowMap.enabled = this.shadow;

      if (this.xr) {
        this.vrButton = VRButton.createButton(this.renderer);
        this.renderer.domElement.parentNode.appendChild(this.vrButton);
        this.renderer.xr.enabled = true;
        if (this.three.composer) this.renderer.setAnimationLoop(this.animateXRC);
        else this.renderer.setAnimationLoop(this.animateXR);
      } else {
        if (this.three.composer) this.animateC();
        else this.animate();
      }
    }
    this.onMountedCallbacks.forEach(c => c());
  },
  beforeUnmount() {
    this.raf = false;
    this.three.dispose();
  },
  methods: {
    onMounted(callback) {
      this.onMountedCallbacks.push(callback);
    },
    onBeforeRender(callback) {
      this.three.onBeforeRender(callback);
    },
    onAfterResize(callback) {
      this.three.onAfterResize(callback);
    },
    animate() {
      if (this.raf) requestAnimationFrame(this.animate);
      this.three.render();
    },
    animateC() {
      if (this.raf) requestAnimationFrame(this.animateC);
      this.three.renderC();
    },
    animateXR() { this.three.render(); },
    animateXRC() { this.three.renderC(); },
  },
  render() {
    return h('canvas', {}, this.$slots.default());
  },
  __hmrId: 'Renderer',
});

function setFromProp(o, prop) {
  if (prop instanceof Object) {
    Object.entries(prop).forEach(([key, value]) => {
      o[key] = value;
    });
  }
}
function bindProps(src, props, dst) {
  props.forEach(prop => {
    bindProp(src, prop, dst);
  });
}
function bindProp(src, srcProp, dst, dstProp) {
  if (!dstProp) dstProp = srcProp;
  const ref = toRef(src, srcProp);
  if (ref.value instanceof Object) {
    setFromProp(dst[dstProp], ref.value);
    watch(ref, (value) => { setFromProp(dst[dstProp], value); }, { deep: true });
  } else {
    if (ref.value) dst[dstProp] = src[srcProp];
    watch(ref, (value) => { dst[dstProp] = value; });
  }
}
function propsValues(props, exclude) {
  const values = {};
  Object.entries(props).forEach(([key, value]) => {
    if (!exclude || (exclude && !exclude.includes(key))) {
      values[key] = value;
    }
  });
  return values;
}
function lerp(value1, value2, amount) {
  amount = amount < 0 ? 0 : amount;
  amount = amount > 1 ? 1 : amount;
  return value1 + (value2 - value1) * amount;
}
function lerpv2(v1, v2, amount) {
  v1.x = lerp(v1.x, v2.x, amount);
  v1.y = lerp(v1.y, v2.y, amount);
}
function lerpv3(v1, v2, amount) {
  v1.x = lerp(v1.x, v2.x, amount);
  v1.y = lerp(v1.y, v2.y, amount);
  v1.z = lerp(v1.z, v2.z, amount);
}
function limit(val, min, max) {
  return val < min ? min : (val > max ? max : val);
}
// from https://github.com/pmndrs/drei/blob/master/src/useMatcapTexture.tsx
const MATCAP_ROOT = 'https://rawcdn.githack.com/emmelleppi/matcaps/9b36ccaaf0a24881a39062d05566c9e92be4aa0d';

function getMatcapUrl(hash, format = 1024) {
  const fileName = `${hash}${getMatcapFormatString(format)}.png`;
  return `${MATCAP_ROOT}/${format}/${fileName}`;
}
function getMatcapFormatString(format) {
  switch (format) {
    case 64:
      return '-64px';
    case 128:
      return '-128px';
    case 256:
      return '-256px';
    case 512:
      return '-512px';
    default:
      return '';
  }
}

// import Object3D from '../core/Object3D.js';

var Camera = defineComponent({
  // TODO: eventually extend Object3D, for now: error 'injection "scene" not found'
  // because camera is a sibling of scene in Trois
  // extends: Object3D,
  inject: ['three'],
  render() {
    return this.$slots.default ? this.$slots.default() : [];
  },
});

var OrthographicCamera = defineComponent({
  extends: Camera,
  name: 'OrthographicCamera',
  inject: ['three'],
  props: {
    left: { type: Number, default: -1 },
    right: { type: Number, default: 1 },
    top: { type: Number, default: 1 },
    bottom: { type: Number, default: -1 },
    near: { type: Number, default: 0.1 },
    far: { type: Number, default: 2000 },
    zoom: { type: Number, default: 1 },
    position: { type: Object, default: { x: 0, y: 0, z: 0 } },
  },
  created() {
    this.camera = new OrthographicCamera$1(this.left, this.right, this.top, this.bottom, this.near, this.far);
    bindProp(this, 'position', this.camera);

    ['left', 'right', 'top', 'bottom', 'near', 'far', 'zoom'].forEach(p => {
      watch(() => this[p], () => {
        this.camera[p] = this[p];
        this.camera.updateProjectionMatrix();
      });
    });

    this.three.camera = this.camera;
  },
  __hmrId: 'OrthographicCamera',
});

var PerspectiveCamera = defineComponent({
  extends: Camera,
  name: 'PerspectiveCamera',
  inject: ['three'],
  props: {
    aspect: { type: Number, default: 1 },
    far: { type: Number, default: 2000 },
    fov: { type: Number, default: 50 },
    near: { type: Number, default: 0.1 },
    position: { type: Object, default: { x: 0, y: 0, z: 0 } },
    lookAt: { type: Object, default: null },
  },
  created() {
    this.camera = new PerspectiveCamera$1(this.fov, this.aspect, this.near, this.far);
    bindProp(this, 'position', this.camera);

    if (this.lookAt) this.camera.lookAt(this.lookAt.x, this.lookAt.y, this.lookAt.z);
    watch(() => this.lookAt, (v) => { this.camera.lookAt(v.x, v.y, v.z); }, { deep: true });

    ['aspect', 'far', 'fov', 'near'].forEach(p => {
      watch(() => this[p], () => {
        this.camera[p] = this[p];
        this.camera.updateProjectionMatrix();
      });
    });

    this.three.camera = this.camera;
  },
  __hmrId: 'PerspectiveCamera',
});

var Object3D = defineComponent({
  name: 'Object3D',
  inject: ['three', 'scene', 'rendererComponent'],
  emits: ['created', 'ready'],
  props: {
    position: { type: Object, default: { x: 0, y: 0, z: 0 } },
    rotation: { type: Object, default: { x: 0, y: 0, z: 0 } },
    scale: { type: Object, default: { x: 1, y: 1, z: 1 } },
    lookAt: { type: Object, default: null },
    autoRemove: { type: Boolean, default: true },
  },
  // can't use setup because it will not be used in sub components
  // setup() {},
  unmounted() {
    if (this.autoRemove) this.removeFromParent();
  },
  methods: {
    initObject3D(o3d) {
      this.o3d = o3d;
      this.$emit('created', this.o3d);

      bindProp(this, 'position', this.o3d);
      bindProp(this, 'rotation', this.o3d);
      bindProp(this, 'scale', this.o3d);

      // TODO : fix lookat.x
      if (this.lookAt) this.o3d.lookAt(this.lookAt.x, this.lookAt.y, this.lookAt.z);
      watch(() => this.lookAt, (v) => { this.o3d.lookAt(v.x, v.y, v.z); }, { deep: true });

      this._parent = this.getParent();
      if (this.addToParent()) this.$emit('ready', this);
      else console.error('Missing parent (Scene, Group...)');
    },
    getParent() {
      let parent = this.$parent;
      while (parent) {
        if (parent.add) return parent;
        parent = parent.$parent;
      }
      return false;
    },
    addToParent(o) {
      const o3d = o || this.o3d;
      if (this._parent) {
        this._parent.add(o3d);
        return true;
      }
      return false;
    },
    removeFromParent(o) {
      const o3d = o || this.o3d;
      if (this._parent) {
        this._parent.remove(o3d);
        return true;
      }
      return false;
    },
    add(o) { this.o3d.add(o); },
    remove(o) { this.o3d.remove(o); },
  },
  render() {
    return this.$slots.default ? this.$slots.default() : [];
  },
  __hmrId: 'Object3D',
});

var Group = defineComponent({
  name: 'Group',
  extends: Object3D,
  created() {
    this.group = new Group$1();
    this.initObject3D(this.group);
  },
  __hmrId: 'Group',
});

var Scene = defineComponent({
  name: 'Scene',
  inject: ['three'],
  props: {
    id: String,
    background: [String, Number],
  },
  setup(props) {
    const scene = new Scene$1();
    if (props.background) scene.background = new Color(props.background);
    watch(() => props.background, (value) => { scene.background.set(value); });
    return { scene };
  },
  provide() {
    return {
      scene: this.scene,
    };
  },
  mounted() {
    if (!this.three.scene) {
      this.three.scene = this.scene;
    }
  },
  methods: {
    add(o) { this.scene.add(o); },
    remove(o) { this.scene.remove(o); },
  },
  render() {
    return this.$slots.default ? this.$slots.default() : [];
  },
  __hmrId: 'Scene',
});

var Raycaster = defineComponent({
  name: 'Raycaster',
  inject: ['three', 'rendererComponent'],
  props: {
    onPointerEnter: { type: Function, default: () => {} },
    onPointerOver: { type: Function, default: () => {} },
    onPointerMove: { type: Function, default: () => {} },
    onPointerLeave: { type: Function, default: () => {} },
    onClick: { type: Function, default: () => {} },
    intersectMode: { type: String, default: 'move' },
  },
  mounted() {
    this.rendererComponent.onMounted(() => {
      this.pointer = usePointer({
        camera: this.three.camera,
        domElement: this.three.renderer.domElement,
        intersectObjects: this.getIntersectObjects(),
        onIntersectEnter: this.onPointerEnter,
        onIntersectOver: this.onPointerOver,
        onIntersectMove: this.onPointerMove,
        onIntersectLeave: this.onPointerLeave,
        onIntersectClick: this.onClick,
      });
      this.pointer.addListeners();

      if (this.intersectMode === 'frame') {
        this.three.onBeforeRender(this.pointer.intersect);
      }
    });
  },
  unmounted() {
    if (this.pointer) {
      this.pointer.removeListeners();
      this.three.offBeforeRender(this.pointer.intersect);
    }
  },
  methods: {
    getIntersectObjects() {
      return this.three.scene.children.filter(e => e.type === 'Mesh');
    },
  },
  render() {
    return [];
  },
  __hmrId: 'Raycaster',
});

const Geometry = defineComponent({
  inject: ['mesh'],
  props: {
    rotateX: Number,
    rotateY: Number,
    rotateZ: Number,
  },
  created() {
    if (!this.mesh) {
      console.error('Missing parent Mesh');
    }

    this.watchProps = [];
    Object.entries(this.$props).forEach(e => this.watchProps.push(e[0]));

    this.createGeometry();
    this.rotateGeometry();
    this.mesh.setGeometry(this.geometry);

    this.addWatchers();
  },
  unmounted() {
    this.geometry.dispose();
  },
  methods: {
    addWatchers() {
      this.watchProps.forEach(prop => {
        watch(() => this[prop], () => {
          this.refreshGeometry();
        });
      });
    },
    rotateGeometry() {
      if (this.rotateX) this.geometry.rotateX(this.rotateX);
      if (this.rotateY) this.geometry.rotateY(this.rotateY);
      if (this.rotateZ) this.geometry.rotateZ(this.rotateZ);
    },
    refreshGeometry() {
      const oldGeo = this.geometry;
      this.createGeometry();
      this.rotateGeometry();
      this.mesh.setGeometry(this.geometry);
      oldGeo.dispose();
    },
  },
  render() { return []; },
});

function geometryComponent(name, props, createGeometry) {
  return defineComponent({
    name,
    extends: Geometry,
    props,
    methods: {
      createGeometry() {
        this.geometry = createGeometry(this);
      },
    },
  });
}

const props$h = {
  size: Number,
  width: { type: Number, default: 1 },
  height: { type: Number, default: 1 },
  depth: { type: Number, default: 1 },
  widthSegments: { type: Number, default: 1 },
  heightSegments: { type: Number, default: 1 },
  depthSegments: { type: Number, default: 1 },
};

function createGeometry$f(comp) {
  if (comp.size) {
    return new BoxGeometry$1(comp.size, comp.size, comp.size, comp.widthSegments, comp.heightSegments, comp.depthSegments);
  } else {
    return new BoxGeometry$1(comp.width, comp.height, comp.depth, comp.widthSegments, comp.heightSegments, comp.depthSegments);
  }
}
var BoxGeometry = geometryComponent('BoxGeometry', props$h, createGeometry$f);

const props$g = {
  radius: { type: Number, default: 1 },
  segments: { type: Number, default: 8 },
  thetaStart: { type: Number, default: 0 },
  thetaLength: { type: Number, default: Math.PI * 2 },
};

function createGeometry$e(comp) {
  return new CircleGeometry$1(comp.radius, comp.segments, comp.thetaStart, comp.thetaLength);
}
var CircleGeometry = geometryComponent('CircleGeometry', props$g, createGeometry$e);

const props$f = {
  radius: { type: Number, default: 1 },
  height: { type: Number, default: 1 },
  radialSegments: { type: Number, default: 8 },
  heightSegments: { type: Number, default: 1 },
  openEnded: { type: Boolean, default: false },
  thetaStart: { type: Number, default: 0 },
  thetaLength: { type: Number, default: Math.PI * 2 },
};

function createGeometry$d(comp) {
  return new ConeGeometry$1(comp.radius, comp.height, comp.radialSegments, comp.heightSegments, comp.openEnded, comp.thetaStart, comp.thetaLength);
}
var ConeGeometry = geometryComponent('ConeGeometry', props$f, createGeometry$d);

const props$e = {
  radiusTop: { type: Number, default: 1 },
  radiusBottom: { type: Number, default: 1 },
  height: { type: Number, default: 1 },
  radialSegments: { type: Number, default: 8 },
  heightSegments: { type: Number, default: 1 },
  openEnded: { type: Boolean, default: false },
  thetaStart: { type: Number, default: 0 },
  thetaLength: { type: Number, default: Math.PI * 2 },
};

function createGeometry$c(comp) {
  return new CylinderGeometry$1(comp.radiusTop, comp.radiusBottom, comp.height, comp.radialSegments, comp.heightSegments, comp.openEnded, comp.thetaStart, comp.thetaLength);
}
var CylinderGeometry = geometryComponent('CylinderGeometry', props$e, createGeometry$c);

const props$d = {
  radius: { type: Number, default: 1 },
  detail: { type: Number, default: 0 },
};

function createGeometry$b(comp) {
  return new DodecahedronGeometry$1(comp.radius, comp.detail);
}
var DodecahedronGeometry = geometryComponent('DodecahedronGeometry', props$d, createGeometry$b);

const props$c = {
  radius: { type: Number, default: 1 },
  detail: { type: Number, default: 0 },
};

function createGeometry$a(comp) {
  return new IcosahedronGeometry$1(comp.radius, comp.detail);
}
var IcosahedronGeometry = geometryComponent('IcosahedronGeometry', props$c, createGeometry$a);

const props$b = {
  points: Array,
  segments: { type: Number, default: 12 },
  phiStart: { type: Number, default: 0 },
  phiLength: { type: Number, default: Math.PI * 2 },
};

function createGeometry$9(comp) {
  return new LatheGeometry$1(comp.points, comp.segments, comp.phiStart, comp.phiLength);
}
var LatheGeometry = geometryComponent('LatheGeometry', props$b, createGeometry$9);

const props$a = {
  radius: { type: Number, default: 1 },
  detail: { type: Number, default: 0 },
};

function createGeometry$8(comp) {
  return new OctahedronGeometry$1(comp.radius, comp.detail);
}
var OctahedronGeometry = geometryComponent('OctahedronGeometry', props$a, createGeometry$8);

const props$9 = {
  vertices: Array,
  indices: Array,
  radius: { type: Number, default: 1 },
  detail: { type: Number, default: 0 },
};

function createGeometry$7(comp) {
  return new PolyhedronGeometry$1(comp.vertices, comp.indices, comp.radius, comp.detail);
}
var PolyhedronGeometry = geometryComponent('PolyhedronGeometry', props$9, createGeometry$7);

const props$8 = {
  innerRadius: { type: Number, default: 0.5 },
  outerRadius: { type: Number, default: 1 },
  thetaSegments: { type: Number, default: 8 },
  phiSegments: { type: Number, default: 1 },
  thetaStart: { type: Number, default: 0 },
  thetaLength: { type: Number, default: Math.PI * 2 },
};

function createGeometry$6(comp) {
  return new RingGeometry$1(comp.innerRadius, comp.outerRadius, comp.thetaSegments, comp.phiSegments, comp.thetaStart, comp.thetaLength);
}
var RingGeometry = geometryComponent('RingGeometry', props$8, createGeometry$6);

const props$7 = {
  radius: { type: Number, default: 1 },
  widthSegments: { type: Number, default: 12 },
  heightSegments: { type: Number, default: 12 },
};

function createGeometry$5(comp) {
  return new SphereGeometry$1(comp.radius, comp.widthSegments, comp.heightSegments);
}
var SphereGeometry = geometryComponent('SphereGeometry', props$7, createGeometry$5);

const props$6 = {
  radius: { type: Number, default: 1 },
  detail: { type: Number, default: 0 },
};

function createGeometry$4(comp) {
  return new TetrahedronGeometry$1(comp.radius, comp.detail);
}
var TetrahedronGeometry = geometryComponent('TetrahedronGeometry', props$6, createGeometry$4);

const props$5 = {
  radius: { type: Number, default: 1 },
  tube: { type: Number, default: 0.4 },
  radialSegments: { type: Number, default: 8 },
  tubularSegments: { type: Number, default: 6 },
  arc: { type: Number, default: Math.PI * 2 },
};

function createGeometry$3(comp) {
  return new TorusGeometry$1(comp.radius, comp.tube, comp.radialSegments, comp.tubularSegments, comp.arc);
}
var TorusGeometry = geometryComponent('TorusGeometry', props$5, createGeometry$3);

const props$4 = {
  radius: { type: Number, default: 1 },
  tube: { type: Number, default: 0.4 },
  tubularSegments: { type: Number, default: 64 },
  radialSegments: { type: Number, default: 8 },
  p: { type: Number, default: 2 },
  q: { type: Number, default: 3 },
};

function createGeometry$2(comp) {
  return new TorusKnotGeometry$1(comp.radius, comp.tube, comp.tubularSegments, comp.radialSegments, comp.p, comp.q);
}
var TorusKnotGeometry = geometryComponent('TorusKnotGeometry', props$4, createGeometry$2);

const props$3 = {
  points: Array,
  path: Curve,
  tubularSegments: { type: Number, default: 64 },
  radius: { type: Number, default: 1 },
  radialSegments: { type: Number, default: 8 },
  closed: { type: Boolean, default: false },
};

function createGeometry$1(comp) {
  let curve;
  if (comp.points) {
    curve = new CatmullRomCurve3(comp.points);
  } else if (comp.path) {
    curve = comp.path;
  } else {
    console.error('Missing path curve or points.');
  }
  return new TubeGeometry$1(curve, comp.tubularSegments, comp.radius, comp.radiusSegments, comp.closed);
}
var TubeGeometry = defineComponent({
  extends: Geometry,
  props: props$3,
  methods: {
    createGeometry() {
      this.geometry = createGeometry$1(this);
    },
    // update points (without using prop, faster)
    updatePoints(points) {
      updateTubeGeometryPoints(this.geometry, points);
    },
  },
});

function updateTubeGeometryPoints(tube, points) {
  const curve = new CatmullRomCurve3(points);
  const { radialSegments, radius, tubularSegments, closed } = tube.parameters;
  const frames = curve.computeFrenetFrames(tubularSegments, closed);
  tube.tangents = frames.tangents;
  tube.normals = frames.normals;
  tube.binormals = frames.binormals;
  tube.parameters.path = curve;

  const pArray = tube.attributes.position.array;
  const nArray = tube.attributes.normal.array;
  const normal = new Vector3();
  let P;

  for (let i = 0; i < tubularSegments; i++) {
    updateSegment(i);
  }
  updateSegment(tubularSegments);

  tube.attributes.position.needsUpdate = true;
  tube.attributes.normal.needsUpdate = true;

  function updateSegment(i) {
    P = curve.getPointAt(i / tubularSegments, P);
    const N = frames.normals[i];
    const B = frames.binormals[i];
    for (let j = 0; j <= radialSegments; j++) {
      const v = j / radialSegments * Math.PI * 2;
      const sin = Math.sin(v);
      const cos = -Math.cos(v);
      normal.x = (cos * N.x + sin * B.x);
      normal.y = (cos * N.y + sin * B.y);
      normal.z = (cos * N.z + sin * B.z);
      normal.normalize();
      const index = (i * (radialSegments + 1) + j) * 3;
      nArray[index] = normal.x;
      nArray[index + 1] = normal.y;
      nArray[index + 2] = normal.z;
      pArray[index] = P.x + radius * normal.x;
      pArray[index + 1] = P.y + radius * normal.y;
      pArray[index + 2] = P.z + radius * normal.z;
    }
  }
}

var Light = defineComponent({
  extends: Object3D,
  name: 'Light',
  props: {
    color: { type: String, default: '#ffffff' },
    intensity: { type: Number, default: 1 },
    castShadow: { type: Boolean, default: false },
    shadowMapSize: { type: Object, default: { x: 512, y: 512 } },
    shadowCamera: { type: Object, default: {} },
  },
  // can't use setup because it will not be used in sub components
  // setup() {},
  unmounted() {
    if (this.light.target) this.removeFromParent(this.light.target);
  },
  methods: {
    initLight() {
      if (this.light.target) {
        bindProp(this, 'target', this.light.target, 'position');
      }

      if (this.light.shadow) {
        this.light.castShadow = this.castShadow;
        setFromProp(this.light.shadow.mapSize, this.shadowMapSize);
        setFromProp(this.light.shadow.camera, this.shadowCamera);
      }

      ['color', 'intensity', 'castShadow'].forEach(p => {
        watch(() => this[p], () => {
          if (p === 'color') {
            this.light.color.set(this.color);
          } else {
            this.light[p] = this[p];
          }
        });
      });

      this.initObject3D(this.light);
      if (this.light.target) this.addToParent(this.light.target);
    },
  },
  __hmrId: 'Light',
});

var AmbientLight = defineComponent({
  extends: Light,
  created() {
    this.light = new AmbientLight$1(this.color, this.intensity);
    this.initLight();
  },
  __hmrId: 'AmbientLight',
});

var DirectionalLight = defineComponent({
  extends: Light,
  props: {
    target: Object,
  },
  created() {
    this.light = new DirectionalLight$1(this.color, this.intensity);
    this.initLight();
  },
  __hmrId: 'DirectionalLight',
});

var HemisphereLight = defineComponent({
  extends: Light,
  props: {
    groundColor: { type: String, default: '#444444' },
  },
  created() {
    this.light = new HemisphereLight$1(this.color, this.groundColor, this.intensity);
    watch(() => this.groundColor, (value) => { this.light.groundColor.set(value); });
    this.initLight();
  },
  __hmrId: 'HemisphereLight',
});

var PointLight = defineComponent({
  extends: Light,
  props: {
    distance: {
      type: Number,
      default: 0,
    },
    decay: {
      type: Number,
      default: 1,
    },
  },
  created() {
    this.light = new PointLight$1(this.color, this.intensity, this.distance, this.decay);
    this.initLight();
  },
  __hmrId: 'PointLight',
});

var RectAreaLight = defineComponent({
  extends: Light,
  props: {
    width: { type: Number, default: 10 },
    height: { type: Number, default: 10 },
    helper: Boolean,
  },
  created() {
    RectAreaLightUniformsLib.init();
    this.light = new RectAreaLight$1(this.color, this.intensity, this.width, this.height);

    ['width', 'height'].forEach(p => {
      watch(() => this[p], () => {
        this.light[p] = this[p];
      });
    });

    if (this.helper) {
      this.lightHelper = new RectAreaLightHelper(this.light);
      this.light.add(this.lightHelper);
    }

    this.initLight();
  },
  unmounted() {
    if (this.lightHelper) this.removeFromParent(this.lightHelper);
  },
  __hmrId: 'RectAreaLight',
});

var SpotLight = defineComponent({
  extends: Light,
  props: {
    angle: { type: Number, default: Math.PI / 3 },
    decay: { type: Number, default: 1 },
    distance: { type: Number, default: 0 },
    penumbra: { type: Number, default: 0 },
    target: Object,
  },
  created() {
    this.light = new SpotLight$1(this.color, this.intensity, this.distance, this.angle, this.penumbra, this.decay);
    ['angle', 'decay', 'distance', 'penumbra'].forEach(p => {
      watch(() => this[p], () => {
        this.light[p] = this[p];
      });
    });
    this.initLight();
  },
  __hmrId: 'SpotLight',
});

var Material = defineComponent({
  inject: ['three', 'mesh'],
  props: {
    color: { type: [String, Number], default: '#ffffff' },
    depthTest: { type: Boolean, default: true },
    depthWrite: { type: Boolean, default: true },
    fog: { type: Boolean, default: true },
    opacity: { type: Number, default: 1 },
    side: { type: Number, default: FrontSide },
    transparent: Boolean,
    vertexColors: Boolean,
  },
  provide() {
    return {
      material: this,
    };
  },
  created() {
    this.createMaterial();
    this.mesh.setMaterial(this.material);

    this._addWatchers();
    if (this.addWatchers) this.addWatchers();
  },
  unmounted() {
    this.material.dispose();
  },
  methods: {
    setProp(key, value, needsUpdate = false) {
      this.material[key] = value;
      this.material.needsUpdate = needsUpdate;
    },
    setTexture(texture, key = 'map') {
      this.setProp(key, texture, true);
    },
    _addWatchers() {
      ['color', 'depthTest', 'depthWrite', 'fog', 'opacity', 'side', 'transparent'].forEach(p => {
        watch(() => this[p], () => {
          if (p === 'color') {
            this.material.color.set(this.color);
          } else {
            this.material[p] = this[p];
          }
        });
      });
    },
  },
  render() {
    return this.$slots.default ? this.$slots.default() : [];
  },
  __hmrId: 'Material',
});

const wireframeProps = {
  wireframe: { type: Boolean, default: false },
  // not needed for WebGL
  // wireframeLinecap: { type: String, default: 'round' },
  // wireframeLinejoin: { type: String, default: 'round' },
  wireframeLinewidth: { type: Number, default: 1 }, // not really useful
};

var BasicMaterial = defineComponent({
  extends: Material,
  props: {
    ...wireframeProps,
  },
  methods: {
    createMaterial() {
      this.material = new MeshBasicMaterial(propsValues(this.$props));
    },
    addWatchers() {
      bindProps(this, Object.keys(wireframeProps), this.material);
    },
  },
  __hmrId: 'BasicMaterial',
});

var LambertMaterial = defineComponent({
  extends: Material,
  props: {
    ...wireframeProps,
  },
  methods: {
    createMaterial() {
      this.material = new MeshLambertMaterial(propsValues(this.$props));
    },
    addWatchers() {
      bindProps(this, Object.keys(wireframeProps), this.material);
    },
  },
  __hmrId: 'LambertMaterial',
});

var MatcapMaterial = defineComponent({
  extends: Material,
  props: {
    src: String,
    name: String,
    flatShading: Boolean,
  },
  methods: {
    createMaterial() {
      const src = this.name ? getMatcapUrl(this.name) : this.src;
      const opts = propsValues(this.$props, ['src', 'name']);
      opts.matcap = new TextureLoader().load(src);
      this.material = new MeshMatcapMaterial(opts);
    },
    addWatchers() {
      // TODO
    },
  },
  __hmrId: 'MatcapMaterial',
});

var PhongMaterial = defineComponent({
  extends: Material,
  props: {
    emissive: { type: [Number, String], default: 0 },
    emissiveIntensity: { type: Number, default: 1 },
    reflectivity: { type: Number, default: 1 },
    shininess: { type: Number, default: 30 },
    specular: { type: [String, Number], default: 0x111111 },
    flatShading: Boolean,
    ...wireframeProps,
  },
  methods: {
    createMaterial() {
      this.material = new MeshPhongMaterial(propsValues(this.$props));
    },
    addWatchers() {
      // TODO : handle flatShading ?
      ['emissive', 'emissiveIntensity', 'reflectivity', 'shininess', 'specular'].forEach(p => {
        watch(() => this[p], (value) => {
          if (p === 'emissive' || p === 'specular') {
            this.material[p].set(value);
          } else {
            this.material[p] = value;
          }
        });
      });
      bindProps(this, Object.keys(wireframeProps), this.material);
    },
  },
  __hmrId: 'PhongMaterial',
});

const props$2 = {
  aoMapIntensity: { type: Number, default: 1 },
  bumpScale: { type: Number, default: 1 },
  displacementBias: { type: Number, default: 0 },
  displacementScale: { type: Number, default: 1 },
  emissive: { type: [Number, String], default: 0 },
  emissiveIntensity: { type: Number, default: 1 },
  envMapIntensity: { type: Number, default: 1 },
  lightMapIntensity: { type: Number, default: 1 },
  metalness: { type: Number, default: 0 },
  normalScale: { type: Object, default: { x: 1, y: 1 } },
  roughness: { type: Number, default: 1 },
  refractionRatio: { type: Number, default: 0.98 },
  flatShading: Boolean,
};

var StandardMaterial = defineComponent({
  extends: Material,
  props: {
    ...props$2,
    ...wireframeProps,
  },
  methods: {
    createMaterial() {
      this.material = new MeshStandardMaterial(propsValues(this.$props, ['normalScale']));
    },
    addWatchers() {
      // TODO : use setProp, handle flatShading ?
      Object.keys(props$2).forEach(p => {
        if (p === 'normalScale') return;
        watch(() => this[p], (value) => {
          if (p === 'emissive') {
            this.material[p].set(value);
          } else {
            this.material[p] = value;
          }
        });
      });
      bindProp(this, 'normalScale', this.material);
      bindProps(this, Object.keys(wireframeProps), this.material);
    },
  },
  __hmrId: 'StandardMaterial',
});

var PhysicalMaterial = defineComponent({
  extends: StandardMaterial,
  props: {
    flatShading: Boolean,
  },
  methods: {
    createMaterial() {
      this.material = new MeshPhysicalMaterial(propsValues(this.$props));
    },
    addWatchers() {
      // TODO
    },
  },
  __hmrId: 'PhysicalMaterial',
});

const defaultVertexShader = `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}`;

const defaultFragmentShader = `
varying vec2 vUv;
void main() {
  gl_FragColor = vec4(vUv.x, vUv.y, 0., 1.0);
}`;

var ShaderMaterial = defineComponent({
  inject: ['three', 'mesh'],
  props: {
    uniforms: { type: Object, default: () => { return {}; } },
    vertexShader: { type: String, default: defaultVertexShader },
    fragmentShader: { type: String, default: defaultFragmentShader },
  },
  provide() {
    return {
      material: this,
    };
  },
  created() {
    this.createMaterial();
    ['vertexShader', 'fragmentShader'].forEach(p => {
      watch(() => this[p], () => {
        // recreate material if we change either shader
        this.material.dispose();
        this.createMaterial();
      });
    });
  },
  unmounted() {
    this.material.dispose();
  },
  methods: {
    createMaterial() {
      this.material = new ShaderMaterial$1(propsValues(this.$props));
      this.mesh.setMaterial(this.material);
    },
  },
  render() {
    return this.$slots.default ? this.$slots.default() : [];
  },
  __hmrId: 'ShaderMaterial',
});

/**
 * ------------------------------------------------------------------------------------------
 * Subsurface Scattering shader
 * Based on three/examples/jsm/shaders/SubsurfaceScatteringShader.js
 * Based on GDC 2011 – Approximating Translucency for a Fast, Cheap and Convincing Subsurface Scattering Look
 * https://colinbarrebrisebois.com/2011/03/07/gdc-2011-approximating-translucency-for-a-fast-cheap-and-convincing-subsurface-scattering-look/
 *------------------------------------------------------------------------------------------
 */

function replaceAll(string, find, replace) {
  return string.split(find).join(replace);
}

const meshphongFragHead = ShaderChunk.meshphong_frag.slice(0, ShaderChunk.meshphong_frag.indexOf('void main() {'));
const meshphongFragBody = ShaderChunk.meshphong_frag.slice(ShaderChunk.meshphong_frag.indexOf('void main() {'));

const SubsurfaceScatteringShader = {

  uniforms: UniformsUtils.merge([
    ShaderLib.phong.uniforms,
    {
      thicknessColor: { value: new Color(0xffffff) },
      thicknessDistortion: { value: 0.1 },
      thicknessAmbient: { value: 0.0 },
      thicknessAttenuation: { value: 0.1 },
      thicknessPower: { value: 2.0 },
      thicknessScale: { value: 10.0 },
    },
  ]),

  vertexShader: `
    #define USE_UV
    ${ShaderChunk.meshphong_vert}
  `,

  fragmentShader: `
    #define USE_UV
    #define SUBSURFACE

    ${meshphongFragHead}

    uniform float thicknessPower;
    uniform float thicknessScale;
    uniform float thicknessDistortion;
    uniform float thicknessAmbient;
    uniform float thicknessAttenuation;
    uniform vec3 thicknessColor;

    void RE_Direct_Scattering(const in IncidentLight directLight, const in vec2 uv, const in GeometricContext geometry, inout ReflectedLight reflectedLight) {
      #ifdef USE_COLOR
        vec3 thickness = vColor * thicknessColor;
      #else
        vec3 thickness = thicknessColor;
      #endif
      vec3 scatteringHalf = normalize(directLight.direction + (geometry.normal * thicknessDistortion));
      float scatteringDot = pow(saturate(dot(geometry.viewDir, -scatteringHalf)), thicknessPower) * thicknessScale;
      vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * thickness;
      reflectedLight.directDiffuse += scatteringIllu * thicknessAttenuation * directLight.color;
    }
  ` + meshphongFragBody.replace(
    '#include <lights_fragment_begin>',
    replaceAll(
      ShaderChunk.lights_fragment_begin,
      'RE_Direct( directLight, geometry, material, reflectedLight );',
      `
        RE_Direct( directLight, geometry, material, reflectedLight );
        #if defined( SUBSURFACE ) && defined( USE_UV )
          RE_Direct_Scattering(directLight, vUv, geometry, reflectedLight);
        #endif
      `
    )
  ),
};

var SubSurfaceMaterial = defineComponent({
  inject: ['three', 'mesh'],
  props: {
    color: { type: String, default: '#ffffff' },
    thicknessColor: { type: String, default: '#ffffff' },
    thicknessDistortion: { type: Number, default: 0.4 },
    thicknessAmbient: { type: Number, default: 0.01 },
    thicknessAttenuation: { type: Number, default: 0.7 },
    thicknessPower: { type: Number, default: 2 },
    thicknessScale: { type: Number, default: 4 },
    transparent: { type: Boolean, default: false },
    opacity: { type: Number, default: 1 },
    vertexColors: { type: Boolean, default: false },
  },
  created() {
    this.createMaterial();
    this.mesh.setMaterial(this.material);
  },
  unmounted() {
    this.material.dispose();
  },
  methods: {
    createMaterial() {
      const params = SubsurfaceScatteringShader;
      const uniforms = UniformsUtils.clone(params.uniforms);

      Object.entries(this.$props).forEach(([key, value]) => {
        let _key = key, _value = value;
        if (['color', 'thicknessColor'].includes(key)) {
          if (key === 'color') _key = 'diffuse';
          _value = new Color(value);
        }
        if (!['transparent', 'vertexColors'].includes(key)) {
          uniforms[_key].value = _value;
        }
      });

      this.material = new ShaderMaterial$1({
        ...params,
        uniforms,
        lights: true,
        transparent: this.transparent,
        vertexColors: this.vertexColors,
      });
    },
  },
  render() {
    return [];
  },
  __hmrId: 'SubSurfaceMaterial',
});

var ToonMaterial = defineComponent({
  extends: Material,
  props: {
    ...wireframeProps,
  },
  methods: {
    createMaterial() {
      this.material = new MeshToonMaterial(propsValues(this.$props));
    },
    addWatchers() {
      bindProps(this, Object.keys(wireframeProps), this.material);
    },
  },
  __hmrId: 'ToonMaterial',
});

var Texture = defineComponent({
  inject: ['material'],
  emits: ['loaded'],
  props: {
    name: { type: String, default: 'map' },
    uniform: { type: String, default: null },
    src: String,
    onLoad: Function,
    onProgress: Function,
    onError: Function,
    mapping: { type: Number, default: UVMapping },
    wrapS: { type: Number, default: ClampToEdgeWrapping },
    wrapT: { type: Number, default: ClampToEdgeWrapping },
    magFilter: { type: Number, default: LinearFilter },
    minFilter: { type: Number, default: LinearMipmapLinearFilter },
    repeat: { type: Object, default: { x: 1, y: 1 } },
    rotation: { type: Number, default: 0 },
    center: { type: Object, default: { x: 0, y: 0 } },
  },
  created() {
    this.refreshTexture();
    watch(() => this.src, this.refreshTexture);
  },
  unmounted() {
    if (this.material && this.material.setTexture) this.material.setTexture(null, this.name);
    this.texture.dispose();
  },
  methods: {
    createTexture() {
      this.texture = new TextureLoader().load(this.src, this.onLoaded, this.onProgress, this.onError);
      const wathProps = ['mapping', 'wrapS', 'wrapT', 'magFilter', 'minFilter', 'repeat', 'rotation', 'rotation', 'center'];
      wathProps.forEach(prop => {
        bindProp(this, prop, this.texture);
      });
    },
    refreshTexture() {
      this.createTexture();
      // handle standard material
      if (this.material && this.material.setTexture) { this.material.setTexture(this.texture, this.name); }
      // handle shader material
      else if (this.material && this.material.material.type === "ShaderMaterial") {
        // require a `uniform` prop so we know what to call the uniform
        if (!this.uniform) {
          console.warn('"uniform" prop required to use texture in a shader.');
          return
        }
        this.material.uniforms[this.uniform] = { value: this.texture };
      }
    },
    onLoaded() {
      if (this.onLoad) this.onLoad();
      this.$emit('loaded');
    },
  },
  render() { return []; },
});

var CubeTexture = defineComponent({
  inject: ['material'],
  emits: ['loaded'],
  props: {
    path: String,
    urls: {
      type: Array,
      default: ['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'],
    },
    onLoad: Function,
    onProgress: Function,
    onError: Function,
    name: { type: String, default: 'envMap' },
    refraction: Boolean,
    // todo: remove ?
    refractionRatio: { type: Number, default: 0.98 },
  },
  created() {
    this.refreshTexture();
    watch(() => this.path, this.refreshTexture);
    watch(() => this.urls, this.refreshTexture);
  },
  unmounted() {
    this.material.setTexture(null, this.name);
    this.texture.dispose();
  },
  methods: {
    createTexture() {
      this.texture = new CubeTextureLoader()
        .setPath(this.path)
        .load(this.urls, this.onLoaded, this.onProgress, this.onError);
    },
    refreshTexture() {
      this.createTexture();
      this.material.setTexture(this.texture, this.name);
      if (this.refraction) {
        this.texture.mapping = CubeRefractionMapping;
        this.material.setProp('refractionRatio', this.refractionRatio);
      }
    },
    onLoaded() {
      if (this.onLoad) this.onLoad();
      this.$emit('loaded');
    },
  },
  render() {
    return [];
  },
});

const pointerProps = {
  onPointerEnter: Function,
  onPointerOver: Function,
  onPointerMove: Function,
  onPointerLeave: Function,
  onPointerDown: Function,
  onPointerUp: Function,
  onClick: Function,
};

const Mesh = defineComponent({
  name: 'Mesh',
  extends: Object3D,
  props: {
    castShadow: Boolean,
    receiveShadow: Boolean,
    ...pointerProps,
  },
  // can't use setup because it will not be used in sub components
  // setup() {},
  provide() {
    return {
      mesh: this,
    };
  },
  mounted() {
    if (!this.mesh && !this.loading) this.initMesh();
  },
  methods: {
    initMesh() {
      this.mesh = new Mesh$1(this.geometry, this.material);
      this.mesh.component = this;

      bindProp(this, 'castShadow', this.mesh);
      bindProp(this, 'receiveShadow', this.mesh);

      if (this.onPointerEnter ||
        this.onPointerOver ||
        this.onPointerMove ||
        this.onPointerLeave ||
        this.onPointerDown ||
        this.onPointerUp ||
        this.onClick) {
        this.three.addIntersectObject(this.mesh);
      }

      this.initObject3D(this.mesh);
    },
    addGeometryWatchers(props) {
      Object.keys(props).forEach(prop => {
        watch(() => this[prop], () => {
          this.refreshGeometry();
        });
      });
    },
    setGeometry(geometry) {
      this.geometry = geometry;
      if (this.mesh) this.mesh.geometry = geometry;
    },
    setMaterial(material) {
      this.material = material;
      if (this.mesh) this.mesh.material = material;
    },
    refreshGeometry() {
      const oldGeo = this.geometry;
      this.createGeometry();
      this.mesh.geometry = this.geometry;
      oldGeo.dispose();
    },
  },
  unmounted() {
    if (this.mesh) {
      this.three.removeIntersectObject(this.mesh);
    }
    // for predefined mesh (geometry is not unmounted)
    if (this.geometry) this.geometry.dispose();
  },
  __hmrId: 'Mesh',
});

function meshComponent(name, props, createGeometry) {
  return defineComponent({
    name,
    extends: Mesh,
    props,
    created() {
      this.createGeometry();
      this.addGeometryWatchers(props);
    },
    methods: {
      createGeometry() {
        this.geometry = createGeometry(this);
      },
    },
    __hmrId: name,
  });
}

var Box = meshComponent('Box', props$h, createGeometry$f);

var Circle = meshComponent('Circle', props$g, createGeometry$e);

var Cone = meshComponent('Cone', props$f, createGeometry$d);

var Cylinder = meshComponent('Cylinder', props$e, createGeometry$c);

var Dodecahedron = meshComponent('Dodecahedron', props$d, createGeometry$b);

var Icosahedron = meshComponent('Icosahedron', props$c, createGeometry$a);

var Lathe = meshComponent('Lathe', props$b, createGeometry$9);

var Octahedron = meshComponent('Octahedron', props$a, createGeometry$8);

const props$1 = {
  width: { type: Number, default: 1 },
  height: { type: Number, default: 1 },
  widthSegments: { type: Number, default: 1 },
  heightSegments: { type: Number, default: 1 },
};

function createGeometry(comp) {
  return new PlaneGeometry(comp.width, comp.height, comp.widthSegments, comp.heightSegments);
}
geometryComponent('PlaneGeometry', props$1, createGeometry);

var Plane = meshComponent('Plane', props$1, createGeometry);

var Polyhedron = meshComponent('Polyhedron', props$9, createGeometry$7);

var Ring = meshComponent('Ring', props$8, createGeometry$6);

var Sphere = meshComponent('Sphere', props$7, createGeometry$5);

var Tetrahedron = meshComponent('Tetrahedron', props$6, createGeometry$4);

const props = {
  text: String,
  fontSrc: String,
  size: { type: Number, default: 80 },
  height: { type: Number, default: 5 },
  depth: { type: Number, default: 1 },
  curveSegments: { type: Number, default: 12 },
  bevelEnabled: { type: Boolean, default: false },
  bevelThickness: { type: Number, default: 10 },
  bevelSize: { type: Number, default: 8 },
  bevelOffset: { type: Number, default: 0 },
  bevelSegments: { type: Number, default: 5 },
  align: { type: [Boolean, String], default: false },
};

var Text = defineComponent({
  extends: Mesh,
  props,
  data() {
    return {
      loading: true,
    };
  },
  created() {
    // add watchers
    const watchProps = [
      'text', 'size', 'height', 'curveSegments',
      'bevelEnabled', 'bevelThickness', 'bevelSize', 'bevelOffset', 'bevelSegments',
      'align',
    ];
    watchProps.forEach(p => {
      watch(() => this[p], () => {
        if (this.font) this.refreshGeometry();
      });
    });

    const loader = new FontLoader();
    loader.load(this.fontSrc, (font) => {
      this.loading = false;
      this.font = font;
      this.createGeometry();
      this.initMesh();
    });
  },
  methods: {
    createGeometry() {
      this.geometry = new TextGeometry(this.text, {
        font: this.font,
        size: this.size,
        height: this.height,
        depth: this.depth,
        curveSegments: this.curveSegments,
        bevelEnabled: this.bevelEnabled,
        bevelThickness: this.bevelThickness,
        bevelSize: this.bevelSize,
        bevelOffset: this.bevelOffset,
        bevelSegments: this.bevelSegments,
      });

      if (this.align === 'center') {
        this.geometry.center();
      }
    },
  },
});

var Torus = meshComponent('Torus', props$5, createGeometry$3);

var TorusKnot = meshComponent('TorusKnot', props$4, createGeometry$2);

var Tube = defineComponent({
  extends: Mesh,
  props: props$3,
  created() {
    this.createGeometry();
    this.addGeometryWatchers(props$3);
  },
  methods: {
    createGeometry() {
      this.geometry = createGeometry$1(this);
    },
    // update curve points (without using prop, faster)
    updatePoints(points) {
      updateTubeGeometryPoints(this.geometry, points);
    },
  },
  __hmrId: 'Tube',
});

var Gem = defineComponent({
  extends: Mesh,
  props: {
    cubeRTSize: { type: Number, default: 256 },
    cubeCameraNear: { type: Number, default: 0.1 },
    cubeCameraFar: { type: Number, default: 2000 },
    autoUpdate: Boolean,
  },
  mounted() {
    this.initGem();
    if (this.autoUpdate) this.three.onBeforeRender(this.updateCubeRT);
    else this.rendererComponent.onMounted(this.updateCubeRT);
  },
  unmounted() {
    this.three.offBeforeRender(this.updateCubeRT);
    if (this.cubeCamera) this.removeFromParent(this.cubeCamera);
    if (this.meshBack) this.removeFromParent(this.meshBack);
    if (this.materialBack) this.materialBack.dispose();
  },
  methods: {
    initGem() {
      const cubeRT = new WebGLCubeRenderTarget(this.cubeRTSize, { format: RGBFormat, generateMipmaps: true, minFilter: LinearMipmapLinearFilter });
      this.cubeCamera = new CubeCamera(this.cubeCameraNear, this.cubeCameraFar, cubeRT);
      bindProp(this, 'position', this.cubeCamera);
      this.addToParent(this.cubeCamera);

      this.material.side = FrontSide;
      this.material.envMap = cubeRT.texture;
      this.material.envMapIntensity = 10;
      this.material.metalness = 0;
      this.material.roughness = 0;
      this.material.opacity = 0.75;
      this.material.transparent = true;
      this.material.premultipliedAlpha = true;
      this.material.needsUpdate = true;

      this.materialBack = this.material.clone();
      this.materialBack.side = BackSide;
      this.materialBack.envMapIntensity = 5;
      this.materialBack.metalness = 1;
      this.materialBack.roughness = 0;
      this.materialBack.opacity = 0.5;

      this.meshBack = new Mesh$1(this.geometry, this.materialBack);

      bindProp(this, 'position', this.meshBack);
      bindProp(this, 'rotation', this.meshBack);
      bindProp(this, 'scale', this.meshBack);
      this.addToParent(this.meshBack);
    },
    updateCubeRT() {
      this.mesh.visible = false;
      this.meshBack.visible = false;
      this.cubeCamera.update(this.three.renderer, this.scene);
      this.mesh.visible = true;
      this.meshBack.visible = true;
    },
  },
  __hmrId: 'Gem',
});

var Image = defineComponent({
  emits: ['loaded'],
  extends: Mesh,
  props: {
    src: String,
    width: Number,
    height: Number,
    keepSize: Boolean,
  },
  created() {
    this.createGeometry();
    this.createMaterial();
    this.initMesh();

    watch(() => this.src, this.refreshTexture);

    ['width', 'height'].forEach(p => {
      watch(() => this[p], this.resize);
    });

    if (this.keepSize) this.three.onAfterResize(this.resize);
  },
  methods: {
    createGeometry() {
      this.geometry = new PlaneGeometry(1, 1, 1, 1);
    },
    createMaterial() {
      this.material = new MeshBasicMaterial({ side: DoubleSide, map: this.loadTexture() });
    },
    loadTexture() {
      return new TextureLoader().load(this.src, this.onLoaded);
    },
    refreshTexture() {
      if (this.texture) this.texture.dispose();
      this.material.map = this.loadTexture();
      this.material.needsUpdate = true;
    },
    onLoaded(texture) {
      this.texture = texture;
      this.resize();
      this.$emit('loaded');
    },
    resize() {
      if (!this.texture) return;
      const screen = this.three.size;
      const iW = this.texture.image.width;
      const iH = this.texture.image.height;
      const iRatio = iW / iH;
      let w, h;
      if (this.width && this.height) {
        w = this.width * screen.wWidth / screen.width;
        h = this.height * screen.wHeight / screen.height;
      } else if (this.width) {
        w = this.width * screen.wWidth / screen.width;
        h = w / iRatio;
      } else if (this.height) {
        h = this.height * screen.wHeight / screen.height;
        w = h * iRatio;
      }
      this.mesh.scale.x = w;
      this.mesh.scale.y = h;
    },
  },
  __hmrId: 'Image',
});

var InstancedMesh = defineComponent({
  extends: Object3D,
  props: {
    castShadow: Boolean,
    receiveShadow: Boolean,
    count: Number,
    ...pointerProps,
  },
  provide() {
    return {
      mesh: this,
    };
  },
  beforeMount() {
    if (!this.$slots.default) {
      console.error('Missing Geometry');
    }
  },
  mounted() {
    this.initMesh();
  },
  methods: {
    initMesh() {
      this.mesh = new InstancedMesh$1(this.geometry, this.material, this.count);
      this.mesh.component = this;

      bindProp(this, 'castShadow', this.mesh);
      bindProp(this, 'receiveShadow', this.mesh);

      if (this.onPointerEnter ||
        this.onPointerOver ||
        this.onPointerMove ||
        this.onPointerLeave ||
        this.onPointerDown ||
        this.onPointerUp ||
        this.onClick) {
        this.three.addIntersectObject(this.mesh);
      }

      this.initObject3D(this.mesh);
    },
    setGeometry(geometry) {
      this.geometry = geometry;
      if (this.mesh) this.mesh.geometry = geometry;
    },
    setMaterial(material) {
      this.material = material;
      this.material.instancingColor = true;
      if (this.mesh) this.mesh.material = material;
    },
  },
  unmounted() {
    if (this.mesh) {
      this.three.removeIntersectObject(this.mesh);
    }
  },
  __hmrId: 'InstancedMesh',
});

var MirrorMesh = defineComponent({
  extends: Mesh,
  props: {
    cubeRTSize: { type: Number, default: 256 },
    cubeCameraNear: { type: Number, default: 0.1 },
    cubeCameraFar: { type: Number, default: 2000 },
    autoUpdate: Boolean,
  },
  mounted() {
    this.initMirrorMesh();
    if (this.autoUpdate) this.three.onBeforeRender(this.updateCubeRT);
    else this.rendererComponent.onMounted(this.updateCubeRT);
  },
  unmounted() {
    this.three.offBeforeRender(this.updateCubeRT);
    if (this.cubeCamera) this.removeFromParent(this.cubeCamera);
  },
  methods: {
    initMirrorMesh() {
      const cubeRT = new WebGLCubeRenderTarget(this.cubeRTSize, { format: RGBFormat, generateMipmaps: true, minFilter: LinearMipmapLinearFilter });
      this.cubeCamera = new CubeCamera(this.cubeCameraNear, this.cubeCameraFar, cubeRT);
      this.addToParent(this.cubeCamera);

      this.material.envMap = cubeRT.texture;
      this.material.needsUpdate = true;
    },
    updateCubeRT() {
      this.mesh.visible = false;
      this.cubeCamera.update(this.three.renderer, this.scene);
      this.mesh.visible = true;
    },
  },
  __hmrId: 'MirrorMesh',
});

var RefractionMesh = defineComponent({
  extends: Mesh,
  props: {
    cubeRTSize: { type: Number, default: 256 },
    cubeCameraNear: { type: Number, default: 0.1 },
    cubeCameraFar: { type: Number, default: 2000 },
    refractionRatio: { type: Number, default: 0.98 },
    autoUpdate: Boolean,
  },
  mounted() {
    this.initMirrorMesh();
    if (this.autoUpdate) this.three.onBeforeRender(this.updateCubeRT);
    else this.rendererComponent.onMounted(this.updateCubeRT);
  },
  unmounted() {
    this.three.offBeforeRender(this.updateCubeRT);
    if (this.cubeCamera) this.removeFromParent(this.cubeCamera);
  },
  methods: {
    initMirrorMesh() {
      const cubeRT = new WebGLCubeRenderTarget(this.cubeRTSize, { mapping: CubeRefractionMapping, format: RGBFormat, generateMipmaps: true, minFilter: LinearMipmapLinearFilter });
      this.cubeCamera = new CubeCamera(this.cubeCameraNear, this.cubeCameraFar, cubeRT);
      bindProp(this, 'position', this.cubeCamera);
      this.addToParent(this.cubeCamera);

      this.material.envMap = cubeRT.texture;
      this.material.refractionRatio = this.refractionRatio;
      this.material.needsUpdate = true;
    },
    updateCubeRT() {
      this.mesh.visible = false;
      this.cubeCamera.update(this.three.renderer, this.scene);
      this.mesh.visible = true;
    },
  },
  __hmrId: 'RefractionMesh',
});

var Sprite = defineComponent({
  extends: Object3D,
  emits: ['loaded'],
  props: {
    src: String,
  },
  data() {
    return {
      loading: true,
    };
  },
  created() {
    this.texture = new TextureLoader().load(this.src, this.onLoaded);
    this.material = new SpriteMaterial({ map: this.texture });
    this.sprite = new Sprite$1(this.material);
    this.geometry = this.sprite.geometry;
    this.initObject3D(this.sprite);
  },
  unmounted() {
    this.texture.dispose();
    this.material.dispose();
  },
  methods: {
    onLoaded() {
      this.loading = false;
      this.updateUV();
      this.$emit('loaded');
    },
    updateUV() {
      this.iWidth = this.texture.image.width;
      this.iHeight = this.texture.image.height;
      this.iRatio = this.iWidth / this.iHeight;

      let x = 0.5, y = 0.5;
      if (this.iRatio > 1) {
        y = 0.5 / this.iRatio;
      } else {
        x = 0.5 / this.iRatio;
      }

      const positions = this.geometry.attributes.position.array;
      positions[0] = -x; positions[1] = -y;
      positions[5] = x; positions[6] = -y;
      positions[10] = x; positions[11] = y;
      positions[15] = -x; positions[16] = y;
      this.geometry.attributes.position.needsUpdate = true;
    },
  },
  __hmrId: 'Sprite',
});

var Model = defineComponent({
  extends: Object3D,
  emits: ['load', 'progress', 'error'],
  data() {
    return {
      progress: 0,
    };
  },
  methods: {
    onLoad(model) {
      this.$emit('load', model);
      this.initObject3D(model);
    },
    onProgress(progress) {
      this.progress = progress.loaded / progress.total;
      this.$emit('progress', progress);
    },
    onError(error) {
      this.$emit('error', error);
    },
  },
});

var GLTF = defineComponent({
  extends: Model,
  props: {
    src: String,
  },
  created() {
    const loader = new GLTFLoader();
    loader.load(this.src, (gltf) => {
      this.onLoad(gltf.scene);
    }, this.onProgress, this.onError);
  },
});

var FBX = defineComponent({
  extends: Model,
  props: {
    src: String,
  },
  created() {
    const loader = new FBXLoader();
    loader.load(this.src, (fbx) => {
      this.onLoad(fbx);
    }, this.onProgress, this.onError);
  },
});

var EffectComposer = defineComponent({
  setup() {
    return {
      passes: [],
    };
  },
  inject: ['three'],
  provide() {
    return {
      passes: this.passes,
    };
  },
  mounted() {
    this.three.onAfterInit(() => {
      this.composer = new EffectComposer$1(this.three.renderer);
      this.three.renderer.autoClear = false;
      this.passes.forEach(pass => {
        this.composer.addPass(pass);
      });
      this.three.composer = this.composer;

      this.resize();
      this.three.onAfterResize(this.resize);
    });
  },
  unmounted() {
    this.three.offAfterResize(this.resize);
  },
  methods: {
    resize() {
      this.composer.setSize(this.three.size.width, this.three.size.height);
    },
  },
  render() {
    return this.$slots.default();
  },
  __hmrId: 'EffectComposer',
});

var EffectPass = defineComponent({
  inject: ['three', 'passes'],
  emits: ['ready'],
  beforeMount() {
    if (!this.passes) {
      console.error('Missing parent EffectComposer');
    }
  },
  unmounted() {
    if (this.pass.dispose) this.pass.dispose();
  },
  methods: {
    completePass(pass) {
      this.passes.push(pass);
      this.pass = pass;
      this.$emit('ready', pass);
    },
  },
  render() {
    return [];
  },
  __hmrId: 'EffectPass',
});

var RenderPass = defineComponent({
  extends: EffectPass,
  mounted() {
    if (!this.three.scene) {
      console.error('Missing Scene');
    }
    if (!this.three.camera) {
      console.error('Missing Camera');
    }
    const pass = new RenderPass$1(this.three.scene, this.three.camera);
    this.completePass(pass);
  },
  __hmrId: 'RenderPass',
});

var BokehPass = defineComponent({
  extends: EffectPass,
  props: {
    focus: {
      type: Number,
      default: 1,
    },
    aperture: {
      type: Number,
      default: 0.025,
    },
    maxblur: {
      type: Number,
      default: 0.01,
    },
  },
  watch: {
    focus() { this.pass.uniforms.focus.value = this.focus; },
    aperture() { this.pass.uniforms.aperture.value = this.aperture; },
    maxblur() { this.pass.uniforms.maxblur.value = this.maxblur; },
  },
  mounted() {
    if (!this.three.scene) {
      console.error('Missing Scene');
    }
    if (!this.three.camera) {
      console.error('Missing Camera');
    }
    const params = {
      focus: this.focus,
      aperture: this.aperture,
      maxblur: this.maxblur,
      width: this.three.size.width,
      height: this.three.size.height,
    };
    const pass = new BokehPass$1(this.three.scene, this.three.camera, params);
    this.completePass(pass);
  },
  __hmrId: 'BokehPass',
});

var FilmPass = defineComponent({
  extends: EffectPass,
  props: {
    noiseIntensity: { type: Number, default: 0.5 },
    scanlinesIntensity: { type: Number, default: 0.05 },
    scanlinesCount: { type: Number, default: 4096 },
    grayscale: { type: Number, default: 0 },
  },
  watch: {
    noiseIntensity() { this.pass.uniforms.nIntensity.value = this.noiseIntensity; },
    scanlinesIntensity() { this.pass.uniforms.sIntensity.value = this.scanlinesIntensity; },
    scanlinesCount() { this.pass.uniforms.sCount.value = this.scanlinesCount; },
    grayscale() { this.pass.uniforms.grayscale.value = this.grayscale; },
  },
  mounted() {
    const pass = new FilmPass$1(this.noiseIntensity, this.scanlinesIntensity, this.scanlinesCount, this.grayscale);
    this.completePass(pass);
  },
  __hmrId: 'FilmPass',
});

var FXAAPass = defineComponent({
  extends: EffectPass,
  mounted() {
    const pass = new ShaderPass(FXAAShader);
    this.completePass(pass);

    // resize will be called in three init
    this.three.onAfterResize(this.resize);
  },
  unmounted() {
    this.three.offAfterResize(this.resize);
  },
  methods: {
    resize() {
      const { resolution } = this.pass.material.uniforms;
      resolution.value.x = 1 / this.three.size.width;
      resolution.value.y = 1 / this.three.size.height;
    },
  },
  __hmrId: 'FXAAPass',
});

var HalftonePass = defineComponent({
  extends: EffectPass,
  props: {
    shape: { type: Number, default: 1 },
    radius: { type: Number, default: 4 },
    rotateR: { type: Number, default: Math.PI / 12 * 1 },
    rotateG: { type: Number, default: Math.PI / 12 * 2 },
    rotateB: { type: Number, default: Math.PI / 12 * 3 },
    scatter: { type: Number, default: 0 },
  },
  mounted() {
    const pass = new HalftonePass$1(this.three.size.width, this.three.size.height, {});

    ['shape', 'radius', 'rotateR', 'rotateG', 'rotateB', 'scatter'].forEach(p => {
      pass.uniforms[p].value = this[p];
      watch(() => this[p], () => {
        pass.uniforms[p].value = this[p];
      });
    });

    this.completePass(pass);
  },
  __hmrId: 'HalftonePass',
});

var SMAAPass = defineComponent({
  extends: EffectPass,
  mounted() {
    // three size is not set yet, but this pass will be resized by effect composer
    const pass = new SMAAPass$1(this.three.size.width, this.three.size.height);
    this.completePass(pass);
  },
  __hmrId: 'SMAAPass',
});

var SSAOPass = defineComponent({
  extends: EffectPass,
  props: {
    scene: null,
    camera: null,
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  mounted() {
    const pass = new SSAOPass$1(
      this.scene || this.three.scene,
      this.camera || this.three.camera,
      this.three.size.width,
      this.three.size.height
    );

    for (const key of Object.keys(this.options)) {
      pass[key] = this.options[key];
    }

    this.completePass(pass);
  },
  __hmrId: 'SSAOPass',
});

var DefaultShader = {
  uniforms: {},
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    void main() {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
  `,
};

// From https://github.com/evanw/glfx.js

var TiltShift = {
  uniforms: {
    tDiffuse: { value: null },
    blurRadius: { value: 0 },
    gradientRadius: { value: 0 },
    start: { value: new Vector2() },
    end: { value: new Vector2() },
    delta: { value: new Vector2() },
    texSize: { value: new Vector2() },
  },
  vertexShader: DefaultShader.vertexShader,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float blurRadius;
    uniform float gradientRadius;
    uniform vec2 start;
    uniform vec2 end;
    uniform vec2 delta;
    uniform vec2 texSize;
    varying vec2 vUv;

    float random(vec3 scale, float seed) {
      /* use the fragment position for a different seed per-pixel */
      return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
    }

    void main() {
      vec4 color = vec4(0.0);
      float total = 0.0;

      /* randomize the lookup values to hide the fixed number of samples */
      float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);

      vec2 normal = normalize(vec2(start.y - end.y, end.x - start.x));
      float radius = smoothstep(0.0, 1.0, abs(dot(vUv * texSize - start, normal)) / gradientRadius) * blurRadius;
      for (float t = -30.0; t <= 30.0; t++) {
          float percent = (t + offset - 0.5) / 30.0;
          float weight = 1.0 - abs(percent);
          vec4 texel = texture2D(tDiffuse, vUv + delta / texSize * percent * radius);
          // vec4 texel2 = texture2D(tDiffuse, vUv + vec2(-delta.y, delta.x) / texSize * percent * radius);

          /* switch to pre-multiplied alpha to correctly blur transparent images */
          texel.rgb *= texel.a;
          // texel2.rgb *= texel2.a;

          color += texel * weight;
          total += 2.0 * weight;
      }

      gl_FragColor = color / total;

      /* switch back from pre-multiplied alpha */
      gl_FragColor.rgb /= gl_FragColor.a + 0.00001;
    }
  `,
};

var TiltShiftPass = defineComponent({
  extends: EffectPass,
  props: {
    blurRadius: { type: Number, default: 10 },
    gradientRadius: { type: Number, default: 100 },
    start: { type: Object, default: { x: 0, y: 100 } },
    end: { type: Object, default: { x: 10, y: 100 } },
  },
  mounted() {
    this.pass = new ShaderPass(TiltShift);
    this.passes.push(this.pass);

    this.pass1 = new ShaderPass(TiltShift);
    this.passes.push(this.pass1);

    const uniforms = this.uniforms = this.pass.uniforms;
    const uniforms1 = this.uniforms1 = this.pass1.uniforms;
    uniforms1.blurRadius = uniforms.blurRadius;
    uniforms1.gradientRadius = uniforms.gradientRadius;
    uniforms1.start = uniforms.start;
    uniforms1.end = uniforms.end;
    uniforms1.texSize = uniforms.texSize;

    bindProp(this, 'blurRadius', uniforms.blurRadius, 'value');
    bindProp(this, 'gradientRadius', uniforms.gradientRadius, 'value');

    this.updateFocusLine();
    ['start', 'end'].forEach(p => {
      watch(() => this[p], this.updateFocusLine, { deep: true });
    });

    this.pass.setSize = (width, height) => {
      uniforms.texSize.value.set(width, height);
    };

    // emit ready event with two passes - do so manually in this file instead
    // of calling `completePass` like in other effect types
    this.$emit('ready', [this.pass, this.pass1]);
  },
  methods: {
    updateFocusLine() {
      this.uniforms.start.value.copy(this.start);
      this.uniforms.end.value.copy(this.end);
      const dv = new Vector2().copy(this.end).sub(this.start).normalize();
      this.uniforms.delta.value.copy(dv);
      this.uniforms1.delta.value.set(-dv.y, dv.x);
    },
  },
  __hmrId: 'TiltShiftPass',
});

var UnrealBloomPass = defineComponent({
  extends: EffectPass,
  props: {
    strength: { type: Number, default: 1.5 },
    radius: { type: Number, default: 0 },
    threshold: { type: Number, default: 0 },
  },
  watch: {
    strength() { this.pass.strength = this.strength; },
    radius() { this.pass.radius = this.radius; },
    threshold() { this.pass.threshold = this.threshold; },
  },
  mounted() {
    const size = new Vector2(this.three.size.width, this.three.size.height);
    const pass = new UnrealBloomPass$1(size, this.strength, this.radius, this.threshold);
    this.completePass(pass);
  },
  __hmrId: 'UnrealBloomPass',
});

// From https://github.com/evanw/glfx.js

var ZoomBlur = {
  uniforms: {
    tDiffuse: { value: null },
    center: { value: new Vector2(0.5, 0.5) },
    strength: { value: 0 },
  },
  vertexShader: DefaultShader.vertexShader,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 center;
    uniform float strength;
    varying vec2 vUv;

    float random(vec3 scale, float seed) {
      /* use the fragment position for a different seed per-pixel */
      return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
    }
    
    void main() {
      vec4 color = vec4(0.0);
      float total = 0.0;
      vec2 toCenter = center - vUv;
      
      /* randomize the lookup values to hide the fixed number of samples */
      float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);
      
      for (float t = 0.0; t <= 40.0; t++) {
        float percent = (t + offset) / 40.0;
        float weight = 4.0 * (percent - percent * percent);
        vec4 texel = texture2D(tDiffuse, vUv + toCenter * percent * strength);

        /* switch to pre-multiplied alpha to correctly blur transparent images */
        texel.rgb *= texel.a;

        color += texel * weight;
        total += weight;
      }

      gl_FragColor = color / total;

      /* switch back from pre-multiplied alpha */
      gl_FragColor.rgb /= gl_FragColor.a + 0.00001;
    }
  `,
};

var ZoomBlurPass = defineComponent({
  extends: EffectPass,
  props: {
    center: { type: Object, default: { x: 0.5, y: 0.5 } },
    strength: { type: Number, default: 0.5 },
  },
  mounted() {
    const pass = new ShaderPass(ZoomBlur);

    const uniforms = this.uniforms = pass.uniforms;
    bindProp(this, 'center', uniforms.center, 'value');
    bindProp(this, 'strength', uniforms.strength, 'value');

    this.completePass(pass);
  },
  __hmrId: 'ZoomBlurPass',
});

var TROIS = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Renderer: Renderer,
  OrthographicCamera: OrthographicCamera,
  PerspectiveCamera: PerspectiveCamera,
  Camera: PerspectiveCamera,
  Group: Group,
  Scene: Scene,
  Object3D: Object3D,
  Raycaster: Raycaster,
  BoxGeometry: BoxGeometry,
  CircleGeometry: CircleGeometry,
  ConeGeometry: ConeGeometry,
  CylinderGeometry: CylinderGeometry,
  DodecahedronGeometry: DodecahedronGeometry,
  IcosahedronGeometry: IcosahedronGeometry,
  LatheGeometry: LatheGeometry,
  OctahedronGeometry: OctahedronGeometry,
  PolyhedronGeometry: PolyhedronGeometry,
  RingGeometry: RingGeometry,
  SphereGeometry: SphereGeometry,
  TetrahedronGeometry: TetrahedronGeometry,
  TorusGeometry: TorusGeometry,
  TorusKnotGeometry: TorusKnotGeometry,
  TubeGeometry: TubeGeometry,
  AmbientLight: AmbientLight,
  DirectionalLight: DirectionalLight,
  HemisphereLight: HemisphereLight,
  PointLight: PointLight,
  RectAreaLight: RectAreaLight,
  SpotLight: SpotLight,
  BasicMaterial: BasicMaterial,
  LambertMaterial: LambertMaterial,
  MatcapMaterial: MatcapMaterial,
  PhongMaterial: PhongMaterial,
  PhysicalMaterial: PhysicalMaterial,
  ShaderMaterial: ShaderMaterial,
  StandardMaterial: StandardMaterial,
  SubSurfaceMaterial: SubSurfaceMaterial,
  ToonMaterial: ToonMaterial,
  Texture: Texture,
  CubeTexture: CubeTexture,
  Mesh: Mesh,
  Box: Box,
  Circle: Circle,
  Cone: Cone,
  Cylinder: Cylinder,
  Dodecahedron: Dodecahedron,
  Icosahedron: Icosahedron,
  Lathe: Lathe,
  Octahedron: Octahedron,
  Plane: Plane,
  Polyhedron: Polyhedron,
  Ring: Ring,
  Sphere: Sphere,
  Tetrahedron: Tetrahedron,
  Text: Text,
  Torus: Torus,
  TorusKnot: TorusKnot,
  Tube: Tube,
  Gem: Gem,
  Image: Image,
  InstancedMesh: InstancedMesh,
  MirrorMesh: MirrorMesh,
  RefractionMesh: RefractionMesh,
  Sprite: Sprite,
  GLTFModel: GLTF,
  FBXModel: FBX,
  EffectComposer: EffectComposer,
  RenderPass: RenderPass,
  BokehPass: BokehPass,
  FilmPass: FilmPass,
  FXAAPass: FXAAPass,
  HalftonePass: HalftonePass,
  SMAAPass: SMAAPass,
  SSAOPass: SSAOPass,
  TiltShiftPass: TiltShiftPass,
  UnrealBloomPass: UnrealBloomPass,
  ZoomBlurPass: ZoomBlurPass,
  setFromProp: setFromProp,
  bindProps: bindProps,
  bindProp: bindProp,
  propsValues: propsValues,
  lerp: lerp,
  lerpv2: lerpv2,
  lerpv3: lerpv3,
  limit: limit,
  getMatcapUrl: getMatcapUrl
});

const TroisJSVuePlugin = {
  install: (app) => {
    const comps = [
      'Camera',
      'OrthographicCamera',
      'PerspectiveCamera',
      'Raycaster',
      'Renderer',
      'Scene',
      'Group',

      'AmbientLight',
      'DirectionalLight',
      'HemisphereLight',
      'PointLight',
      'RectAreaLight',
      'SpotLight',

      'BasicMaterial',
      'LambertMaterial',
      'MatcapMaterial',
      'PhongMaterial',
      'PhysicalMaterial',
      'ShaderMaterial',
      'StandardMaterial',
      'SubSurfaceMaterial',
      'ToonMaterial',

      'Texture',
      'CubeTexture',

      'Mesh',

      'Box', 'BoxGeometry',
      'Circle', 'CircleGeometry',
      'Cone', 'ConeGeometry',
      'Cylinder', 'CylinderGeometry',
      'Dodecahedron', 'DodecahedronGeometry',
      'Icosahedron', 'IcosahedronGeometry',
      'Lathe', 'LatheGeometry',
      'Octahedron', 'OctahedronGeometry',
      'Plane',
      'Polyhedron', 'PolyhedronGeometry',
      'Ring', 'RingGeometry',
      'Sphere', 'SphereGeometry',
      'Tetrahedron', 'TetrahedronGeometry',
      'Text',
      'Torus', 'TorusGeometry',
      'TorusKnot', 'TorusKnotGeometry',
      'Tube', 'TubeGeometry',

      'Gem',
      'Image',
      'InstancedMesh',
      'MirrorMesh',
      'RefractionMesh',
      'Sprite',

      'FBXModel',
      'GLTFModel',

      'BokehPass',
      'EffectComposer',
      'FilmPass',
      'FXAAPass',
      'HalftonePass',
      'RenderPass',
      'SAOPass',
      'SMAAPass',
      'SSAOPass',
      'TiltShiftPass',
      'UnrealBloomPass',
      'ZoomBlurPass',

      'GLTFViewer',
    ];

    comps.forEach(comp => {
      app.component(comp, TROIS[comp]);
    });
  },
};

function createApp(params) {
  return createApp$1(params).use(TroisJSVuePlugin);
}

export { AmbientLight, BasicMaterial, BokehPass, Box, BoxGeometry, PerspectiveCamera as Camera, Circle, CircleGeometry, Cone, ConeGeometry, CubeTexture, Cylinder, CylinderGeometry, DirectionalLight, Dodecahedron, DodecahedronGeometry, EffectComposer, FBX as FBXModel, FXAAPass, FilmPass, GLTF as GLTFModel, Gem, Group, HalftonePass, HemisphereLight, Icosahedron, IcosahedronGeometry, Image, InstancedMesh, LambertMaterial, Lathe, LatheGeometry, MatcapMaterial, Mesh, MirrorMesh, Object3D, Octahedron, OctahedronGeometry, OrthographicCamera, PerspectiveCamera, PhongMaterial, PhysicalMaterial, Plane, PointLight, Polyhedron, PolyhedronGeometry, Raycaster, RectAreaLight, RefractionMesh, RenderPass, Renderer, Ring, RingGeometry, SMAAPass, SSAOPass, Scene, ShaderMaterial, Sphere, SphereGeometry, SpotLight, Sprite, StandardMaterial, SubSurfaceMaterial, Tetrahedron, TetrahedronGeometry, Text, Texture, TiltShiftPass, ToonMaterial, Torus, TorusGeometry, TorusKnot, TorusKnotGeometry, TroisJSVuePlugin, Tube, TubeGeometry, UnrealBloomPass, ZoomBlurPass, bindProp, bindProps, createApp, getMatcapUrl, lerp, lerpv2, lerpv3, limit, propsValues, setFromProp };
//# sourceMappingURL=trois.module.js.map
