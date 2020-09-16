export function setFromProp(o, prop) {
  if (prop instanceof Object) {
    for (const [key, value] of Object.entries(prop)) {
      o[key] = value;
    }
  }
};

export function lerp(value1, value2, amount) {
  amount = amount < 0 ? 0 : amount;
  amount = amount > 1 ? 1 : amount;
  return value1 + (value2 - value1) * amount;
};

export function lerpv3(v1, v2, amount) {
  v1.x = lerp(v1.x, v2.x, amount);
  v1.y = lerp(v1.y, v2.y, amount);
  v1.z = lerp(v1.z, v2.z, amount);
};
