import { h } from 'vue';
import { Vector2, Vector3, Plane as Plane$1, Raycaster, WebGLRenderer, PerspectiveCamera as PerspectiveCamera$1, Scene as Scene$1, Color, BoxBufferGeometry, SphereBufferGeometry, AmbientLight as AmbientLight$1, PointLight as PointLight$1, SpotLight as SpotLight$1, FrontSide, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, MeshPhysicalMaterial, MeshStandardMaterial, Mesh as Mesh$1, PlaneBufferGeometry, InstancedMesh as InstancedMesh$1 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer as EffectComposer$1 } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass as RenderPass$1 } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass as BokehPass$1 } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { UnrealBloomPass as UnrealBloomPass$1 } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

/**
 * Three.js helper
 */
function useThree() {
  // default conf
  var conf = {
    canvas: null,
    antialias: true,
    alpha: false,
    orbit_ctrl: false,
    mouse_move: false,
    mouse_raycast: false,
    resize: 'window',
    width: 0,
    height: 0,
  };

  // size
  var size = {
    width: 0, height: 0,
    wWidth: 0, wHeight: 0,
    ratio: 0,
  };

  // handlers
  var afterInitHandlers = [];
  var afterResizeHandlers = [];
  var beforeRenderHandlers = [];

  // mouse tracking
  var mouse = new Vector2();
  var mouseV3 = new Vector3();
  var mousePlane = new Plane$1(new Vector3(0, 0, 1), 0);
  var raycaster = new Raycaster();

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
    onAfterResize: onAfterResize,
    onBeforeRender: onBeforeRender,
  };

  /**
   * init three
   */
  function init(params) {
    if (params) {
      for (var [key, value] of Object.entries(params)) {
        conf[key] = value;
      }
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

    if (conf.orbit_ctrl) {
      obj.orbitCtrl = new OrbitControls(obj.camera, obj.renderer.domElement);
      if (conf.orbit_ctrl instanceof Object) {
        for (var [key$1, value$1] of Object.entries(conf.orbit_ctrl)) {
          obj.orbitCtrl[key$1] = value$1;
        }
      }
    }

    if (conf.width && conf.height) {
      setSize(conf.width, conf.height);
    } else if (conf.resize) {
      onResize();
      window.addEventListener('resize', onResize);
    }

    if (conf.mouse_move) {
      if (conf.mouse_move === 'body') {
        obj.mouse_move_element = document.body;
      } else {
        obj.mouse_move_element = obj.renderer.domElement;
      }
      obj.mouse_move_element.addEventListener('mousemove', onMousemove);
      obj.mouse_move_element.addEventListener('mouseleave', onMouseleave);
    }

    afterInitHandlers.forEach(function (c) { return c(); });

    return true;
  }
  /**
   * add after init handler
   */
  function onAfterInit(callback) {
    afterInitHandlers.push(callback);
  }

  /**
   * add after resize handler
   */
  function onAfterResize(callback) {
    afterResizeHandlers.push(callback);
  }

  /**
   * add before render handler
   */
  function onBeforeRender(callback) {
    beforeRenderHandlers.push(callback);
  }

  /**
   * default render
   */
  function render() {
    if (obj.orbitCtrl) { obj.orbitCtrl.update(); }
    beforeRenderHandlers.forEach(function (c) { return c(); });
    obj.renderer.render(obj.scene, obj.camera);
  }

  /**
   * composer render
   */
  function renderC() {
    if (obj.orbitCtrl) { obj.orbitCtrl.update(); }
    beforeRenderHandlers.forEach(function (c) { return c(); });
    obj.composer.render();
  }

  /**
   * remove listeners
   */
  function dispose() {
    window.removeEventListener('resize', onResize);
    if (obj.mouse_move_element) {
      obj.mouse_move_element.removeEventListener('mousemove', onMousemove);
      obj.mouse_move_element.removeEventListener('mouseleave', onMouseleave); 
    }
  }

  /**
   * mousemove listener
   */
  function onMousemove(e) {
    mouse.x = (e.clientX / size.width) * 2 - 1;
    mouse.y = -(e.clientY / size.height) * 2 + 1;
    updateMouseV3();
  }

  /**
   * mouseleave listener
   */
  function onMouseleave(e) {
    mouse.x = 0;
    mouse.y = 0;
    updateMouseV3();
  }

  /**
   * get 3d mouse position
   */
  function updateMouseV3() {
    if (conf.mouse_raycast) {
      obj.camera.getWorldDirection(mousePlane.normal);
      mousePlane.normal.normalize();
      raycaster.setFromCamera(mouse, obj.camera);
      raycaster.ray.intersectPlane(mousePlane, mouseV3);
    }
  }

  /**
   * resize listener
   */
  function onResize() {
    if (conf.resize === 'window') {
      setSize(window.innerWidth, window.innerHeight);
    } else {
      setSize(conf.resize.clientWidth, conf.resize.clientHeight);
    }
    afterResizeHandlers.forEach(function (c) { return c(); });
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

    var wsize = getCameraSize();
    size.wWidth = wsize[0]; size.wHeight = wsize[1];
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
    antialias: {
      type: Boolean,
      default: true,
    },
    alpha: {
      type: Boolean,
      default: false,
    },
    shadow: {
      type: Boolean,
      default: false,
    },
    orbitCtrl: {
      type: [Boolean, Object],
      default: false,
    },
    mouseMove: {
      type: [Boolean, String],
      default: false,
    },
    mouseRaycast: {
      type: Boolean,
      default: false,
    },
    resize: {
      type: [Boolean, String, Element],
      default: 'window',
    },
    width: String,
    height: String,
  },
  setup: function setup(props) {
    return {
      three: useThree(),
      raf: true,
    };
  },
  provide: function provide() {
    return {
      three: this.three,
    };
  },
  mounted: function mounted() {
    var params = {
      canvas: this.$refs.canvas,
      antialias: this.antialias,
      alpha: this.alpha,
      orbit_ctrl: this.orbitCtrl,
      mouse_move: this.mouseMove,
      mouse_raycast: this.mouseRaycast,
      resize: this.resize,
      width: this.width,
      height: this.height,
    };

    if (this.three.init(params)) {
      this.three.renderer.shadowMap.enabled = this.shadow;
      if (this.three.composer) { this.animateC(); }
      else { this.animate(); }
    }  },
  beforeUnmount: function beforeUnmount() {
    this.raf = false;
    this.three.dispose();
  },
  methods: {
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
    return h(
      'canvas',
      { ref: 'canvas' },
      this.$slots.default()
    );
  },
};

