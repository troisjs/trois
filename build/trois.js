'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vue = require('vue');
var three = require('three');
var OrbitControls_js = require('three/examples/jsm/controls/OrbitControls.js');
var EffectComposer_js = require('three/examples/jsm/postprocessing/EffectComposer.js');
var RenderPass_js = require('three/examples/jsm/postprocessing/RenderPass.js');
var BokehPass_js = require('three/examples/jsm/postprocessing/BokehPass.js');
var FilmPass_js = require('three/examples/jsm/postprocessing/FilmPass.js');
var ShaderPass_js = require('three/examples/jsm/postprocessing/ShaderPass.js');
var FXAAShader_js = require('three/examples/jsm/shaders/FXAAShader.js');
var HalftonePass_js = require('three/examples/jsm/postprocessing/HalftonePass.js');
var SMAAPass_js = require('three/examples/jsm/postprocessing/SMAAPass.js');
var UnrealBloomPass_js = require('three/examples/jsm/postprocessing/UnrealBloomPass.js');

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
  var mouse = new three.Vector2();
  var mouseV3 = new three.Vector3();
  var mousePlane = new three.Plane(new three.Vector3(0, 0, 1), 0);
  var raycaster = new three.Raycaster();

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

    obj.renderer = new three.WebGLRenderer({ canvas: conf.canvas, antialias: conf.antialias, alpha: conf.alpha });
    obj.renderer.autoClear = conf.autoClear;

    if (conf.orbit_ctrl) {
      obj.orbitCtrl = new OrbitControls_js.OrbitControls(obj.camera, obj.renderer.domElement);
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
    return vue.h('canvas', {}, this.$slots.default());
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
    var ref = vue.toRef(comp, prop);
    setFromProp(object, ref.value);
    vue.watch(ref, function () {
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
    position: { type: [Object, three.Vector3], default: { x: 0, y: 0, z: 0 } },
  },
  created: function created() {
    var this$1 = this;

    this.camera = new three.OrthographicCamera(this.left, this.right, this.top, this.bottom, this.near, this.far);
    useBindProp(this, 'position', this.camera.position);

    ['left', 'right', 'top', 'bottom', 'near', 'far', 'zoom'].forEach(function (p) {
      vue.watch(function () { return this$1[p]; }, function () {
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
    position: { type: [Object, three.Vector3], default: { x: 0, y: 0, z: 0 } },
  },
  created: function created() {
    var this$1 = this;

    this.camera = new three.PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
    useBindProp(this, 'position', this.camera.position);

    ['aspect', 'far', 'fov', 'near'].forEach(function (p) {
      vue.watch(function () { return this$1[p]; }, function () {
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
    var parent = vue.inject('group', vue.inject('scene'));
    var group = new three.Group();
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
    var scene = new three.Scene();
    if (props.background) { scene.background = new three.Color(props.background); }
    vue.watch(function () { return props.background; }, function (value) { scene.background = new three.Color(value); });
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
        vue.watch(function () { return this$1[prop]; }, function () {
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
      this.geometry = new three.BoxBufferGeometry(w, h, d, this.widthSegments, this.heightSegments, this.depthSegments);
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
      this.geometry = new three.CircleBufferGeometry(this.radius, this.segments, this.thetaStart, this.thetaLength);
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
      this.geometry = new three.ConeBufferGeometry(this.radius, this.height, this.radialSegments, this.heightSegments, this.openEnded, this.thetaStart, this.thetaLength);
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
      this.geometry = new three.CylinderBufferGeometry(this.radiusTop, this.radiusBottom, this.height, this.radialSegments, this.heightSegments, this.openEnded, this.thetaStart, this.thetaLength);
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
      this.geometry = new three.DodecahedronBufferGeometry(this.radius, this.detail);
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
      this.geometry = new three.IcosahedronBufferGeometry(this.radius, this.detail);
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
      this.geometry = new three.LatheBufferGeometry(this.points, this.segments, this.phiStart, this.phiLength);
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
      this.geometry = new three.OctahedronBufferGeometry(this.radius, this.detail);
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
      this.geometry = new three.PolyhedronBufferGeometry(this.vertices, this.indices, this.radius, this.detail);
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
      this.geometry = new three.RingBufferGeometry(this.innerRadius, this.outerRadius, this.thetaSegments, this.phiSegments, this.thetaStart, this.thetaLength);
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
      this.geometry = new three.SphereBufferGeometry(this.radius, this.widthSegments, this.heightSegments);
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
      this.geometry = new three.TetrahedronBufferGeometry(this.radius, this.detail);
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
      this.geometry = new three.TorusBufferGeometry(this.radius, this.tube, this.radialSegments, this.tubularSegments, this.arc);
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
      this.geometry = new three.TorusKnotBufferGeometry(this.radius, this.tube, this.radialSegments, this.tubularSegments, this.p, this.q);
    },
  },
};

var TubeGeometry = {
  extends: Geometry,
  props: {
    path: three.Curve,
    tubularSegments: { type: Number, default: 64 },
    radius: { type: Number, default: 1 },
    radiusSegments: { type: Number, default: 8 },
    closed: { type: Boolean, default: false },
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new three.TubeBufferGeometry(this.path, this.tubularSegments, this.radius, this.radiusSegments, this.closed);
    },
  },
};

var Light = {
  inject: {
    scene: 'scene',
    parent: {
      from: 'group',
      default: function () { return vue.inject('scene'); },
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
      vue.watch(function () { return this$1[p]; }, function () {
        if (p === 'color') {
          this$1.light.color = new three.Color(this$1.color);
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
    this.light = new three.AmbientLight(this.color, this.intensity);
  },
  __hmrId: 'AmbientLight',
};

var DirectionalLight = {
  extends: Light,
  props: {
    target: Object,
  },
  created: function created() {
    this.light = new three.DirectionalLight(this.color, this.intensity);
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
    this.light = new three.PointLight(this.color, this.intensity, this.distance, this.decay);
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

    this.light = new three.SpotLight(this.color, this.intensity, this.distance, this.angle, this.penumbra, this.decay);
    ['angle', 'decay', 'distance', 'penumbra'].forEach(function (p) {
      vue.watch(function () { return this$1[p]; }, function () {
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
    side: { type: Number, default: three.FrontSide },
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
        vue.watch(function () { return this$1[p]; }, function () {
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
      this.material = new three.MeshBasicMaterial(propsValues(this.$props, ['id']));
    },
  },
  __hmrId: 'BasicMaterial',
};

var LambertMaterial = {
  extends: Material,
  methods: {
    createMaterial: function createMaterial() {
      this.material = new three.MeshLambertMaterial(propsValues(this.$props, ['id']));
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
      opts.matcap = new three.TextureLoader().load(src);
      this.material = new three.MeshMatcapMaterial(opts);
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
      this.material = new three.MeshPhongMaterial(propsValues(this.$props, ['id']));
    },
    addWatchers: function addWatchers() {
      var this$1 = this;

      ['emissive', 'emissiveIntensity', 'reflectivity', 'shininess', 'specular'].forEach(function (p) {
        vue.watch(function () { return this$1[p]; }, function (value) {
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
  normalScale: { type: Object, default: function () { return new three.Vector2(1, 1); } },
  roughness: { type: Number, default: 1 },
  refractionRatio: { type: Number, default: 0.98 },
  wireframe: Boolean,
};

var StandardMaterial = {
  extends: Material,
  props: props,
  methods: {
    createMaterial: function createMaterial() {
      this.material = new three.MeshStandardMaterial(propsValues(this.$props, ['id', 'normalScale']));
    },
    addWatchers: function addWatchers() {
      var this$1 = this;

      // todo : use setProp ?
      Object.keys(props).forEach(function (p) {
        if (p === 'normalScale') { return; }
        vue.watch(function () { return this$1[p]; }, function (value) {
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
      this.material = new three.MeshPhysicalMaterial(propsValues(this.$props, ['id']));
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

var meshphongFragHead = three.ShaderChunk.meshphong_frag.slice(0, three.ShaderChunk.meshphong_frag.indexOf('void main() {'));
var meshphongFragBody = three.ShaderChunk.meshphong_frag.slice(three.ShaderChunk.meshphong_frag.indexOf('void main() {'));

var SubsurfaceScatteringShader = {

  uniforms: three.UniformsUtils.merge([
    three.ShaderLib.phong.uniforms,
    {
      thicknessColor: { value: new three.Color(0x668597) },
      thicknessDistortion: { value: 0.1 },
      thicknessAmbient: { value: 0.0 },
      thicknessAttenuation: { value: 0.1 },
      thicknessPower: { value: 2.0 },
      thicknessScale: { value: 10.0 },
    } ]),

  vertexShader: ("\n    #define USE_UV\n    " + (three.ShaderChunk.meshphong_vert) + "\n  "),

  fragmentShader: "\n    #define USE_UV\n    #define SUBSURFACE\n\n    " + meshphongFragHead + "\n\n    uniform float thicknessPower;\n    uniform float thicknessScale;\n    uniform float thicknessDistortion;\n    uniform float thicknessAmbient;\n    uniform float thicknessAttenuation;\n    uniform vec3 thicknessColor;\n\n    void RE_Direct_Scattering(const in IncidentLight directLight, const in vec2 uv, const in GeometricContext geometry, inout ReflectedLight reflectedLight) {\n      #ifdef USE_COLOR\n        vec3 thickness = vColor * thicknessColor;\n      #else\n        vec3 thickness = thicknessColor;\n      #endif\n      vec3 scatteringHalf = normalize(directLight.direction + (geometry.normal * thicknessDistortion));\n      float scatteringDot = pow(saturate(dot(geometry.viewDir, -scatteringHalf)), thicknessPower) * thicknessScale;\n      vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * thickness;\n      reflectedLight.directDiffuse += scatteringIllu * thicknessAttenuation * directLight.color;\n    }\n  " + meshphongFragBody.replace(
    '#include <lights_fragment_begin>',
    replaceAll(
      three.ShaderChunk.lights_fragment_begin,
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
      var uniforms = three.UniformsUtils.clone(params.uniforms);

      Object.entries(this.$props).forEach(function (ref) {
        var key = ref[0];
        var value = ref[1];

        var _key = key, _value = value;
        if (['color', 'thicknessColor'].includes(key)) {
          if (key === 'color') { _key = 'diffuse'; }
          _value = new three.Color(value);
        }
        if (!['id', 'transparent', 'vertexColors'].includes(key)) {
          uniforms[_key].value = _value;
        }
      });

      this.material = new three.ShaderMaterial(Object.assign({}, params,
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
      this.material = new three.MeshToonMaterial(propsValues(this.$props, ['id']));
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
    vue.watch(function () { return this$1.src; }, this.refreshTexture);
  },
  unmounted: function unmounted() {
    this.material.setTexture(null, this.id);
    this.texture.dispose();
  },
  methods: {
    createTexture: function createTexture() {
      this.texture = new three.TextureLoader().load(this.src, this.onLoaded, this.onProgress, this.onError);
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
    vue.watch(function () { return this$1.path; }, this.refreshTexture);
    vue.watch(function () { return this$1.urls; }, this.refreshTexture);
  },
  unmounted: function unmounted() {
    this.material.setTexture(null, this.id);
    this.texture.dispose();
  },
  methods: {
    createTexture: function createTexture() {
      this.texture = new three.CubeTextureLoader()
        .setPath(this.path)
        .load(this.urls, this.onLoaded, this.onProgress, this.onError);
    },
    refreshTexture: function refreshTexture() {
      this.createTexture();
      this.material.setTexture(this.texture, this.id);
      if (this.refraction) {
        this.texture.mapping = three.CubeRefractionMapping;
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
      default: function () { return vue.inject('scene'); },
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
      this.mesh = new three.Mesh(this.geometry, this.material);

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
        vue.watch(function () { return this$1[p]; }, function () { this$1.mesh[p] = this$1[p]; });
      });

      vue.watch(function () { return this$1.materialId; }, function () {
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
      vue.watch(function () { return this$1[prop]; }, function () {
        this$1.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry: function createGeometry() {
      if (this.size) {
        this.geometry = new three.BoxBufferGeometry(this.size, this.size, this.size);
      } else {
        this.geometry = new three.BoxBufferGeometry(this.width, this.height, this.depth);
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
      vue.watch(function () { return this$1[prop]; }, function () {
        this$1.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new three.CircleBufferGeometry(this.radius, this.segments, this.thetaStart, this.thetaLength);
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
      vue.watch(function () { return this$1[prop]; }, function () {
        this$1.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new three.ConeBufferGeometry(this.radius, this.height, this.radialSegments, this.heightSegments, this.openEnded, this.thetaStart, this.thetaLength);
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
      vue.watch(function () { return this$1[prop]; }, function () {
        this$1.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new three.CylinderBufferGeometry(this.radiusTop, this.radiusBottom, this.height, this.radialSegments, this.heightSegments, this.openEnded, this.thetaStart, this.thetaLength);
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
      vue.watch(function () { return this$1[prop]; }, function () {
        this$1.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new three.DodecahedronBufferGeometry(this.radius, this.detail);
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
      vue.watch(function () { return this$1[prop]; }, function () {
        this$1.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new three.IcosahedronBufferGeometry(this.radius, this.detail);
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
      vue.watch(function () { return this$1[prop]; }, function () {
        this$1.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new three.LatheBufferGeometry(this.points, this.segments, this.phiStart, this.phiLength);
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
      vue.watch(function () { return this$1[prop]; }, function () {
        this$1.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new three.OctahedronBufferGeometry(this.radius, this.detail);
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
      vue.watch(function () { return this$1[prop]; }, function () {
        this$1.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new three.PlaneBufferGeometry(this.width, this.height, this.widthSegments, this.heightSegments);
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
      vue.watch(function () { return this$1[prop]; }, function () {
        this$1.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new three.PolyhedronBufferGeometry(this.vertices, this.indices, this.radius, this.detail);
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
      vue.watch(function () { return this$1[prop]; }, function () {
        this$1.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new three.RingBufferGeometry(this.innerRadius, this.outerRadius, this.thetaSegments, this.phiSegments, this.thetaStart, this.thetaLength);
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
      this.geometry = new three.SphereBufferGeometry(this.radius, this.widthSegments, this.heightSegments);
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
      vue.watch(function () { return this$1[prop]; }, function () {
        this$1.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new three.TetrahedronBufferGeometry(this.radius, this.detail);
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
      vue.watch(function () { return this$1[p]; }, function () {
        if (this$1.font) { this$1.refreshGeometry(); }
      });
    });

    var loader = new three.FontLoader();
    loader.load(this.fontSrc, function (font) {
      this$1.font = font;
      this$1.createGeometry();
      this$1.initMesh();
    });
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new three.TextBufferGeometry(this.text, {
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
      vue.watch(function () { return this$1[prop]; }, function () {
        this$1.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new three.TorusBufferGeometry(this.radius, this.tube, this.radialSegments, this.tubularSegments, this.arc);
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
      vue.watch(function () { return this$1[prop]; }, function () {
        this$1.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new three.TorusKnotBufferGeometry(this.radius, this.tube, this.tubularSegments, this.radialSegments, this.p, this.q);
    },
  },
  __hmrId: 'TorusKnot',
};

var Tube = {
  extends: Mesh,
  props: {
    path: three.Curve,
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
      vue.watch(function () { return this$1[prop]; }, function () {
        this$1.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new three.TubeBufferGeometry(this.path, this.tubularSegments, this.radius, this.radialSegments, this.closed);
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
      var cubeRT = new three.WebGLCubeRenderTarget(this.cubeRTSize, { format: three.RGBFormat, generateMipmaps: true, minFilter: three.LinearMipmapLinearFilter });
      this.cubeCamera = new three.CubeCamera(this.cubeCameraNear, this.cubeCameraFar, cubeRT);
      useBindProp(this, 'position', this.cubeCamera.position);
      this.parent.add(this.cubeCamera);

      this.material.side = three.FrontSide;
      this.material.envMap = cubeRT.texture;
      this.material.envMapIntensity = 10;
      this.material.metalness = 0;
      this.material.roughness = 0;
      this.material.opacity = 0.75;
      this.material.transparent = true;
      this.material.premultipliedAlpha = true;
      this.material.needsUpdate = true;

      this.materialBack = this.material.clone();
      this.materialBack.side = three.BackSide;
      this.materialBack.envMapIntensity = 5;
      this.materialBack.metalness = 1;
      this.materialBack.roughness = 0;
      this.materialBack.opacity = 0.5;

      this.meshBack = new three.Mesh(this.geometry, this.materialBack);

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

    vue.watch(function () { return this$1.src; }, this.refreshTexture);

    ['width', 'height'].forEach(function (p) {
      vue.watch(function () { return this$1[p]; }, this$1.resize);
    });

    if (this.keepSize) { this.three.onAfterResize(this.resize); }
  },
  methods: {
    createGeometry: function createGeometry() {
      this.geometry = new three.PlaneBufferGeometry(1, 1, 1, 1);
    },
    createMaterial: function createMaterial() {
      this.material = new three.MeshBasicMaterial({ side: three.DoubleSide, map: this.loadTexture() });
    },
    loadTexture: function loadTexture() {
      return new three.TextureLoader().load(this.src, this.onLoaded);
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
    var parent = vue.inject('group', vue.inject('scene'));
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

      this.mesh = new three.InstancedMesh(this.geometry, this.material, this.count);

      useBindProp(this, 'position', this.mesh.position);
      useBindProp(this, 'rotation', this.mesh.rotation);
      useBindProp(this, 'scale', this.mesh.scale);

      ['castShadow', 'receiveShadow'].forEach(function (p) {
        this$1.mesh[p] = this$1[p];
        vue.watch(function () { return this$1[p]; }, function () { this$1.mesh[p] = this$1[p]; });
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
      var cubeRT = new three.WebGLCubeRenderTarget(this.cubeRTSize, { format: three.RGBFormat, generateMipmaps: true, minFilter: three.LinearMipmapLinearFilter });
      this.cubeCamera = new three.CubeCamera(this.cubeCameraNear, this.cubeCameraFar, cubeRT);
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
      var cubeRT = new three.WebGLCubeRenderTarget(this.cubeRTSize, { mapping: three.CubeRefractionMapping, format: three.RGBFormat, generateMipmaps: true, minFilter: three.LinearMipmapLinearFilter });
      this.cubeCamera = new three.CubeCamera(this.cubeCameraNear, this.cubeCameraFar, cubeRT);
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
    var parent = vue.inject('group', vue.inject('scene'));
    return { parent: parent };
  },
  mounted: function mounted() {
    this.texture = new three.TextureLoader().load(this.src, this.onLoaded);
    this.material = new three.SpriteMaterial({ map: this.texture });
    this.sprite = new three.Sprite(this.material);
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
      this$1.composer = new EffectComposer_js.EffectComposer(this$1.three.renderer);
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
    var pass = new RenderPass_js.RenderPass(this.three.scene, this.three.camera);
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
    var pass = new BokehPass_js.BokehPass(this.three.scene, this.three.camera, params);
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
    var pass = new FilmPass_js.FilmPass(this.noiseIntensity, this.scanlinesIntensity, this.scanlinesCount, this.grayscale);
    this.passes.push(pass);
    this.pass = pass;
  },
  __hmrId: 'FilmPass',
};

var FXAAPass = {
  extends: EffectPass,
  mounted: function mounted() {
    var pass = new ShaderPass_js.ShaderPass(FXAAShader_js.FXAAShader);
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

    var pass = new HalftonePass_js.HalftonePass(this.three.size.width, this.three.size.height, {});

    ['shape', 'radius', 'rotateR', 'rotateG', 'rotateB', 'scatter'].forEach(function (p) {
      pass.uniforms[p].value = this$1[p];
      vue.watch(function () { return this$1[p]; }, function () {
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
    var pass = new SMAAPass_js.SMAAPass(this.three.size.width, this.three.size.height);
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
    start: { value: new three.Vector2() },
    end: { value: new three.Vector2() },
    delta: { value: new three.Vector2() },
    texSize: { value: new three.Vector2() },
  },
  vertexShader: DefaultShader.vertexShader,
  fragmentShader: "\n    uniform sampler2D tDiffuse;\n    uniform float blurRadius;\n    uniform float gradientRadius;\n    uniform vec2 start;\n    uniform vec2 end;\n    uniform vec2 delta;\n    uniform vec2 texSize;\n    varying vec2 vUv;\n\n    float random(vec3 scale, float seed) {\n      /* use the fragment position for a different seed per-pixel */\n      return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n    }\n\n    void main() {\n      vec4 color = vec4(0.0);\n      float total = 0.0;\n\n      /* randomize the lookup values to hide the fixed number of samples */\n      float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n\n      vec2 normal = normalize(vec2(start.y - end.y, end.x - start.x));\n      float radius = smoothstep(0.0, 1.0, abs(dot(vUv * texSize - start, normal)) / gradientRadius) * blurRadius;\n      for (float t = -30.0; t <= 30.0; t++) {\n          float percent = (t + offset - 0.5) / 30.0;\n          float weight = 1.0 - abs(percent);\n          vec4 texel = texture2D(tDiffuse, vUv + delta / texSize * percent * radius);\n          // vec4 texel2 = texture2D(tDiffuse, vUv + vec2(-delta.y, delta.x) / texSize * percent * radius);\n\n          /* switch to pre-multiplied alpha to correctly blur transparent images */\n          texel.rgb *= texel.a;\n          // texel2.rgb *= texel2.a;\n\n          color += texel * weight;\n          total += 2.0 * weight;\n      }\n\n      gl_FragColor = color / total;\n\n      /* switch back from pre-multiplied alpha */\n      gl_FragColor.rgb /= gl_FragColor.a + 0.00001;\n    }\n  ",
};

function useBindPropValue(src, srcProp, dst, dstProp) {
  if ( dstProp === void 0 ) dstProp = 'value';

  if (src[srcProp]) {
    dst[dstProp] = src[srcProp];
    vue.watch(function () { return src[srcProp]; }, function (value) {
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

    this.pass = new ShaderPass_js.ShaderPass(TiltShift);
    this.passes.push(this.pass);

    this.pass1 = new ShaderPass_js.ShaderPass(TiltShift);
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
      vue.watch(function () { return this$1[p]; }, this$1.updateFocusLine);
    });

    this.pass.setSize = function (width, height) {
      uniforms.texSize.value.set(width, height);
    };
  },
  methods: {
    updateFocusLine: function updateFocusLine() {
      this.uniforms.start.value.copy(this.start);
      this.uniforms.end.value.copy(this.end);
      var dv = new three.Vector2().copy(this.end).sub(this.start).normalize();
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
    var size = new three.Vector2(this.three.size.width, this.three.size.height);
    var pass = new UnrealBloomPass_js.UnrealBloomPass(size, this.strength, this.radius, this.threshold);
    this.passes.push(pass);
    this.pass = pass;
  },
  __hmrId: 'UnrealBloomPass',
};

// From https://github.com/evanw/glfx.js

var ZoomBlur = {
  uniforms: {
    tDiffuse: { value: null },
    center: { value: new three.Vector2(0.5, 0.5) },
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
    this.pass = new ShaderPass_js.ShaderPass(ZoomBlur);
    this.passes.push(this.pass);

    var uniforms = this.uniforms = this.pass.uniforms;
    useBindProp(this, 'center', uniforms.center.value);
    useBindPropValue(this, 'strength', uniforms.strength);
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

exports.AmbientLight = AmbientLight;
exports.BasicMaterial = BasicMaterial;
exports.BokehPass = BokehPass;
exports.Box = Box;
exports.BoxGeometry = BoxGeometry;
exports.Camera = PerspectiveCamera;
exports.Circle = Circle;
exports.CircleGeometry = CircleGeometry;
exports.Cone = Cone;
exports.ConeGeometry = ConeGeometry;
exports.CubeTexture = CubeTexture;
exports.Cylinder = Cylinder;
exports.CylinderGeometry = CylinderGeometry;
exports.DirectionalLight = DirectionalLight;
exports.Dodecahedron = Dodecahedron;
exports.DodecahedronGeometry = DodecahedronGeometry;
exports.EffectComposer = EffectComposer;
exports.FXAAPass = FXAAPass;
exports.FilmPass = FilmPass;
exports.Gem = Gem;
exports.Group = Group;
exports.HalftonePass = HalftonePass;
exports.Icosahedron = Icosahedron;
exports.IcosahedronGeometry = IcosahedronGeometry;
exports.Image = Image;
exports.InstancedMesh = InstancedMesh;
exports.LambertMaterial = LambertMaterial;
exports.Lathe = Lathe;
exports.LatheGeometry = LatheGeometry;
exports.MatcapMaterial = MatcapMaterial;
exports.Mesh = Mesh;
exports.MirrorMesh = MirrorMesh;
exports.Octahedron = Octahedron;
exports.OctahedronGeometry = OctahedronGeometry;
exports.OrthographicCamera = OrthographicCamera;
exports.PerspectiveCamera = PerspectiveCamera;
exports.PhongMaterial = PhongMaterial;
exports.PhysicalMaterial = PhysicalMaterial;
exports.Plane = Plane;
exports.PointLight = PointLight;
exports.Polyhedron = Polyhedron;
exports.PolyhedronGeometry = PolyhedronGeometry;
exports.RefractionMesh = RefractionMesh;
exports.RenderPass = RenderPass;
exports.Renderer = Renderer;
exports.Ring = Ring;
exports.RingGeometry = RingGeometry;
exports.SMAAPass = SMAAPass;
exports.Scene = Scene;
exports.Sphere = Sphere;
exports.SphereGeometry = SphereGeometry;
exports.SpotLight = SpotLight;
exports.Sprite = Sprite;
exports.StandardMaterial = StandardMaterial;
exports.SubSurfaceMaterial = SubSurfaceMaterial;
exports.Tetrahedron = Tetrahedron;
exports.TetrahedronGeometry = TetrahedronGeometry;
exports.Text = Text;
exports.Texture = Texture;
exports.TiltShiftPass = TiltShiftPass;
exports.ToonMaterial = ToonMaterial;
exports.Torus = Torus;
exports.TorusGeometry = TorusGeometry;
exports.TorusKnot = TorusKnot;
exports.TorusKnotGeometry = TorusKnotGeometry;
exports.TroisJSVuePlugin = TroisJSVuePlugin;
exports.Tube = Tube;
exports.TubeGeometry = TubeGeometry;
exports.UnrealBloomPass = UnrealBloomPass;
exports.ZoomBlurPass = ZoomBlurPass;
exports.getMatcapUrl = getMatcapUrl;
exports.lerp = lerp;
exports.lerpv2 = lerpv2;
exports.lerpv3 = lerpv3;
exports.limit = limit;
exports.propsValues = propsValues;
exports.setFromProp = setFromProp;
