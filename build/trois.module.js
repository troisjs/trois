import { h, toRef, watch, inject, resolveComponent, openBlock, createBlock, withCtx, createVNode, renderSlot } from 'vue';
import { Vector2, Vector3, Plane as Plane$1, Raycaster, WebGLRenderer, OrthographicCamera as OrthographicCamera$1, PerspectiveCamera as PerspectiveCamera$1, Group as Group$1, Scene as Scene$1, Color, BoxBufferGeometry, CircleBufferGeometry, ConeBufferGeometry, CylinderBufferGeometry, DodecahedronBufferGeometry, IcosahedronBufferGeometry, LatheBufferGeometry, OctahedronBufferGeometry, PolyhedronBufferGeometry, RingBufferGeometry, SphereBufferGeometry, TetrahedronBufferGeometry, TorusBufferGeometry, TorusKnotBufferGeometry, Curve, TubeBufferGeometry, AmbientLight as AmbientLight$1, DirectionalLight as DirectionalLight$1, PointLight as PointLight$1, SpotLight as SpotLight$1, FrontSide, MeshBasicMaterial, MeshLambertMaterial, TextureLoader, MeshMatcapMaterial, MeshPhongMaterial, MeshStandardMaterial, MeshPhysicalMaterial, ShaderChunk, UniformsUtils, ShaderLib, ShaderMaterial as ShaderMaterial$1, MeshToonMaterial, CubeTextureLoader, CubeRefractionMapping, Mesh as Mesh$1, PlaneBufferGeometry, FontLoader, TextBufferGeometry, WebGLCubeRenderTarget, RGBFormat, LinearMipmapLinearFilter, CubeCamera, BackSide, DoubleSide, InstancedMesh as InstancedMesh$1, SpriteMaterial, Sprite as Sprite$1, WebGLRenderTarget, ObjectSpaceNormalMap, Object3D, Face3, MathUtils, InstancedBufferAttribute } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer as EffectComposer$1 } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass as RenderPass$1 } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass as BokehPass$1 } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { FilmPass as FilmPass$1 } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { HalftonePass as HalftonePass$1 } from 'three/examples/jsm/postprocessing/HalftonePass.js';
import { SMAAPass as SMAAPass$1 } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { UnrealBloomPass as UnrealBloomPass$1 } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { Pass } from 'three/examples/jsm/postprocessing/Pass.js';
import { gsap, Power4 } from 'gsap';
import { Geometry as Geometry$1 } from 'three/examples/jsm/deprecated/Geometry.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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

    if (conf.width && conf.height) {
      setSize(conf.width, conf.height);
    } else if (conf.resize) {
      onResize();
      window.addEventListener('resize', onResize);
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
   * click listener
   */
  function onClick(e) {
    mouse.x = (e.clientX / size.width) * 2 - 1;
    mouse.y = -(e.clientY / size.height) * 2 + 1;
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
    mouse.x = (e.clientX / size.width) * 2 - 1;
    mouse.y = -(e.clientY / size.height) * 2 + 1;
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
  props: {
    antialias: Boolean,
    alpha: Boolean,
    autoClear: { type: Boolean, default: true },
    mouseMove: { type: [Boolean, String], default: false },
    mouseRaycast: { type: Boolean, default: false },
    mouseOver: { type: Boolean, default: false },
    click: { type: Boolean, default: false },
    orbitCtrl: { type: [Boolean, Object], default: false },
    resize: { type: [Boolean, String], default: true },
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
      this.three.renderer.shadowMap.enabled = this.shadow;
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

function useBindProp(comp, prop, object) {
  if (comp[prop]) {
    var ref = toRef(comp, prop);
    setFromProp(object, ref.value);
    watch(ref, function () {
      setFromProp(object, ref.value);
    }, { deep: true });
  }
}

var OrthographicCamera = {
  inject: ['three'],
  props: {
    left: { type: Number, default: -1 },
    right: { type: Number, default: 1 },
    top: { type: Number, default: 1 },
    bottom: { type: Number, default: -1 },
    near: { type: Number, default: 0.1 },
    far: { type: Number, default: 2000 },
    zoom: { type: Number, default: 1 },
    position: { type: [Object, Vector3], default: { x: 0, y: 0, z: 0 } },
  },
  created: function created() {
    var this$1 = this;

    this.camera = new OrthographicCamera$1(this.left, this.right, this.top, this.bottom, this.near, this.far);
    useBindProp(this, 'position', this.camera.position);

    ['left', 'right', 'top', 'bottom', 'near', 'far', 'zoom'].forEach(function (p) {
      watch(function () { return this$1[p]; }, function () {
        this$1.camera[p] = this$1[p];
        this$1.camera.updateProjectionMatrix();
      });
    });

    this.three.camera = this.camera;
  },
  render: function render() {
    return [];
  },
  __hmrId: 'OrthographicCamera',
};

var PerspectiveCamera = {
  inject: ['three'],
  props: {
    aspect: { type: Number, default: 1 },
    far: { type: Number, default: 2000 },
    fov: { type: Number, default: 50 },
    near: { type: Number, default: 0.1 },
    position: { type: [Object, Vector3], default: { x: 0, y: 0, z: 0 } },
  },
  created: function created() {
    var this$1 = this;

    this.camera = new PerspectiveCamera$1(this.fov, this.aspect, this.near, this.far);
    useBindProp(this, 'position', this.camera.position);

    ['aspect', 'far', 'fov', 'near'].forEach(function (p) {
      watch(function () { return this$1[p]; }, function () {
        this$1.camera[p] = this$1[p];
        this$1.camera.updateProjectionMatrix();
      });
    });

    this.three.camera = this.camera;
  },
  render: function render() {
    return [];
  },
  __hmrId: 'PerspectiveCamera',
};

var Group = {
  inject: ['three', 'scene'],
  props: {
    position: Object,
    rotation: Object,
    scale: Object,
  },
  setup: function setup(props) {
    var parent = inject('group', inject('scene'));
    var group = new Group$1();
    useBindProp(props, 'position', group.position);
    useBindProp(props, 'rotation', group.rotation);
    useBindProp(props, 'scale', group.scale);
    return { parent: parent, group: group };
  },
  provide: function provide() {
    return {
      group: this.group,
    };
  },
  created: function created() {
    this.parent.add(this.group);
  },
  unmounted: function unmounted() {
    this.parent.remove(this.group);
  },
  render: function render() {
    if (this.$slots.default) {
      return this.$slots.default();
    }
    return [];
  },
  __hmrId: 'Group',
};

var Scene = {
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
    // add(o) {
    //   this.scene.add(o);
    // },
    // remove(o) {
    //   this.scene.remove(o);
    // },
  },
  render: function render() {
    if (this.$slots.default) {
      return this.$slots.default();
    }
    return [];
  },
};

var Geometry = {
  emits: ['ready'],
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
  },
  beforeMount: function beforeMount() {
    this.createGeometry();
    this.rotateGeometry();
    this.mesh.setGeometry(this.geometry);
  },
  mounted: function mounted() {
    this.addWatchers();
  },
  unmounted: function unmounted() {
    this.geometry.dispose();
  },
  methods: {
    rotateGeometry: function rotateGeometry() {
      if (this.rotateX) { this.geometry.rotateX(this.rotateX); }
      if (this.rotateY) { this.geometry.rotateY(this.rotateY); }
      if (this.rotateZ) { this.geometry.rotateZ(this.rotateZ); }
    },
    addWatchers: function addWatchers() {
      var this$1 = this;

      this.watchProps.forEach(function (prop) {
        watch(function () { return this$1[prop]; }, function () {
          this$1.refreshGeometry();
        });
      });
    },
    refreshGeometry: function refreshGeometry() {
      var oldGeo = this.geometry;
      this.createGeometry();
      this.rotateGeometry();
      this.mesh.setGeometry(this.geometry);
      oldGeo.dispose();
    },
  },
  render: function render() {
    return [];
  },
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
      this.geometry = new BoxBufferGeometry(w, h, d, this.widthSegments, this.heightSegments, this.depthSegments);
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
      this.geometry = new CircleBufferGeometry(this.radius, this.segments, this.thetaStart, this.thetaLength);
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
      this.geometry = new ConeBufferGeometry(this.radius, this.height, this.radialSegments, this.heightSegments, this.openEnded, this.thetaStart, this.thetaLength);
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
      this.geometry = new CylinderBufferGeometry(this.radiusTop, this.radiusBottom, this.height, this.radialSegments, this.heightSegments, this.openEnded, this.thetaStart, this.thetaLength);
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
      this.geometry = new DodecahedronBufferGeometry(this.radius, this.detail);
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
      this.geometry = new IcosahedronBufferGeometry(this.radius, this.detail);
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
      this.geometry = new LatheBufferGeometry(this.points, this.segments, this.phiStart, this.phiLength);
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
      this.geometry = new OctahedronBufferGeometry(this.radius, this.detail);
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
      this.geometry = new PolyhedronBufferGeometry(this.vertices, this.indices, this.radius, this.detail);
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
      this.geometry = new RingBufferGeometry(this.innerRadius, this.outerRadius, this.thetaSegments, this.phiSegments, this.thetaStart, this.thetaLength);
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
      this.geometry = new SphereBufferGeometry(this.radius, this.widthSegments, this.heightSegments);
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
      this.geometry = new TetrahedronBufferGeometry(this.radius, this.detail);
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
      this.geometry = new TorusBufferGeometry(this.radius, this.tube, this.radialSegments, this.tubularSegments, this.arc);
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
      this.geometry = new TorusKnotBufferGeometry(this.radius, this.tube, this.radialSegments, this.tubularSegments, this.p, this.q);
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
      this.geometry = new TubeBufferGeometry(this.path, this.tubularSegments, this.radius, this.radiusSegments, this.closed);
    },
  },
};

