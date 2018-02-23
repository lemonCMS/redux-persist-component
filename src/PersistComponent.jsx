import React from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash/get';

class PersistComponent extends React.Component {

  static contextTypes = {
    store: PropTypes.object
  };

  lastState = {};

  componentDidMount() {
    this.context.store.subscribe(() => {
      const state = this.context.store.getState();
      (typeof this.props.modules === 'string' ? [this.props.modules] : this.props.modules).map((module) => {
        const newState = _get(state, module);
        if (this.lastState[module] !== newState) {
          this.props.storage.setItem(module, newState);
          this.lastState[module] = newState;
        }
      });
    });

    A(typeof this.props.modules === 'string' ? [this.props.modules] : this.props.modules).map((module) => {
      this.props.storage.getItem(module).then((item) => {
        if (item !== null) {
          this.context.store.dispatch({
            type: `@@redux-persist-component/${module}`,
            result: item
          });
        }
      });
    });
  }

  render() {
    return this.props.children;
  }
}

PersistComponent.propTypes = {
  children: PropTypes.object.isRequired,
  modules: PropTypes.array.isRequired,
  storage: PropTypes.object.isRequired
};
PersistComponent.defaultProps = {};

export default PersistComponent;
