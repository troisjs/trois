import { h, toRef, watch, createApp as createApp$1 } from 'https://unpkg.com/vue@3.0.7/dist/vue.esm-browser.prod.js';
import { Vector2, Vector3, Plane as Plane$1, Raycaster, WebGLRenderer, OrthographicCamera as OrthographicCamera$1, PerspectiveCamera as PerspectiveCamera$1, Group as Group$1, Scene as Scene$1, Color, BoxGeometry as BoxGeometry$1, CircleGeometry as CircleGeometry$1, ConeGeometry as ConeGeometry$1, CylinderGeometry as CylinderGeometry$1, DodecahedronGeometry as DodecahedronGeometry$1, IcosahedronGeometry as IcosahedronGeometry$1, LatheGeometry as LatheGeometry$1, OctahedronGeometry as OctahedronGeometry$1, PolyhedronGeometry as PolyhedronGeometry$1, RingGeometry as RingGeometry$1, SphereGeometry as SphereGeometry$1, TetrahedronGeometry as TetrahedronGeometry$1, TorusGeometry as TorusGeometry$1, TorusKnotGeometry as TorusKnotGeometry$1, Curve, TubeGeometry as TubeGeometry$1, AmbientLight as AmbientLight$1, DirectionalLight as DirectionalLight$1, HemisphereLight as HemisphereLight$1, PointLight as PointLight$1, RectAreaLight as RectAreaLight$1, SpotLight as SpotLight$1, FrontSide, MeshBasicMaterial, MeshLambertMaterial, TextureLoader, MeshMatcapMaterial, MeshPhongMaterial, MeshStandardMaterial, MeshPhysicalMaterial, ShaderChunk, UniformsUtils, ShaderLib, ShaderMaterial as ShaderMaterial$1, MeshToonMaterial, UVMapping, ClampToEdgeWrapping, LinearFilter, LinearMipmapLinearFilter, CubeTextureLoader, CubeRefractionMapping, Mesh as Mesh$1, BoxBufferGeometry, CircleBufferGeometry, ConeBufferGeometry, CylinderBufferGeometry, DodecahedronBufferGeometry, IcosahedronBufferGeometry, LatheBufferGeometry, OctahedronBufferGeometry, PlaneBufferGeometry, PolyhedronBufferGeometry, RingBufferGeometry, SphereBufferGeometry, TetrahedronBufferGeometry, FontLoader, TextBufferGeometry, TorusBufferGeometry, TorusKnotBufferGeometry, CatmullRomCurve3, WebGLCubeRenderTarget, RGBFormat, CubeCamera, BackSide, DoubleSide, InstancedMesh as InstancedMesh$1, SpriteMaterial, Sprite as Sprite$1 } from 'https://unpkg.com/three@0.125.2/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.125.2/examples/jsm/controls/OrbitControls.js';
import { RectAreaLightUniformsLib } from 'https://unpkg.com/three@0.125.2/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { RectAreaLightHelper } from 'https://unpkg.com/three@0.125.2/examples/jsm/helpers/RectAreaLightHelper.js';
import { EffectComposer as EffectComposer$1 } from 'https://unpkg.com/three@0.125.2/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass as RenderPass$1 } from 'https://unpkg.com/three@0.125.2/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass as BokehPass$1 } from 'https://unpkg.com/three@0.125.2/examples/jsm/postprocessing/BokehPass.js';
import { FilmPass as FilmPass$1 } from 'https://unpkg.com/three@0.125.2/examples/jsm/postprocessing/FilmPass.js';
import { ShaderPass } from 'https://unpkg.com/three@0.125.2/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'https://unpkg.com/three@0.125.2/examples/jsm/shaders/FXAAShader.js';
import { HalftonePass as HalftonePass$1 } from 'https://unpkg.com/three@0.125.2/examples/jsm/postprocessing/HalftonePass.js';
import { SMAAPass as SMAAPass$1 } from 'https://unpkg.com/three@0.125.2/examples/jsm/postprocessing/SMAAPass.js';
import { UnrealBloomPass as UnrealBloomPass$1 } from 'https://unpkg.com/three@0.125.2/examples/jsm/postprocessing/UnrealBloomPass.js';

/**
 * Three.js helper
 */
