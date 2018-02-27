# Redux-persist-component

## why?
When you are using SSR and client side rendering and would like to restore your redux state, saved on the client computer.



## How to install
```npm install --save @wicked_query/redux-persist-component```

## Usage
### Storing whith localforage

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

## Props

```
storage: storage enging that resolve a promise, only tested just with localforage
```

```
modules: an array|object containing the modules to save
```


### Modules as object
If you would like to save just a small part of the store you can pass an object with key and function|boolean(true)

```js
modules={{auth: store => ({token: store.token})}}
```


## Restoring the state clientside
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

```client.js```
```js
export default function reducer(orgState = initialState, action = {}) {
  switch (action.type) {
    case @@redux-persist-component/auth:
      return Object.assign({}, action.result);
  }
}
```  


## Restoring the state serverside
When you are using a cookiestorage, you can restore the state on the serverside

```server.js```
```js
...
import PersistServer from '@wicked_query/redux-persist-component/lib/PersistServer;
import {CookieStorage, NodeCookiesWrapper} from 'redux-persist-cookie-storage';
...
 

app.use(async (req, res) => {
  const cookieJar = new NodeCookiesWrapper(new Cookies(req, res));
  const cookiesStorage = new CookieStorage(cookieJar, {
    setCookieOptions: {
      path: '/'
    }
  });

  const providers = {
    client: apiClient(req),
    app: createApp(req),
    restApp: createApp(req),
  };
  const history = createMemoryHistory({initialEntries: [req.originalUrl]});
  const store = createStore({history, helpers: providers, data: {}});

  function hydrate() {
    res.write('<!doctype html>');
    ReactDOM.renderToNodeStream(<Html assets={webpackIsomorphicTools.assets()} store={store} />).pipe(res);
  }

  try {
    const {components, match, params} = await asyncMatchRoutes(routes, req._parsedUrl.pathname);
    const locals = {
      ...providers,
      store,
      match,
      params,
      history,
      location: history.location
    };

    const restoreState = PersistServer({
      store,
      storage: cookiesStorage,
      modules: ['auth']
    });
    const authorize = authorizeWait('authorized', components, locals);
    const triggers = triggerWait('fetch', components, locals);

    restoreState.then(() => authorize.then(() => triggers.then(() => {
      // Data fetched, state restored, lets render
      const modules = [];
      const context = {};
      const component = (
        <Loadable.Capture report={moduleName => modules.push(moduleName)}>
          <Provider store={store} {...providers}>
            <ConnectedRouter history={history}>
              <StaticRouter location={req.originalUrl} context={context}>
                <ReduxAsyncConnect routes={routes} store={store} helpers={providers}>
                    {renderRoutes(routes)}
                </ReduxAsyncConnect>
              </StaticRouter>
            </ConnectedRouter>
          </Provider>
        </Loadable.Capture>
      );
      const content = ReactDOM.renderToString(component);

      if (context.url) {
        return res.redirect(301, context.url);
      }

      const locationState = store.getState().routing.location;
      if (decodeURIComponent(req.originalUrl) !== locationState.pathname + decodeURIComponent(locationState.search)) {
        return res.redirect(301, locationState.pathname + locationState.search);
      }

      const bundles = getBundles(getChunks(), modules);
      const html = <Html assets={webpackIsomorphicTools.assets()} bundles={bundles} content={content} store={store} />;
      res.status(200).send(`<!doctype html>${ReactDOM.renderToString(html)}`);
      console.log('send');
    }))).catch((mountError) => {
      console.error('MOUNT ERROR:', pretty.render(mountError));
      res.status(401);
      hydrate();
    });

  } catch (mountError) {
    console.error('MOUNT ERROR:', pretty.render(mountError));
    res.status(500);
    hydrate();
  }
});



```` 