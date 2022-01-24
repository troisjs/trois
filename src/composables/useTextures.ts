import { Texture, TextureLoader } from 'three'

export interface TextureConfigInterface {
  src: string
}

export interface TexturesInterface {
  loader: TextureLoader
  count: number
  textures: Texture[],
  loadProgress: number
  loadTextures(images: TextureConfigInterface[], cb: {() : void}): void
  dispose(): void
}

export default function useTextures(): TexturesInterface {
  const obj: TexturesInterface = {
    loader: new TextureLoader(),
    count: 0,
    textures: [],
    loadProgress: 0,
    loadTextures,
    dispose,
  }
  return obj

  function loadTextures(images: TextureConfigInterface[], cb: {() : void}) {
    obj.count = images.length
    obj.textures.splice(0)
    obj.loadProgress = 0
    Promise.all(images.map(loadTexture)).then(cb)
  }

  function loadTexture(img: TextureConfigInterface, index: number) {
    return new Promise(resolve => {
      obj.loader.load(
        img.src,
        texture => {
          obj.loadProgress += 1 / obj.count
          obj.textures[index] = texture
          resolve(texture)
        }
      )
    })
  }

  function dispose() {
    obj.textures.forEach(t => t.dispose())
  }
}
