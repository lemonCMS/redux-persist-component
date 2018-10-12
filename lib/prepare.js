'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = function (initModules) {
  var modules = typeof initModules === 'string' ? [initModules] : initModules;
  var prepared = {};
  var saveRestore = function saveRestore(key) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$save = _ref.save,
        _save = _ref$save === undefined ? null : _ref$save,
        _ref$restore = _ref.restore,
        restore = _ref$restore === undefined ? null : _ref$restore;

    return {
      save: function save(state, lastState, storage) {
        var saveState = _save ? _save(state, key, storage) : state;
        if (typeof saveState !== "undefined") {
          var stringed = JSON.stringify(saveState);
          if (stringed !== lastState) {
            storage.setItem(key, stringed);
          }
          return stringed;
        }
      },
      restore: restore ? restore : function (_ref2) {
        var result = _ref2.result,
            dispatch = _ref2.dispatch;

        dispatch({
          type: '@@redux-persist-component/' + key,
          result: result
        });
      }
    };
  };

  var moduleMapper = function moduleMapper(module, key) {
    if (typeof module === 'string') {
      prepared[module] = saveRestore(module);
    } else if (typeof module === 'function') {
      prepared[key] = saveRestore(key, { save: module });
    } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object') {

      if (typeof module.save !== 'undefined' || typeof module.restore !== 'undefined') {
        prepared[key] = saveRestore(key, module);
      } else {
        Object.keys(module).map(function (nestedKey) {
          return moduleMapper(module[nestedKey], nestedKey);
        });
      }
    }
  };

  modules.map(function (module, key) {
    return moduleMapper(module, key);
  });

  return prepared;
};