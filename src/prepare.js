export default function(initModules) {
  const modules = (typeof initModules === 'string' ? [initModules] : initModules);
  const prepared = {};
  const saveRestore = (key, {save = null, restore = null} = {}) => ({
    save: (state, lastState, storage) => {
      const saveState = save ? save(state, key, storage) : state;
      if (typeof saveState !== "undefined") {
        const stringed = JSON.stringify(saveState);
        if (stringed !== lastState) {
          storage.setItem(key, stringed);
        }
        return stringed;
      }
    },
    restore: restore ? restore : ({result, dispatch}) => {
      dispatch({
        type: `@@redux-persist-component/${key}`,
        result: result
      });
    }
  });


  const moduleMapper = (module, key) => {
    if (typeof module === 'string') {
      prepared[module] = saveRestore(module);
    } else if (typeof module === 'function') {
      prepared[key] = saveRestore(key, {save: module});
    } else if (typeof module === 'object') {

      if (typeof module.save !== 'undefined' || typeof module.restore !== 'undefined') {
        prepared[key]= saveRestore(key, module);
      } else {
        Object.keys(module).map((nestedKey) =>
          moduleMapper(module[nestedKey], nestedKey));

      }
    }
  };

  modules.map((module, key) =>
    moduleMapper(module, key));

  return prepared;
}
