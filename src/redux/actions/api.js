// action types
export const API_REQUEST = 'API_REQUEST';   // command action
export const API_SUCCESS = 'API_SUCCESS';   // event action
export const API_ERROR = 'API_ERROR';       // event action

// action creators
export const apiRequest = ({ method, url, data, feature }) => ({
    type: `${feature} ${API_REQUEST}`,
    payload: data,
    meta: {
        method,
        url,
        feature
    }
});

export const apiSuccess = ({ response, data, feature }) => ({
    type: `${feature} ${API_SUCCESS}`,
    payload: response,
    meta: { data, feature }
});

export const apiError = ({ error, data, feature }) => ({
    type: `${feature} ${API_ERROR}`,
    payload: error,
    meta: { data, feature }
});
