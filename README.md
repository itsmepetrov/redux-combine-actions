# Redux Combine Actions

[![build status](https://img.shields.io/travis/itsmepetrov/redux-combine-actions/master.svg?style=flat-square)](https://travis-ci.org/itsmepetrov/redux-combine-actions)
[![npm version](https://img.shields.io/npm/v/redux-combine-actions.svg?style=flat-square)](https://www.npmjs.com/package/redux-combine-actions)

This is a Redux middleware that allows you to easy combine async actions and dispatch them either sequentially or in parallel.

### Installation

```
npm install --save redux-combine-actions
```

## Usage

To enable redux-combine-actions use applyMiddleware()

```js
import { createStore, combineReducers, applyMiddleware } from 'redux';
import combineActionsMiddleware from 'redux-combine-actions';
import * as reducers from './reducers';

let createStoreWithMiddleware = applyMiddleware(combineActionsMiddleware)(createStore);

let reducer = combineReducers(reducers);
let store = createStoreWithMiddleware(reducer);
```

To use the middleware, you action creator must return action with the following fields:

- `types` - An array of action types in the next notation: [PENDING, SUCCESS, ERROR], where PENDING action is dispatched immediately, SUCCESS action is dispatched only if all child actions were executed successfully and ERROR action is dispatched  only if an error occurred.
- `payload` - An array of [action creators](http://gaearon.github.io/redux/docs/basics/Actions.html#action-creators). This field must contain set of functions which shall be dispatched. For example, it can be [ordinary action creators](#simple-usage), or action creators that return a [promise](#with-promises) (see [redux-promise](https://github.com/acdlite/redux-promise) or [redux-promise-middleware](https://github.com/pburtchaell/redux-promise-middleware)), in this case, you can specify `sequence` option.
- `sequence` - Specifies actions sequence. If `true` - dispatch array of action creators in sequential order, else - dispatch in parallel.

The middleware returns a promise to the caller and a [FSA](https://github.com/acdlite/flux-standard-action) compliant action for both SUCCESS and ERROR action types.

### Simple usage
```js
export function addTodo(text) {
  return { type: ADD_TODO, text };
}

export function increment() {
  return { type: INCREMENT_COUNTER };
}

// Combine "addTodo" and "increment" actions
export function addTodoAndIncrement({text}) {

    return {
        type: [
            'COMBINED_ACTION_START',
            'COMBINED_ACTION_SUCCESS',
            'COMBINED_ACTION_ERROR'
        ],

        // Pass actions in array
        payload: [addTodo.bind(null, text), increment]
    };
}

// Dispatch action
store.dispatch(addTodoAndIncrement({text:'Dispatch combined action'}));
```

This will dispatch actions in the following sequence:

*`COMBINED_ACTION_START`* > *`ADD_TODO`* > *`INCREMENT_COUNTER`* > *`COMBINED_ACTION_SUCCESS`*

### With promises
Using in combination with [redux-promise-middleware](https://github.com/pburtchaell/redux-promise-middleware).
```js
export function getProviders() {
    return {
        type: [
            'PROVIDERS_GET_PENDING',
            'PROVIDERS_GET_SUCCESS',
            'PROVIDERS_GET_ERROR'
        ],
        payload: {
            promise: api.getProvidersAsync()
        }
    };
}

export function getSubscribers() {
    return {
        type: [
            'SUBSCRIBER_GET_PENDING',
            'SUBSCRIBER_GET_SUCCESS',
            'SUBSCRIBER_GET_ERROR'
        ],
        payload: {
            promise: api.getSubscribersAsync()
        }
    };
}

// Combine "getProviders" and "getSubscribers" actions
export function fetchData() {

    return {
        type: [
            'DATABASE_FETCH_PENDING',
            'DATABASE_FETCH_SUCCESS',
            'DATABASE_FETCH_ERROR'
        ],

        // Set true for sequential actions
        sequence: true,

        // Pass actions in array
        payload: [getProviders, getSubscribers]
    };
}
```

This will dispatch actions one after another:

*`DATABASE_FETCH_PENDING`* > *`PROVIDERS_GET_PENDING`* > *`PROVIDERS_GET_SUCCESS`* > *`SUBSCRIBER_GET_PENDING`* > *`SUBSCRIBER_GET_SUCCESS`* > *`DATABASE_FETCH_SUCCESS`*

If you set `sequence` to `false` then all child actions will be dispatched in parallel:

*`DATABASE_FETCH_PENDING`* > *`PROVIDERS_GET_PENDING`* > *`SUBSCRIBER_GET_PENDING`* > *`PROVIDERS_GET_SUCCESS`* > *`SUBSCRIBER_GET_SUCCESS`* > *`DATABASE_FETCH_SUCCESS`*

## License

MIT
