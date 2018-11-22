import { combineReducers } from 'redux';
import homeReducer from './home_reducer';
import movieReducer from './movie_reducer';

const rootReducer = combineReducers({
    home: homeReducer,
    movie: movieReducer
});

export default rootReducer;