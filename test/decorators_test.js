require('babel-register')({ extensions: [ '.es6' ] });
const decorators = require('./decorators_test.es6');
exports.decorators = decorators.decorators;
exports.decorators_serialization = decorators.decorators_serialization;