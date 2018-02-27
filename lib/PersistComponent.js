'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _map2 = require('lodash/map');

var _map3 = _interopRequireDefault(_map2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PersistComponent = function (_React$Component) {
  _inherits(PersistComponent, _React$Component);

  function PersistComponent() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, PersistComponent);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = PersistComponent.__proto__ || Object.getPrototypeOf(PersistComponent)).call.apply(_ref, [this].concat(args))), _this), _this.lastState = {}, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(PersistComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var modules = typeof this.props.modules === 'string' ? [this.props.modules] : this.props.modules;

      this.context.store.subscribe(function () {
        var state = _this2.context.store.getState();
        (0, _map3.default)(modules, function (module, key) {
          if (typeof key === 'string' && typeof module === 'function') {
            var newState = (0, _get3.default)(state, key);
            var result = module(newState);
            if (_this2.lastState[key] !== result) {
              _this2.props.storage.setItem(key, JSON.stringify(result));
              _this2.lastState[key] = JSON.parse(JSON.stringify(result));
            }
          } else if (typeof key === 'string' && typeof module !== 'function') {
            var _newState = (0, _get3.default)(state, key);
            if (_this2.lastState[key] !== _newState) {
              _this2.props.storage.setItem(key, JSON.stringify(_newState));
              _this2.lastState[key] = JSON.parse(JSON.stringify(_newState));
            }
          } else {
            var _newState2 = (0, _get3.default)(state, module);
            if (_this2.lastState[module] !== _newState2) {
              _this2.props.storage.setItem(module, JSON.stringify(_newState2));
              _this2.lastState[module] = JSON.parse(JSON.stringify(_newState2));
            }
          }
        });
      });

      (0, _map3.default)(modules, function (module, key) {
        var moduleName = void 0;
        if (typeof key === 'string') {
          moduleName = key;
        } else {
          moduleName = module;
        }

        _this2.props.storage.getItem(moduleName).then(function (item) {
          if (item !== null) {
            _this2.context.store.dispatch({
              type: '@@redux-persist-component/' + moduleName,
              result: JSON.parse(item)
            });
          }
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children;
    }
  }]);

  return PersistComponent;
}(_react2.default.Component);

PersistComponent.contextTypes = {
  store: _propTypes2.default.object
};


PersistComponent.propTypes = {
  children: _propTypes2.default.object.isRequired,
  modules: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.object]).isRequired,
  storage: _propTypes2.default.object.isRequired
};
PersistComponent.defaultProps = {};

exports.default = PersistComponent;