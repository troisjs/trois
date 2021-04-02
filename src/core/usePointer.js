import { InstancedMesh, Vector2, Vector3 } from 'three';
import useRaycaster from './useRaycaster';

export default function usePointer(options) {
  const {
    camera,
    domElement,
    intersectObjects,
    touch = true,
    resetOnEnd = false,
    resetPosition = new Vector2(Infinity, Infinity),
    resetPositionV3 = new Vector3(Infinity, Infinity, Infinity),
    onIntersectEnter = () => {},
    onIntersectOver = () => {},
    onIntersectMove = () => {},
    onIntersectLeave = () => {},
    onIntersectClick = () => {},
  } = options;

  const position = resetPosition.clone();
  const positionN = new Vector2(Infinity, Infinity);

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
  };

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
  };

  function intersect() {
    if (intersectObjects.length) {
      const intersects = raycaster.intersect(positionN, intersectObjects);
      const offObjects = [...intersectObjects];
      const iMeshes = [];

      intersects.forEach(intersect => {
        const { object } = intersect;
        const { component } = object;

        // only once for InstancedMesh
        if (object instanceof InstancedMesh) {
          if (iMeshes.indexOf(object) !== -1) return;
          iMeshes.push(object);
        }

        if (!object.over) {
          object.over = true;
          const overEvent = { type: 'pointerover', over: true, component, intersect };
          const enterEvent = { ...overEvent, type: 'pointerenter' };
          onIntersectOver(overEvent);
          onIntersectEnter(enterEvent);
          if (component.onPointerOver) component.onPointerOver(overEvent);
          if (component.onPointerEnter) component.onPointerEnter(enterEvent);
        }

        const moveEvent = { type: 'pointermove', component, intersect };
        onIntersectMove(moveEvent);
        if (component.onPointerMove) component.onPointerMove(moveEvent);

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
          if (component.onPointerOver) component.onPointerOver(overEvent);
          if (component.onPointerLeave) component.onPointerLeave(leaveEvent);
        }
      });
    }
  };

  function pointerEnter(event) {
    updatePosition(event);
  };

  function pointerMove(event) {
    updatePosition(event);
    intersect();
  };

  function pointerClick(event) {
    updatePosition(event);
    if (intersectObjects.length) {
      const intersects = raycaster.intersect(positionN, intersectObjects);
      const iMeshes = [];
      intersects.forEach(intersect => {
        const { object } = intersect;
        const { component } = object;

        // only once for InstancedMesh
        if (object instanceof InstancedMesh) {
          if (iMeshes.indexOf(object) !== -1) return;
          iMeshes.push(object);
        }

        const event = { type: 'click', component, intersect };
        onIntersectClick(event);
        if (component.onClick) component.onClick(event);
      });
    }
  };

  function pointerLeave() {
    if (resetOnEnd) reset();
  };

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
  };

  function removeListeners() {
    domElement.removeEventListener('mouseenter', pointerEnter);
    domElement.removeEventListener('mousemove', pointerMove);
    domElement.removeEventListener('mouseleave', pointerLeave);
    domElement.removeEventListener('click', pointerClick);

    domElement.removeEventListener('touchstart', pointerEnter);
    domElement.removeEventListener('touchmove', pointerMove);
    domElement.removeEventListener('touchend', pointerLeave);
    obj.listeners = false;
  };
};
