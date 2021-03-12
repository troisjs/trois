import { toRef, watch } from 'vue';

export function setFromProp(o, prop) {
  if (prop instanceof Object) {
    Object.entries(prop).forEach(([key, value]) => {
      o[key] = value;
    });
  }
};

export function bindProp(src, srcProp, dst, dstProp) {
  if (!dstProp) dstProp = srcProp;
  const ref = toRef(src, srcProp);
  if (ref.value instanceof Object) {
    setFromProp(dst[dstProp], ref.value);
    watch(ref, (value) => { setFromProp(dst[dstProp], value); }, { deep: true });
  } else {
    if (ref.value) dst[dstProp] = src[srcProp];
    watch(ref, (value) => { dst[dstProp] = value; });
  }
};

export function propsValues(props, exclude) {
  const values = {};
  Object.entries(props).forEach(([key, value]) => {
    if (!exclude || (exclude && !exclude.includes(key))) {
      values[key] = value;
    }
  });
  return values;
};

export function lerp(value1, value2, amount) {
  amount = amount < 0 ? 0 : amount;
  amount = amount > 1 ? 1 : amount;
  return value1 + (value2 - value1) * amount;
};

export function lerpv2(v1, v2, amount) {
  v1.x = lerp(v1.x, v2.x, amount);
  v1.y = lerp(v1.y, v2.y, amount);
};

export function lerpv3(v1, v2, amount) {
  v1.x = lerp(v1.x, v2.x, amount);
  v1.y = lerp(v1.y, v2.y, amount);
  v1.z = lerp(v1.z, v2.z, amount);
};

export function limit(val, min, max) {
  return val < min ? min : (val > max ? max : val);
};

// from https://github.com/pmndrs/drei/blob/master/src/useMatcapTexture.tsx
const MATCAP_ROOT = 'https://rawcdn.githack.com/emmelleppi/matcaps/9b36ccaaf0a24881a39062d05566c9e92be4aa0d';

export function getMatcapUrl(hash, format = 1024) {
  const fileName = `${hash}${getMatcapFormatString(format)}.png`;
  return `${MATCAP_ROOT}/${format}/${fileName}`;
};

function getMatcapFormatString(format) {
  switch (format) {
    case 64:
      return '-64px';
    case 128:
      return '-128px';
    case 256:
      return '-256px';
    case 512:
      return '-512px';
    default:
      return '';
  }
}

// shader defaults
export const defaultVertexShader = `
varying vec2 vUv;

void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}`;

export const defaultFragmentShader = `
varying vec2 vUv;

void main() {
  gl_FragColor = vec4(vUv.x, vUv.y, 0., 1.0);
}`;