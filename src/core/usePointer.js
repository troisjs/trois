import { Vector2, Vector3 } from 'three';
import useRaycaster from './useRaycaster';

export default function usePointer(options) {
  const {
    camera,
    domElement,
    intersectObjects,
    touch = true,
    resetOnEnd = false,
    resetPosition = new Vector2(),
    resetPositionV3 = new Vector3(),
    // onEnter = () => {},
    // onLeave = () => {},
    // onMove = () => {},
    // onDown = () => {},
    // onUp = () => {},
    // onClick = () => {},
  } = options;

  const position = resetPosition.clone();
  const positionN = new Vector2();

  const raycaster = useRaycaster({ camera });
  const positionV3 = raycaster.position;

  const obj = {
    position,
    positionN,
    positionV3,
    listeners: false,
    addListeners,
    removeListeners,
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
    positionN.y = (position.y / rect.height) * 2 - 1;
    raycaster.updatePosition(positionN);
  };

  function pointerEnter(event) {
    updatePosition(event);
    // onEnter();
  };

  function pointerChange() {
    if (intersectObjects.length) {
      const intersects = raycaster.intersect(positionN, intersectObjects);
      const offObjects = [...intersectObjects];

      intersects.forEach(intersect => {
        const { object } = intersect;
        const { component } = object;
        if (!object.over) {
          object.over = true;
          if (component.onPointerOver) component.onPointerOver({ over: true, component, intersect });
          if (component.onPointerEnter) component.onPointerEnter({ component, intersect });
        }
        offObjects.splice(offObjects.indexOf(object), 1);
      });

      offObjects.forEach(object => {
        const { component } = object;
        if (object.over && component.onPointerOver) {
          object.over = false;
          if (component.onPointerOver) component.onPointerOver({ over: false, component });
          if (component.onPointerLeave) component.onPointerLeave({ component });
        }
      });
    }
  };

  function pointerMove(event) {
    updatePosition(event);
    pointerChange();
    // onMove();
  };

  function pointerClick(event) {
    updatePosition(event);
    if (intersectObjects.length) {
      const intersects = raycaster.intersect(positionN, intersectObjects);
      intersects.forEach(intersect => {
        const { object } = intersect;
        const { component } = object;
        if (component.onClick) component.onClick({ component, intersect });
      });
    }
  };

  function pointerLeave(event) {
    if (resetOnEnd) reset();
    // onLeave();
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

    domElement.removeEventListener('touchstart', pointerEnter);
    domElement.removeEventListener('touchmove', pointerMove);
    domElement.removeEventListener('touchend', pointerLeave);
    obj.listeners = false;
  };
};
