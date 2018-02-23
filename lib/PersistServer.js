'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
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


  var promises = [];
  (typeof modules === 'string' ? [modules] : modules).map(function (module) {
    promises.push(storage.getItem(module).then(function (item) {
      if (item !== null) {
        store.dispatch({
          type: '@@redux-persist-component/' + module,
          result: JSON.parse(item)
        });
      }
    }));
  });

  return asyncMap(promises, function (promise) {
    return promise;
  });
};