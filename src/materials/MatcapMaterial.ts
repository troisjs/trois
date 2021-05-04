import { MeshMatcapMaterial, TextureLoader } from 'three'
import { propsValues, getMatcapUrl } from '../tools'
import { materialComponent } from './Material'

export default materialComponent(
  'MatcapMaterial',
  {
    src: String,
    name: { type: String, default: '0404E8_0404B5_0404CB_3333FC' },
  },
  (opts) => {
    const src = opts.src ? opts.src : getMatcapUrl(opts.name)
    const props = propsValues(opts, ['src', 'name'])
    props.matcap = new TextureLoader().load(src)
    return new MeshMatcapMaterial(props)
  }
)