function useThree() {
  // default conf
  var conf = {
    canvas: null,
    antialias: true,
    alpha: false,
    autoClear: true,
    orbit_ctrl: false,
    mouse_move: false,
    mouse_raycast: false,
    mouse_over: false,
    click: false,
    resize: true,
    width: 0,
    height: 0,
  };

  // size
  var size = {
    width: 1, height: 1,
    wWidth: 1, wHeight: 1,
    ratio: 1,
  };

  // handlers
  var afterInitCallbacks = [];
  var afterResizeCallbacks = [];
  var beforeRenderCallbacks = [];

  // mouse tracking
  var mouse = new Vector2();
  var mouseV3 = new Vector3();
  var mousePlane = new Plane$1(new Vector3(0, 0, 1), 0);
  var raycaster = new Raycaster();

  // raycast objects
  var intersectObjects = [];

  // returned object
  var obj = {
    conf: conf,
    renderer: null,
    camera: null,
    cameraCtrl: null,
    materials: {},
    scene: null,
    size: size,
    mouse: mouse, mouseV3: mouseV3,
    init: init,
    dispose: dispose,
    render: render,
    renderC: renderC,
    setSize: setSize,
    onAfterInit: onAfterInit,
    onAfterResize: onAfterResize, offAfterResize: offAfterResize,
    onBeforeRender: onBeforeRender, offBeforeRender: offBeforeRender,
    addIntersectObject: addIntersectObject, removeIntersectObject: removeIntersectObject,
  };

  /**
   * init three
   */
  function init(params) {
    if (params) {
      Object.entries(params).forEach(function (ref) {
        var key = ref[0];
        var value = ref[1];

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

    if (conf.orbit_ctrl) {
      obj.orbitCtrl = new OrbitControls(obj.camera, obj.renderer.domElement);
      if (conf.orbit_ctrl instanceof Object) {
        Object.entries(conf.orbit_ctrl).forEach(function (ref) {
          var key = ref[0];
          var value = ref[1];

          obj.orbitCtrl[key] = value;
        });
      }
    }

    if (conf.resize) {
      onResize();
      window.addEventListener('resize', onResize);
    } else {
      setSize(conf.width | 300, conf.height | 150);
    }

    conf.mouse_move = conf.mouse_move || conf.mouse_over;
    if (conf.mouse_move) {
      if (conf.mouse_move === 'body') {
        obj.mouse_move_element = document.body;
      } else {
        obj.mouse_move_element = obj.renderer.domElement;
      }
      obj.mouse_move_element.addEventListener('mousemove', onMousemove);
      obj.mouse_move_element.addEventListener('mouseleave', onMouseleave);
    }

    if (conf.click) {
      obj.renderer.domElement.addEventListener('click', onClick);
    }

    afterInitCallbacks.forEach(function (c) { return c(); });

    return true;
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
    afterResizeCallbacks = afterResizeCallbacks.filter(function (c) { return c !== callback; });
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
    beforeRenderCallbacks = beforeRenderCallbacks.filter(function (c) { return c !== callback; });
  }

  /**
   * default render
   */
  function render() {
    if (obj.orbitCtrl) { obj.orbitCtrl.update(); }
    beforeRenderCallbacks.forEach(function (c) { return c(); });
    obj.renderer.render(obj.scene, obj.camera);
  }

  /**
   * composer render
   */
  function renderC() {
    if (obj.orbitCtrl) { obj.orbitCtrl.update(); }
    beforeRenderCallbacks.forEach(function (c) { return c(); });
    obj.composer.render();
  }

  /**
   * add intersect object
   */
  function addIntersectObject(o) {
    if (intersectObjects.indexOf(o) === -1) {
      intersectObjects.push(o);
    }
  }

  /**
   * remove intersect object
   */
  function removeIntersectObject(o) {
    var i = intersectObjects.indexOf(o);
    if (i !== -1) {
      intersectObjects.splice(i, 1);
    }
  }

  /**
   * remove listeners
   */
  function dispose() {
    beforeRenderCallbacks = [];
    window.removeEventListener('resize', onResize);
    if (obj.mouse_move_element) {
      obj.mouse_move_element.removeEventListener('mousemove', onMousemove);
      obj.mouse_move_element.removeEventListener('mouseleave', onMouseleave);
    }
    obj.renderer.domElement.removeEventListener('click', onClick);
    if (obj.orbitCtrl) { obj.orbitCtrl.dispose(); }
    this.renderer.dispose();
  }

  /**
   */
  function updateMouse(e) {
    var rect = e.target.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / size.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / size.height) * 2 + 1;
  }

  /**
   * click listener
   */
  function onClick(e) {
    updateMouse(e);
    raycaster.setFromCamera(mouse, obj.camera);
    var objects = raycaster.intersectObjects(intersectObjects);
    for (var i = 0; i < objects.length; i++) {
      var o = objects[i].object;
      if (o.onClick) { o.onClick(e); }
    }
  }

  /**
   * mousemove listener
   */
  function onMousemove(e) {
    updateMouse(e);
    onMousechange();
  }

  /**
   * mouseleave listener
   */
  function onMouseleave(e) {
    // mouse.x = 0;
    // mouse.y = 0;
    onMousechange();
  }

  /**
   * mouse change
   */
  function onMousechange(e) {
    if (conf.mouse_over || conf.mouse_raycast) {
      raycaster.setFromCamera(mouse, obj.camera);

      if (conf.mouse_raycast) {
        // get mouse 3d position
        obj.camera.getWorldDirection(mousePlane.normal);
        mousePlane.normal.normalize();
        raycaster.ray.intersectPlane(mousePlane, mouseV3);
      }

      if (conf.mouse_over) {
        var onObjects = raycaster.intersectObjects(intersectObjects);
        var offObjects = [].concat( intersectObjects );
        for (var i = 0; i < onObjects.length; i++) {
          var o = onObjects[i].object;
          if (!o.hover && o.onHover) {
            o.hover = true;
            o.onHover(true);
          }
          offObjects.splice(offObjects.indexOf(o), 1);
        }
        for (var i$1 = 0; i$1 < offObjects.length; i$1++) {
          var o$1 = offObjects[i$1];
          if (o$1.hover && o$1.onHover) {
            o$1.hover = false;
            o$1.onHover(false);
          }
        }
      }
    }
  }

  /**
   * resize listener
   */
  function onResize() {
    if (conf.resize === 'window') {
      setSize(window.innerWidth, window.innerHeight);
    } else {
      var elt = obj.renderer.domElement.parentNode;
      setSize(elt.clientWidth, elt.clientHeight);
    }
    afterResizeCallbacks.forEach(function (c) { return c(); });
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
      var wsize = getCameraSize();
      size.wWidth = wsize[0]; size.wHeight = wsize[1];
    }
  }

  /**
   * calculate camera visible area size
   */
  function getCameraSize() {
    var vFOV = (obj.camera.fov * Math.PI) / 180;
    var h = 2 * Math.tan(vFOV / 2) * Math.abs(obj.camera.position.z);
    var w = h * obj.camera.aspect;
    return [w, h];
  }

  return obj;
}

var Renderer = {
  name: 'Renderer',
  props: {
    antialias: Boolean,
    alpha: Boolean,
    autoClear: { type: Boolean, default: true },
    mouseMove: { type: [Boolean, String], default: false },
    mouseRaycast: { type: Boolean, default: false },
    mouseOver: { type: Boolean, default: false },
    click: { type: Boolean, default: false },
    orbitCtrl: { type: [Boolean, Object], default: false },
    resize: { type: [Boolean, String], default: false },
    shadow: Boolean,
    width: String,
    height: String,
  },
  setup: function setup() {
    return {
      three: useThree(),
      raf: true,
      onMountedCallbacks: [],
    };
  },
  provide: function provide() {
    return {
      three: this.three,
      // renderer: this.three.renderer,
      rendererComponent: this,
    };
  },
  mounted: function mounted() {
    var params = {
      canvas: this.$el,
      antialias: this.antialias,
      alpha: this.alpha,
      autoClear: this.autoClear,
      orbit_ctrl: this.orbitCtrl,
      mouse_move: this.mouseMove,
      mouse_raycast: this.mouseRaycast,
      mouse_over: this.mouseOver,
      click: this.click,
      resize: this.resize,
      width: this.width,
      height: this.height,
    };

    if (this.three.init(params)) {
      this.renderer = this.three.renderer;
      this.renderer.shadowMap.enabled = this.shadow;
      if (this.three.composer) { this.animateC(); }
      else { this.animate(); }
    }
    this.onMountedCallbacks.forEach(function (c) { return c(); });
  },
  beforeUnmount: function beforeUnmount() {
    this.raf = false;
    this.three.dispose();
  },
  methods: {
    onMounted: function onMounted(callback) {
      this.onMountedCallbacks.push(callback);
    },
    onBeforeRender: function onBeforeRender(callback) {
      this.three.onBeforeRender(callback);
    },
    onAfterResize: function onAfterResize(callback) {
      this.three.onAfterResize(callback);
    },
    animate: function animate() {
      if (this.raf) { requestAnimationFrame(this.animate); }
      this.three.render();
    },
    animateC: function animateC() {
      if (this.raf) { requestAnimationFrame(this.animateC); }
      this.three.renderC();
    },
  },
  render: function render() {
    return h('canvas', {}, this.$slots.default());
  },
  __hmrId: 'Renderer',
};

function setFromProp(o, prop) {
  if (prop instanceof Object) {
    Object.entries(prop).forEach(function (ref) {
      var key = ref[0];
      var value = ref[1];

      o[key] = value;
    });
  }
}
function bindProp(src, srcProp, dst, dstProp) {
  if (!dstProp) { dstProp = srcProp; }
  var ref = toRef(src, srcProp);
  if (ref.value instanceof Object) {
    setFromProp(dst[dstProp], ref.value);
    watch(ref, function (value) { setFromProp(dst[dstProp], value); }, { deep: true });
  } else {
    if (ref.value) { dst[dstProp] = src[srcProp]; }
    watch(ref, function (value) { dst[dstProp] = value; });
  }
}
function propsValues(props, exclude) {
  var values = {};
  Object.entries(props).forEach(function (ref) {
    var key = ref[0];
    var value = ref[1];

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
var MATCAP_ROOT = 'https://rawcdn.githack.com/emmelleppi/matcaps/9b36ccaaf0a24881a39062d05566c9e92be4aa0d';

function getMatcapUrl(hash, format) {
  if ( format === void 0 ) format = 1024;

  var fileName = "" + hash + (getMatcapFormatString(format)) + ".png";
  return (MATCAP_ROOT + "/" + format + "/" + fileName);
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

var OrthographicCamera = {
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
  created: function created() {
    var this$1 = this;

    this.camera = new OrthographicCamera$1(this.left, this.right, this.top, this.bottom, this.near, this.far);
    bindProp(this, 'position', this.camera);

    ['left', 'right', 'top', 'bottom', 'near', 'far', 'zoom'].forEach(function (p) {
      watch(function () { return this$1[p]; }, function () {
        this$1.camera[p] = this$1[p];
        this$1.camera.updateProjectionMatrix();
      });
    });

    this.three.camera = this.camera;
  },
  render: function render() { return []; },
  __hmrId: 'OrthographicCamera',
};

var PerspectiveCamera = {
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
  created: function created() {
    var this$1 = this;

    this.camera = new PerspectiveCamera$1(this.fov, this.aspect, this.near, this.far);
    bindProp(this, 'position', this.camera);

    if (this.lookAt) { this.camera.lookAt(this.lookAt.x, this.lookAt.y, this.lookAt.z); }
    watch(function () { return this$1.lookAt; }, function (v) { this$1.camera.lookAt(v.x, v.y, v.z); }, { deep: true });

    ['aspect', 'far', 'fov', 'near'].forEach(function (p) {
      watch(function () { return this$1[p]; }, function () {
        this$1.camera[p] = this$1[p];
        this$1.camera.updateProjectionMatrix();
      });
    });

    this.three.camera = this.camera;
  },
  render: function render() { return []; },
  __hmrId: 'PerspectiveCamera',
};

var Object3D = {
  name: 'Object3D',
  inject: ['three', 'scene', 'rendererComponent'],
  props: {
    position: { type: Object, default: { x: 0, y: 0, z: 0 } },
    rotation: { type: Object, default: { x: 0, y: 0, z: 0 } },
    scale: { type: Object, default: { x: 1, y: 1, z: 1 } },
    lookAt: { type: Object, default: null },
  },
  // can't use setup because it will not be used in sub components
  // setup() {},
  unmounted: function unmounted() {
    if (this.$parent.remove) { this.$parent.remove(this.o3d); }
  },
  methods: {
    initObject3D: function initObject3D(o3d) {
      var this$1 = this;

      this.o3d = o3d;

      bindProp(this, 'position', this.o3d);
      bindProp(this, 'rotation', this.o3d);
      bindProp(this, 'scale', this.o3d);

      // fix lookat.x
      if (this.lookAt) { this.o3d.lookAt(this.lookAt.x, this.lookAt.y, this.lookAt.z); }
      watch(function () { return this$1.lookAt; }, function (v) { this$1.o3d.lookAt(v.x, v.y, v.z); }, { deep: true });

      if (this.$parent.add) { this.$parent.add(this.o3d); }
    },
    add: function add(o) { this.o3d.add(o); },
    remove: function remove(o) { this.o3d.remove(o); },
  },
  render: function render() {
    return this.$slots.default ? this.$slots.default() : [];
  },
  __hmrId: 'Object3D',
};

var Group = {
  name: 'Group',
  extends: Object3D,
  created: function created() {
    this.group = new Group$1();
    this.initObject3D(this.group);
  },
  __hmrId: 'Group',
};

var Scene = {
  name: 'Scene',
  inject: ['three'],
  props: {
    id: String,
    background: [String, Number],
  },
  setup: function setup(props) {
    var scene = new Scene$1();
    if (props.background) { scene.background = new Color(props.background); }
    watch(function () { return props.background; }, function (value) { scene.background = new Color(value); });
    return { scene: scene };
  },
  provide: function provide() {
    return {
      scene: this.scene,
    };
  },
  mounted: function mounted() {
    if (!this.three.scene) {
      this.three.scene = this.scene;
    }
  },
  methods: {
    add: function add(o) { this.scene.add(o); },
    remove: function remove(o) { this.scene.remove(o); },
  },
  render: function render() {
    return this.$slots.default ? this.$slots.default() : [];
  },
  __hmrId: 'Scene',
};

var Geometry = {
  inject: ['mesh'],
  props: {
    rotateX: Number,
    rotateY: Number,
    rotateZ: Number,
  },
  created: function created() {
    var this$1 = this;

    if (!this.mesh) {
      console.error('Missing parent Mesh');
    }

    this.watchProps = [];
    Object.entries(this.$props).forEach(function (e) { return this$1.watchProps.push(e[0]); });

    this.createGeometry();
    this.rotateGeometry();
    this.mesh.setGeometry(this.geometry);

    this.addWatchers();
  },
  unmounted: function unmounted() {
    this.geometry.dispose();
  },
  methods: {
    addWatchers: function addWatchers() {
      var this$1 = this;

      this.watchProps.forEach(function (prop) {
        watch(function () { return this$1[prop]; }, function () {
          this$1.refreshGeometry();
        });
      });
    },
    rotateGeometry: function rotateGeometry() {
      if (this.rotateX) { this.geometry.rotateX(this.rotateX); }
      if (this.rotateY) { this.geometry.rotateY(this.rotateY); }
      if (this.rotateZ) { this.geometry.rotateZ(this.rotateZ); }
    },
    refreshGeometry: function refreshGeometry() {
      var oldGeo = this.geometry;
      this.createGeometry();
      this.rotateGeometry();
      this.mesh.setGeometry(this.geometry);
      oldGeo.dispose();
    },
  },
  render: function render() { return []; },
};

var BoxGeometry = {
  extends: Geometry,
  props: {
    size: Number,
    width: { type: Number, default: 1 },
    height: { type: Number, default: 1 },
    depth: { type: Number, default: 1 },
    widthSegments: { type: Number, default: 1 },
    heightSegments: { type: Number, default: 1 },
    depthSegments: { type: Number, default: 1 },
  },
  methods: {
    createGeometry: function createGeometry() {
      var w = this.width, h = this.height, d = this.depth;
      if (this.size) {
        w = this.size; h = this.size; d = this.size;
      }
      this.geometry = new BoxGeometry$1(w, h, d, this.widthSegments, this.heightSegments, this.depthSegments);
    },
  },
};

var CircleGeometry = {
  extends: Geometry,
  props: {
    radius: { type: Number, default: 1 },
    segments: { type: Number, default: 8 },
    thetaStart: { type: Number, default: 0 },
    thetaLength: { type: Number, default: Math.PI * 2 },
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new CircleGeometry$1(this.radius, this.segments, this.thetaStart, this.thetaLength);
    },
  },
};

var ConeGeometry = {
  extends: Geometry,
  props: {
    radius: { type: Number, default: 1 },
    height: { type: Number, default: 1 },
    radialSegments: { type: Number, default: 8 },
    heightSegments: { type: Number, default: 1 },
    openEnded: { type: Boolean, default: false },
    thetaStart: { type: Number, default: 0 },
    thetaLength: { type: Number, default: Math.PI * 2 },
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new ConeGeometry$1(this.radius, this.height, this.radialSegments, this.heightSegments, this.openEnded, this.thetaStart, this.thetaLength);
    },
  },
};

var CylinderGeometry = {
  extends: Geometry,
  props: {
    radiusTop: { type: Number, default: 1 },
    radiusBottom: { type: Number, default: 1 },
    height: { type: Number, default: 1 },
    radialSegments: { type: Number, default: 8 },
    heightSegments: { type: Number, default: 1 },
    openEnded: { type: Boolean, default: false },
    thetaStart: { type: Number, default: 0 },
    thetaLength: { type: Number, default: Math.PI * 2 },
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new CylinderGeometry$1(this.radiusTop, this.radiusBottom, this.height, this.radialSegments, this.heightSegments, this.openEnded, this.thetaStart, this.thetaLength);
    },
  },
};

var DodecahedronGeometry = {
  extends: Geometry,
  props: {
    radius: { type: Number, default: 1 },
    detail: { type: Number, default: 0 },
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new DodecahedronGeometry$1(this.radius, this.detail);
    },
  },
};

var IcosahedronGeometry = {
  extends: Geometry,
  props: {
    radius: { type: Number, default: 1 },
    detail: { type: Number, default: 0 },
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new IcosahedronGeometry$1(this.radius, this.detail);
    },
  },
};