var Light = {
  inject: {
    scene: 'scene',
    parent: {
      from: 'group',
      default: function () { return inject('scene'); },
    },
  },
  props: {
    color: {
      type: String,
      default: '#ffffff',
    },
    intensity: {
      type: Number,
      default: 1,
    },
    castShadow: {
      type: Boolean,
      default: false,
    },
    shadowMapSize: Object,
    position: Object,
  },
  // can't use setup because it will not be used in sub components
  // setup() {},
  mounted: function mounted() {
    var this$1 = this;

    useBindProp(this, 'position', this.light.position);

    if (this.light.target) {
      useBindProp(this, 'target', this.light.target.position);
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

    this.parent.add(this.light);
    if (this.light.target) { this.parent.add(this.light.target); }
  },
  unmounted: function unmounted() {
    this.parent.remove(this.light);
    if (this.light.target) { this.parent.remove(this.light.target); }
  },
  render: function render() {
    return [];
  },
  __hmrId: 'Light',
};

var AmbientLight = {
  extends: Light,
  created: function created() {
    this.light = new AmbientLight$1(this.color, this.intensity);
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
  },
  __hmrId: 'DirectionalLight',
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
  },
  __hmrId: 'PointLight',
};

var SpotLight = {
  extends: Light,
  props: {
    angle: {
      type: Number,
      default: Math.PI / 3,
    },
    decay: {
      type: Number,
      default: 1,
    },
    distance: {
      type: Number,
      default: 0,
    },
    penumbra: {
      type: Number,
      default: 0,
    },
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
  },
  __hmrId: 'SpotLight',
};

