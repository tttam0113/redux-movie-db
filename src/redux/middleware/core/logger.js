import differ from 'deep-diff';

// https://github.com/flitbit/diff#differences
const dictionary = {
    E: {
        color: '#2196F3',
        text: 'CHANGED:'
    },
    N: {
        color: '#4CAF50',
        text: 'ADDED:'
    },
    D: {
        color: '#F44336',
        text: 'DELETED:'
    },
    A: {
        color: '#2196F3',
        text: 'ARRAY:'
    }
};

const style = kind => `color: ${dictionary[kind].color}; font-weight: bold`;

const renderDiff = diff => {
    const { kind, path, lhs, rhs, index, item } = diff;

    switch (kind) {
        case 'E':
            return [path.join('.'), lhs, '→', rhs];
        case 'N':
            return [path.join('.'), rhs];
        case 'D':
            return [path.join('.')];
        case 'A':
            return [`${path.join('.')}[${index}]`, item];
        default:
            return [];
    }
};

const logDiff = (prevState, newState, isCollapsed) => {
    const diff = differ(prevState, newState);

    try {
        if (isCollapsed) {
            console.groupCollapsed('diff');
        } else {
            console.group('diff');
        }
    } catch (e) {
        console.log('diff');
    }

    if (diff) {
        diff.forEach(elem => {
            const { kind } = elem;
            const output = renderDiff(elem);

            console.log(`%c ${dictionary[kind].text}`, style(kind), ...output);
        });
    } else {
        console.log('—— no diff ——');
    }

    try {
        console.groupEnd();
    } catch (e) {
        console.log('—— diff end —— ');
    }
};

const loggerMiddleware = ({ getState }) => next => action => {
    // console.log(process.env);

    // prevState: () => '#9E9E9E',
    // action: () => '#03A9F4',
    // nextState: () => '#4CAF50',
    // error: () => '#F20404',

    const { REACT_APP_ENV } = process.env;

    if (!REACT_APP_ENV || REACT_APP_ENV === 'development') {
        console.group(`${action.type}`);

        const prevState = getState();

        // console.group('CURRENT STATE:');
        console.log('%c CURRENT STATE', 'color: #9E9E9E; font-weight: bold;', prevState );
        // console.groupEnd();

        // console.group('ACTION:');
        console.log('%c ACTION       ', 'color: #03A9F4; font-weight: bold;', action);
        // console.groupEnd();

        next(action);

        // console.group('NEXT STATE: ');
        const nextState = getState();
        console.log('%c NEXT STATE   ', 'color: #4CAF50; font-weight: bold;', nextState);
        // console.groupEnd();

        logDiff(prevState, nextState, true);

        console.groupEnd();
    } else {
        next(action);
    }
};

export default loggerMiddleware;
