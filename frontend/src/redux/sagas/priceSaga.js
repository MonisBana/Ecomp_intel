import { put } from "redux-saga/effects";
import * as types from "../types/type";
import axios from "../../axios-base";

export function* fetchCurrentPrice(requestBody) {
  let response;
  yield axios
    .post("/populateResult/", requestBody.payload)
    .then((res) => (response = res.data));
  yield put({ type: types.FETCHEDCURRENTPRICE, res: response });
}
