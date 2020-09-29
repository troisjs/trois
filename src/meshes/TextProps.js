export default {
  text: String,
  fontSrc: String,
  size: { type: Number, default: 80 },
  height: { type: Number, default: 5 },
  depth: { type: Number, default: 1 },
  curveSegments: { type: Number, default: 12 },
  bevelEnabled: { type: Boolean, default: false },
  bevelThickness: { type: Number, default: 10 },
  bevelSize: { type: Number, default: 8 },
  bevelOffset: { type: Number, default: 0 },
  bevelSegments: { type: Number, default: 5 },
  align: { type: [Boolean, String], default: false },
};
