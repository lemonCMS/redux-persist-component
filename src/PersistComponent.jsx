import React from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import _map from 'lodash/map';

class PersistComponent extends React.Component {

  static contextTypes = {
    store: PropTypes.object
  };

  lastState = {};

  restored = false;

  componentDidMount() {
    const modules = (typeof this.props.modules === 'string' ? [this.props.modules] : this.props.modules);

    this.context.store.subscribe(() => {
      const state = this.context.store.getState();

      if (this.restored === true) {
        _map(modules, (module, key) => {
          if (typeof key === 'string' && typeof module === 'function') {
            const newState = _get(state, key);
            const result = module(newState, _get(this.lastState, key, null));
            if (this.lastState[key] !== result) {
              this.props.storage.setItem(key, JSON.stringify(result));
              this.lastState[key] = JSON.parse(JSON.stringify(result));
            }
          } else if (typeof key === 'string' && typeof module !== 'function') {
            const newState = _get(state, key);
            if (this.lastState[key] !== newState) {
              this.props.storage.setItem(key, JSON.stringify(newState));
              this.lastState[key] = JSON.parse(JSON.stringify(newState));
            }

          } else {
            const newState = _get(state, module);
            if (this.lastState[module] !== newState) {
              this.props.storage.setItem(module, JSON.stringify(newState));
              this.lastState[module] = JSON.parse(JSON.stringify(newState));
            }
          }
        });
      }
    });

    _map(modules, (module, key) => {
      let moduleName;
      if (typeof key === 'string') {
        moduleName = key;
      } else {
        moduleName = module;
      }

      const promise = [];
      promise.push(this.props.storage.getItem(moduleName).then((item) => {
        if (item !== null && item !== 'undefined') {
          const parsed = typeof item === 'string' ? JSON.parse(item) : item;
          this.context.store.dispatch({
            type: `@@redux-persist-component/${moduleName}`,
            result: parsed
          });
        }
      }));
      Promise.all(promise).then(() => { this.restored = true; });
    });
  }

  render() {
    return this.props.children;
  }
}

PersistComponent.propTypes = {
  children: PropTypes.object.isRequired,
  modules: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]).isRequired,
  storage: PropTypes.object.isRequired
};
PersistComponent.defaultProps = {};

export default PersistComponent;
