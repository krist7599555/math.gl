// Copyright (c) 2017 Uber Technologies, Inc.
// MIT License

import Vector from './base/vector';

/** Three-element vector class */
export default class Vector3 extends Vector<Vector3> {
  static readonly ZERO: Vector3;
  readonly ELEMENTS: number;

  constructor();
  constructor(array: readonly number[]);
  constructor(x: number, y: number, z: number);

  set(x: number, y: number, z: number);

  copy(array: readonly number[]);

  fromObject(object);
  toObject(object);

  // x,y inherited from Vector

  z: number;

  // ACCESSORS
  angle(vector: readonly number[]): number;

  // MODIFIERS
  cross(vector: readonly number[]): Vector3;

  rotateX(args: {radians: number; origin?: readonly number[]}): Vector3;
  rotateY(args: {radians: number; origin?: readonly number[]}): Vector3;
  rotateZ(args: {radians: number; origin?: readonly number[]}): Vector3;

  // Transforms

  // transforms as point (4th component is implicitly 1)
  transform(matrix4: readonly number[]): Vector3;
  // transforms as point (4th component is implicitly 1)
  transformAsPoint(matrix4: readonly number[]): Vector3;
  // transforms as vector  (4th component is implicitly 0, ignores translation. slightly faster)
  transformAsVector(matrix4: readonly number[]): Vector3;

  transformByMatrix3(matrix3: readonly number[]): Vector3;
  transformByMatrix2(matrix2: readonly number[]): Vector3;
  transformByQuaternion(quaternion: readonly number[]): Vector3;
}
