/*
 * node-qtdatastream
 * https://github.com/magne4000/node-qtdatastream
 *
 * Copyright (c) 2017 Joël Charles
 * Licensed under the MIT license.
 */

/** @module qtdatastream/util */

/**
 * Apply `toString()` method on Buffer and remove NUL end char
 * @static
 * @param {Buffer} obj
 * @returns {string}
 */
function str(obj) {
  const str = obj.toString();
  return str.replace('\0', '');
}

/**
 * Convert a Date object to a Julian day representation
 * @static
 * @param {Date} d
 * @returns {number}
 */
function dateToJulianDay(d) {
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const a = Math.floor((14-month)/12);
  const y = Math.floor(year+4800-a);
  const m = month+12*a-3;
  const jdn = day + Math.floor((153*m+2)/5)+(365*y)+Math.floor(y/4)-Math.floor(y/100)+Math.floor(y/400)-32045;
  return jdn;
}

/**
 * Convert a Julian day representation to a Date object
 * @static
 * @param {number} i
 * @returns {Date}
 */
function julianDayToDate(i) {
  const y = 4716;
  const v = 3;
  const j = 1401;
  const u = 5;
  const m = 2;
  const s = 153;
  const n = 12;
  const w = 2;
  const r = 4;
  const B = 274277;
  const p = 1461;
  const C = -38;
  const f = i + j + Math.floor((Math.floor((4 * i + B) / 146097) * 3) / 4) + C;
  const e = r * f + v;
  const g = Math.floor((e % p) / r);
  const h = u * g + w;
  const D = Math.floor((h % s) / u) + 1;
  const M = ((Math.floor(h / s) + m) % n) + 1;
  const Y = Math.floor(e / p) - y + Math.floor((n + m - M) / n);
  return new Date(Y, M-1, D);
}

function mapObject(obj, fn) {
  const keys = Object.keys(obj);
  for (let key of keys) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, key);
    Object.assign(descriptor, {
      value: fn(obj[key])
    });
    Object.defineProperty(obj, key, descriptor);
  }
  return obj;
}

function deepMap(obj, fn) {
  const deepMapper = val => (val !== null && typeof val === 'object') ? deepMap(val, fn) : fn(val);
  if (Array.isArray(obj)) {
    return obj.map(deepMapper);
  }
  if (obj !== null && typeof obj === 'object') {
    return mapObject(obj, deepMapper);
  }
  return obj;
}

module.exports = {
  str,
  dateToJulianDay,
  julianDayToDate,
  mapObject,
  deepMap
};
