import {
  Box, Cylinder, Plane, Sphere,
  Body, World,
  SAPBroadphase,
  Quaternion, Vec3,
} from 'cannon'

export default function useCannon(options) {
  const {
    broadphase = null,
    gravity = new Vec3(0, 0, -9.82),
    // solverIterations = 10,
  } = options

  const world = new World()
  world.gravity.set(gravity.x, gravity.y, gravity.z)

  if (broadphase === 'sap') {
    world.broadphase = new SAPBroadphase(world)
  }
  // world.solver.iterations = solverIterations;

  const meshes = []

  const obj = {
    world,
    addMesh,
    removeMesh,
    step,
  }
  return obj

  function addMesh(mesh) {
    const shape = getShape(mesh.geometry)
    if (shape) {
      if (mesh.isInstancedMesh) {
        handleInstancedMesh(mesh, shape)
      } else if (mesh.isMesh) {
        handleMesh(mesh, shape)
      }
    } else {
      console.warn(`Unhandled Mesh geometry ${mesh.geometry.type}`)
    }
  }

  function removeMesh(mesh) {
    const index = meshes.indexOf(mesh)
    if (index !== -1) {
      meshes.splice(index, 1)
    }
    if (mesh.userData.bodies) {
      mesh.userData.bodies.forEach(body => {
        world.removeBody(body)
      })
      mesh.userData.bodies = []
    }
    if (mesh.userData.body) {
      world.removeBody(mesh.userData.body)
      delete mesh.userData.body
    }
  }

  function step() {
    world.step(1 / 60)
    for (let i = 0, l = meshes.length; i < l; i++) {
      const mesh = meshes[i]
      if (mesh.isInstancedMesh) {
        const iMatrix = mesh.instanceMatrix.array
        const bodies = mesh.userData.bodies
        for (let j = 0; j < bodies.length; j++) {
          const body = bodies[j]
          compose(body.position, body.quaternion, mesh.userData.scales[j], iMatrix, j * 16)
        }
        mesh.instanceMatrix.needsUpdate = true
      } else if (mesh.isMesh) {
        mesh.position.copy(mesh.userData.body.position)
        mesh.quaternion.copy(mesh.userData.body.quaternion)
      }
    }
  }

  function getShape(geometry) {
    const parameters = geometry.parameters
    switch (geometry.type) {
      case 'BoxGeometry':
        return new Box(new Vec3(
          parameters.width / 2,
          parameters.height / 2,
          parameters.depth / 2
        ))

      case 'PlaneGeometry':
        return new Plane()

      case 'SphereGeometry':
        return new Sphere(parameters.radius)

      case 'CylinderGeometry':
        return new Cylinder(parameters.radiusTop, parameters.radiusBottom, parameters.height, parameters.radialSegments)
    }
    return null
  }

  function handleMesh(mesh, shape) {
    const position = new Vec3()
    position.copy(mesh.position)

    const quaternion = new Quaternion()
    quaternion.copy(mesh.quaternion)

    const mass = mesh.userData.mass ? mesh.userData.mass : 0
    const damping = mesh.userData.damping ? mesh.userData.damping : 0.01

    const body = new Body({ shape, position, quaternion, mass, linearDamping: damping, angularDamping: damping })
    world.addBody(body)

    mesh.userData.body = body
    if (mesh.userData.mass > 0) {
      meshes.push(mesh)
    }
  }

  function handleInstancedMesh(mesh, shape) {
    const iMatrix = mesh.instanceMatrix.array
    const bodies = []
    for (let i = 0; i < mesh.count; i++) {
      const index = i * 16

      const position = new Vec3()
      position.set(iMatrix[index + 12], iMatrix[index + 13], iMatrix[index + 14])

      // handle instance scale
      let scale = 1
      if (mesh.userData.scales?.[i]) scale = mesh.userData.scales?.[i]
      const geoParams = mesh.geometry.parameters
      if (mesh.geometry.type === 'SphereGeometry') {
        shape = new Sphere(scale * geoParams.radius)
      } else if (mesh.geometry.type === 'BoxGeometry') {
        shape = new Box(new Vec3(
          scale * geoParams.width / 2,
          scale * geoParams.height / 2,
          scale * geoParams.depth / 2
        ))
      } else {
        console.warn(`Unhandled InstancedMesh geometry ${mesh.geometry.type}`)
        return
      }

      let mass = 0
      if (mesh.userData.masses?.[i]) mass = mesh.userData.masses[i]
      else if (mesh.userData.mass) mass = mesh.userData.mass

      let damping = 0.01
      if (mesh.userData.dampings?.[i]) damping = mesh.userData.dampings?.[i]
      else if (mesh.userData.damping) damping = mesh.userData.damping

      const body = new Body({ shape, position, mass, linearDamping: damping, angularDamping: damping })
      world.addBody(body)
      bodies.push(body)
    }

    mesh.userData.bodies = bodies
    meshes.push(mesh)
  }

  function compose(position, quaternion, scale, iMatrix, index) {
    const x = quaternion.x, y = quaternion.y, z = quaternion.z, w = quaternion.w
    const x2 = x + x, y2 = y + y, z2 = z + z
    const xx = x * x2, xy = x * y2, xz = x * z2
    const yy = y * y2, yz = y * z2, zz = z * z2
    const wx = w * x2, wy = w * y2, wz = w * z2

    iMatrix[index + 0] = (1 - (yy + zz)) * scale
    iMatrix[index + 1] = (xy + wz) * scale
    iMatrix[index + 2] = (xz - wy) * scale
    iMatrix[index + 3] = 0

    iMatrix[index + 4] = (xy - wz) * scale
    iMatrix[index + 5] = (1 - (xx + zz)) * scale
    iMatrix[index + 6] = (yz + wx) * scale
    iMatrix[index + 7] = 0

    iMatrix[index + 8] = (xz + wy) * scale
    iMatrix[index + 9] = (yz - wx) * scale
    iMatrix[index + 10] = (1 - (xx + yy)) * scale
    iMatrix[index + 11] = 0

    iMatrix[index + 12] = position.x
    iMatrix[index + 13] = position.y
    iMatrix[index + 14] = position.z
    iMatrix[index + 15] = 1
  }
}
