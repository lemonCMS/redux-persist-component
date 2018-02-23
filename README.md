#Redux-persist-component

##why?
When you are using SSR and client side rendering and would like to restore your redux state, saved on the client computer.



##How to install
```npm install --save @wicked_query/redux-persist-component```

##Usage
###Storing whith localforage

Simply import the module and wrap withing redux store.


client.js
```
...
import ReduxPersistComponent from 'redux-persist-component';
import localforage from 'localforage';
...

    ReactDOM.hydrate(
      <HotEnabler>
        <Provider store={store} {...providers}>
          <ConnectedRouter history={history}>
            <ReduxAsyncConnect routes={_routes}
              store={store}
              helpers={providers}>
              <ReduxPersistComponent storage={localForage} modules={['auth']}>
                {renderRoutes(_routes)}
              </ReduxPersistComponent>
            </ReduxAsyncConnect>
          </ConnectedRouter>
        </Provider>
      </HotEnabler>,
      dest
    );

```

##Props

```
storage: storage enging that resolve a promise, only tested just with localforage
```

```
modules: an array containen the modules to save
```


##Restoring the state
When there is a state available to be restored a action will be dispatched.

```js
dispatch({
    type: `@@redux-persist-component/${module}`,
    result: item
  });
```

The dispatched action contains two properties:
```type``` and ```result```

And within your reducer you just have te state the result into your state.

```js
export default function reducer(orgState = initialState, action = {}) {
  switch (action.type) {
    case @@redux-persist-component/auth:
      return Object.assign({}, action.result);
  }
}
```  
