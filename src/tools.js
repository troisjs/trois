export function setFromProp(o, prop) {
  if (prop instanceof Object) {
    for (const [key, value] of Object.entries(prop)) {
      o[key] = value;
    }
  }
};
