/* eslint-disable @typescript-eslint/no-empty-function */
import { Camera, InstancedMesh, Intersection, Object3D, Vector2, Vector3 } from 'three'
import useRaycaster from './useRaycaster'

export interface PointerEventInterface {
  type: 'pointerenter' | 'pointermove' | 'pointerleave' | 'click'
  position?: Vector2
  positionN?: Vector2
  positionV3?: Vector3
}

export interface PointerIntersectEventInterface {
  type: 'pointerenter' | 'pointerover' | 'pointermove' | 'pointerleave' | 'click'
  component: any
  over?: boolean
  intersect?: Intersection
}

export type PointerCallbackType = (e: PointerEventInterface) => void
export type PointerIntersectCallbackType = (e: PointerIntersectEventInterface) => void

export interface PointerPublicConfigInterface {
  intersectMode?: 'frame'
  intersectRecursive?: boolean
  touch?: boolean
  resetOnEnd?: boolean
  onEnter?: PointerCallbackType
  onMove?: PointerCallbackType
  onLeave?: PointerCallbackType
  onClick?: PointerCallbackType
  onIntersectEnter?: PointerIntersectCallbackType
  onIntersectOver?: PointerIntersectCallbackType
  onIntersectMove?: PointerIntersectCallbackType
  onIntersectLeave?: PointerIntersectCallbackType
  onIntersectClick?: PointerIntersectCallbackType
}

export interface PointerConfigInterface extends PointerPublicConfigInterface {
  camera: Camera
  domElement: HTMLCanvasElement
  intersectObjects: Object3D[] | (() => Object3D[])
}

export interface PointerInterface {
  position: Vector2
  positionN: Vector2
  positionV3: Vector3
  intersectObjects: Object3D[] | (() => Object3D[])
  listeners: boolean
  addListeners(cb: void): void
  removeListeners(cb: void): void
  intersect(): void
}

