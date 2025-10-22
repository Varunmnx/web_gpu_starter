// src/types.d.ts

// This module declaration tells TypeScript that any import 
// ending in .glsl should be treated as a string.
declare module "*.glsl" {
  const content: string;
  export default content;
}
declare module "*.vert" {
  const content: string;
  export default content;
}
declare module "*.frag" {
  const content: string;
  export default content;
}

// global.d.ts
declare module 'three/examples/jsm/controls/OrbitControls';
declare module 'lil-gui';
