import { Camera, Intersection, Object3D, Plane, Raycaster, Vector2, Vector3 } from 'three'

export interface RaycasterInterface {
  position: Vector3
  updatePosition(coords: Vector2): void
  intersect(coords: Vector2, objects: Object3D[], recursive?: boolean): Intersection[],
}

export interface RaycasterConfigInterface {
  camera: Camera
  resetPosition?: Vector3
}

export default function useRaycaster(options: RaycasterConfigInterface): RaycasterInterface {
  const {
    camera,
    resetPosition = new Vector3(0, 0, 0),
  } = options

  const raycaster = new Raycaster()
  const position = resetPosition.clone()
  const plane = new Plane(new Vector3(0, 0, 1), 0)

  const updatePosition = (coords: Vector2) => {
    raycaster.setFromCamera(coords, camera)
    camera.getWorldDirection(plane.normal)
    raycaster.ray.intersectPlane(plane, position)
  }

  const intersect = (coords: Vector2, objects: Object3D[], recursive = false) => {
    raycaster.setFromCamera(coords, camera)
    return raycaster.intersectObjects(objects, recursive)
  }

  return {
    position,
    updatePosition,
    intersect,
  }
}
