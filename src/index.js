function isArrayOfFunctions(array) {
    return Array.isArray(array) && array.length > 0 && array.every(item => item instanceof Function);
}

const defaultTypes = ['PENDING', 'FULFILLED', 'REJECTED'];

export default function sequenceMiddleware() {
    const promiseTypeSuffixes = config.promiseTypeSuffixes || defaultTypes;

    return next => action => {
        if (!isArrayOfFunctions(action.payload)) {
            return next(action);
        }

        const { type, sequence, meta} = action;
        const actions = action.payload;
        const [ PENDING, FULFILLED, REJECTED ] = (meta || {}).promiseTypeSuffixes || promiseTypeSuffixes;
        let promise;

        next({
            type: `${type}_${PENDING}`
            ...meta ? { meta } : {}
        });

        if (sequence) {
            promise = actions.reduce((result, item) => result.then(() => next(item())), Promise.resolve());
        } else {
            promise = Promise.all(actions.map(item => next(item())));
        }

        return promise.then(
            payload => next({
                payload,
                type: `${type}_${FULFILLED}`
                ...meta ? { meta } : {}
            }),
            error => next({
                payload: error,
                error: true,
                type: `${type}_${REJECTED}`
                ...meta ? { meta } : {}
            })
        );
    };
}
