import { toRef, watch } from 'vue';
import { setFromProp } from '../tools.js';

export default function useBindProp(comp, prop, object) {
  if (comp[prop]) {
    const ref = toRef(comp, prop);
    setFromProp(object, ref.value);
    watch(ref, () => {
      setFromProp(object, ref.value);
    }, { deep: true });
  }
};
