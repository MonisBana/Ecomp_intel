import { put } from "redux-saga/effects";
import * as types from "../types/type";

export function* fetchCurrentPrice(data) {
  yield put({ type: types.FETCHEDCURRENTPRICE, res: data.payload });
}