var LatheGeometry = {
  extends: Geometry,
  props: {
    points: Array,
    segments: { type: Number, default: 12 },
    phiStart: { type: Number, default: 0 },
    phiLength: { type: Number, default: Math.PI * 2 },
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new LatheGeometry$1(this.points, this.segments, this.phiStart, this.phiLength);
    },
  },
};

var OctahedronGeometry = {
  extends: Geometry,
  props: {
    radius: { type: Number, default: 1 },
    detail: { type: Number, default: 0 },
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new OctahedronGeometry$1(this.radius, this.detail);
    },
  },
};

var PolyhedronGeometry = {
  extends: Geometry,
  props: {
    vertices: Array,
    indices: Array,
    radius: { type: Number, default: 1 },
    detail: { type: Number, default: 0 },
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new PolyhedronGeometry$1(this.vertices, this.indices, this.radius, this.detail);
    },
  },
};

var RingGeometry = {
  extends: Geometry,
  props: {
    innerRadius: { type: Number, default: 0.5 },
    outerRadius: { type: Number, default: 1 },
    thetaSegments: { type: Number, default: 8 },
    phiSegments: { type: Number, default: 1 },
    thetaStart: { type: Number, default: 0 },
    thetaLength: { type: Number, default: Math.PI * 2 },
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new RingGeometry$1(this.innerRadius, this.outerRadius, this.thetaSegments, this.phiSegments, this.thetaStart, this.thetaLength);
    },
  },
};

var SphereGeometry = {
  extends: Geometry,
  props: {
    radius: { type: Number, default: 1 },
    widthSegments: { type: Number, default: 12 },
    heightSegments: { type: Number, default: 12 },
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new SphereGeometry$1(this.radius, this.widthSegments, this.heightSegments);
    },
  },
};

var TetrahedronGeometry = {
  extends: Geometry,
  props: {
    radius: { type: Number, default: 1 },
    detail: { type: Number, default: 0 },
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new TetrahedronGeometry$1(this.radius, this.detail);
    },
  },
};

var TorusGeometry = {
  extends: Geometry,
  props: {
    radius: { type: Number, default: 1 },
    tube: { type: Number, default: 0.4 },
    radialSegments: { type: Number, default: 8 },
    tubularSegments: { type: Number, default: 6 },
    arc: { type: Number, default: Math.PI * 2 },
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new TorusGeometry$1(this.radius, this.tube, this.radialSegments, this.tubularSegments, this.arc);
    },
  },
};

var TorusKnotGeometry = {
  extends: Geometry,
  props: {
    radius: { type: Number, default: 1 },
    tube: { type: Number, default: 0.4 },
    radialSegments: { type: Number, default: 64 },
    tubularSegments: { type: Number, default: 8 },
    p: { type: Number, default: 2 },
    q: { type: Number, default: 3 },
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new TorusKnotGeometry$1(this.radius, this.tube, this.radialSegments, this.tubularSegments, this.p, this.q);
    },
  },
};

var TubeGeometry = {
  extends: Geometry,
  props: {
    path: Curve,
    tubularSegments: { type: Number, default: 64 },
    radius: { type: Number, default: 1 },
    radiusSegments: { type: Number, default: 8 },
    closed: { type: Boolean, default: false },
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new TubeGeometry$1(this.path, this.tubularSegments, this.radius, this.radiusSegments, this.closed);
    },
  },
};

var Light = {
  extends: Object3D,
  name: 'Light',
  props: {
    color: { type: String, default: '#ffffff' },
    intensity: { type: Number, default: 1 },
    castShadow: { type: Boolean, default: false },
    shadowMapSize: { type: Object, default: { x: 512, y: 512 } },
  },
  // can't use setup because it will not be used in sub components
  // setup() {},
  unmounted: function unmounted() {
    if (this.light.target) { this.$parent.remove(this.light.target); }
  },
  methods: {
    initLight: function initLight() {
      var this$1 = this;

      if (this.light.target) {
        bindProp(this, 'target', this.light.target, 'position');
      }

      if (this.light.shadow) {
        this.light.castShadow = this.castShadow;
        setFromProp(this.light.shadow.mapSize, this.shadowMapSize);
      }

      ['color', 'intensity', 'castShadow'].forEach(function (p) {
        watch(function () { return this$1[p]; }, function () {
          if (p === 'color') {
            this$1.light.color = new Color(this$1.color);
          } else {
            this$1.light[p] = this$1[p];
          }
        });
      });

      this.initObject3D(this.light);
      if (this.light.target) { this.$parent.add(this.light.target); }
    },
  },
  __hmrId: 'Light',
};

var AmbientLight = {
  extends: Light,
  created: function created() {
    this.light = new AmbientLight$1(this.color, this.intensity);
    this.initLight();
  },
  __hmrId: 'AmbientLight',
};

var DirectionalLight = {
  extends: Light,
  props: {
    target: Object,
  },
  created: function created() {
    this.light = new DirectionalLight$1(this.color, this.intensity);
    this.initLight();
  },
  __hmrId: 'DirectionalLight',
};

var HemisphereLight = {
  extends: Light,
  props: {
    groundColor: { type: String, default: '#ffffff' },
  },
  created: function created() {
    this.light = new HemisphereLight$1(this.color, this.groundColor, this.intensity);
    bindProp(this, 'groundColor', this.light);
    this.initLight();
  },
  __hmrId: 'HemisphereLight',
};

var PointLight = {
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
  created: function created() {
    this.light = new PointLight$1(this.color, this.intensity, this.distance, this.decay);
    this.initLight();
  },
  __hmrId: 'PointLight',
};

var RectAreaLight = {
  extends: Light,
  props: {
    width: { type: Number, default: 10 },
    height: { type: Number, default: 10 },
    helper: Boolean,
  },
  created: function created() {
    var this$1 = this;

    RectAreaLightUniformsLib.init();
    this.light = new RectAreaLight$1(this.color, this.intensity, this.width, this.height);

    ['width', 'height'].forEach(function (p) {
      watch(function () { return this$1[p]; }, function () {
        this$1.light[p] = this$1[p];
      });
    });

    if (this.helper) {
      this.lightHelper = new RectAreaLightHelper(this.light);
      this.$parent.add(this.lightHelper);
    }

    this.initLight();
  },
  unmounted: function unmounted() {
    if (this.lightHelper) { this.$parent.remove(this.lightHelper); }
  },
  __hmrId: 'RectAreaLight',
};

var SpotLight = {
  extends: Light,
  props: {
    angle: { type: Number, default: Math.PI / 3 },
    decay: { type: Number, default: 1 },
    distance: { type: Number, default: 0 },
    penumbra: { type: Number, default: 0 },
    target: Object,
  },
  created: function created() {
    var this$1 = this;

    this.light = new SpotLight$1(this.color, this.intensity, this.distance, this.angle, this.penumbra, this.decay);
    ['angle', 'decay', 'distance', 'penumbra'].forEach(function (p) {
      watch(function () { return this$1[p]; }, function () {
        this$1.light[p] = this$1[p];
      });
    });
    this.initLight();
  },
  __hmrId: 'SpotLight',
};

