// Copyright (c) 2017 Uber Technologies, Inc.
// MIT License
import {NumericArray} from './types';
import assert from "./assert";

export type ConfigurationOptions = {
    EPSILON?: number;
    debug?: boolean;
    precision?: number;
    printTypes?: boolean;
    printDegrees?: boolean;
    printRowMajor?: boolean;
    _cartographicRadians?: boolean;
};

const RADIANS_TO_DEGREES = (1 / Math.PI) * 180;
const DEGREES_TO_RADIANS = (1 / 180) * Math.PI;

// TODO - remove
/* eslint-disable no-shadow */
export const config: ConfigurationOptions = {};

config.EPSILON = 1e-12;
config.debug = false;
config.precision = 4;
config.printTypes = false;
config.printDegrees = false;
config.printRowMajor = true;

export function configure(options: ConfigurationOptions = {}): ConfigurationOptions {
    // Only copy existing keys
    for (const key in options) {
        assert(key in config);
        config[key] = options[key];
    }
    return config;
}

/**
 * Formats a value into a string
 * @param value
 * @param param1 
 * @returns 
 */
export function formatValue(value: number, { precision = config.precision || 4 }: ConfigurationOptions = {}): string {
    value = round(value);
    // get rid of trailing zeros
    return `${parseFloat(value.toPrecision(precision))}`;
}

/**
 * Check if value is an "array"
 * Returns `true` if value is either an array or a typed array
 *
 * Note: returns `false` for `ArrayBuffer` and `DataView` instances
 */
 export function isArray(value: any): boolean {
    return Array.isArray(value) || (ArrayBuffer.isView(value) && !(value instanceof DataView));
}

export function clone(array: NumericArray): NumericArray {
    // @ts-ignore
    return array.clone ? array.clone() : new Array(...array);
}

export function toRadians(degrees: NumericArray): NumericArray {
    return radians(degrees);
}

export function toDegrees(radians: NumericArray): NumericArray {
    return degrees(radians);
}

// GLSL math function equivalents - Works on both single values and vectors

/**
 * "GLSL equivalent" radians: Works on single values and vectors
 */
 export function radians(degrees: number | NumericArray, result?) {
    return map(degrees, degrees => degrees * DEGREES_TO_RADIANS, result);
}

/**
 * "GLSL equivalent" degrees: Works on single values and vectors
 */
 export function degrees(radians: number | NumericArray, result?) {
    return map(radians, radians => radians * RADIANS_TO_DEGREES, result);
}

/**
 * "GLSL equivalent" of `Math.sin`: Works on single values and vectors
 */
 export function sin(radians: number | NumericArray): number[] {
    return map(radians, angle => Math.sin(angle));
}

/**
 * "GLSL equivalent" of `Math.cos`: Works on single values and vectors
 */
 export function cos(radians: number | NumericArray) {
    return map(radians, angle => Math.cos(angle));
}

/**
 * "GLSL equivalent" of `Math.tan`: Works on single values and vectors
 */
export function tan(radians: number | NumericArray) {
    return map(radians, angle => Math.tan(angle));
}

/**
 * "GLSL equivalent" of `Math.asin`: Works on single values and vectors
 */
export function asin(radians: number | NumericArray) {
    return map(radians, angle => Math.asin(angle));
}

/**
 * "GLSL equivalent" of `Math.acos`: Works on single values and vectors
 */
export function acos(radians: number | NumericArray) {
    return map(radians, angle => Math.acos(angle));
}

/**
 * "GLSL equivalent" of `Math.atan`: Works on single values and vectors
 */
export function atan(radians: number | NumericArray) {
    return map(radians, angle => Math.atan(angle));
}

/**
 * GLSL style value clamping: Works on single values and vectors
 */
export function clamp(value: number | NumericArray, min: number, max: number) {
    return map(value, value => Math.max(min, Math.min(max, value)));
}

/**
 * Interpolate between two numbers or two arrays
 */
export function lerp(a, b, t: number) {
    if (isArray(a)) {
        return a.map((ai, i) => lerp(ai, b[i], t));
    }
    return t * b + (1 - t) * a;
}

/**
 * Compares any two math objects, using `equals` method if available.
 * @param a 
 * @param b 
 * @param epsilon 
 * @returns 
 */
// eslint-disable-next-line complexity
export function equals(a, b, epsilon?: number) {
    const oldEpsilon = config.EPSILON;
    if (epsilon) {
        config.EPSILON = epsilon;
    }
    try {
        if (a === b) {
            return true;
        }
        if (isArray(a) && isArray(b)) {
            if (a.length !== b.length) {
                return false;
            }
            for (let i = 0; i < a.length; ++i) {
                // eslint-disable-next-line max-depth
                if (!equals(a[i], b[i])) {
                    return false;
                }
            }
            return true;
        }
        if (a && a.equals) {
            return a.equals(b);
        }
        if (b && b.equals) {
            return b.equals(a);
        }
        if (Number.isFinite(a) && Number.isFinite(b)) {
            return Math.abs(a - b) <= config.EPSILON * Math.max(1, Math.abs(a), Math.abs(b));
        }
        return false;
    }
    finally {
        config.EPSILON = oldEpsilon;
    }
}

// eslint-disable-next-line complexity
export function exactEquals(a, b) {
    if (a === b) {
        return true;
    }
    if (a && typeof a === "object" && b && typeof b === "object") {
        if (a.constructor !== b.constructor) {
            return false;
        }
        if (a.exactEquals) {
            return a.exactEquals(b);
        }
    }
    if (isArray(a) && isArray(b)) {
        if (a.length !== b.length) {
            return false;
        }
        for (let i = 0; i < a.length; ++i) {
            if (!exactEquals(a[i], b[i])) {
                return false;
            }
        }
        return true;
    }
    return false;
}

export function withEpsilon(epsilon: number, func: Function): any {
    const oldPrecision = config.EPSILON;
    config.EPSILON = epsilon;
    let value;
    try {
        value = func();
    }
    finally {
        config.EPSILON = oldPrecision;
    }
    return value;
}

// HELPERS

function round(value) {
    return Math.round(value / config.EPSILON) * config.EPSILON;
}

// If the array has a clone function, calls it, otherwise returns a copy
function duplicateArray(array) {
    return array.clone ? array.clone() : new Array(array.length);
}

// If the argument value is an array, applies the func element wise,
// otherwise applies func to the argument value
function map(value: number | NumericArray, func: Function, result?) {
    if (isArray(value)) {
        result = result || duplicateArray(value);
        for (let i = 0; i < result.length && i < (value as NumericArray).length; ++i) {
            result[i] = func(value[i], i, result);
        }
        return result;
    }
    return func(value);
}
