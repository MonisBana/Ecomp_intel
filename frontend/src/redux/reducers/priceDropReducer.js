import * as types from "../types/type";

const initialState = {
  price_drop: [],
};
const priceDropReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GETPRICEDROP:
      return {
        ...state,
      };
    case types.FETCHEDPRICEDROP:
      console.log(action.res);
      return {
        ...state,
        price_drop: action.res,
      };
    default:
      return state;
  }
};

export default priceDropReducer;
