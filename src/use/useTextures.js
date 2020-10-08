import { TextureLoader } from 'three';

export default function useTextures() {
  const obj = {
    loader: new TextureLoader(),
    count: 0,
    textures: [],
    loadProgress: 0,
    loadTextures,
    dispose,
  };
  return obj;

  function loadTextures(images, cb) {
    obj.count = images.length;
    obj.textures.splice(0);
    obj.loadProgress = 0;
    Promise.all(images.map(loadTexture)).then(cb);
  };

  function loadTexture(img, index) {
    return new Promise(resolve => {
      obj.loader.load(
        img.src,
        texture => {
          obj.loadProgress += 1 / obj.count;
          obj.textures[index] = texture;
          resolve(texture);
        }
      );
    });
  };

  function dispose() {
    obj.textures.forEach(t => t.dispose());
  }
};
