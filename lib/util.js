/*
 * node-qtdatastream
 * https://github.com/magne4000/node-qtdatastream
 *
 * Copyright (c) 2016 Joël Charles
 * Licensed under the MIT license.
 */

//Fix for Buffer.toString function
exports.str = function(obj) {
    var str = obj.toString();
    return str.replace('\0', '');
};

exports.dateToJulianDay = function(d) {
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var a = Math.floor((14-month)/12);
    var y = Math.floor(year+4800-a);
    var m = month+12*a-3;
    var jdn = day + Math.floor((153*m+2)/5)+(365*y)+Math.floor(y/4)-Math.floor(y/100)+Math.floor(y/400)-32045;
    return jdn;
};

exports.julianDayToDate = function(i) {
    var y = 4716;
    var v = 3;
    var j = 1401;
    var u =  5;
    var m =  2;
    var s =  153;
    var n = 12;
    var w =  2;
    var r =  4;
    var B =  274277;
    var p =  1461;
    var C =  -38;
    var f = i + j + Math.floor((Math.floor((4 * i + B) / 146097) * 3) / 4) + C;
    var e = r * f + v;
    var g = Math.floor((e % p) / r);
    var h = u * g + w;
    var D = Math.floor((h % s) / u) + 1;
    var M = ((Math.floor(h / s) + m) % n) + 1;
    var Y = Math.floor(e / p) - y + Math.floor((n + m - M) / n) ;
    return new Date(Y,M-1,D);
};