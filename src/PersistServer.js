const asyncMap = (arr, mapper) => {
  let q = Promise.resolve();
  return Promise.all(arr.map(v => q = q.then(() => mapper(v))));
};

export default ({store, storage, modules}) => {

  const promises = [];
  (typeof modules === 'string' ? [modules] : modules).map((module) => {
    promises.push(storage.getItem(module).then((item) => {

      if (item !== null && item !== 'undefined') {
        try {
          const parsed = JSON.parse(item);
          store.dispatch({
            type: `@@redux-persist-component/${module}`,
            result: parsed
          });

        } catch(error) {
          console.error('Json parse failed: ', error);
        }
      }
    }));
  });

  return asyncMap(promises, (promise) => {
    return promise;
  });
};

