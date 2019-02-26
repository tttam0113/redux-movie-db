import { API_REQUEST, apiSuccess, apiError } from '../../actions/api';

const apiMiddleware = ({ dispatch }) => next => action => {
  next(action);

  if (action.type.includes(API_REQUEST)) {
    const data = action.payload;
    const { url, method, feature } = action.meta;
    fetch(url, { method })
      .then(response => response.json())
      .then(response => dispatch(apiSuccess({ response, data, feature })))
      .catch(error => dispatch(apiError({ error, data, feature })));
  }
};

export default apiMiddleware;
