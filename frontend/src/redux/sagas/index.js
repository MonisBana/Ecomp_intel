import * as types from "../types/type";
import { takeEvery, takeLatest } from "redux-saga/effects";
import { fetchCurrentPrice } from "./priceSaga";
import { fetchPriceDrop } from "./priceDropSaga";
export function* currentPriceWatcher() {
  yield takeEvery(types.GETCURRENTPRICE, fetchCurrentPrice);
}

export function* priceDropWatcher() {
  yield takeEvery(types.GETPRICEDROP, fetchPriceDrop);
}
