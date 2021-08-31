/* eslint-disable */
import { takeEvery, call, put } from "redux-saga/effects";
import { GET_ORDER_DETAIL, SET_ORDER_DETAIL } from "../actions";
import { appId, apiUrl, deliveryId } from "../components/Helpers/Config";
import Axios from "axios";
import cookie from "react-cookies";
var base64 = require("base-64");
export const watchGetOrderDetail = function* () {
  yield takeEvery(GET_ORDER_DETAIL, workerGetOrderDetail);
};

function* workerGetOrderDetail({ orderId }) {
  try {
    const uri =
      apiUrl +
      "reports/order_history?app_id=" +
      appId +
      "&local_order_no=" +
      orderId +
      "&customer_id=" +
      base64.encode(cookie.load("UserId")) +
      "&enc=Y";
    const result = yield call(Axios.get, uri);
    var resultArr = [];
    resultArr.push(result.data);
    yield put({ type: SET_ORDER_DETAIL, value: resultArr });
  } catch {
    console.log("Get Order Detail Failed");
  }
}
