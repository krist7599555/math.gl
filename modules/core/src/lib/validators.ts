// Copyright (c) 2017 Uber Technologies, Inc.
// MIT License

import {config} from './common';

export function validateVector(v, length) {
  if (v.length !== length) {
    return false;
  }
  // Could be arguments "array" (v.every not availasble)
  for (let i = 0; i < v.length; ++i) {
    if (!Number.isFinite(v[i])) {
      return false;
    }
  }
  return true;
}

export function checkNumber(value) {
  if (!Number.isFinite(value)) {
    throw new Error(`Invalid number ${value}`);
  }
  return value;
}

export function checkVector(v, length, callerName = '') {
  if (config.debug && !validateVector(v, length)) {
    throw new Error(`math.gl: ${callerName} some fields set to invalid numbers'`);
  }
  return v;
}

const map = {};

export function deprecated(method: string, version: number | string) {
  if (!map[method]) {
    map[method] = true;
    // eslint-disable-next-line
    console.warn(
      `${method} has been removed in version ${version}, see upgrade guide for more information`
    );
  }
}