function setFromProp(o, prop) {
  if (prop instanceof Object) {
    for (var [key, value] of Object.entries(prop)) {
      o[key] = value;
    }
  }
}
function lerp(value1, value2, amount) {
  amount = amount < 0 ? 0 : amount;
  amount = amount > 1 ? 1 : amount;
  return value1 + (value2 - value1) * amount;
}
function lerpv3(v1, v2, amount) {
  v1.x = lerp(v1.x, v2.x, amount);
  v1.y = lerp(v1.y, v2.y, amount);
  v1.z = lerp(v1.z, v2.z, amount);
}

var PerspectiveCamera = {
  inject: ['three'],
  props: {
    fov: {
      type: Number,
      default: 50,
    },
    position: Object,
  },
  created: function created() {
    var camera = new PerspectiveCamera$1(this.fov);
    setFromProp(camera.position, this.position);
    this.three.camera = camera;
  },
  render: function render() {
    return [];
  },
};

var Scene = {
  inject: ['three'],
  props: {
    id: String,
    background: [String, Number],
  },
  setup: function setup (props) {
    var scene = new Scene$1();
    if (props.background) { scene.background = new Color(props.background); }
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
  render: function render() {
    if (this.$slots.default) {
      return this.$slots.default();
    }
    return [];
  },
};

var Geometry = {
  inject: ['parent'],
  beforeMount: function beforeMount() {
    if (!this.parent) {
      console.error('Missing parent Mesh');
    }
  },
  unmounted: function unmounted() {
    this.parent.geometry.dispose();
  },
  render: function render() {
    return [];
  },
};

var BoxGeometry = {
  extends: Geometry,
  props: {
    size: {
      type: Number,
    },
    width: {
      type: Number,
      default: 1,
    },
    height: {
      type: Number,
      default: 1,
    },
    depth: {
      type: Number,
      default: 1,
    },
  },
  mounted: function mounted() {
    if (this.size) {
      this.parent.geometry = new BoxBufferGeometry(this.size, this.size, this.size);
    } else {
      this.parent.geometry = new BoxBufferGeometry(this.width, this.height, this.depth);
    }
  },
};

var SphereGeometry = {
  extends: Geometry,
  props: {
    radius: Number,
    widthSegments: {
      type: Number,
      default: 12,
    },
    heightSegments: {
      type: Number,
      default: 12,
    },
  },
  mounted: function mounted() {
    this.parent.geometry = new SphereBufferGeometry(this.radius, this.widthSegments, this.heightSegments);
  },
};

var Light = {
  inject: ['scene'],
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
  mounted: function mounted() {
    setFromProp(this.light.position, this.position);

    if (this.light.shadow) {
      this.light.castShadow = this.castShadow;
      setFromProp(this.light.shadow.mapSize, this.shadowMapSize);
    }

    this.scene.add(this.light);
    if (this.light.target) { this.scene.add(this.light.target); }
  },
  render: function render() {
    return [];
  },
};

var AmbientLight = {
  extends: Light,
  created: function created() {
    this.light = new AmbientLight$1(this.color, this.intensity);
  },
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
};

var SpotLight = {
  extends: Light,
  props: {
    distance: {
      type: Number,
      default: 0,
    },
    angle: {
      type: Number,
      default: Math.PI / 3,
    },
    penumbra: {
      type: Number,
      default: 0,
    },
    decay: {
      type: Number,
      default: 1,
    },
  },
  created: function created() {
    this.light = new SpotLight$1(this.color, this.intensity, this.distance, this.angle, this.penumbra, this.decay);
  },
};

var Material = {
  inject: ['three'],
  props: {
    id: String,
    color: {
      type: [String, Number],
      default: '#ffffff',
    },
    depthTest: {
      type: Boolean,
      default: true,
    },
    depthWrite: {
      type: Boolean,
      default: true,
    },
    fog: {
      type: Boolean,
      default: false,
    },
    opacity: {
      type: Number,
      default: 1,
    },
    side: {
      type: Number,
      default: FrontSide,
    },
    transparent: {
      type: Boolean,
      default: false,
    },
    vertexColors: {
      type: Boolean,
      default: false,
    },
  },
  mounted: function mounted() {
    this.three.materials[this.id] = this.material;
  },
  unmounted: function unmounted() {
    this.material.dispose();
  },
  methods: {
    propsValues: function propsValues() {
      var props = {};
      for (var [key, value] of Object.entries(this.$props)) {
        if (key !== 'id') { props[key] = value; }
      }
      return props;
    },
  },
  render: function render() {
    return [];
  },
};

var BasicMaterial = {
  extends: Material,
  created: function created() {
    this.material = new MeshBasicMaterial({
      color: this.color,
    });
  },
};

var LambertMaterial = {
  extends: Material,
  created: function created() {
    this.material = new MeshLambertMaterial({
      color: this.color,
    });
  },
};

var PhongMaterial = {
  extends: Material,
  created: function created() {
    this.material = new MeshPhongMaterial({
      color: this.color,
    });
  },
};

var PhysicalMaterial = {
  extends: Material,
  created: function created() {
    this.material = new MeshPhysicalMaterial({
      color: this.color,
    });
  },
};

var StandardMaterial = {
  extends: Material,
  props: {
    emissive: {
      type: [Number, String],
      default: 0,
    },
    emissiveIntensity: {
      type: Number,
      default: 1,
    },
    metalness: {
      type: Number,
      default: 0,
    },
    roughness: {
      type: Number,
      default: 1,
    },
  },
  created: function created() {
    this.material = new MeshStandardMaterial(this.propsValues());
  },
};

var Mesh = {
  inject: ['three', 'scene'],
  props: {
    material: String,
    position: Object,
    rotation: Object,
    scale: Object,
    castShadow: {
      type: Boolean,
      default: false,
    },
    receiveShadow: {
      type: Boolean,
      default: false,
    },
  },
  mounted: function mounted() {
    this.mesh = new Mesh$1(this.geometry, this.three.materials[this.material]);
    setFromProp(this.mesh.position, this.position);
    setFromProp(this.mesh.rotation, this.rotation);
    setFromProp(this.mesh.scale, this.scale);
    this.mesh.castShadow = this.castShadow;
    this.mesh.receiveShadow = this.receiveShadow;
    this.scene.add(this.mesh);
  },
  unmounted: function unmounted() {
    this.geometry.dispose();
  },
  render: function render() {
    return [];
  },
};

var Box = {
  extends: Mesh,
  props: {
    size: {
      type: Number,
    },
    width: {
      type: Number,
      default: 1,
    },
    height: {
      type: Number,
      default: 1,
    },
    depth: {
      type: Number,
      default: 1,
    },
  },
  created: function created() {
    if (this.size) {
      this.geometry = new BoxBufferGeometry(this.size, this.size, this.size);
    } else {
      this.geometry = new BoxBufferGeometry(this.width, this.height, this.depth);
    }
  },
};

var Plane = {
  extends: Mesh,
  props: {
    width: {
      type: Number,
      default: 1,
    },
    height: {
      type: Number,
      default: 1,
    },
    widthSegments: {
      type: Number,
      default: 1,
    },
    heightSegments: {
      type: Number,
      default: 1,
    },
  },
  created: function created() {
    this.geometry = new PlaneBufferGeometry(this.width, this.height, this.widthSegments, this.heightSegments);
  },
};

var Sphere = {
  extends: Mesh,
  props: {
    radius: Number,
    widthSegments: {
      type: Number,
      default: 12,
    },
    heightSegments: {
      type: Number,
      default: 12,
    },
  },
  created: function created() {
    this.geometry = new SphereBufferGeometry(this.radius, this.widthSegments, this.heightSegments);
  },
};

var InstancedMesh = {
  inject: ['three', 'scene'],
  props: {
    material: String,
    count: Number,
    position: Object,
    castShadow: {
      type: Boolean,
      default: false,
    },
    receiveShadow: {
      type: Boolean,
      default: false,
    },
  },
  setup: function setup() {
    return {
      conf: {},
    };
  },
  provide: function provide() {
    return {
      parent: this.conf,
    };
  },
  beforeMount: function beforeMount() {
    if (!this.$slots.default) {
      console.error('Missing Geometry');
    }
  },
  mounted: function mounted() {
    this.mesh = new InstancedMesh$1(this.conf.geometry, this.three.materials[this.material], this.count);
    setFromProp(this.mesh.position, this.position);
    this.mesh.castShadow = this.castShadow;
    this.mesh.receiveShadow = this.receiveShadow;
    this.scene.add(this.mesh);
  },
  render: function render() {
    return this.$slots.default();
  },
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
      this$1.passes.forEach(function (pass) {
        this$1.composer.addPass(pass);
      });
      this$1.three.composer = this$1.composer;
    });
  },
  render: function render() {
    return this.$slots.default();
  },
};

