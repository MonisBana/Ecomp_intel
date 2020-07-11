import * as types from "../types/type";
import axios from "../../axios-base";

// export const getCurrentPrice = (requestBody) => (dispatch) => {
//   axios
//     .post("/populateResult/", requestBody)
//     .then((response) =>
//       dispatch({ type: types.GETCURRENTPRICE, products: response.data })
//     )
//     .catch((err) => console.log(err));
// };

export const getCurrentPrice = (requestBody) => ({
  type: types.GETCURRENTPRICE,
  payload: requestBody,
});
