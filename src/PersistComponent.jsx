import React from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import _map from 'lodash/map';
import prepare from './prepare';

class PersistComponent extends React.Component {

  static contextTypes = {
    store: PropTypes.object
  };

  lastState = {};

  restored = false;

  state = {mounted: false};

  constructor() {
    super();
    this.append = this.append.bind(this);
  }

  componentDidMount() {
    if (this.state.mounted === false) {
      this.setState({mounted: true}, () => this.append(this.props));
    }
  }

  append(props) {
    const {storage, modules} = props;
    const preparedModules = prepare(modules);
    this.context.store.subscribe(() => {
      const state = this.context.store.getState();
      if (this.restored === true) {
        _map(preparedModules, (module, key) => {
          const newState = _get(state, key);
          this.lastState[key] = module.save(newState, this.lastState[key], storage);
        });
      }
    });

    _map(preparedModules, (module, key) => {
      const promise = [];
      promise.push(this.props.storage.getItem(key).then((item) => {
        if (item !== null && item !== 'undefined') {
          try {
            const result = typeof item === 'string' ? JSON.parse(item) : item;
            const state = this.context.store.getState();
            if (state[key] && JSON.stringify(state[key]) !== item) {
              module.restore({dispatch: this.context.store.dispatch, result, currentState: state[key], key})
            }
          } catch (e) {
            console.warning('Json parse failed', e);
          }
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
