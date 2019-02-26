// action type for both
export const SET_LOADER = 'SET_LOADER';

//action creators for both
export const setLoader = ({ state, feature }) => ({
  type: `${feature} ${SET_LOADER}`,
  payload: state,
  meta: { feature },
});