export default function usePointer(options: PointerConfigInterface): PointerInterface {
  const {
    camera,
    domElement,
    intersectObjects,
    intersectRecursive = false,
    touch = true,
    resetOnEnd = false,
    onEnter = () => {},
    onMove = () => {},
    onLeave = () => {},
    onClick = () => {},
    onIntersectEnter = () => {},
    onIntersectOver = () => {},
    onIntersectMove = () => {},
    onIntersectLeave = () => {},
    onIntersectClick = () => {},
  } = options

  const position = new Vector2(0, 0)
  const positionN = new Vector2(0, 0)

  const raycaster = useRaycaster({ camera })
  const positionV3 = raycaster.position

  const obj: PointerInterface = {
    position,
    positionN,
    positionV3,
    intersectObjects,
    listeners: false,
    addListeners,
    removeListeners,
    intersect,
  }

  return obj

  function reset() {
    position.set(0, 0)
    positionN.set(0, 0)
    positionV3.set(0, 0, 0)
  }

  function updatePosition(event: TouchEvent | MouseEvent) {
    let x, y
    // @ts-ignore
    if (event.touches && event.touches.length > 0) {
      x = (<TouchEvent>event).touches[0].clientX
      y = (<TouchEvent>event).touches[0].clientY
    } else {
      x = (<MouseEvent>event).clientX
      y = (<MouseEvent>event).clientY
    }

    const rect = domElement.getBoundingClientRect()
    position.x = x - rect.left
    position.y = y - rect.top
    positionN.x = (position.x / rect.width) * 2 - 1
    positionN.y = -(position.y / rect.height) * 2 + 1
    raycaster.updatePosition(positionN)
  }

  function intersect() {
    const _intersectObjects = getIntersectObjects()
    if (_intersectObjects.length) {
      const intersects = raycaster.intersect(positionN, _intersectObjects, intersectRecursive)
      const offObjects: Object3D[] = [..._intersectObjects]
      const iMeshes: InstancedMesh[] = []

      intersects.forEach(intersect => {
        const { object } = intersect
        const component = getComponent(object)

        // only once for InstancedMesh
        if (object instanceof InstancedMesh) {
          if (iMeshes.indexOf(object) !== -1) return
          iMeshes.push(object)
        }

        if (!object.userData.over) {
          object.userData.over = true
          const overEvent: PointerIntersectEventInterface = { type: 'pointerover', over: true, component, intersect }
          const enterEvent: PointerIntersectEventInterface = { ...overEvent, type: 'pointerenter' }
          onIntersectOver(overEvent)
          onIntersectEnter(enterEvent)
          component?.onPointerOver?.(overEvent)
          component?.onPointerEnter?.(enterEvent)
        }

        const moveEvent: PointerIntersectEventInterface = { type: 'pointermove', component, intersect }
        onIntersectMove(moveEvent)
        component?.onPointerMove?.(moveEvent)

        offObjects.splice(offObjects.indexOf((<Object3D>object)), 1)
      })

      offObjects.forEach(object => {
        const component = getComponent(object)
        if (object.userData.over) {
          object.userData.over = false
          const overEvent: PointerIntersectEventInterface = { type: 'pointerover', over: false, component }
          const leaveEvent: PointerIntersectEventInterface = { ...overEvent, type: 'pointerleave' }
          onIntersectOver(overEvent)
          onIntersectLeave(leaveEvent)
          component?.onPointerOver?.(overEvent)
          component?.onPointerLeave?.(leaveEvent)
        }
      })
    }
  }

  function pointerEnter(event: TouchEvent | MouseEvent) {
    updatePosition(event)
    onEnter({ type: 'pointerenter', position, positionN, positionV3 })
  }

  function pointerMove(event: TouchEvent | MouseEvent) {
    updatePosition(event)
    onMove({ type: 'pointermove', position, positionN, positionV3 })
    intersect()
  }

  function pointerClick(event: TouchEvent | MouseEvent) {
    updatePosition(event)
    const _intersectObjects = getIntersectObjects()
    if (_intersectObjects.length) {
      const intersects = raycaster.intersect(positionN, _intersectObjects, intersectRecursive)
      const iMeshes: InstancedMesh[] = []
      intersects.forEach(intersect => {
        const { object } = intersect
        const component = getComponent(object)

        // only once for InstancedMesh
        if (object instanceof InstancedMesh) {
          if (iMeshes.indexOf(object) !== -1) return
          iMeshes.push(object)
        }

        const event: PointerIntersectEventInterface = { type: 'click', component, intersect }
        onIntersectClick(event)
        component?.onClick?.(event)
      })
    }
    onClick({ type: 'click', position, positionN, positionV3 })
  }

  function pointerLeave() {
    if (resetOnEnd) reset()
    onLeave({ type: 'pointerleave' })
  }

  function getComponent(object: Object3D) {
    if (object.userData.component) return object.userData.component

    let parent = object.parent
    while (parent) {
      if (parent.userData.component) {
        return parent.userData.component
      }
      parent = parent.parent
    }

    return undefined
  }

  function getIntersectObjects() {
    if (typeof intersectObjects === 'function') {
      return intersectObjects()
    } else return intersectObjects
  }

  function addListeners() {
    domElement.addEventListener('mouseenter', pointerEnter)
    domElement.addEventListener('mousemove', pointerMove)
    domElement.addEventListener('mouseleave', pointerLeave)
    domElement.addEventListener('click', pointerClick)
    if (touch) {
      domElement.addEventListener('touchstart', pointerEnter)
      domElement.addEventListener('touchmove', pointerMove)
      domElement.addEventListener('touchend', pointerLeave)
    }
    obj.listeners = true
  }

  function removeListeners() {
    domElement.removeEventListener('mouseenter', pointerEnter)
    domElement.removeEventListener('mousemove', pointerMove)
    domElement.removeEventListener('mouseleave', pointerLeave)
    domElement.removeEventListener('click', pointerClick)

    domElement.removeEventListener('touchstart', pointerEnter)
    domElement.removeEventListener('touchmove', pointerMove)
    domElement.removeEventListener('touchend', pointerLeave)
    obj.listeners = false
  }
}
