import * as types from "../types/type";
import { takeEvery, takeLatest } from "redux-saga/effects";
import { fetchCurrentPrice } from "./priceSaga";
export function* currentPriceWatcher(requestBody) {
  yield takeEvery(types.GETCURRENTPRICE, fetchCurrentPrice);
}