var Material = {
  inject: ['three', 'mesh'],
  props: {
    color: { type: [String, Number], default: '#ffffff' },
    depthTest: { type: Boolean, default: true },
    depthWrite: { type: Boolean, default: true },
    flatShading: Boolean,
    fog: { type: Boolean, default: true },
    opacity: { type: Number, default: 1 },
    side: { type: Number, default: FrontSide },
    transparent: Boolean,
    vertexColors: Boolean,
  },
  provide: function provide() {
    return {
      material: this,
    };
  },
  created: function created() {
    this.createMaterial();
    this.mesh.setMaterial(this.material);

    this._addWatchers();
    if (this.addWatchers) { this.addWatchers(); }
  },
  unmounted: function unmounted() {
    this.material.dispose();
  },
  methods: {
    setProp: function setProp(key, value, needsUpdate) {
      if ( needsUpdate === void 0 ) needsUpdate = false;

      this.material[key] = value;
      this.material.needsUpdate = needsUpdate;
    },
    setTexture: function setTexture(texture, key) {
      if ( key === void 0 ) key = 'map';

      this.setProp(key, texture, true);
    },
    _addWatchers: function _addWatchers() {
      var this$1 = this;

      // don't work for flatShading
      ['color', 'depthTest', 'depthWrite', 'fog', 'opacity', 'side', 'transparent'].forEach(function (p) {
        watch(function () { return this$1[p]; }, function () {
          if (p === 'color') {
            this$1.material.color.set(this$1.color);
          } else {
            this$1.material[p] = this$1[p];
          }
        });
      });
    },
  },
  render: function render() {
    return this.$slots.default ? this.$slots.default() : [];
  },
  __hmrId: 'Material',
};

var BasicMaterial = {
  extends: Material,
  methods: {
    createMaterial: function createMaterial() {
      this.material = new MeshBasicMaterial(propsValues(this.$props));
    },
  },
  __hmrId: 'BasicMaterial',
};

var LambertMaterial = {
  extends: Material,
  methods: {
    createMaterial: function createMaterial() {
      this.material = new MeshLambertMaterial(propsValues(this.$props));
    },
  },
  __hmrId: 'LambertMaterial',
};

var MatcapMaterial = {
  extends: Material,
  props: {
    src: String,
    name: String,
  },
  methods: {
    createMaterial: function createMaterial() {
      var src = this.name ? getMatcapUrl(this.name) : this.src;
      var opts = propsValues(this.$props, ['src', 'name']);
      opts.matcap = new TextureLoader().load(src);
      this.material = new MeshMatcapMaterial(opts);
    },
  },
  __hmrId: 'MatcapMaterial',
};

var PhongMaterial = {
  extends: Material,
  props: {
    emissive: { type: [Number, String], default: 0 },
    emissiveIntensity: { type: Number, default: 1 },
    reflectivity: { type: Number, default: 1 },
    shininess: { type: Number, default: 30 },
    specular: { type: [String, Number], default: 0x111111 },
  },
  methods: {
    createMaterial: function createMaterial() {
      this.material = new MeshPhongMaterial(propsValues(this.$props));
    },
    addWatchers: function addWatchers() {
      var this$1 = this;

      ['emissive', 'emissiveIntensity', 'reflectivity', 'shininess', 'specular'].forEach(function (p) {
        watch(function () { return this$1[p]; }, function (value) {
          if (p === 'emissive' || p === 'specular') {
            this$1.material[p].set(value);
          } else {
            this$1.material[p] = value;
          }
        });
      });
    },
  },
  __hmrId: 'PhongMaterial',
};

var props = {
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
  wireframe: Boolean,
};

var StandardMaterial = {
  extends: Material,
  props: props,
  methods: {
    createMaterial: function createMaterial() {
      this.material = new MeshStandardMaterial(propsValues(this.$props, ['normalScale']));
    },
    addWatchers: function addWatchers() {
      var this$1 = this;

      // todo : use setProp ?
      Object.keys(props).forEach(function (p) {
        if (p === 'normalScale') { return; }
        watch(function () { return this$1[p]; }, function (value) {
          if (p === 'emissive') {
            this$1.material[p].set(value);
          } else {
            this$1.material[p] = value;
          }
        });
      });
      bindProp(this, 'normalScale', this.material);
    },
  },
  __hmrId: 'StandardMaterial',
};

var PhysicalMaterial = {
  extends: StandardMaterial,
  methods: {
    createMaterial: function createMaterial() {
      this.material = new MeshPhysicalMaterial(propsValues(this.$props));
    },
  },
  __hmrId: 'PhysicalMaterial',
};

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

var meshphongFragHead = ShaderChunk.meshphong_frag.slice(0, ShaderChunk.meshphong_frag.indexOf('void main() {'));
var meshphongFragBody = ShaderChunk.meshphong_frag.slice(ShaderChunk.meshphong_frag.indexOf('void main() {'));

var SubsurfaceScatteringShader = {

  uniforms: UniformsUtils.merge([
    ShaderLib.phong.uniforms,
    {
      thicknessColor: { value: new Color(0x668597) },
      thicknessDistortion: { value: 0.1 },
      thicknessAmbient: { value: 0.0 },
      thicknessAttenuation: { value: 0.1 },
      thicknessPower: { value: 2.0 },
      thicknessScale: { value: 10.0 },
    } ]),

  vertexShader: ("\n    #define USE_UV\n    " + (ShaderChunk.meshphong_vert) + "\n  "),

  fragmentShader: "\n    #define USE_UV\n    #define SUBSURFACE\n\n    " + meshphongFragHead + "\n\n    uniform float thicknessPower;\n    uniform float thicknessScale;\n    uniform float thicknessDistortion;\n    uniform float thicknessAmbient;\n    uniform float thicknessAttenuation;\n    uniform vec3 thicknessColor;\n\n    void RE_Direct_Scattering(const in IncidentLight directLight, const in vec2 uv, const in GeometricContext geometry, inout ReflectedLight reflectedLight) {\n      #ifdef USE_COLOR\n        vec3 thickness = vColor * thicknessColor;\n      #else\n        vec3 thickness = thicknessColor;\n      #endif\n      vec3 scatteringHalf = normalize(directLight.direction + (geometry.normal * thicknessDistortion));\n      float scatteringDot = pow(saturate(dot(geometry.viewDir, -scatteringHalf)), thicknessPower) * thicknessScale;\n      vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * thickness;\n      reflectedLight.directDiffuse += scatteringIllu * thicknessAttenuation * directLight.color;\n    }\n  " + meshphongFragBody.replace(
    '#include <lights_fragment_begin>',
    replaceAll(
      ShaderChunk.lights_fragment_begin,
      'RE_Direct( directLight, geometry, material, reflectedLight );',
      "\n        RE_Direct( directLight, geometry, material, reflectedLight );\n        #if defined( SUBSURFACE ) && defined( USE_UV )\n          RE_Direct_Scattering(directLight, vUv, geometry, reflectedLight);\n        #endif\n      "
    )
  ),
};

var ShaderMaterial = {
  inject: ['three', 'mesh'],
  props: {
    uniforms: Object,
    vertexShader: String,
    fragmentShader: String,
  },
  created: function created() {
    this.createMaterial();
    this.mesh.setMaterial(this.material);
    if (this.addWatchers) { this.addWatchers(); }
  },
  unmounted: function unmounted() {
    this.material.dispose();
  },
  render: function render() {
    return [];
  },
  __hmrId: 'ShaderMaterial',
};

var SubSurfaceMaterial = {
  extends: ShaderMaterial,
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
  methods: {
    createMaterial: function createMaterial() {
      var params = SubsurfaceScatteringShader;
      var uniforms = UniformsUtils.clone(params.uniforms);

      Object.entries(this.$props).forEach(function (ref) {
        var key = ref[0];
        var value = ref[1];

        var _key = key, _value = value;
        if (['color', 'thicknessColor'].includes(key)) {
          if (key === 'color') { _key = 'diffuse'; }
          _value = new Color(value);
        }
        if (!['transparent', 'vertexColors'].includes(key)) {
          uniforms[_key].value = _value;
        }
      });

      this.material = new ShaderMaterial$1(Object.assign({}, params,
        {uniforms: uniforms,
        lights: true,
        transparent: this.transparent,
        vertexColors: this.vertexColors}));
    },
  },
  __hmrId: 'SubSurfaceMaterial',
};

var ToonMaterial = {
  extends: Material,
  methods: {
    createMaterial: function createMaterial() {
      this.material = new MeshToonMaterial(propsValues(this.$props));
    },
  },
  __hmrId: 'ToonMaterial',
};

var Texture = {
  inject: ['material'],
  emits: ['loaded'],
  props: {
    id: { type: String, default: 'map' },
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
  created: function created() {
    var this$1 = this;

    this.refreshTexture();
    watch(function () { return this$1.src; }, this.refreshTexture);
  },
  unmounted: function unmounted() {
    this.material.setTexture(null, this.id);
    this.texture.dispose();
  },
  methods: {
    createTexture: function createTexture() {
      var this$1 = this;

      this.texture = new TextureLoader().load(this.src, this.onLoaded, this.onProgress, this.onError);
      var wathProps = ['mapping', 'wrapS', 'wrapT', 'magFilter', 'minFilter', 'repeat', 'rotation', 'rotation', 'center'];
      wathProps.forEach(function (prop) {
        bindProp(this$1, prop, this$1.texture);
      });
    },
    refreshTexture: function refreshTexture() {
      this.createTexture();
      this.material.setTexture(this.texture, this.id);
    },
    onLoaded: function onLoaded() {
      if (this.onLoad) { this.onLoad(); }
      this.$emit('loaded');
    },
  },
  render: function render() { return []; },
};

var CubeTexture = {
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
    id: { type: String, default: 'envMap' },
    refraction: Boolean,
    // todo: remove ?
    refractionRatio: { type: Number, default: 0.98 },
  },
  created: function created() {
    var this$1 = this;

    this.refreshTexture();
    watch(function () { return this$1.path; }, this.refreshTexture);
    watch(function () { return this$1.urls; }, this.refreshTexture);
  },
  unmounted: function unmounted() {
    this.material.setTexture(null, this.id);
    this.texture.dispose();
  },
  methods: {
    createTexture: function createTexture() {
      this.texture = new CubeTextureLoader()
        .setPath(this.path)
        .load(this.urls, this.onLoaded, this.onProgress, this.onError);
    },
    refreshTexture: function refreshTexture() {
      this.createTexture();
      this.material.setTexture(this.texture, this.id);
      if (this.refraction) {
        this.texture.mapping = CubeRefractionMapping;
        this.material.setProp('refractionRatio', this.refractionRatio);
      }
    },
    onLoaded: function onLoaded() {
      if (this.onLoad) { this.onLoad(); }
      this.$emit('loaded');
    },
  },
  render: function render() {
    return [];
  },
};

