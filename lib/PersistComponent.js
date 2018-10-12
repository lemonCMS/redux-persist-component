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

var _prepare = require('./prepare');

var _prepare2 = _interopRequireDefault(_prepare);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PersistComponent = function (_React$Component) {
  _inherits(PersistComponent, _React$Component);

  function PersistComponent() {
    _classCallCheck(this, PersistComponent);

    var _this = _possibleConstructorReturn(this, (PersistComponent.__proto__ || Object.getPrototypeOf(PersistComponent)).call(this));

    _this.lastState = {};
    _this.restored = false;
    _this.state = { mounted: false };

    _this.append = _this.append.bind(_this);
    return _this;
  }

  _createClass(PersistComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      if (this.state.mounted === false) {
        this.setState({ mounted: true }, function () {
          return _this2.append(_this2.props);
        });
      }
    }
  }, {
    key: 'append',
    value: function append(props) {
      var _this3 = this;

      var storage = props.storage,
          modules = props.modules;

      var preparedModules = (0, _prepare2.default)(modules);
      this.context.store.subscribe(function () {
        var state = _this3.context.store.getState();
        if (_this3.restored === true) {
          (0, _map3.default)(preparedModules, function (module, key) {
            var newState = (0, _get3.default)(state, key);
            _this3.lastState[key] = module.save(newState, _this3.lastState[key], storage);
          });
        }
      });

      (0, _map3.default)(preparedModules, function (module, key) {
        var promise = [];
        promise.push(_this3.props.storage.getItem(key).then(function (item) {
          if (item !== null && item !== 'undefined') {
            try {
              var result = typeof item === 'string' ? JSON.parse(item) : item;
              var state = _this3.context.store.getState();
              if (state[key] && JSON.stringify(state[key]) !== item) {
                module.restore({ dispatch: _this3.context.store.dispatch, result: result, currentState: state[key], key: key });
              }
            } catch (e) {
              console.warning('Json parse failed', e);
            }
          }
        }));
        Promise.all(promise).then(function () {
          _this3.restored = true;
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