var Material = {
  inject: ['three', 'mesh'],
  props: {
    id: String,
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
  beforeMount: function beforeMount() {
    this.createMaterial();
    if (this.id) { this.three.materials[this.id] = this.material; }
    this.mesh.setMaterial(this.material);
  },
  mounted: function mounted() {
    this._addWatchers();
    if (this.addWatchers) { this.addWatchers(); }
  },
  unmounted: function unmounted() {
    this.material.dispose();
    if (this.id) { delete this.three.materials[this.id]; }
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
    if (this.$slots.default) {
      return this.$slots.default();
    }
    return [];
  },
  __hmrId: 'Material',
};

var BasicMaterial = {
  extends: Material,
  methods: {
    createMaterial: function createMaterial() {
      this.material = new MeshBasicMaterial(propsValues(this.$props, ['id']));
    },
  },
  __hmrId: 'BasicMaterial',
};

var LambertMaterial = {
  extends: Material,
  methods: {
    createMaterial: function createMaterial() {
      this.material = new MeshLambertMaterial(propsValues(this.$props, ['id']));
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
      var opts = propsValues(this.$props, ['id', 'src', 'name']);
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
      this.material = new MeshPhongMaterial(propsValues(this.$props, ['id']));
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
  normalScale: { type: Object, default: function () { return new Vector2(1, 1); } },
  roughness: { type: Number, default: 1 },
  refractionRatio: { type: Number, default: 0.98 },
  wireframe: Boolean,
};

var StandardMaterial = {
  extends: Material,
  props: props,
  methods: {
    createMaterial: function createMaterial() {
      this.material = new MeshStandardMaterial(propsValues(this.$props, ['id', 'normalScale']));
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
      useBindProp(this, 'normalScale', this.material.normalScale);
    },
  },
  __hmrId: 'StandardMaterial',
};

var PhysicalMaterial = {
  extends: StandardMaterial,
  methods: {
    createMaterial: function createMaterial() {
      this.material = new MeshPhysicalMaterial(propsValues(this.$props, ['id']));
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
    id: String,
    uniforms: Object,
    vertexShader: String,
    fragmentShader: String,
  },
  beforeMount: function beforeMount() {
    this.createMaterial();
    if (this.id) { this.three.materials[this.id] = this.material; }
    this.mesh.setMaterial(this.material);
  },
  mounted: function mounted() {
    if (this.addWatchers) { this.addWatchers(); }
  },
  unmounted: function unmounted() {
    this.material.dispose();
    if (this.id) { delete this.three.materials[this.id]; }
  },
  render: function render() {
    return [];
  },
  __hmrId: 'ShaderMaterial',
};

var SubSurfaceMaterial = {
  extends: ShaderMaterial,
  props: {
    diffuse: { type: String, default: '#ffffff' },
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

        if (key === 'diffuse' || key === 'thicknessColor') {
          value = new Color(value);
        }
        if (key !== 'id' && key !== 'transparent' && key !== 'vertexColors') {
          uniforms[key].value = value;
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
      this.material = new MeshToonMaterial(propsValues(this.$props, ['id']));
    },
  },
  __hmrId: 'ToonMaterial',
};

var Texture = {
  inject: ['material'],
  emits: ['loaded'],
  props: {
    src: String,
    onLoad: Function,
    onProgress: Function,
    onError: Function,
    id: { type: String, default: 'map' },
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
      this.texture = new TextureLoader().load(this.src, this.onLoaded, this.onProgress, this.onError);
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
  render: function render() {
    return [];
  },
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
  inject: {
    three: 'three',
    scene: 'scene',
    rendererComponent: 'rendererComponent',
    parent: {
      from: 'group',
      default: function () { return inject('scene'); },
    },
  },
  emits: ['ready'],
  props: {
    materialId: String,
    position: Object,
    rotation: Object,
    scale: Object,
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
    // console.log('Mesh mounted');
    if (this.geometry && !this.mesh) { this.initMesh(); }
  },
  unmounted: function unmounted() {
    // console.log('Mesh unmounted');
    if (this.mesh) {
      this.three.removeIntersectObject(this.mesh);
      this.parent.remove(this.mesh);
    }
    if (this.geometry) { this.geometry.dispose(); }
    if (this.material && !this.materialId) { this.material.dispose(); }
  },
  methods: {
    initMesh: function initMesh() {
      var this$1 = this;

      if (!this.material && this.materialId) {
        this.material = this.three.materials[this.materialId];
      }
      this.mesh = new Mesh$1(this.geometry, this.material);

      if (this.onHover) {
        this.mesh.onHover = function (over) { this$1.onHover({ component: this$1, over: over }); };
        this.three.addIntersectObject(this.mesh);
      }

      if (this.onClick) {
        this.mesh.onClick = function (e) { this$1.onClick({ component: this$1, event: e }); };
        this.three.addIntersectObject(this.mesh);
      }

      this.bindProps();
      this.parent.add(this.mesh);
      this.$emit('ready');
    },
    bindProps: function bindProps() {
      var this$1 = this;

      useBindProp(this, 'position', this.mesh.position);
      useBindProp(this, 'rotation', this.mesh.rotation);
      useBindProp(this, 'scale', this.mesh.scale);

      ['castShadow', 'receiveShadow'].forEach(function (p) {
        this$1.mesh[p] = this$1[p];
        watch(function () { return this$1[p]; }, function () { this$1.mesh[p] = this$1[p]; });
      });

      watch(function () { return this$1.materialId; }, function () {
        this$1.mesh.material = this$1.three.materials[this$1.materialId];
      });
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
  render: function render() {
    if (this.$slots.default) {
      return this.$slots.default();
    }
    return [];
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
    radialSegments: { type: Number, default: 64 },
    tubularSegments: { type: Number, default: 8 },
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
      this.geometry = new TorusKnotBufferGeometry(this.radius, this.tube, this.radialSegments, this.tubularSegments, this.p, this.q);
    },
  },
  __hmrId: 'TorusKnot',
};

var Tube = {
  extends: Mesh,
  props: {
    path: Curve,
    tubularSegments: { type: Number, default: 64 },
    radius: { type: Number, default: 1 },
    radialSegments: { type: Number, default: 8 },
    closed: { type: Boolean, default: false },
  },
  created: function created() {
    var this$1 = this;

    this.createGeometry();

    var watchProps = ['path', 'tubularSegments', 'radius', 'radialSegments', 'closed'];
    watchProps.forEach(function (prop) {
      watch(function () { return this$1[prop]; }, function () {
        this$1.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new TubeBufferGeometry(this.path, this.tubularSegments, this.radius, this.radialSegments, this.closed);
    },
  },
  __hmrId: 'Tube',
};

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
    if (this.meshBack) { this.parent.remove(this.meshBack); }
    if (this.materialBack) { this.materialBack.dispose(); }
  },
  methods: {
    initGem: function initGem() {
      var cubeRT = new WebGLCubeRenderTarget(this.cubeRTSize, { format: RGBFormat, generateMipmaps: true, minFilter: LinearMipmapLinearFilter });
      this.cubeCamera = new CubeCamera(this.cubeCameraNear, this.cubeCameraFar, cubeRT);
      useBindProp(this, 'position', this.cubeCamera.position);
      this.parent.add(this.cubeCamera);

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

      useBindProp(this, 'position', this.meshBack.position);
      useBindProp(this, 'rotation', this.meshBack.rotation);
      useBindProp(this, 'scale', this.meshBack.scale);
      this.parent.add(this.meshBack);
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
  inject: ['three', 'scene'],
  props: {
    materialId: String,
    count: Number,
    position: Object,
    castShadow: Boolean,
    receiveShadow: Boolean,
  },
  setup: function setup() {
    var parent = inject('group', inject('scene'));
    return { parent: parent };
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
  mounted: function mounted() {
    this.initMesh();
  },
  unmounted: function unmounted() {
    this.parent.remove(this.mesh);
  },
  methods: {
    initMesh: function initMesh() {
      var this$1 = this;

      if (!this.material && this.materialId) {
        this.material = this.three.materials[this.materialId];
      }

      this.mesh = new InstancedMesh$1(this.geometry, this.material, this.count);

      useBindProp(this, 'position', this.mesh.position);
      useBindProp(this, 'rotation', this.mesh.rotation);
      useBindProp(this, 'scale', this.mesh.scale);

      ['castShadow', 'receiveShadow'].forEach(function (p) {
        this$1.mesh[p] = this$1[p];
        watch(function () { return this$1[p]; }, function () { this$1.mesh[p] = this$1[p]; });
      });

      // watch(() => this.materialId, () => {
      //   this.mesh.material = this.three.materials[this.materialId];
      // });

      this.parent.add(this.mesh);
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
  render: function render() {
    return this.$slots.default();
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
    if (this.cubeCamera) { this.parent.remove(this.cubeCamera); }
  },
  methods: {
    initMirrorMesh: function initMirrorMesh() {
      var cubeRT = new WebGLCubeRenderTarget(this.cubeRTSize, { format: RGBFormat, generateMipmaps: true, minFilter: LinearMipmapLinearFilter });
      this.cubeCamera = new CubeCamera(this.cubeCameraNear, this.cubeCameraFar, cubeRT);
      this.parent.add(this.cubeCamera);

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
    if (this.cubeCamera) { this.parent.remove(this.cubeCamera); }
  },
  methods: {
    initMirrorMesh: function initMirrorMesh() {
      var cubeRT = new WebGLCubeRenderTarget(this.cubeRTSize, { mapping: CubeRefractionMapping, format: RGBFormat, generateMipmaps: true, minFilter: LinearMipmapLinearFilter });
      this.cubeCamera = new CubeCamera(this.cubeCameraNear, this.cubeCameraFar, cubeRT);
      useBindProp(this, 'position', this.cubeCamera.position);
      this.parent.add(this.cubeCamera);

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
  emits: ['ready', 'loaded'],
  inject: ['three', 'scene'],
  props: {
    src: String,
    position: Object,
    scale: Object,
  },
  setup: function setup() {
    var parent = inject('group', inject('scene'));
    return { parent: parent };
  },
  mounted: function mounted() {
    this.texture = new TextureLoader().load(this.src, this.onLoaded);
    this.material = new SpriteMaterial({ map: this.texture });
    this.sprite = new Sprite$1(this.material);
    this.geometry = this.sprite.geometry;
    useBindProp(this, 'position', this.sprite.position);
    useBindProp(this, 'scale', this.sprite.scale);

    this.parent.add(this.sprite);
    this.$emit('ready');
  },
  unmounted: function unmounted() {
    this.texture.dispose();
    this.material.dispose();
    this.parent.remove(this.sprite);
  },
  methods: {
    onLoaded: function onLoaded() {
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
  render: function render() {
    return [];
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

function useBindPropValue(src, srcProp, dst, dstProp) {
  if ( dstProp === void 0 ) dstProp = 'value';

  if (src[srcProp]) {
    dst[dstProp] = src[srcProp];
    watch(function () { return src[srcProp]; }, function (value) {
      dst[dstProp] = value;
    });
  }
}

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

    useBindPropValue(this, 'blurRadius', uniforms.blurRadius);
    useBindPropValue(this, 'gradientRadius', uniforms.gradientRadius);

    this.updateFocusLine();
    ['start', 'end'].forEach(function (p) {
      watch(function () { return this$1[p]; }, this$1.updateFocusLine);
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
    useBindProp(this, 'center', uniforms.center.value);
    useBindPropValue(this, 'strength', uniforms.strength);
  },
  __hmrId: 'ZoomBlurPass',
};

var snoise2 = "\n//\n// Description : Array and textureless GLSL 2D simplex noise function.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : ijm\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//\n\nvec3 mod289(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec2 mod289(vec2 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec3 permute(vec3 x) {\n  return mod289(((x*34.0)+1.0)*x);\n}\n\nfloat snoise(vec2 v)\n{\n  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0\n                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)\n                      -0.577350269189626,  // -1.0 + 2.0 * C.x\n                      0.024390243902439); // 1.0 / 41.0\n  // First corner\n  vec2 i  = floor(v + dot(v, C.yy) );\n  vec2 x0 = v -   i + dot(i, C.xx);\n\n  // Other corners\n  vec2 i1;\n  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\n  vec4 x12 = x0.xyxy + C.xxzz;\n  x12.xy -= i1;\n\n  // Permutations\n  i = mod289(i); // Avoid truncation effects in permutation\n  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))\n      + i.x + vec3(0.0, i1.x, 1.0 ));\n\n  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);\n  m = m*m ;\n  m = m*m ;\n\n  // Gradients: 41 points uniformly over a line, mapped onto a diamond.\n  // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)\n\n  vec3 x = 2.0 * fract(p * C.www) - 1.0;\n  vec3 h = abs(x) - 0.5;\n  vec3 ox = floor(x + 0.5);\n  vec3 a0 = x - ox;\n\n  // Normalise gradients implicitly by scaling m\n  // Approximation of: m *= inversesqrt( a0*a0 + h*h );\n  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );\n\n  // Compute final noise value at P\n  vec3 g;\n  g.x  = a0.x  * x0.x  + h.x  * x0.y;\n  g.yz = a0.yz * x12.xz + h.yz * x12.yw;\n  return 130.0 * dot(m, g);\n}\n";

var NoisyImage = {
  extends: Image,
  props: {
    widthSegments: { type: Number, default: 20 },
    heightSegments: { type: Number, default: 20 },
    timeCoef: { type: Number, default: 0.001 },
    noiseCoef: { type: Number, default: 1 },
    zCoef: { type: Number, default: 5 },
    dispCoef: { type: Number, default: 0.05 },
  },
  setup: function setup(props) {
    // uniforms
    var uTime = { value: 0 };
    var uNoiseCoef = { value: props.noiseCoef };
    watch(function () { return props.noiseCoef; }, function (value) { uNoiseCoef.value = value; });
    var uZCoef = { value: props.zCoef };
    watch(function () { return props.zCoef; }, function (value) { uZCoef.value = value; });
    var uDispCoef = { value: props.dispCoef };
    watch(function () { return props.dispCoef; }, function (value) { uDispCoef.value = value; });

    return {
      uTime: uTime, uNoiseCoef: uNoiseCoef, uZCoef: uZCoef, uDispCoef: uDispCoef,
    };
  },
  mounted: function mounted() {
    this.startTime = Date.now();
    this.three.onBeforeRender(this.updateTime);
  },
  unmounted: function unmounted() {
    this.three.offBeforeRender(this.updateTime);
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new PlaneBufferGeometry(1, 1, this.widthSegments, this.heightSegments);
    },
    createMaterial: function createMaterial() {
      var this$1 = this;

      this.material = new MeshBasicMaterial({ side: DoubleSide, map: this.loadTexture() });
      this.material.onBeforeCompile = function (shader) {
        shader.uniforms.uTime = this$1.uTime;
        shader.uniforms.uNoiseCoef = this$1.uNoiseCoef;
        shader.uniforms.uZCoef = this$1.uZCoef;
        shader.uniforms.uDispCoef = this$1.uDispCoef;
        shader.vertexShader = "\n          uniform float uTime;\n          uniform float uNoiseCoef;\n          uniform float uZCoef;\n          varying float vNoise;\n          " + snoise2 + "\n        " + shader.vertexShader;

        shader.vertexShader = shader.vertexShader.replace(
          '#include <begin_vertex>',
          "         \n            vec3 p = vec3(position * uNoiseCoef);\n            p.x += uTime;\n            vNoise = snoise(p.xy);\n            vec3 transformed = vec3(position);\n            transformed.z += vNoise * uZCoef;\n          "
        );

        shader.fragmentShader = "\n          uniform float uDispCoef;\n          varying float vNoise;\n        " + shader.fragmentShader;

        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <map_fragment>',
          "\n            vec4 texelColor = texture2D(map, vUv);\n            vec4 dispTexel = texture2D(map, vUv + vec2(vNoise * uDispCoef, 0));\n            texelColor.r = dispTexel.r;\n            diffuseColor = texelColor;\n          "
        );
        this$1.materialShader = shader;
      };
    },
    updateTime: function updateTime() {
      this.uTime.value = (Date.now() - this.startTime) * this.timeCoef;
    },
  },
  __hmrId: 'NoisyImage',
};

var snoise3 = "\n//\n// Description : Array and textureless GLSL 2D/3D/4D simplex\n//               noise functions.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : ijm\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//\n\nvec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }\nvec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }\nvec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }\nvec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }\n\nfloat snoise(vec3 v)\n{\n  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;\n  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);\n\n  // First corner\n  vec3 i  = floor(v + dot(v, C.yyy) );\n  vec3 x0 =   v - i + dot(i, C.xxx) ;\n\n  // Other corners\n  vec3 g = step(x0.yzx, x0.xyz);\n  vec3 l = 1.0 - g;\n  vec3 i1 = min( g.xyz, l.zxy );\n  vec3 i2 = max( g.xyz, l.zxy );\n\n  vec3 x1 = x0 - i1 + C.xxx;\n  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y\n  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y\n\n  // Permutations\n  i = mod289(i);\n  vec4 p = permute( permute( permute(\n             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))\n           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))\n           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));\n\n  // Gradients: 7x7 points over a square, mapped onto an octahedron.\n  // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)\n  float n_ = 0.142857142857; // 1.0/7.0\n  vec3  ns = n_ * D.wyz - D.xzx;\n\n  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)\n\n  vec4 x_ = floor(j * ns.z);\n  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)\n\n  vec4 x = x_ *ns.x + ns.yyyy;\n  vec4 y = y_ *ns.x + ns.yyyy;\n  vec4 h = 1.0 - abs(x) - abs(y);\n\n  vec4 b0 = vec4( x.xy, y.xy );\n  vec4 b1 = vec4( x.zw, y.zw );\n\n  vec4 s0 = floor(b0)*2.0 + 1.0;\n  vec4 s1 = floor(b1)*2.0 + 1.0;\n  vec4 sh = -step(h, vec4(0.0));\n\n  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\n  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;\n\n  vec3 p0 = vec3(a0.xy,h.x);\n  vec3 p1 = vec3(a0.zw,h.y);\n  vec3 p2 = vec3(a1.xy,h.z);\n  vec3 p3 = vec3(a1.zw,h.w);\n\n  // Normalise gradients\n  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n\n  // Mix final noise value\n  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\n  m = m * m;\n  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),\n                                dot(p2,x2), dot(p3,x3) ) );\n}\n";

var NoisyPlane = {
  extends: Plane,
  props: {
    timeCoef: { type: Number, default: 0.001 },
    noiseCoef: { type: Number, default: 5 },
    deltaCoef: { type: Number, default: 1 / 512 },
    displacementScale: { type: Number, default: 5 },
  },
  setup: function setup(props) {
    // uniforms
    var uTime = { value: 0 };
    var uNoiseCoef = { value: props.noiseCoef };
    watch(function () { return props.noiseCoef; }, function (value) { uNoiseCoef.value = value; });
    var uDelta = { value: new Vector2(props.deltaCoef, props.deltaCoef) };
    watch(function () { return props.deltaCoef; }, function (value) { uDelta.value.set(value, value); });

    return {
      uTime: uTime, uNoiseCoef: uNoiseCoef, uDelta: uDelta,
    };
  },
  mounted: function mounted() {
    var this$1 = this;

    this.init();

    watch(function () { return this$1.displacementScale; }, function (value) { this$1.material.displacementScale = value; });

    this.startTime = Date.now();
    this.three.onBeforeRender(this.update);
  },
  unmounted: function unmounted() {
    this.three.offBeforeRender(this.update);
    this.fsQuad.dispose();
    this.dispRT.dispose();
    this.dispMat.dispose();
    this.normRT.dispose();
    this.normMat.dispose();
  },
  methods: {
    init: function init() {
      this.fsQuad = new Pass.FullScreenQuad();

      // displacement map
      this.dispRT = new WebGLRenderTarget(512, 512, { depthBuffer: false, stencilBuffer: false });
      this.dispMat = new ShaderMaterial$1({
        uniforms: {
          uTime: this.uTime,
          uNoiseCoef: this.uNoiseCoef,
        },
        vertexShader: "\n          varying vec2 vUv;\n          void main() {\n            vUv = uv;\n            // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n            gl_Position = vec4(position, 1.0);\n          }\n        ",
        fragmentShader: ("\n          uniform float uTime;\n          uniform float uNoiseCoef;\n          varying vec2 vUv;\n          " + snoise3 + "\n          void main() {\n            vec2 p = vec2(vUv * uNoiseCoef);\n            float noise = (snoise(vec3(p.x, p.y, uTime)) + 1.0) / 2.0;\n            gl_FragColor = vec4(noise, 0.0, 0.0, 1.0);\n          }\n        "),
      });

      // normal map
      this.normRT = new WebGLRenderTarget(512, 512, { depthBuffer: false, stencilBuffer: false });
      this.normMat = new ShaderMaterial$1({
        uniforms: {
          dispMap: { value: this.dispRT.texture },
          delta: this.uDelta,
        },
        vertexShader: "\n          varying vec2 vUv;\n          void main() {\n            vUv = uv;\n            // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n            gl_Position = vec4(position, 1.0);\n          }\n        ",
        fragmentShader: "\n          uniform sampler2D dispMap;\n          uniform vec2 delta;\n          varying vec2 vUv;\n          void main() {\n            // gl_FragColor = vec4(0.5, 0.5, 1.0, 0.0);\n            float x1 = texture2D(dispMap, vec2(vUv.x - delta.x, vUv.y)).r;\n            float x2 = texture2D(dispMap, vec2(vUv.x + delta.x, vUv.y)).r;\n            float y1 = texture2D(dispMap, vec2(vUv.x, vUv.y - delta.y)).r;\n            float y2 = texture2D(dispMap, vec2(vUv.x, vUv.y + delta.y)).r;\n            gl_FragColor = vec4(0.5 + (x1 - x2), 0.5 + (y1 - y2), 1.0, 1.0);\n          }\n        ",
      });

      this.material.displacementMap = this.dispRT.texture;
      this.material.displacementScale = this.displacementScale;
      this.material.normalMap = this.normRT.texture;
      this.material.normalMapType = ObjectSpaceNormalMap;
      // this.material.needsUpdate = true;
    },
    update: function update() {
      this.uTime.value = (Date.now() - this.startTime) * this.timeCoef;
      this.renderDisp();
    },
    renderDisp: function renderDisp() {
      this.renderMat(this.dispMat, this.dispRT);
      this.renderMat(this.normMat, this.normRT);
    },
    renderMat: function renderMat(mat, target) {
      var renderer = this.three.renderer;
      this.fsQuad.material = mat;
      var oldTarget = renderer.getRenderTarget();
      renderer.setRenderTarget(target);
      this.fsQuad.render(renderer);
      renderer.setRenderTarget(oldTarget);
    },
  },
  __hmrId: 'NoisyPlane',
};

var snoise4 = "\n//\n// Description : Array and textureless GLSL 2D/3D/4D simplex\n//               noise functions.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : ijm\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//\n\nvec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }\nfloat mod289(float x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }\nvec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }\nfloat permute(float x) { return mod289(((x*34.0)+1.0)*x); }\nvec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }\nfloat taylorInvSqrt(float r) { return 1.79284291400159 - 0.85373472095314 * r; }\n\nvec4 grad4(float j, vec4 ip)\n{\n  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);\n  vec4 p,s;\n\n  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;\n  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);\n  s = vec4(lessThan(p, vec4(0.0)));\n  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;\n\n  return p;\n}\n\n// (sqrt(5) - 1)/4 = F4, used once below\n#define F4 0.309016994374947451\n\nfloat snoise(vec4 v)\n{\n  const vec4  C = vec4( 0.138196601125011,  // (5 - sqrt(5))/20  G4\n                        0.276393202250021,  // 2 * G4\n                        0.414589803375032,  // 3 * G4\n                        -0.447213595499958); // -1 + 4 * G4\n\n  // First corner\n  vec4 i  = floor(v + dot(v, vec4(F4)) );\n  vec4 x0 = v -   i + dot(i, C.xxxx);\n\n  // Other corners\n\n  // Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)\n  vec4 i0;\n  vec3 isX = step( x0.yzw, x0.xxx );\n  vec3 isYZ = step( x0.zww, x0.yyz );\n  //  i0.x = dot( isX, vec3( 1.0 ) );\n  i0.x = isX.x + isX.y + isX.z;\n  i0.yzw = 1.0 - isX;\n  //  i0.y += dot( isYZ.xy, vec2( 1.0 ) );\n  i0.y += isYZ.x + isYZ.y;\n  i0.zw += 1.0 - isYZ.xy;\n  i0.z += isYZ.z;\n  i0.w += 1.0 - isYZ.z;\n\n  // i0 now contains the unique values 0,1,2,3 in each channel\n  vec4 i3 = clamp( i0, 0.0, 1.0 );\n  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );\n  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );\n\n  vec4 x1 = x0 - i1 + C.xxxx;\n  vec4 x2 = x0 - i2 + C.yyyy;\n  vec4 x3 = x0 - i3 + C.zzzz;\n  vec4 x4 = x0 + C.wwww;\n\n  // Permutations\n  i = mod289(i);\n  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);\n  vec4 j1 = permute( permute( permute( permute (\n             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))\n           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))\n           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))\n           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));\n\n  // Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope\n  // 7*7*6 = 294, which is close to the ring size 17*17 = 289.\n  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;\n\n  vec4 p0 = grad4(j0,   ip);\n  vec4 p1 = grad4(j1.x, ip);\n  vec4 p2 = grad4(j1.y, ip);\n  vec4 p3 = grad4(j1.z, ip);\n  vec4 p4 = grad4(j1.w, ip);\n\n  // Normalise gradients\n  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n  p4 *= taylorInvSqrt(dot(p4,p4));\n\n  // Mix contributions from the five corners\n  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);\n  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);\n  m0 = m0 * m0;\n  m1 = m1 * m1;\n  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))\n               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;\n\n}\n";

var NoisySphere = {
  extends: Sphere,
  props: {
    radius: { type: Number, default: 20 },
    widthSegments: { type: Number, default: 128 },
    heightSegments: { type: Number, default: 128 },
    timeCoef: { type: Number, default: 0.001 },
    noiseCoef: { type: Number, default: 0.05 },
    dispCoef: { type: Number, default: 5 },
  },
  setup: function setup(props) {
    // uniforms
    var uTime = { value: 0 };
    var uNoiseCoef = { value: props.noiseCoef };
    watch(function () { return props.noiseCoef; }, function (value) { uNoiseCoef.value = value; });
    var uDispCoef = { value: props.dispCoef };
    watch(function () { return props.dispCoef; }, function (value) { uDispCoef.value = value; });

    return {
      uTime: uTime, uNoiseCoef: uNoiseCoef, uDispCoef: uDispCoef,
    };
  },
  mounted: function mounted() {
    this.updateMaterial();

    this.startTime = Date.now();
    this.three.onBeforeRender(this.updateTime);
  },
  unmounted: function unmounted() {
    this.three.offBeforeRender(this.updateTime);
  },
  methods: {
    updateMaterial: function updateMaterial() {
      var this$1 = this;

      this.material.onBeforeCompile = function (shader) {
        shader.uniforms.uTime = this$1.uTime;
        shader.uniforms.uNoiseCoef = this$1.uNoiseCoef;
        shader.uniforms.uDispCoef = this$1.uDispCoef;
        shader.vertexShader = "\n          uniform float uTime;\n          uniform float uNoiseCoef;\n          uniform float uDispCoef;\n          varying float vNoise;\n          " + snoise4 + "\n        " + shader.vertexShader;

        shader.vertexShader = shader.vertexShader.replace(
          '#include <begin_vertex>',
          "\n            vec4 p = vec4(vec3(position * uNoiseCoef), uTime);\n            vNoise = snoise(p);\n            vec3 transformed = vec3(position);\n            transformed += normalize(position) * vNoise * uDispCoef;\n          "
        );
        this$1.materialShader = shader;
      };
      this.material.needsupdate = true;
    },
    updateTime: function updateTime() {
      this.uTime.value = (Date.now() - this.startTime) * this.timeCoef;
    },
  },
  __hmrId: 'NoisySphere',
};

var NoisyText = {
  extends: Text,
  props: {
    timeCoef: { type: Number, default: 0.001 },
    noiseCoef: { type: Number, default: 0.015 },
    zCoef: { type: Number, default: 10 },
  },
  setup: function setup(props) {
    // uniforms
    var uTime = { value: 0 };
    var uNoiseCoef = { value: props.noiseCoef };
    watch(function () { return props.noiseCoef; }, function (value) { uNoiseCoef.value = value; });
    var uZCoef = { value: props.zCoef };
    watch(function () { return props.zCoef; }, function (value) { uZCoef.value = value; });

    return {
      uTime: uTime, uNoiseCoef: uNoiseCoef, uZCoef: uZCoef,
    };
  },
  mounted: function mounted() {
    this.updateMaterial();

    this.startTime = Date.now();
    this.three.onBeforeRender(this.updateTime);
  },
  unmounted: function unmounted() {
    this.three.offBeforeRender(this.updateTime);
  },
  methods: {
    updateMaterial: function updateMaterial() {
      var this$1 = this;

      this.material.onBeforeCompile = function (shader) {
        shader.uniforms.uTime = this$1.uTime;
        shader.uniforms.uNoiseCoef = this$1.uNoiseCoef;
        shader.uniforms.uZCoef = this$1.uZCoef;
        shader.vertexShader = "\n          uniform float uTime;\n          uniform float uNoiseCoef;\n          uniform float uZCoef;\n          " + snoise2 + "\n        " + shader.vertexShader;

        shader.vertexShader = shader.vertexShader.replace(
          '#include <begin_vertex>',
          "         \n            vec3 p = vec3(position * uNoiseCoef);\n            p.x += uTime;\n            float noise = snoise(p.xy);\n            vec3 transformed = vec3(position);\n            transformed.z += noise * uZCoef;\n          "
        );
        this$1.materialShader = shader;
      };
      this.material.needsupdate = true;
    },
    updateTime: function updateTime() {
      this.uTime.value = (Date.now() - this.startTime) * this.timeCoef;
    },
  },
  __hmrId: 'NoisyText',
};

var AnimatedPlane = function AnimatedPlane(params) {
  var this$1 = this;

  Object.entries(params).forEach(function (ref) {
    var key = ref[0];
    var value = ref[1];

    this$1[key] = value;
  });

  this.o3d = new Object3D();
  this.uProgress = { value: 0 };
  this.uvScale = new Vector2();

  this.initMaterial();
  this.initPlane();
};

AnimatedPlane.prototype.initMaterial = function initMaterial () {
    var this$1 = this;

  this.material = new MeshBasicMaterial({
    side: DoubleSide,
    transparent: true,
    map: this.texture,
    onBeforeCompile: function (shader) {
      shader.uniforms.progress = this$1.uProgress;
      shader.uniforms.uvScale = { value: this$1.uvScale };
      shader.vertexShader = "\n          uniform float progress;\n          uniform vec2 uvScale;\n\n          attribute vec3 offset;\n          attribute vec3 rotation;\n          attribute vec2 uvOffset;\n\n          mat3 rotationMatrixXYZ(vec3 r)\n          {\n            float cx = cos(r.x);\n            float sx = sin(r.x);\n            float cy = cos(r.y);\n            float sy = sin(r.y);\n            float cz = cos(r.z);\n            float sz = sin(r.z);\n\n            return mat3(\n               cy * cz, cx * sz + sx * sy * cz, sx * sz - cx * sy * cz,\n              -cy * sz, cx * cz - sx * sy * sz, sx * cz + cx * sy * sz,\n                    sy,               -sx * cy,                cx * cy\n            );\n          }\n        " + shader.vertexShader;

      shader.vertexShader = shader.vertexShader.replace('#include <uv_vertex>', "\n          #include <uv_vertex>\n          vUv = vUv * uvScale + uvOffset;\n        ");

      shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', "\n          mat3 rotMat = rotationMatrixXYZ(progress * rotation);\n          transformed = rotMat * transformed;\n\n          vec4 mvPosition = vec4(transformed, 1.0);\n          #ifdef USE_INSTANCING\n            mvPosition = instanceMatrix * mvPosition;\n          #endif\n\n          mvPosition.xyz += progress * offset;\n\n          mvPosition = modelViewMatrix * mvPosition;\n          gl_Position = projectionMatrix * mvPosition;\n        ");
    },
  });
};

AnimatedPlane.prototype.initPlane = function initPlane () {
  var ref = this.screen;
    var width = ref.width;
    var wWidth = ref.wWidth;
    var wHeight = ref.wHeight;
  this.wSize = this.size * wWidth / width;
  this.nx = Math.ceil(wWidth / this.wSize) + 1;
  this.ny = Math.ceil(wHeight / this.wSize) + 1;
  this.icount = this.nx * this.ny;

  this.initGeometry();
  this.initUV();
  this.initAnimAttributes();

  if (this.imesh) {
    this.o3d.remove(this.imesh);
  }
  this.imesh = new InstancedMesh$1(this.bGeometry, this.material, this.icount);
  this.o3d.add(this.imesh);

  var dummy = new Object3D();
  var index = 0;
  var x = -(wWidth - (wWidth - this.nx * this.wSize)) / 2 + this.dx;
  for (var i = 0; i < this.nx; i++) {
    var y = -(wHeight - (wHeight - this.ny * this.wSize)) / 2 + this.dy;
    for (var j = 0; j < this.ny; j++) {
      dummy.position.set(x, y, 0);
      dummy.updateMatrix();
      this.imesh.setMatrixAt(index++, dummy.matrix);
      y += this.wSize;
    }
    x += this.wSize;
  }
};

AnimatedPlane.prototype.initGeometry = function initGeometry () {
  // square
  var geometry = new Geometry$1();
  geometry.vertices.push(new Vector3(0, 0, 0));
  geometry.vertices.push(new Vector3(this.wSize, 0, 0));
  geometry.vertices.push(new Vector3(0, this.wSize, 0));
  geometry.vertices.push(new Vector3(this.wSize, this.wSize, 0));
  geometry.faces.push(new Face3(0, 2, 1));
  geometry.faces.push(new Face3(2, 3, 1));

  geometry.faceVertexUvs[0].push([
    new Vector2(0, 0),
    new Vector2(0, 1),
    new Vector2(1, 0) ]);
  geometry.faceVertexUvs[0].push([
    new Vector2(0, 1),
    new Vector2(1, 1),
    new Vector2(1, 0) ]);

  // geometry.computeFaceNormals();
  // geometry.computeVertexNormals();

  // center
  this.dx = this.wSize / 2;
  this.dy = this.wSize / 2;
  geometry.translate(-this.dx, -this.dy, 0);

  this.bGeometry = geometry.toBufferGeometry();
};

AnimatedPlane.prototype.initAnimAttributes = function initAnimAttributes () {
  var rnd = MathUtils.randFloat;
    var rndFS = MathUtils.randFloatSpread;
  var v3 = new Vector3();

  var offsets = new Float32Array(this.icount * 3);
  for (var i = 0; i < offsets.length; i += 3) {
    if (this.anim === 1) { v3.set(rndFS(10), rnd(50, 100), rnd(20, 50)).toArray(offsets, i); }
    else { v3.set(rndFS(20), rndFS(20), rnd(20, 200)).toArray(offsets, i); }
  }
  this.bGeometry.setAttribute('offset', new InstancedBufferAttribute(offsets, 3));

  var rotations = new Float32Array(this.icount * 3);
  var angle = Math.PI * 4;
  for (var i$1 = 0; i$1 < rotations.length; i$1 += 3) {
    rotations[i$1] = rndFS(angle);
    rotations[i$1 + 1] = rndFS(angle);
    rotations[i$1 + 2] = rndFS(angle);
  }
  this.bGeometry.setAttribute('rotation', new InstancedBufferAttribute(rotations, 3));
};

AnimatedPlane.prototype.initUV = function initUV () {
  var ratio = this.nx / this.ny;
  var tRatio = this.texture.image.width / this.texture.image.height;
  if (ratio > tRatio) { this.uvScale.set(1 / this.nx, (tRatio / ratio) / this.ny); }
  else { this.uvScale.set((ratio / tRatio) / this.nx, 1 / this.ny); }
  var nW = this.uvScale.x * this.nx;
  var nH = this.uvScale.y * this.ny;

  var v2 = new Vector2();
  var uvOffsets = new Float32Array(this.icount * 2);
  for (var i = 0; i < this.nx; i++) {
    for (var j = 0; j < this.ny; j++) {
      v2.set(
        this.uvScale.x * i + (1 - nW) / 2,
        this.uvScale.y * j + (1 - nH) / 2
      ).toArray(uvOffsets, (i * this.ny + j) * 2);
    }
  }
  this.bGeometry.setAttribute('uvOffset', new InstancedBufferAttribute(uvOffsets, 2));
};

AnimatedPlane.prototype.setTexture = function setTexture (texture) {
  this.texture = texture;
  this.material.map = texture;
  this.initUV();
};

AnimatedPlane.prototype.resize = function resize () {
  this.initPlane();
};

function useTextures() {
  var obj = {
    loader: new TextureLoader(),
    count: 0,
    textures: [],
    loadProgress: 0,
    loadTextures: loadTextures,
    dispose: dispose,
  };
  return obj;

  function loadTextures(images, cb) {
    obj.count = images.length;
    obj.textures.splice(0);
    obj.loadProgress = 0;
    Promise.all(images.map(loadTexture)).then(cb);
  }
  function loadTexture(img, index) {
    return new Promise(function (resolve) {
      obj.loader.load(
        img.src,
        function (texture) {
          obj.loadProgress += 1 / obj.count;
          obj.textures[index] = texture;
          resolve(texture);
        }
      );
    });
  }
  function dispose() {
    obj.textures.forEach(function (t) { return t.dispose(); });
  }
}

var script = {
  props: {
    images: Array,
    events: { type: Object, default: function () { return { wheel: true, click: true, keyup: true }; } },
  },
  setup: function setup() {
    var ref = useTextures();
    var textures = ref.textures;
    var loadTextures = ref.loadTextures;
    return {
      textures: textures,
      loadTextures: loadTextures,
      progress: 0,
      targetProgress: 0,
    };
  },
  mounted: function mounted() {
    this.three = this.$refs.renderer.three;

    if (this.images.length < 2) {
      console.error('This slider needs at least 2 images.');
    } else {
      this.loadTextures(this.images, this.init);
    }
  },
  unmounted: function unmounted() {
    document.removeEventListener('click', this.onClick);
    document.removeEventListener('keyup', this.onKeyup);
    window.removeEventListener('wheel', this.onWheel);
  },
  methods: {
    init: function init() {
      this.initScene();

      gsap.fromTo(this.plane1.uProgress,
        {
          value: -2,
        },
        {
          value: 0,
          duration: 2.5,
          ease: Power4.easeOut,
        }
      );

      if (this.events.click) { document.addEventListener('click', this.onClick); }
      if (this.events.keyup) { document.addEventListener('keyup', this.onKeyup); }
      if (this.events.wheel) { window.addEventListener('wheel', this.onWheel); }
      this.three.onBeforeRender(this.updateProgress);
      this.three.onAfterResize(this.onResize);
    },
    initScene: function initScene() {
      var renderer = this.three.renderer;
      var scene = this.$refs.scene.scene;

      this.plane1 = new AnimatedPlane({
        renderer: renderer, screen: this.three.size,
        size: 10,
        anim: 1,
        texture: this.textures[0],
      });

      this.plane2 = new AnimatedPlane({
        renderer: renderer, screen: this.three.size,
        size: 10,
        anim: 2,
        texture: this.textures[1],
      });

      this.setPlanesProgress(0);
      this.planes = new Object3D();
      this.planes.add(this.plane1.o3d);
      this.planes.add(this.plane2.o3d);
      scene.add(this.planes);
    },
    onResize: function onResize() {
      this.plane1.resize();
      this.plane2.resize();
    },
    onWheel: function onWheel(e) {
      // e.preventDefault();
      if (e.deltaY > 0) {
        this.setTargetProgress(this.targetProgress + 1 / 20);
      } else {
        this.setTargetProgress(this.targetProgress - 1 / 20);
      }
    },
    onClick: function onClick(e) {
      if (e.clientY < this.three.size.height / 2) {
        this.navPrevious();
      } else {
        this.navNext();
      }
    },
    onKeyup: function onKeyup(e) {
      if (e.keyCode === 37 || e.keyCode === 38) {
        this.navPrevious();
      } else if (e.keyCode === 39 || e.keyCode === 40) {
        this.navNext();
      }
    },
    navNext: function navNext() {
      if (Number.isInteger(this.targetProgress)) { this.setTargetProgress(this.targetProgress + 1); }
      else { this.setTargetProgress(Math.ceil(this.targetProgress)); }
    },
    navPrevious: function navPrevious() {
      if (Number.isInteger(this.targetProgress)) { this.setTargetProgress(this.targetProgress - 1); }
      else { this.setTargetProgress(Math.floor(this.targetProgress)); }
    },
    setTargetProgress: function setTargetProgress(value) {
      this.targetProgress = value;
      if (this.targetProgress < 0) {
        this.progress += this.images.length;
        this.targetProgress += this.images.length;
      }
    },
    updateProgress: function updateProgress() {
      var progress1 = lerp(this.progress, this.targetProgress, 0.1);
      var pdiff = progress1 - this.progress;
      if (pdiff === 0) { return; }

      var p0 = this.progress % 1;
      var p1 = progress1 % 1;
      if ((pdiff > 0 && p1 < p0) || (pdiff < 0 && p0 < p1)) {
        var i = Math.floor(progress1) % this.images.length;
        var j = (i + 1) % this.images.length;
        this.plane1.setTexture(this.textures[i]);
        this.plane2.setTexture(this.textures[j]);
      }

      this.progress = progress1;
      this.setPlanesProgress(this.progress % 1);
    },
    setPlanesProgress: function setPlanesProgress(progress) {
      this.plane1.uProgress.value = progress;
      this.plane2.uProgress.value = -1 + progress;
      this.plane1.material.opacity = 1 - progress;
      this.plane2.material.opacity = progress;
      this.plane1.o3d.position.z = progress;
      this.plane2.o3d.position.z = progress - 1;
    },
  },
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_Camera = resolveComponent("Camera");
  var _component_Scene = resolveComponent("Scene");
  var _component_Renderer = resolveComponent("Renderer");

  return (openBlock(), createBlock(_component_Renderer, {
    ref: "renderer",
    antialias: ""
  }, {
    default: withCtx(function () { return [
      createVNode(_component_Camera, {
        ref: "camera",
        position: { z: 150 }
      }, null, 512 /* NEED_PATCH */),
      createVNode(_component_Scene, { ref: "scene" }, null, 512 /* NEED_PATCH */)
    ]; }),
    _: 1 /* STABLE */
  }, 512 /* NEED_PATCH */))
}

script.render = render;
script.__file = "src/components/sliders/Slider1.vue";

var script$1 = {
  props: {
    src: String,
    cameraPosition: Object,
  },
  mounted: function mounted() {
    var this$1 = this;

    this.renderer = this.$refs.renderer;

    var loader = new GLTFLoader();
    loader.load(this.src, function (gltf) {
      this$1.renderer.three.scene.add(gltf.scene);
    });
  },
};

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_Camera = resolveComponent("Camera");
  var _component_Scene = resolveComponent("Scene");
  var _component_Renderer = resolveComponent("Renderer");

  return (openBlock(), createBlock(_component_Renderer, {
    ref: "renderer",
    "orbit-ctrl": { enableDamping: true, dampingFactor: 0.05 }
  }, {
    default: withCtx(function () { return [
      createVNode(_component_Camera, {
        ref: "camera",
        position: $props.cameraPosition
      }, null, 8 /* PROPS */, ["position"]),
      createVNode(_component_Scene, null, {
        default: withCtx(function () { return [
          renderSlot(_ctx.$slots, "default")
        ]; }),
        _: 3 /* FORWARDED */
      })
    ]; }),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["orbit-ctrl"]))
}

script$1.render = render$1;
script$1.__file = "src/components/viewers/GLTFViewer.vue";

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
  PointLight: PointLight,
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
  NoisyImage: NoisyImage,
  NoisyPlane: NoisyPlane,
  NoisySphere: NoisySphere,
  NoisyText: NoisyText,
  Slider1: script,
  GLTFViewer: script$1,
  setFromProp: setFromProp,
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
      'PointLight',
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

export { AmbientLight, BasicMaterial, BokehPass, Box, BoxGeometry, PerspectiveCamera as Camera, Circle, CircleGeometry, Cone, ConeGeometry, CubeTexture, Cylinder, CylinderGeometry, DirectionalLight, Dodecahedron, DodecahedronGeometry, EffectComposer, FXAAPass, FilmPass, script$1 as GLTFViewer, Gem, Group, HalftonePass, Icosahedron, IcosahedronGeometry, Image, InstancedMesh, LambertMaterial, Lathe, LatheGeometry, MatcapMaterial, Mesh, MirrorMesh, NoisyImage, NoisyPlane, NoisySphere, NoisyText, Octahedron, OctahedronGeometry, OrthographicCamera, PerspectiveCamera, PhongMaterial, PhysicalMaterial, Plane, PointLight, Polyhedron, PolyhedronGeometry, RefractionMesh, RenderPass, Renderer, Ring, RingGeometry, SMAAPass, Scene, script as Slider1, Sphere, SphereGeometry, SpotLight, Sprite, StandardMaterial, SubSurfaceMaterial, Tetrahedron, TetrahedronGeometry, Text, Texture, TiltShiftPass, ToonMaterial, Torus, TorusGeometry, TorusKnot, TorusKnotGeometry, TroisJSVuePlugin, Tube, TubeGeometry, UnrealBloomPass, ZoomBlurPass, getMatcapUrl, lerp, lerpv2, lerpv3, limit, propsValues, setFromProp };
//# sourceMappingURL=trois.module.js.map
