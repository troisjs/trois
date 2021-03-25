import {
  Plane,
  Raycaster,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Three.js helper
 */
export default function useThree() {
  // default conf
  const conf = {
    canvas: null,
    antialias: true,
    alpha: false,
    autoClear: true,
    orbit_ctrl: false,
    // mouse_move: false,
    // mouse_raycast: false,
    // mouse_over: false,
    use_pointer: true,
    click: false,
    resize: true,
    width: 0,
    height: 0,
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

  // mouse tracking
  const mouse = new Vector2(Infinity, Infinity);
  const mouseV3 = new Vector3();
  const mousePlane = new Plane(new Vector3(0, 0, 1), 0);
  const raycaster = new Raycaster();

  // raycast objects
  const intersectObjects = [];

  // returned object
  const obj = {
    conf,
    renderer: null,
    camera: null,
    cameraCtrl: null,
    materials: {},
    scene: null,
    size,
    mouse, mouseV3,
    raycaster,
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

    if (conf.orbit_ctrl) {
      obj.orbitCtrl = new OrbitControls(obj.camera, obj.renderer.domElement);
      if (conf.orbit_ctrl instanceof Object) {
        Object.entries(conf.orbit_ctrl).forEach(([key, value]) => {
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

    // conf.mouse_move = conf.mouse_move || conf.mouse_over;
    if (conf.use_pointer) {
      if (conf.use_pointer === true) {
        // use renderer as mousemove by default
        obj.mouse_move_element = obj.renderer.domElement;
      } else {
        // use custom element as mousemove element
        obj.mouse_move_element = conf.use_pointer;
      }
      obj.mouse_move_element.addEventListener('mousemove', onMousemove);
      obj.mouse_move_element.addEventListener('mouseleave', onMouseleave);
      obj.mouse_move_element.addEventListener('touchstart', onTouchstart);
      obj.mouse_move_element.addEventListener('touchmove', onTouchmove)
    }

    if (conf.click) {
      obj.renderer.domElement.addEventListener('click', onClick);
    }

    afterInitCallbacks.forEach(c => c());

    return true;
  };

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
  }

  /**
   * remove intersect object
   */
  function removeIntersectObject(o) {
    const i = intersectObjects.indexOf(o);
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
    if (obj.orbitCtrl) obj.orbitCtrl.dispose();
    this.renderer.dispose();
  }

  /**
   */
  function updateMouse(e) {
    const rect = obj.mouse_move_element.getBoundingClientRect();
    mouse.x = ((e.x - rect.left) / size.width) * 2 - 1;
    mouse.y = -((e.y - rect.top) / size.height) * 2 + 1;
  }

  /**
   * click listener
   */
  function onClick(e) {
    updateMouse(e);
    raycaster.setFromCamera(mouse, obj.camera);
    const objects = raycaster.intersectObjects(intersectObjects);
    for (let i = 0; i < objects.length; i++) {
      const o = objects[i].object;
      if (o.onClick) o.onClick(e);
    }
  }

  /**
   * mousemove listener
   */
  function onMousemove(e) {
    updateMouse(e);
    onMousechange(e);
  }

  /**
   * mouseleave listener
   */
  function onMouseleave(e) {
    // mouse.x = 0;
    // mouse.y = 0;
    onMousechange(e);
  }

  /**
   * mouse change
   */
  function onMousechange(e) {
    // if (conf.mouse_over || conf.mouse_raycast) {
    //   raycaster.setFromCamera(mouse, obj.camera);

    //   if (conf.mouse_raycast) {
    //     // get mouse 3d position
    //     obj.camera.getWorldDirection(mousePlane.normal);
    //     mousePlane.normal.normalize();
    //     raycaster.ray.intersectPlane(mousePlane, mouseV3);
    //   }

    //   if (conf.mouse_over) {
    //     const onObjects = raycaster.intersectObjects(intersectObjects);
    //     const offObjects = [...intersectObjects];
    //     for (let i = 0; i < onObjects.length; i++) {
    //       const o = onObjects[i].object;
    //       if (!o.hover && o.onHover) {
    //         o.hover = true;
    //         o.onHover(true);
    //       }
    //       offObjects.splice(offObjects.indexOf(o), 1);
    //     }
    //     for (let i = 0; i < offObjects.length; i++) {
    //       const o = offObjects[i];
    //       if (o.hover && o.onHover) {
    //         o.hover = false;
    //         o.onHover(false);
    //       }
    //     }
    //   }
    // }
  }

  /**
   * touch start
   */
  function onTouchstart(evt) {
    console.log('TODO: touchstart', evt)
  }

  /**
   * touch move
   */
  function onTouchmove(evt) {
    console.log('TODO: touchmove', evt)
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
