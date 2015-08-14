# Redux Combine Actions

[![build status](https://img.shields.io/travis/itsmepetrov/redux-combine-actions/master.svg?style=flat-square)](https://travis-ci.org/itsmepetrov/redux-combine-actions)
[![npm version](https://img.shields.io/npm/v/redux-combine-actions.svg?style=flat-square)](https://www.npmjs.com/package/redux-combine-actions)

This is a Redux middleware that allows you to easy combine actions and dispatch them sequentially.

### Installation

```
npm install --save redux-combine-actions
```

## Usage

Manual TBD

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
- `payload` - An array of [action creators](http://gaearon.github.io/redux/docs/basics/Actions.html#action-creators). This field must contain set of functions which shall be dispatched. For example, it can be [ordinary action creators](#simple-usage), or actions creators that return a [promise](#with-promises) (see [redux-promise](https://github.com/acdlite/redux-promise) or [redux-promise-middleware](https://github.com/pburtchaell/redux-promise-middleware)), in this case, you can specify `sequence` option. 
- `sequence` - Specifies actions sequence. If `true` - dispatch array of action creators in sequential order, else - dispatch in parallel.

### Simple usage
```js
export function addTodo(text) {
  return { type: types.ADD_TODO, text };
}

export function increment() {
  return { type: INCREMENT_COUNTER };
}

// Combine "addTodo" and "increment" actions
export function addTodoAndIncrement({text}) {

    return {
        types: [
            'COMBINED_ACTION_START',
            'COMBINED ACTION_SUCCESS',
            'COMBINED ACTION_ERROR'
        ],

        // Pass actions in array
        payload: [addTodo.bind(text), increment]
    };
}

// Dispatch action
store.dispatch(addTodoAndIncrement({text:'Dispatch combined action'}));
```

### With promises
Using in combination with [redux-promise-middleware](https://github.com/pburtchaell/redux-promise-middleware).
```js
export function getProviders() {
    return {
        types: [
            'PROVIDERS_GET_PENDING',
            'PROVIDERS_GET_SUCCESS',
            'PROVIDERS_GET_ERROR'
        ],
        payload: api.getProvidersAsync()
    };
}

export function getSubscribers() {
    return {
        types: [
            'SUBSCRIBER_GET_PENDING',
            'SUBSCRIBER_GET_SUCCESS',
            'SUBSCRIBER_GET_ERROR'
        ],
        payload: api.getSubscribersAsync()
    };
}

// Combine "getProviders" and "getSubscribers" actions
export function fetchData() {

    return {
        types: [
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

## License

MIT
