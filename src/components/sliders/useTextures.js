import { TextureLoader } from 'three';

export default function useTextures() {
  const loader = new TextureLoader();
  const textures = [];

  const loadTexture = (img, index) => {
    return new Promise(resolve => {
      loader.load(
        img.src,
        texture => {
          textures[index] = texture;
          resolve(texture);
        }
      );
    });
  };

  const loadTextures = (images, cb) => {
    textures.splice(0);
    Promise.all(images.map(loadTexture)).then(cb);
  };

  return {
    textures,
    loadTextures,
  };
};