var Mesh = {
  extends: Object3D,
  name: 'Mesh',
  props: {
    castShadow: Boolean,
    receiveShadow: Boolean,
    onHover: Function,
    onClick: Function,
  },
  // can't use setup because it will not be used in sub components
  // setup() {},
  provide: function provide() {
    return {
      mesh: this,
    };
  },
  mounted: function mounted() {
    if (!this.mesh && !this.loading) { this.initMesh(); }
  },
  methods: {
    initMesh: function initMesh() {
      var this$1 = this;

      this.mesh = new Mesh$1(this.geometry, this.material);

      ['castShadow', 'receiveShadow'].forEach(function (p) {
        this$1.mesh[p] = this$1[p];
        watch(function () { return this$1[p]; }, function () { this$1.mesh[p] = this$1[p]; });
      });

      if (this.onHover) {
        this.mesh.onHover = function (over) { this$1.onHover({ component: this$1, over: over }); };
        this.three.addIntersectObject(this.mesh);
      }

      if (this.onClick) {
        this.mesh.onClick = function (e) { this$1.onClick({ component: this$1, event: e }); };
        this.three.addIntersectObject(this.mesh);
      }

      this.initObject3D(this.mesh);
    },
    setGeometry: function setGeometry(geometry) {
      this.geometry = geometry;
      if (this.mesh) { this.mesh.geometry = geometry; }
    },
    setMaterial: function setMaterial(material) {
      this.material = material;
      if (this.mesh) { this.mesh.material = material; }
    },
    refreshGeometry: function refreshGeometry() {
      var oldGeo = this.geometry;
      this.createGeometry();
      this.mesh.geometry = this.geometry;
      oldGeo.dispose();
    },
  },
  unmounted: function unmounted() {
    if (this.mesh) {
      this.three.removeIntersectObject(this.mesh);
    }
    // for predefined mesh (geometry and material are not unmounted)
    if (this.geometry) { this.geometry.dispose(); }
    if (this.material) { this.material.dispose(); }
  },
  __hmrId: 'Mesh',
};

