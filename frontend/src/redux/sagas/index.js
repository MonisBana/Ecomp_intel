import * as types from "../types/type";
import { takeLatest, takeEvery } from "redux-saga/effects";
import { fetchCurrentPrice } from "./priceSaga";
export function* currentPriceWatcher(requestBody) {
  yield takeEvery(types.GETCURRENTPRICE, fetchCurrentPrice);
}
