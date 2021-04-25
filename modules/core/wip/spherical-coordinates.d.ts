// Copyright (c) 2017 Uber Technologies, Inc.
// MIT License

// Adaptation of THREE.js Spherical class, under MIT license
import Vector3 from './vector3';

type SphericalCoordinatesOptions = {
  phi?: number;
  theta?: number;
  radius?: number;
  bearing?: number;
  pitch?: number;
  altitude?: number;
  radiusScale?: number;
};

type FormatOptions = {
  printTypes?: boolean;
};

/**
 * Ref: https://en.wikipedia.org/wiki/Spherical_coordinate_system
 * The poles (phi) are at the positive and negative y axis.
 * The equator starts at positive z.
 */
export default class SphericalCoordinates {
  // Todo [rho, theta, phi] ?

  // Cartographic (bearing 0 north, pitch 0 look from above)
  bearing: number;
  pitch: number;
  altitude: number;

  // lnglatZ coordinates
  longitude: number;
  latitude: number;
  lng: number;
  lat: number;
  z: number;

  /**
   * @param {Object} options
   * @param {Number} [options.phi] =0 - rotation around X (latitude)
   * @param {Number} [options.theta] =0 - rotation around Y (longitude)
   * @param {Number} [options.radius] =1 - Distance from center
   * @param {Number} [options.bearing]
   * @param {Number} [options.pitch]
   * @param {Number} [options.altitude]
   * @param {Number} [options.radiusScale] =1
   */
  constructor(options?: SphericalCoordinatesOptions);

  fromLngLatZ(lngLatZ: number[]): SphericalCoordinates;
  fromVector3(v: number[]): SphericalCoordinates;

  clone(): SphericalCoordinates;
  copy(other: SphericalCoordinates): SphericalCoordinates;
  set(radius: number, phi: number, theta: number): SphericalCoordinates;

  equals(other: SphericalCoordinates): boolean;
  exactEquals(other: SphericalCoordinates): boolean;

  toString(): string;
  formatString(options?: FormatOptions): string;
  toVector3(): Vector3;

  // restrict phi to be betwee EPS and PI-EPS
  makeSafe(): SphericalCoordinates;
  check(): SphericalCoordinates;
}
