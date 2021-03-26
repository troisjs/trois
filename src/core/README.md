## TODO
- [X] Document raycaster component
- [ ] Document new events/props on Object3D
- [ ] Click events on Raycaster
- [ ] Click events on Object3D

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


### Deprecations

* `mouseMove`, `mouseRaycast`, and `mouseOver` are all no longer used on the renderer.
* `usePointer` on the `Renderer` is `true` by default. Switch to `false` to prevent mouse event handling on the renderer element. Example:
    ```html
    <!-- Do not listen to mousemove events - marginal performance improvement -->
    <Renderer :use-pointer="false">
    ```