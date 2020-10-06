import { watch } from 'vue';

export default function useBindPropValue(src, srcProp, dst, dstProp = 'value') {
  if (src[srcProp]) {
    dst[dstProp] = src[srcProp];
    watch(() => src[srcProp], (value) => {
      dst[dstProp] = value;
    });
  }
};