var Box = {
  extends: Mesh,
  props: {
    size: Number,
    width: { type: Number, default: 1 },
    height: { type: Number, default: 1 },
    depth: { type: Number, default: 1 },
    widthSegments: { type: Number, default: 1 },
    heightSegments: { type: Number, default: 1 },
    depthSegments: { type: Number, default: 1 },
  },
  created: function created() {
    var this$1 = this;

    this.createGeometry();

    ['size', 'width', 'height', 'depth', 'widthSegments', 'heightSegments', 'depthSegments'].forEach(function (prop) {
      watch(function () { return this$1[prop]; }, function () {
        this$1.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry: function createGeometry() {
      if (this.size) {
        this.geometry = new BoxBufferGeometry(this.size, this.size, this.size);
      } else {
        this.geometry = new BoxBufferGeometry(this.width, this.height, this.depth);
      }
    },
  },
  __hmrId: 'Box',
};

var Circle = {
  extends: Mesh,
  props: {
    radius: { type: Number, default: 1 },
    segments: { type: Number, default: 8 },
    thetaStart: { type: Number, default: 0 },
    thetaLength: { type: Number, default: Math.PI * 2 },
  },
  created: function created() {
    var this$1 = this;

    this.createGeometry();

    var watchProps = ['radius', 'segments', 'thetaStart', 'thetaLength'];
    watchProps.forEach(function (prop) {
      watch(function () { return this$1[prop]; }, function () {
        this$1.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new CircleBufferGeometry(this.radius, this.segments, this.thetaStart, this.thetaLength);
    },
  },
  __hmrId: 'Circle',
};

var Cone = {
  extends: Mesh,
  props: {
    radius: { type: Number, default: 1 },
    height: { type: Number, default: 1 },
    radialSegments: { type: Number, default: 8 },
    heightSegments: { type: Number, default: 1 },
    openEnded: { type: Boolean, default: false },
    thetaStart: { type: Number, default: 0 },
    thetaLength: { type: Number, default: Math.PI * 2 },
  },
  created: function created() {
    var this$1 = this;

    this.createGeometry();

    var watchProps = ['radius', 'height', 'radialSegments', 'heightSegments', 'openEnded', 'thetaStart', 'thetaLength'];
    watchProps.forEach(function (prop) {
      watch(function () { return this$1[prop]; }, function () {
        this$1.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new ConeBufferGeometry(this.radius, this.height, this.radialSegments, this.heightSegments, this.openEnded, this.thetaStart, this.thetaLength);
    },
  },
  __hmrId: 'Cone',
};

var Cylinder = {
  extends: Mesh,
  props: {
    radiusTop: { type: Number, default: 1 },
    radiusBottom: { type: Number, default: 1 },
    height: { type: Number, default: 1 },
    radialSegments: { type: Number, default: 8 },
    heightSegments: { type: Number, default: 1 },
    openEnded: { type: Boolean, default: false },
    thetaStart: { type: Number, default: 0 },
    thetaLength: { type: Number, default: Math.PI * 2 },
  },
  created: function created() {
    var this$1 = this;

    this.createGeometry();

    var watchProps = ['radiusTop', 'radiusBottom', 'height', 'radialSegments', 'heightSegments', 'openEnded', 'thetaStart', 'thetaLength'];
    watchProps.forEach(function (prop) {
      watch(function () { return this$1[prop]; }, function () {
        this$1.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new CylinderBufferGeometry(this.radiusTop, this.radiusBottom, this.height, this.radialSegments, this.heightSegments, this.openEnded, this.thetaStart, this.thetaLength);
    },
  },
  __hmrId: 'Cylinder',
};

var Dodecahedron = {
  extends: Mesh,
  props: {
    radius: { type: Number, default: 1 },
    detail: { type: Number, default: 0 },
  },
  created: function created() {
    var this$1 = this;

    this.createGeometry();

    var watchProps = ['radius', 'detail'];
    watchProps.forEach(function (prop) {
      watch(function () { return this$1[prop]; }, function () {
        this$1.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new DodecahedronBufferGeometry(this.radius, this.detail);
    },
  },
  __hmrId: 'Dodecahedron',
};

var Icosahedron = {
  extends: Mesh,
  props: {
    radius: { type: Number, default: 1 },
    detail: { type: Number, default: 0 },
  },
  created: function created() {
    var this$1 = this;

    this.createGeometry();

    var watchProps = ['radius', 'detail'];
    watchProps.forEach(function (prop) {
      watch(function () { return this$1[prop]; }, function () {
        this$1.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new IcosahedronBufferGeometry(this.radius, this.detail);
    },
  },
  __hmrId: 'Icosahedron',
};

var Lathe = {
  extends: Mesh,
  props: {
    points: Array,
    segments: { type: Number, default: 12 },
    phiStart: { type: Number, default: 0 },
    phiLength: { type: Number, default: Math.PI * 2 },
  },
  created: function created() {
    var this$1 = this;

    this.createGeometry();

    var watchProps = ['points', 'segments', 'phiStart', 'phiLength'];
    watchProps.forEach(function (prop) {
      watch(function () { return this$1[prop]; }, function () {
        this$1.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new LatheBufferGeometry(this.points, this.segments, this.phiStart, this.phiLength);
    },
  },
  __hmrId: 'Lathe',
};

var Octahedron = {
  extends: Mesh,
  props: {
    radius: { type: Number, default: 1 },
    detail: { type: Number, default: 0 },
  },
  created: function created() {
    var this$1 = this;

    this.createGeometry();

    var watchProps = ['radius', 'detail'];
    watchProps.forEach(function (prop) {
      watch(function () { return this$1[prop]; }, function () {
        this$1.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new OctahedronBufferGeometry(this.radius, this.detail);
    },
  },
  __hmrId: 'Octahedron',
};

var Plane = {
  extends: Mesh,
  props: {
    width: { type: Number, default: 1 },
    height: { type: Number, default: 1 },
    widthSegments: { type: Number, default: 1 },
    heightSegments: { type: Number, default: 1 },
  },
  created: function created() {
    var this$1 = this;

    this.createGeometry();

    var watchProps = ['width', 'height', 'widthSegments', 'heightSegments'];
    watchProps.forEach(function (prop) {
      watch(function () { return this$1[prop]; }, function () {
        this$1.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new PlaneBufferGeometry(this.width, this.height, this.widthSegments, this.heightSegments);
    },
  },
  __hmrId: 'Plane',
};

var Polyhedron = {
  extends: Mesh,
  props: {
    vertices: Array,
    indices: Array,
    radius: { type: Number, default: 1 },
    detail: { type: Number, default: 0 },
  },
  created: function created() {
    var this$1 = this;

    this.createGeometry();

    var watchProps = ['vertices', 'indices', 'radius', 'detail'];
    watchProps.forEach(function (prop) {
      watch(function () { return this$1[prop]; }, function () {
        this$1.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new PolyhedronBufferGeometry(this.vertices, this.indices, this.radius, this.detail);
    },
  },
  __hmrId: 'Polyhedron',
};

var Ring = {
  extends: Mesh,
  props: {
    innerRadius: { type: Number, default: 0.5 },
    outerRadius: { type: Number, default: 1 },
    thetaSegments: { type: Number, default: 8 },
    phiSegments: { type: Number, default: 1 },
    thetaStart: { type: Number, default: 0 },
    thetaLength: { type: Number, default: Math.PI * 2 },
  },
  created: function created() {
    var this$1 = this;

    this.createGeometry();

    var watchProps = ['innerRadius', 'outerRadius', 'thetaSegments', 'phiSegments', 'thetaStart', 'thetaLength'];
    watchProps.forEach(function (prop) {
      watch(function () { return this$1[prop]; }, function () {
        this$1.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new RingBufferGeometry(this.innerRadius, this.outerRadius, this.thetaSegments, this.phiSegments, this.thetaStart, this.thetaLength);
    },
  },
  __hmrId: 'Ring',
};

var Sphere = {
  extends: Mesh,
  props: {
    radius: Number,
    widthSegments: { type: Number, default: 12 },
    heightSegments: { type: Number, default: 12 },
  },
  watch: {
    radius: function radius() { this.refreshGeometry(); },
    widthSegments: function widthSegments() { this.refreshGeometry(); },
    heightSegments: function heightSegments() { this.refreshGeometry(); },
  },
  created: function created() {
    this.createGeometry();
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new SphereBufferGeometry(this.radius, this.widthSegments, this.heightSegments);
    },
  },
  __hmrId: 'Sphere',
};

var Tetrahedron = {
  extends: Mesh,
  props: {
    radius: { type: Number, default: 1 },
    detail: { type: Number, default: 0 },
  },
  created: function created() {
    var this$1 = this;

    this.createGeometry();

    var watchProps = ['radius', 'detail'];
    watchProps.forEach(function (prop) {
      watch(function () { return this$1[prop]; }, function () {
        this$1.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new TetrahedronBufferGeometry(this.radius, this.detail);
    },
  },
  __hmrId: 'Tetrahedron',
};

var TextProps = {
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

var Text = {
  extends: Mesh,
  props: Object.assign({}, TextProps),
  data: function data() {
    return {
      loading: true,
    };
  },
  created: function created() {
    var this$1 = this;

    // add watchers
    var watchProps = [
      'text', 'size', 'height', 'curveSegments',
      'bevelEnabled', 'bevelThickness', 'bevelSize', 'bevelOffset', 'bevelSegments',
      'align' ];
    watchProps.forEach(function (p) {
      watch(function () { return this$1[p]; }, function () {
        if (this$1.font) { this$1.refreshGeometry(); }
      });
    });

    var loader = new FontLoader();
    loader.load(this.fontSrc, function (font) {
      this$1.loading = false;
      this$1.font = font;
      this$1.createGeometry();
      this$1.initMesh();
    });
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new TextBufferGeometry(this.text, {
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
};

var Torus = {
  extends: Mesh,
  props: {
    radius: { type: Number, default: 0.5 },
    tube: { type: Number, default: 0.4 },
    radialSegments: { type: Number, default: 8 },
    tubularSegments: { type: Number, default: 6 },
    arc: { type: Number, default: Math.PI * 2 },
  },
  created: function created() {
    var this$1 = this;

    this.createGeometry();

    var watchProps = ['radius', 'tube', 'radialSegments', 'tubularSegments', 'arc'];
    watchProps.forEach(function (prop) {
      watch(function () { return this$1[prop]; }, function () {
        this$1.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new TorusBufferGeometry(this.radius, this.tube, this.radialSegments, this.tubularSegments, this.arc);
    },
  },
  __hmrId: 'Torus',
};

var TorusKnot = {
  extends: Mesh,
  props: {
    radius: { type: Number, default: 0.5 },
    tube: { type: Number, default: 0.4 },
    tubularSegments: { type: Number, default: 64 },
    radialSegments: { type: Number, default: 8 },
    p: { type: Number, default: 2 },
    q: { type: Number, default: 3 },
  },
  created: function created() {
    var this$1 = this;

    this.createGeometry();

    var watchProps = ['radius', 'tube', 'radialSegments', 'tubularSegments', 'p', 'q'];
    watchProps.forEach(function (prop) {
      watch(function () { return this$1[prop]; }, function () {
        this$1.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new TorusKnotBufferGeometry(this.radius, this.tube, this.tubularSegments, this.radialSegments, this.p, this.q);
    },
  },
  __hmrId: 'TorusKnot',
};

var Tube = {
  extends: Mesh,
  props: {
    path: Curve,
    points: Array,
    tubularSegments: { type: Number, default: 64 },
    radius: { type: Number, default: 1 },
    radialSegments: { type: Number, default: 8 },
    closed: { type: Boolean, default: false },
  },
  created: function created() {
    var this$1 = this;

    this.createGeometry();
    var watchProps = ['tubularSegments', 'radius', 'radialSegments', 'closed'];
    watchProps.forEach(function (prop) {
      watch(function () { return this$1[prop]; }, function (v) {
        this$1.refreshGeometry();
      });
    });
    // watch(() => this.points, () => {
    //   this.updatePoints();
    // });
  },
  methods: {
    createGeometry: function createGeometry() {
      var curve;
      if (this.points) {
        curve = new CatmullRomCurve3(this.points);
      } else if (this.path) {
        curve = this.path;
      } else {
        console.error('Missing path curve or points.');
      }
      this.geometry = new TubeGeometry$1(curve, this.tubularSegments, this.radius, this.radialSegments, this.closed);
    },
    updateCurve: function updateCurve() {
      updateTubeGeometryPoints(this.geometry, this.points);
    },
  },
  __hmrId: 'Tube',
};

function updateTubeGeometryPoints(tube, points) {
  var curve = new CatmullRomCurve3(points);
  var ref = tube.parameters;
  var radialSegments = ref.radialSegments;
  var radius = ref.radius;
  var tubularSegments = ref.tubularSegments;
  var closed = ref.closed;
  var frames = curve.computeFrenetFrames(tubularSegments, closed);
  tube.tangents = frames.tangents;
  tube.normals = frames.normals;
  tube.binormals = frames.binormals;
  tube.parameters.path = curve;

  var pArray = tube.attributes.position.array;
  var nArray = tube.attributes.normal.array;
  var normal = new Vector3();
  var P;

  for (var i = 0; i < tubularSegments; i++) {
    updateSegment(i);
  }
  updateSegment(tubularSegments);

  tube.attributes.position.needsUpdate = true;
  tube.attributes.normal.needsUpdate = true;

  function updateSegment(i) {
    P = curve.getPointAt(i / tubularSegments, P);
    var N = frames.normals[i];
    var B = frames.binormals[i];
    for (var j = 0; j <= radialSegments; j++) {
      var v = j / radialSegments * Math.PI * 2;
      var sin = Math.sin(v);
      var cos = -Math.cos(v);
      normal.x = (cos * N.x + sin * B.x);
      normal.y = (cos * N.y + sin * B.y);
      normal.z = (cos * N.z + sin * B.z);
      normal.normalize();
      var index = (i * (radialSegments + 1) + j) * 3;
      nArray[index] = normal.x;
      nArray[index + 1] = normal.y;
      nArray[index + 2] = normal.z;
      pArray[index] = P.x + radius * normal.x;
      pArray[index + 1] = P.y + radius * normal.y;
      pArray[index + 2] = P.z + radius * normal.z;
    }
  }
}

var Gem = {
  extends: Mesh,
  props: {
    cubeRTSize: { type: Number, default: 256 },
    cubeCameraNear: { type: Number, default: 0.1 },
    cubeCameraFar: { type: Number, default: 2000 },
    autoUpdate: Boolean,
  },
  mounted: function mounted() {
    this.initGem();
    if (this.autoUpdate) { this.three.onBeforeRender(this.updateCubeRT); }
    else { this.rendererComponent.onMounted(this.updateCubeRT); }
  },
  unmounted: function unmounted() {
    this.three.offBeforeRender(this.updateCubeRT);
    if (this.meshBack) { this.$parent.remove(this.meshBack); }
    if (this.materialBack) { this.materialBack.dispose(); }
  },
  methods: {
    initGem: function initGem() {
      var cubeRT = new WebGLCubeRenderTarget(this.cubeRTSize, { format: RGBFormat, generateMipmaps: true, minFilter: LinearMipmapLinearFilter });
      this.cubeCamera = new CubeCamera(this.cubeCameraNear, this.cubeCameraFar, cubeRT);
      bindProp(this, 'position', this.cubeCamera);
      this.$parent.add(this.cubeCamera);

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
      this.$parent.add(this.meshBack);
    },
    updateCubeRT: function updateCubeRT() {
      this.mesh.visible = false;
      this.meshBack.visible = false;
      this.cubeCamera.update(this.three.renderer, this.scene);
      this.mesh.visible = true;
      this.meshBack.visible = true;
    },
  },
  __hmrId: 'Gem',
};

var Image = {
  emits: ['loaded'],
  extends: Mesh,
  props: {
    src: String,
    width: Number,
    height: Number,
    keepSize: Boolean,
  },
  created: function created() {
    var this$1 = this;

    this.createGeometry();
    this.createMaterial();
    this.initMesh();

    watch(function () { return this$1.src; }, this.refreshTexture);

    ['width', 'height'].forEach(function (p) {
      watch(function () { return this$1[p]; }, this$1.resize);
    });

    if (this.keepSize) { this.three.onAfterResize(this.resize); }
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new PlaneBufferGeometry(1, 1, 1, 1);
    },
    createMaterial: function createMaterial() {
      this.material = new MeshBasicMaterial({ side: DoubleSide, map: this.loadTexture() });
    },
    loadTexture: function loadTexture() {
      return new TextureLoader().load(this.src, this.onLoaded);
    },
    refreshTexture: function refreshTexture() {
      if (this.texture) { this.texture.dispose(); }
      this.material.map = this.loadTexture();
      this.material.needsUpdate = true;
    },
    onLoaded: function onLoaded(texture) {
      this.texture = texture;
      this.resize();
      this.$emit('loaded');
    },
    resize: function resize() {
      if (!this.texture) { return; }
      var screen = this.three.size;
      var iW = this.texture.image.width;
      var iH = this.texture.image.height;
      var iRatio = iW / iH;
      var w, h;
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
};

var InstancedMesh = {
  extends: Object3D,
  props: {
    castShadow: Boolean,
    receiveShadow: Boolean,
    count: Number,
  },
  provide: function provide() {
    return {
      mesh: this,
    };
  },
  beforeMount: function beforeMount() {
    if (!this.$slots.default) {
      console.error('Missing Geometry');
    }
  },
  created: function created() {
    this.initMesh();
  },
  methods: {
    initMesh: function initMesh() {
      var this$1 = this;

      this.mesh = new InstancedMesh$1(this.geometry, this.material, this.count);

      ['castShadow', 'receiveShadow'].forEach(function (p) {
        this$1.mesh[p] = this$1[p];
        watch(function () { return this$1[p]; }, function () { this$1.mesh[p] = this$1[p]; });
      });

      this.initObject3D(this.mesh);
    },
    setGeometry: function setGeometry(geometry) {
      this.geometry = geometry;
      if (this.mesh) { this.mesh.geometry = geometry; }
    },
    setMaterial: function setMaterial(material) {
      this.material = material;
      if (this.mesh) { this.mesh.material = material; }
    },
  },
  __hmrId: 'InstancedMesh',
};

var MirrorMesh = {
  extends: Mesh,
  props: {
    cubeRTSize: { type: Number, default: 256 },
    cubeCameraNear: { type: Number, default: 0.1 },
    cubeCameraFar: { type: Number, default: 2000 },
    autoUpdate: Boolean,
  },
  mounted: function mounted() {
    this.initMirrorMesh();
    if (this.autoUpdate) { this.three.onBeforeRender(this.updateCubeRT); }
    else { this.rendererComponent.onMounted(this.updateCubeRT); }
  },
  unmounted: function unmounted() {
    this.three.offBeforeRender(this.updateCubeRT);
    if (this.cubeCamera) { this.$parent.remove(this.cubeCamera); }
  },
  methods: {
    initMirrorMesh: function initMirrorMesh() {
      var cubeRT = new WebGLCubeRenderTarget(this.cubeRTSize, { format: RGBFormat, generateMipmaps: true, minFilter: LinearMipmapLinearFilter });
      this.cubeCamera = new CubeCamera(this.cubeCameraNear, this.cubeCameraFar, cubeRT);
      this.$parent.add(this.cubeCamera);

      this.material.envMap = cubeRT.texture;
      this.material.needsUpdate = true;
    },
    updateCubeRT: function updateCubeRT() {
      this.mesh.visible = false;
      this.cubeCamera.update(this.three.renderer, this.scene);
      this.mesh.visible = true;
    },
  },
  __hmrId: 'MirrorMesh',
};

var RefractionMesh = {
  extends: Mesh,
  props: {
    cubeRTSize: { type: Number, default: 256 },
    cubeCameraNear: { type: Number, default: 0.1 },
    cubeCameraFar: { type: Number, default: 2000 },
    refractionRatio: { type: Number, default: 0.98 },
    autoUpdate: Boolean,
  },
  mounted: function mounted() {
    this.initMirrorMesh();
    if (this.autoUpdate) { this.three.onBeforeRender(this.updateCubeRT); }
    else { this.rendererComponent.onMounted(this.updateCubeRT); }
  },
  unmounted: function unmounted() {
    this.three.offBeforeRender(this.updateCubeRT);
    if (this.cubeCamera) { this.$parent.remove(this.cubeCamera); }
  },
  methods: {
    initMirrorMesh: function initMirrorMesh() {
      var cubeRT = new WebGLCubeRenderTarget(this.cubeRTSize, { mapping: CubeRefractionMapping, format: RGBFormat, generateMipmaps: true, minFilter: LinearMipmapLinearFilter });
      this.cubeCamera = new CubeCamera(this.cubeCameraNear, this.cubeCameraFar, cubeRT);
      bindProp(this, 'position', this.cubeCamera);
      this.$parent.add(this.cubeCamera);

      this.material.envMap = cubeRT.texture;
      this.material.refractionRatio = this.refractionRatio;
      this.material.needsUpdate = true;
    },
    updateCubeRT: function updateCubeRT() {
      this.mesh.visible = false;
      this.cubeCamera.update(this.three.renderer, this.scene);
      this.mesh.visible = true;
    },
  },
  __hmrId: 'RefractionMesh',
};

var Sprite = {
  extends: Object3D,
  emits: ['loaded'],
  props: {
    src: String,
  },
  data: function data() {
    return {
      loading: true,
    };
  },
  created: function created() {
    this.texture = new TextureLoader().load(this.src, this.onLoaded);
    this.material = new SpriteMaterial({ map: this.texture });
    this.sprite = new Sprite$1(this.material);
    this.geometry = this.sprite.geometry;
    this.initObject3D(this.sprite);
  },
  unmounted: function unmounted() {
    this.texture.dispose();
    this.material.dispose();
  },
  methods: {
    onLoaded: function onLoaded() {
      this.loading = false;
      this.updateUV();
      this.$emit('loaded');
    },
    updateUV: function updateUV() {
      this.iWidth = this.texture.image.width;
      this.iHeight = this.texture.image.height;
      this.iRatio = this.iWidth / this.iHeight;

      var x = 0.5, y = 0.5;
      if (this.iRatio > 1) {
        y = 0.5 / this.iRatio;
      } else {
        x = 0.5 / this.iRatio;
      }

      var positions = this.geometry.attributes.position.array;
      positions[0] = -x; positions[1] = -y;
      positions[5] = x; positions[6] = -y;
      positions[10] = x; positions[11] = y;
      positions[15] = -x; positions[16] = y;
      this.geometry.attributes.position.needsUpdate = true;
    },
  },
  __hmrId: 'Sprite',
};

var EffectComposer = {
  setup: function setup() {
    return {
      passes: [],
    };
  },
  inject: ['three'],
  provide: function provide() {
    return {
      passes: this.passes,
    };
  },
  mounted: function mounted() {
    var this$1 = this;

    this.three.onAfterInit(function () {
      this$1.composer = new EffectComposer$1(this$1.three.renderer);
      this$1.three.renderer.autoClear = false;
      this$1.passes.forEach(function (pass) {
        this$1.composer.addPass(pass);
      });
      this$1.three.composer = this$1.composer;

      this$1.resize();
      this$1.three.onAfterResize(this$1.resize);
    });
  },
  unmounted: function unmounted() {
    this.three.offAfterResize(this.resize);
  },
  methods: {
    resize: function resize() {
      this.composer.setSize(this.three.size.width, this.three.size.height);
    },
  },
  render: function render() {
    return this.$slots.default();
  },
  __hmrId: 'EffectComposer',
};

var EffectPass = {
  inject: ['three', 'passes'],
  beforeMount: function beforeMount() {
    if (!this.passes) {
      console.error('Missing parent EffectComposer');
    }
  },
  unmounted: function unmounted() {
    if (this.pass.dispose) { this.pass.dispose(); }
  },
  render: function render() {
    return [];
  },
  __hmrId: 'EffectPass',
};

var RenderPass = {
  extends: EffectPass,
  mounted: function mounted() {
    if (!this.three.scene) {
      console.error('Missing Scene');
    }
    if (!this.three.camera) {
      console.error('Missing Camera');
    }
    var pass = new RenderPass$1(this.three.scene, this.three.camera);
    this.passes.push(pass);
    this.pass = pass;
  },
  __hmrId: 'RenderPass',
};

var BokehPass = {
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
    focus: function focus() { this.pass.uniforms.focus.value = this.focus; },
    aperture: function aperture() { this.pass.uniforms.aperture.value = this.aperture; },
    maxblur: function maxblur() { this.pass.uniforms.maxblur.value = this.maxblur; },
  },
  mounted: function mounted() {
    if (!this.three.scene) {
      console.error('Missing Scene');
    }
    if (!this.three.camera) {
      console.error('Missing Camera');
    }
    var params = {
      focus: this.focus,
      aperture: this.aperture,
      maxblur: this.maxblur,
      width: this.three.size.width,
      height: this.three.size.height,
    };
    var pass = new BokehPass$1(this.three.scene, this.three.camera, params);
    this.passes.push(pass);
    this.pass = pass;
  },
  __hmrId: 'BokehPass',
};

var FilmPass = {
  extends: EffectPass,
  props: {
    noiseIntensity: {
      type: Number,
      default: 0.5,
    },
    scanlinesIntensity: {
      type: Number,
      default: 0.05,
    },
    scanlinesCount: {
      type: Number,
      default: 4096,
    },
    grayscale: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    noiseIntensity: function noiseIntensity() { this.pass.uniforms.nIntensity.value = this.noiseIntensity; },
    scanlinesIntensity: function scanlinesIntensity() { this.pass.uniforms.sIntensity.value = this.scanlinesIntensity; },
    scanlinesCount: function scanlinesCount() { this.pass.uniforms.sCount.value = this.scanlinesCount; },
    grayscale: function grayscale() { this.pass.uniforms.grayscale.value = this.grayscale; },
  },
  mounted: function mounted() {
    var pass = new FilmPass$1(this.noiseIntensity, this.scanlinesIntensity, this.scanlinesCount, this.grayscale);
    this.passes.push(pass);
    this.pass = pass;
  },
  __hmrId: 'FilmPass',
};

var FXAAPass = {
  extends: EffectPass,
  mounted: function mounted() {
    var pass = new ShaderPass(FXAAShader);
    this.passes.push(pass);
    this.pass = pass;

    // resize will be called in three init
    this.three.onAfterResize(this.resize);
  },
  unmounted: function unmounted() {
    this.three.offAfterResize(this.resize);
  },
  methods: {
    resize: function resize() {
      var ref = this.pass.material.uniforms;
      var resolution = ref.resolution;
      resolution.value.x = 1 / this.three.size.width;
      resolution.value.y = 1 / this.three.size.height;
    },
  },
  __hmrId: 'FXAAPass',
};

var HalftonePass = {
  extends: EffectPass,
  props: {
    shape: { type: Number, default: 1 },
    radius: { type: Number, default: 4 },
    rotateR: { type: Number, default: Math.PI / 12 * 1 },
    rotateG: { type: Number, default: Math.PI / 12 * 2 },
    rotateB: { type: Number, default: Math.PI / 12 * 3 },
    scatter: { type: Number, default: 0 },
  },
  mounted: function mounted() {
    var this$1 = this;

    var pass = new HalftonePass$1(this.three.size.width, this.three.size.height, {});

    ['shape', 'radius', 'rotateR', 'rotateG', 'rotateB', 'scatter'].forEach(function (p) {
      pass.uniforms[p].value = this$1[p];
      watch(function () { return this$1[p]; }, function () {
        pass.uniforms[p].value = this$1[p];
      });
    });

    this.passes.push(pass);
    this.pass = pass;
  },
  __hmrId: 'HalftonePass',
};

var SMAAPass = {
  extends: EffectPass,
  mounted: function mounted() {
    // three size is not set yet, but this pass will be resized by effect composer
    var pass = new SMAAPass$1(this.three.size.width, this.three.size.height);
    this.passes.push(pass);
    this.pass = pass;
  },
  __hmrId: 'SMAAPass',
};

var DefaultShader = {
  uniforms: {},
  vertexShader: "\n    varying vec2 vUv;\n    void main() {\n      vUv = uv;\n      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    }\n  ",
  fragmentShader: "\n    varying vec2 vUv;\n    void main() {\n      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n    }\n  ",
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
  fragmentShader: "\n    uniform sampler2D tDiffuse;\n    uniform float blurRadius;\n    uniform float gradientRadius;\n    uniform vec2 start;\n    uniform vec2 end;\n    uniform vec2 delta;\n    uniform vec2 texSize;\n    varying vec2 vUv;\n\n    float random(vec3 scale, float seed) {\n      /* use the fragment position for a different seed per-pixel */\n      return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n    }\n\n    void main() {\n      vec4 color = vec4(0.0);\n      float total = 0.0;\n\n      /* randomize the lookup values to hide the fixed number of samples */\n      float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n\n      vec2 normal = normalize(vec2(start.y - end.y, end.x - start.x));\n      float radius = smoothstep(0.0, 1.0, abs(dot(vUv * texSize - start, normal)) / gradientRadius) * blurRadius;\n      for (float t = -30.0; t <= 30.0; t++) {\n          float percent = (t + offset - 0.5) / 30.0;\n          float weight = 1.0 - abs(percent);\n          vec4 texel = texture2D(tDiffuse, vUv + delta / texSize * percent * radius);\n          // vec4 texel2 = texture2D(tDiffuse, vUv + vec2(-delta.y, delta.x) / texSize * percent * radius);\n\n          /* switch to pre-multiplied alpha to correctly blur transparent images */\n          texel.rgb *= texel.a;\n          // texel2.rgb *= texel2.a;\n\n          color += texel * weight;\n          total += 2.0 * weight;\n      }\n\n      gl_FragColor = color / total;\n\n      /* switch back from pre-multiplied alpha */\n      gl_FragColor.rgb /= gl_FragColor.a + 0.00001;\n    }\n  ",
};

var TiltShiftPass = {
  extends: EffectPass,
  props: {
    blurRadius: { type: Number, default: 10 },
    gradientRadius: { type: Number, default: 100 },
    start: { type: Object, default: { x: 0, y: 100 } },
    end: { type: Object, default: { x: 10, y: 100 } },
  },
  mounted: function mounted() {
    var this$1 = this;

    this.pass = new ShaderPass(TiltShift);
    this.passes.push(this.pass);

    this.pass1 = new ShaderPass(TiltShift);
    this.passes.push(this.pass1);

    var uniforms = this.uniforms = this.pass.uniforms;
    var uniforms1 = this.uniforms1 = this.pass1.uniforms;
    uniforms1.blurRadius = uniforms.blurRadius;
    uniforms1.gradientRadius = uniforms.gradientRadius;
    uniforms1.start = uniforms.start;
    uniforms1.end = uniforms.end;
    uniforms1.texSize = uniforms.texSize;

    bindProp(this, 'blurRadius', uniforms.blurRadius, 'value');
    bindProp(this, 'gradientRadius', uniforms.gradientRadius, 'value');

    this.updateFocusLine();
    ['start', 'end'].forEach(function (p) {
      watch(function () { return this$1[p]; }, this$1.updateFocusLine, { deep: true });
    });

    this.pass.setSize = function (width, height) {
      uniforms.texSize.value.set(width, height);
    };
  },
  methods: {
    updateFocusLine: function updateFocusLine() {
      this.uniforms.start.value.copy(this.start);
      this.uniforms.end.value.copy(this.end);
      var dv = new Vector2().copy(this.end).sub(this.start).normalize();
      this.uniforms.delta.value.copy(dv);
      this.uniforms1.delta.value.set(-dv.y, dv.x);
    },
  },
  __hmrId: 'TiltShiftPass',
};

var UnrealBloomPass = {
  extends: EffectPass,
  props: {
    strength: { type: Number, default: 1.5 },
    radius: { type: Number, default: 0 },
    threshold: { type: Number, default: 0 },
  },
  watch: {
    strength: function strength() { this.pass.strength = this.strength; },
    radius: function radius() { this.pass.radius = this.radius; },
    threshold: function threshold() { this.pass.threshold = this.threshold; },
  },
  mounted: function mounted() {
    var size = new Vector2(this.three.size.width, this.three.size.height);
    var pass = new UnrealBloomPass$1(size, this.strength, this.radius, this.threshold);
    this.passes.push(pass);
    this.pass = pass;
  },
  __hmrId: 'UnrealBloomPass',
};

// From https://github.com/evanw/glfx.js

var ZoomBlur = {
  uniforms: {
    tDiffuse: { value: null },
    center: { value: new Vector2(0.5, 0.5) },
    strength: { value: 0 },
  },
  vertexShader: DefaultShader.vertexShader,
  fragmentShader: "\n    uniform sampler2D tDiffuse;\n    uniform vec2 center;\n    uniform float strength;\n    varying vec2 vUv;\n\n    float random(vec3 scale, float seed) {\n      /* use the fragment position for a different seed per-pixel */\n      return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n    }\n    \n    void main() {\n      vec4 color = vec4(0.0);\n      float total = 0.0;\n      vec2 toCenter = center - vUv;\n      \n      /* randomize the lookup values to hide the fixed number of samples */\n      float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n      \n      for (float t = 0.0; t <= 40.0; t++) {\n        float percent = (t + offset) / 40.0;\n        float weight = 4.0 * (percent - percent * percent);\n        vec4 texel = texture2D(tDiffuse, vUv + toCenter * percent * strength);\n\n        /* switch to pre-multiplied alpha to correctly blur transparent images */\n        texel.rgb *= texel.a;\n\n        color += texel * weight;\n        total += weight;\n      }\n\n      gl_FragColor = color / total;\n\n      /* switch back from pre-multiplied alpha */\n      gl_FragColor.rgb /= gl_FragColor.a + 0.00001;\n    }\n  ",
};

var ZoomBlurPass = {
  extends: EffectPass,
  props: {
    center: { type: Object, default: { x: 0.5, y: 0.5 } },
    strength: { type: Number, default: 0.5 },
  },
  mounted: function mounted() {
    this.pass = new ShaderPass(ZoomBlur);
    this.passes.push(this.pass);

    var uniforms = this.uniforms = this.pass.uniforms;
    bindProp(this, 'center', uniforms.center, 'value');
    bindProp(this, 'strength', uniforms.strength, 'value');
  },
  __hmrId: 'ZoomBlurPass',
};

var TROIS = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Renderer: Renderer,
  OrthographicCamera: OrthographicCamera,
  PerspectiveCamera: PerspectiveCamera,
  Camera: PerspectiveCamera,
  Group: Group,
  Scene: Scene,
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
  EffectComposer: EffectComposer,
  RenderPass: RenderPass,
  BokehPass: BokehPass,
  FilmPass: FilmPass,
  FXAAPass: FXAAPass,
  HalftonePass: HalftonePass,
  SMAAPass: SMAAPass,
  TiltShiftPass: TiltShiftPass,
  UnrealBloomPass: UnrealBloomPass,
  ZoomBlurPass: ZoomBlurPass,
  setFromProp: setFromProp,
  bindProp: bindProp,
  propsValues: propsValues,
  lerp: lerp,
  lerpv2: lerpv2,
  lerpv3: lerpv3,
  limit: limit,
  getMatcapUrl: getMatcapUrl
});

var TroisJSVuePlugin = {
  install: function (app) {
    var comps = [
      'Camera',
      'OrthographicCamera',
      'PerspectiveCamera',
      'Renderer',
      'Scene',
      'Group',

      'BoxGeometry',
      'CircleGeometry',
      'ConeGeometry',
      'CylinderGeometry',
      'DodecahedronGeometry',
      'IcosahedronGeometry',
      'LatheGeometry',
      'OctahedronGeometry',
      'PolyhedronGeometry',
      'RingGeometry',
      'SphereGeometry',
      'TetrahedronGeometry',
      'TorusGeometry',
      'TorusKnotGeometry',
      'TubeGeometry',

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

      'Box',
      'Circle',
      'Cone',
      'Cylinder',
      'Dodecahedron',
      'Icosahedron',
      'Mesh',
      'Lathe',
      'Octahedron',
      'Plane',
      'Polyhedron',
      'Ring',
      'Sphere',
      'Tetrahedron',
      'Text',
      'Torus',
      'TorusKnot',
      'Tube',

      'Gem',
      'Image',
      'InstancedMesh',
      'MirrorMesh',
      'RefractionMesh',
      'Sprite',

      'BokehPass',
      'EffectComposer',
      'FilmPass',
      'FXAAPass',
      'HalftonePass',
      'RenderPass',
      'SAOPass',
      'SMAAPass',
      'TiltShiftPass',
      'UnrealBloomPass',
      'ZoomBlurPass',

      'GLTFViewer' ];

    comps.forEach(function (comp) {
      app.component(comp, TROIS[comp]);
    });
  },
};

function createApp(params) {
  return createApp$1(params).use(TroisJSVuePlugin);
}

export { AmbientLight, BasicMaterial, BokehPass, Box, BoxGeometry, PerspectiveCamera as Camera, Circle, CircleGeometry, Cone, ConeGeometry, CubeTexture, Cylinder, CylinderGeometry, DirectionalLight, Dodecahedron, DodecahedronGeometry, EffectComposer, FXAAPass, FilmPass, Gem, Group, HalftonePass, HemisphereLight, Icosahedron, IcosahedronGeometry, Image, InstancedMesh, LambertMaterial, Lathe, LatheGeometry, MatcapMaterial, Mesh, MirrorMesh, Octahedron, OctahedronGeometry, OrthographicCamera, PerspectiveCamera, PhongMaterial, PhysicalMaterial, Plane, PointLight, Polyhedron, PolyhedronGeometry, RectAreaLight, RefractionMesh, RenderPass, Renderer, Ring, RingGeometry, SMAAPass, Scene, Sphere, SphereGeometry, SpotLight, Sprite, StandardMaterial, SubSurfaceMaterial, Tetrahedron, TetrahedronGeometry, Text, Texture, TiltShiftPass, ToonMaterial, Torus, TorusGeometry, TorusKnot, TorusKnotGeometry, TroisJSVuePlugin, Tube, TubeGeometry, UnrealBloomPass, ZoomBlurPass, bindProp, createApp, getMatcapUrl, lerp, lerpv2, lerpv3, limit, propsValues, setFromProp };
//# sourceMappingURL=trois.module.cdn.js.map
