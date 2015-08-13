# Redux Combine Actions
This is a Redux middleware that allows you to easy combine actions and dispatch them sequentially.

### Installation

```
npm install --save redux-combine-actions
```

## Usage

Manual TBD

```js
import combineActionsMiddleware from 'redux-combine-actions';
```

Simple usage
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
```

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