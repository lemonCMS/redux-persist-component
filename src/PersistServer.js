import prepare from './prepare';
import _map from "lodash/map";
const asyncMap = (arr, mapper) => {
  let q = Promise.resolve();
  return Promise.all(arr.map(v => q = q.then(() => mapper(v))));
};

export default ({store, storage, modules}) => {
  const preparedModules = prepare(modules);
  const promises = [];

  _map(preparedModules, (module, key) => {
    promises.push(storage.getItem(key).then((item) => {
      if (item !== null && item !== 'undefined') {
        try {
          const result = typeof item === 'string' ? JSON.parse(item) : item;
          module.restore({dispatch: store.dispatch, result, key})
        } catch (e) {
          console.warning('Json parse failed', e);
        }
      }
    }));
  });

  return asyncMap(promises, (promise) => {
    return promise;
  });
};

