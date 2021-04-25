// Copyright (c) 2017 Uber Technologies, Inc.
// MIT License

import {config} from './lib/common';

// math.gl classes
export {default as Vector2} from './classes/vector2';
export {default as Vector3} from './classes/vector3';
export {default as Vector4} from './classes/vector4';
export {default as Matrix3} from './classes/matrix3';
export {default as Matrix4} from './classes/matrix4';
export {default as Quaternion} from './classes/quaternion';

export {
  // math.gl global utility methods
  config,
  configure,
  formatValue,
  isArray,
  clone,
  equals,
  exactEquals,
  toRadians,
  toDegrees,
  // math.gl "GLSL"-style functions
  radians,
  degrees,
  sin,
  cos,
  tan,
  asin,
  acos,
  atan,
  clamp,
  lerp,
  withEpsilon
} from './lib/common';

export {checkNumber} from './lib/validators';

export {default as _MathUtils} from './lib/math-utils';

export {default as SphericalCoordinates} from './classes/spherical-coordinates';
export {default as Pose} from './classes/pose';
export {default as Euler} from './classes/euler';

export {default as assert} from './lib/assert';

const globals = {
  // eslint-disable-next-line no-restricted-globals
  self: typeof self !== 'undefined' && self,
  window: typeof window !== 'undefined' && window,
  global: typeof global !== 'undefined' && global
};

const global_ = globals.global || globals.self || globals.window;

// Make config avalable as global variable for access in debugger
// TODO - integrate with probe.gl (as soft dependency) to persist across reloades

// @ts-ignore error TS2339: Property 'mathgl' does not exist on type 'Window | Global
global_.mathgl = {
  config
};

// DEPRECATED
export {default as _SphericalCoordinates} from './classes/spherical-coordinates';
export {default as _Pose} from './classes/pose';
export {default as _Euler} from './classes/euler';
