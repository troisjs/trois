Changelog:

### Raycaster component


### Deprecations

* `mouseMove`, `mouseRaycast`, and `mouseOver` are all no longer used on the renderer.
* `usePointer` on the `Renderer` is `true` by default. Switch to `false` to prevent mouse event handling on the renderer element. Example:
    ```html
    <!-- Do not listen to mousemove events - marginal performance improvement -->
    <Renderer :use-pointer="false">
    ```