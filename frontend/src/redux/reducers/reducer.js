import * as types from "../types/type";

const initialState = {
  prices: null,
  pending: false,
};
const priceReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GETCURRENTPRICE:
      return {
        ...state,
        pending: true,
      };
    case types.FETCHEDCURRENTPRICE:
      console.log(action.res);
      return {
        ...state,
        prices: action.res,
        pending: false,
      };
    default:
      return state;
  }
};

export default priceReducer;
