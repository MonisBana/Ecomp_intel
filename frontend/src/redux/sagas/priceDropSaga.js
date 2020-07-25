import { put } from "redux-saga/effects";
import * as types from "../types/type";

export function* fetchPriceDrop(data) {
  yield put({ type: types.FETCHEDPRICEDROP, res: data.payload });
}
