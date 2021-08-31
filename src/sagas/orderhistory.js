/* eslint-disable */
import { takeEvery, call, put } from "redux-saga/effects";
import { GET_ORDERHISTORY, SET_ORDERHISTORY } from "../actions";
import { appId, apiUrl, deliveryId } from "../components/Helpers/Config";
import Axios from "axios";
import cookie from "react-cookies";

export const watchGetOrderHistory = function* () {
  yield takeEvery(GET_ORDERHISTORY, workerGetOrderHistory);
};

function* workerGetOrderHistory({ params }) {
  try {
    const uri = apiUrl + "reports/order_history?app_id=" + appId + params;
    const result = yield call(Axios.get, uri);
    var resultArr = [];
    resultArr.push(result.data);
    yield put({ type: SET_ORDERHISTORY, value: resultArr });
  } catch {
    console.log("Get Order history Failed");
  }
}
