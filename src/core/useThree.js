import {
  WebGLRenderer,
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import usePointer from './usePointer';

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
    use_pointer: false,
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

  // returned object
  const obj = {
    conf,
    renderer: null,
    camera: null,
    cameraCtrl: null,
    scene: null,
    pointer: null,
    intersectObjects: [],
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
  };

  function initPointer() {
    obj.pointer = usePointer({
      camera: obj.camera,
      domElement: obj.renderer.domElement,
      intersectObjects: obj.intersectObjects,
    });

    if (conf.use_pointer || obj.intersectObjects.length) {
      obj.pointer.addListeners();
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
    if (obj.intersectObjects.indexOf(o) === -1) {
      obj.intersectObjects.push(o);
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
    const i = obj.intersectObjects.indexOf(o);
    if (i !== -1) {
      obj.intersectObjects.splice(i, 1);
    }
    // remove listeners if needed
    if (obj.pointer && !conf.use_pointer && obj.intersectObjects.length === 0) {
      obj.pointer.removeListeners();
    }
  }

  /**
   * remove listeners
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
