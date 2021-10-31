import { ref, toRef, watch, WatchStopHandle } from 'vue'

type OptionSetter = (dst: any, key: string, value: any) => void

export function applyObjectProps(
  dst: any,
  options: Record<string, unknown>,
  setter?: OptionSetter
): void {
  if (options instanceof Object) {
    Object.entries(options).forEach(([key, value]) => {
      if (setter) setter(dst, key, value)
      else dst[key] = value
    })
  }
}

export function bindObjectProp(
  src: any,
  prop: string,
  dst: any,
  apply = true,
  setter?: OptionSetter
): WatchStopHandle {
  if (apply) applyObjectProps(dst, src[prop], setter)
  const r = toRef(src, prop)
  return watch(r, (value) => { applyObjectProps(dst, value, setter) })
}

export function bindObjectProps(
  src: any,
  dst: any,
  apply = true,
  setter?: OptionSetter
): WatchStopHandle {
  if (apply) applyObjectProps(dst, src, setter)
  const r = ref(src)
  return watch(r, (value) => { applyObjectProps(dst, value, setter) }, { deep: true })
}

export function setFromProp(o: Record<string, unknown>, prop: Record<string, unknown>): void {
  if (prop instanceof Object) {
    Object.entries(prop).forEach(([key, value]) => {
      o[key] = value
    })
  }
}

export function bindProps(src: any, props: string[], dst: any): void {
  props.forEach(prop => {
    bindProp(src, prop, dst, prop)
  })
}

export function bindProp(src: any, srcProp: string, dst: any, dstProp?: string): void {
  const _dstProp = dstProp || srcProp
  const ref = toRef(src, srcProp)
  if (ref.value instanceof Object) {
    setFromProp(dst[_dstProp], ref.value)
    watch(ref, (value) => { setFromProp(dst[_dstProp], value) }, { deep: true })
  } else {
    if (ref.value !== undefined) dst[_dstProp] = src[srcProp]
    watch(ref, (value) => { dst[_dstProp] = value })
  }
}

export function propsValues(props: Record<string, unknown>, exclude: string[] = []): Record<string, unknown> {
  const values: Record<string, unknown> = {}
  Object.entries(props).forEach(([key, value]) => {
    if (!exclude || !exclude.includes(key)) {
      values[key] = value
    }
  })
  return values
}

export function lerp(value1: number, value2: number, amount: number): number {
  amount = amount < 0 ? 0 : amount
  amount = amount > 1 ? 1 : amount
  return value1 + (value2 - value1) * amount
}

export function limit(val: number, min: number, max: number): number {
  return val < min ? min : (val > max ? max : val)
}

// from https://github.com/pmndrs/drei/blob/master/src/useMatcapTexture.tsx
const MATCAP_ROOT = 'https://rawcdn.githack.com/emmelleppi/matcaps/9b36ccaaf0a24881a39062d05566c9e92be4aa0d'
const DEFAULT_MATCAP = '0404E8_0404B5_0404CB_3333FC'

export function getMatcapUrl(hash = DEFAULT_MATCAP, format = 1024): string {
  const fileName = `${hash}${getMatcapFormatString(format)}.png`
  return `${MATCAP_ROOT}/${format}/${fileName}`
}

function getMatcapFormatString(format: number) {
  switch (format) {
    case 64:
      return '-64px'
    case 128:
      return '-128px'
    case 256:
      return '-256px'
    case 512:
      return '-512px'
    default:
      return ''
  }
}
