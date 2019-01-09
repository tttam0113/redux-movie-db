import {
    API_REQUEST,
    API_SUCCESS,
    API_ERROR,
    apiRequest,
    apiError,
    apiSuccess
} from 'redux/actions/api';

describe('apiRequest', () => {
    it('should generate apiRequest action object', () => {
        const action = apiRequest({
            method: 'GET',
            url: 'http://localhost:3000/api',
            data: {
                key1: 'value1',
                key2: 'value2'
            },
            feature: '[Feature]'
        });

        expect(action).toEqual({
            type: `[Feature] ${API_REQUEST}`,
            payload: {
                key1: 'value1',
                key2: 'value2'
            },
            meta: {
                method: 'GET',
                url: 'http://localhost:3000/api',
                feature: '[Feature]'
            }
        });
    });
});

describe('apiSuccess', () => {
    it('should generate apiSuccess action object', () => {
        const response = { id: '123' }
        const action = apiSuccess({
            response,
            data: {
                key1: 'value1',
                key2: 'value2'
            },
            feature: '[Feature]'
        });

        expect(action).toEqual({
            type: `[Feature] ${API_SUCCESS}`,
            payload: response,
            meta: {
                data: {
                    key1: 'value1',
                    key2: 'value2'
                },
                feature: '[Feature]'
            }
        });
    });
});

describe('apiError', () => {
    it('should generate apiError action object', () => {
        const error = "Error Message"
        const action = apiError({
            error,
            data: {
                key1: 'value1',
                key2: 'value2'
            },
            feature: '[Feature]'
        });

        expect(action).toEqual({
            type: `[Feature] ${API_ERROR}`,
            payload: "Error Message",
            meta: {
                data: {
                    key1: 'value1',
                    key2: 'value2'
                },
                feature: '[Feature]'
            }
        });
    });
});
