import * as types from "../types/type";

const initialState = {
  prices: [],
};
const priceReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GETCURRENTPRICE:
      return {
        ...state,
      };
    case types.FETCHEDCURRENTPRICE:
      console.log(action.res);
      return {
        ...state,
        prices: action.res,
      };
    default:
      return state;
  }
};

export default priceReducer;