var EffectPass = {
  inject: ['three', 'passes'],
  beforeMount: function beforeMount() {
    if (!this.passes) {
      console.error('Missing parent EffectComposer');
    }
  },
  render: function render() {
    return [];
  },
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
  // watch: {
  //   focus() {
  //     this.pass.focus = this.focus;
  //   },
  //   aperture() {
  //     this.pass.aperture = this.aperture;
  //   },
  //   maxblur() {
  //     this.pass.maxblur = this.maxblur;
  //   },
  // },
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
};

var UnrealBloomPass = {
  extends: EffectPass,
  props: {
    strength: {
      type: Number,
      default: 1.5,
    },
    radius: {
      type: Number,
      default: 0,
    },
    threshold: {
      type: Number,
      default: 0,
    },
  },
  // watch: {
  //   strength() {
  //     this.pass.strength = this.strength;
  //   },
  //   radius() {
  //     this.pass.strength = this.radius;
  //   },
  //   threshold() {
  //     this.pass.strength = this.threshold;
  //   },
  // },
  mounted: function mounted() {
    var size = new Vector2(this.three.size.width, this.three.size.height);
    var pass = new UnrealBloomPass$1(size, this.strength, this.radius, this.threshold);
    this.passes.push(pass);
    this.pass = pass;
  },
};

export { AmbientLight, BasicMaterial, BokehPass, Box, BoxGeometry, PerspectiveCamera as Camera, EffectComposer, InstancedMesh, LambertMaterial, PerspectiveCamera, PhongMaterial, PhysicalMaterial, Plane, PointLight, RenderPass, Renderer, Scene, Sphere, SphereGeometry, SpotLight, StandardMaterial, UnrealBloomPass, lerp, lerpv3, setFromProp };
//# sourceMappingURL=trois.module.js.map
