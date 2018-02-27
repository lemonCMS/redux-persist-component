const asyncMap = (arr, mapper) => {
  let q = Promise.resolve();
  return Promise.all(arr.map(v => q = q.then(() => mapper(v))));
};

export default ({store, storage, modules}) => {

  const promises = [];
  (typeof modules === 'string' ? [modules] : modules).map((module) => {
    promises.push(storage.getItem(module).then((item) => {
      if (item !== null) {
        store.dispatch({
          type: `@@redux-persist-component/${module}`,
          result: JSON.parse(item)
        });
      }
    }));
  });

  return asyncMap(promises, (promise) => {
    return promise;
  });
};

