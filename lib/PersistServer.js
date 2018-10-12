'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _prepare = require('./prepare');

var _prepare2 = _interopRequireDefault(_prepare);

var _map2 = require('lodash/map');

var _map3 = _interopRequireDefault(_map2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var asyncMap = function asyncMap(arr, mapper) {
  var q = Promise.resolve();
  return Promise.all(arr.map(function (v) {
    return q = q.then(function () {
      return mapper(v);
    });
  }));
};

exports.default = function (_ref) {
  var store = _ref.store,
      storage = _ref.storage,
      modules = _ref.modules;

  var preparedModules = (0, _prepare2.default)(modules);
  var promises = [];

  (0, _map3.default)(preparedModules, function (module, key) {
    promises.push(storage.getItem(key).then(function (item) {
      if (item !== null && item !== 'undefined') {
        try {
          var result = typeof item === 'string' ? JSON.parse(item) : item;
          module.restore({ dispatch: store.dispatch, result: result, key: key });
        } catch (e) {
          console.warning('Json parse failed', e);
        }
      }
    }));
  });

  return asyncMap(promises, function (promise) {
    return promise;
  });
};