// Copyright (c) 2017 Uber Technologies, Inc.
// MIT License

import Vector from './base/vector';

/* Two-element vector class */
export default class Vector2 extends Vector<Vector2> {
  static ZERO: number[];
  // Getters/setters
  ELEMENTS: number;

  constructor();
  constructor(array: readonly number[]);
  constructor(x: number, y: number);

  set(x: number, y: number): Vector2;

  copy(array: readonly number[]): Vector2;

  fromObject(object): Vector2;
  
  //  {
  //   if (config.debug) {
  //     checkNumber(object.x);
  //     checkNumber(object.y);
  //   }
  //   this[0] = object.x;
  //   this[1] = object.y;
  //   return this.check();
  // }

  toObject(object: object): object;

  // x,y inherited from Vector

  horizontalAngle(): number;

  verticalAngle(): number;

  // Transforms
  transform(matrix4: readonly number[]): Vector2;
  // transforms as point (4th component is implicitly 1)
  transformAsPoint(matrix4: readonly number[]): Vector2;
  // transforms as vector  (4th component is implicitly 0, ignores translation. slightly faster)
  transformAsVector(matrix4: readonly number[]): Vector2;

  transformByMatrix3(matrix3: readonly number[]): Vector2;
  transformByMatrix2x3(matrix2x3: readonly number[]): Vector2;
  transformByMatrix2(matrix2: readonly number[]): Vector2;
}
