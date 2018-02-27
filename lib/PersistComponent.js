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

      this.context.store.subscribe(function () {
        (typeof _this2.props.modules === 'string' ? [_this2.props.modules] : _this2.props.modules).map(function (module, key) {
          var newState = (0, _get3.default)(state, key);
          if (typeof key === 'string' && typeof module === 'function') {
            var result = module(newState);
            if (_this2.lastState[key] !== result) {
              _this2.props.storage.setItem(key, JSON.stringify(result));
              _this2.lastState[key] = JSON.parse(JSON.stringify(result));
            }
          } else if (typeof key === 'string' && typeof module !== 'function') {
            if (_this2.lastState[key] !== newState) {
              _this2.props.storage.setItem(key, JSON.stringify(newState));
              _this2.lastState[key] = JSON.parse(JSON.stringify(newState));
            }
          } else {
            if (_this2.lastState[module] !== newState) {
              _this2.props.storage.setItem(module, JSON.stringify(newState));
              _this2.lastState[module] = JSON.parse(JSON.stringify(newState));
            }
          }

          newState = null;
        });
      });

      (typeof this.props.modules === 'string' ? [this.props.modules] : this.props.modules).map(function (module) {
        _this2.props.storage.getItem(module).then(function (item) {
          if (item !== null) {
            _this2.context.store.dispatch({
              type: '@@redux-persist-component/' + module,
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
  modules: _propTypes2.default.array.isRequired,
  storage: _propTypes2.default.object.isRequired
};
PersistComponent.defaultProps = {};

exports.default = PersistComponent;