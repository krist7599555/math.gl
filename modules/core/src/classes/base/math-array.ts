// Copyright (c) 2017 Uber Technologies, Inc.
// MIT License
import {NumericArray} from '../../lib/types';
import {ConfigurationOptions, config, formatValue, equals, isArray } from "../../lib/common";

/** Base class for vectors and matrices */
export default abstract class MathArray extends Array<number> {

    /** Number of elements (values) in this array */
    abstract get ELEMENTS(): number;

    abstract copy(vector): this;

    // TODO?
    // abstract fromObject();
    // abstract multiply(...args: Readonly<NumericArray>[]): this;

    // Common methods

    /**
     * Clone the current object
     * @returns a new copy of this object
     */
    clone(): this {
        // @ts-ignore error TS2351: Cannot use 'new' with an expression whose type lacks a call or construct signature.
        return new this.constructor().copy(this);
    }

    from(arrayOrObject: Readonly<NumericArray> | object): this {
        return Array.isArray(arrayOrObject) ? this.copy(arrayOrObject) : this.fromObject(arrayOrObject);
    }

    fromArray(array: Readonly<NumericArray>, offset: number = 0): this {
        for (let i = 0; i < this.ELEMENTS; ++i) {
            this[i] = array[i + offset];
        }
        return this.check();
    }

    to(arrayOrObject: NumericArray | object): NumericArray | object {
        if (arrayOrObject === this) {
            return this;
        }
        // @ts-ignore error TS2339: Property 'toObject' does not exist on type 'MathArray'.
        return isArray(arrayOrObject) ? this.toArray(arrayOrObject) : this.toObject(arrayOrObject);
    }

    toTarget(target: any): any {
        return target ? this.to(target) : this;
    }
    
    toArray(array: NumericArray = [], offset = 0): NumericArray {
        for (let i = 0; i < this.ELEMENTS; ++i) {
            array[offset + i] = this[i];
        }
        return array;
    }

    // TODO - remove
    toFloat32Array(): Float32Array {
        return new Float32Array(this);
    }

    toString(): string {
        return this.formatString(config);
    }

    /** Formats string according to options */
    formatString(opts: ConfigurationOptions): string  {
        let string = "";
        for (let i = 0; i < this.ELEMENTS; ++i) {
            string += (i > 0 ? ", " : "") + formatValue(this[i], opts);
        }
        return `${opts.printTypes ? this.constructor.name : ""}[${string}]`;
    }

    equals(array: Readonly<NumericArray>): boolean {
        if (!array || this.length !== array.length) {
            return false;
        }
        for (let i = 0; i < this.ELEMENTS; ++i) {
            if (!equals(this[i], array[i])) {
                return false;
            }
        }
        return true;
    }

    exactEquals(array: Readonly<NumericArray>): boolean {
        if (!array || this.length !== array.length) {
            return false;
        }
        for (let i = 0; i < this.ELEMENTS; ++i) {
            if (this[i] !== array[i]) {
                return false;
            }
        }
        return true;
    }

    // Modifiers

    /** Negates all values in this object */
    negate(): this {
        for (let i = 0; i < this.ELEMENTS; ++i) {
            this[i] = -this[i];
        }
        return this.check();
    }

    /** Linearly interpolates between two values */
    lerp(a: Readonly<NumericArray>, b: Readonly<NumericArray>, t?: number): this {
        if (t === undefined) {
            t = b;
            b = a;
            a = this; // eslint-disable-line
        }
        for (let i = 0; i < this.ELEMENTS; ++i) {
            const ai = a[i];
            this[i] = ai + t * (b[i] - ai);
        }
        return this.check();
    }

    /** Minimal */
    min(vector: Readonly<NumericArray>): this {
        for (let i = 0; i < this.ELEMENTS; ++i) {
            this[i] = Math.min(vector[i], this[i]);
        }
        return this.check();
    }

    /** Maximal */
    max(vector: Readonly<NumericArray>): this {
        for (let i = 0; i < this.ELEMENTS; ++i) {
            this[i] = Math.max(vector[i], this[i]);
        }
        return this.check();
    }

    clamp(minVector: Readonly<NumericArray>, maxVector: Readonly<NumericArray>): this {
        for (let i = 0; i < this.ELEMENTS; ++i) {
            this[i] = Math.min(Math.max(this[i], minVector[i]), maxVector[i]);
        }
        return this.check();
    }

    add(...vectors: Readonly<NumericArray>[]): this {
        for (const vector of vectors) {
            for (let i = 0; i < this.ELEMENTS; ++i) {
                this[i] += vector[i];
            }
        }
        return this.check();
    }

    subtract(...vectors: Readonly<NumericArray>[]): this {
        for (const vector of vectors) {
            for (let i = 0; i < this.ELEMENTS; ++i) {
                this[i] -= vector[i];
            }
        }
        return this.check();
    }

    scale(scale: Readonly<NumericArray>): this {
        return this.multiply(scale);
    }

    /**
     * Multiplies all elements by `scale`
     * Note: `Matrix4.multiplyByScalar` only scales its 3x3 "minor"
     */
    multiplyByScalar(scalar: number): this {
        for (let i = 0; i < this.ELEMENTS; ++i) {
            this[i] *= scalar;
        }
        return this.check();
    }

    // Debug checks

    /** Throws an error if array length is incorrect or contains illegal values */
    check(): this {
        if (config.debug && !this.validate()) {
            throw new Error(`math.gl: ${this.constructor.name} some fields set to invalid numbers'`);
        }
        return this;
    }

    /** Returns false if the array length is incorrect or contains illegal values */
    validate(): boolean {
        let valid = this.length === this.ELEMENTS;
        for (let i = 0; i < this.ELEMENTS; ++i) {
            valid = valid && Number.isFinite(this[i]);
        }
        return valid;
    }

    // three.js compatibility
    sub(a) {
        return this.subtract(a);
    }
    setScalar(a) {
        for (let i = 0; i < this.ELEMENTS; ++i) {
            this[i] = a;
        }
        return this.check();
    }
    addScalar(a) {
        for (let i = 0; i < this.ELEMENTS; ++i) {
            this[i] += a;
        }
        return this.check();
    }
    subScalar(a) {
        return this.addScalar(-a);
    }
    multiplyScalar(scalar) {
        // Multiplies all elements
        // `Matrix4.scale` only scales its 3x3 "minor"
        for (let i = 0; i < this.ELEMENTS; ++i) {
            this[i] *= scalar;
        }
        return this.check();
    }
    divideScalar(a) {
        return this.multiplyByScalar(1 / a);
    }
    clampScalar(min, max) {
        for (let i = 0; i < this.ELEMENTS; ++i) {
            this[i] = Math.min(Math.max(this[i], min), max);
        }
        return this.check();
    }
    get elements() {
        return this;
    }
}
