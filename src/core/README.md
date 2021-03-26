## TODO
- [X] Document raycaster component
- [X] Document new events/props on Object3D
- [ ] Click events on Raycaster
- [X] Click events on Object3D

## Changelog

### Raycaster component

See [here](https://troisjs-instancedcolors.netlify.app/) for an example ([source](https://github.com/SaFrMo/trois-examples/blob/instanced-colors-standalone-demo/src/components/InstancedColors/InstancedColors.vue)).

```html
<Camera>
    <!-- if the Raycaster is a child of a camera, use that camera as the ray origin -->
    <Raycaster 
        :onPointerOver="callback that accepts an array of all new intersections, like onMouseEnter" 
        :onPointerLeave="callback that accepts an array of all newly-ended intersections, like onMouseLeave" 
        :onPointerOver="callback that accepts array of all current intersections"

        :onBeforeRender="callback that fires every frame - optional, accepts the created raycaster. setting this property assumes the user is implementing all raycaster functionality and nullifies all other props and built-in functionality."
        :scene="THREE scene - optional, defaults to current scene"
        :camera="camera - optional, defaults to parent camera"
        :intersects="array of objects to check for intersections - optional, casts against all scene children by default"
        />
</Camera>
```

### Object3D additions

See [here](https://troisjs-pointer-tester-demo.netlify.app/) for an example ([source](https://github.com/SaFrMo/trois-examples/blob/pointer-tester-demo/src/components/PointerTester.vue)). New Object3D props (all optional):

* `onPointerEnter`: Function, accepts an object with properties `{ object, intersect }`, containing the object being hovered and the actual intersection.
* `onPointerOver`: Function, accepts an object with properties `{ object, intersect }`, containing the object being hovered and the actual intersection.
* `onPointerLeave`: : Function, accepts an object with properties `{ object }`, containing the object no longer being hovered.
* `onClick`: Function, accepts an object with properties `{ object, intersect }`, containing the object being clicked and the actual intersection.
* `usePointerEvents`: Boolean, default false. If set to `true`, this object will emit `pointerEnter`, `pointerOver`, `pointerLeave`, and `click` events, all with the same arguments as the props. Function props are preferred over events to avoid the extra overhead of event emitting, but this option is provided if the user prefers events.
* `pointerObjects`: Array of objects to cast against. Defaults to just the given object. Set to `true` (ie, `<Object3D pointer-objects>`) to cast against all scene children.

### Deprecations and Other Notes

* `mouseMove`, `mouseRaycast`, `mouseOver`, and `click` are all no longer used on the renderer.
* `usePointer` on the `Renderer` is `true` by default. Switch to `false` to prevent mouse event handling on the renderer element. Example:
    ```html
    <!-- Do not listen to mousemove events - marginal performance improvement -->
    <Renderer :use-pointer="false">
    ```