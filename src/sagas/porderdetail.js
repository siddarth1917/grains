/* eslint-disable */
import { takeEvery, call, put } from "redux-saga/effects";
import { GET_PORDERDETAIL, SET_PORDERDETAIL } from "../actions";
import { appId, apiUrl, deliveryId } from "../components/Helpers/Config";
import Axios from "axios";
import cookie from "react-cookies";

export const watchGetPorderDetail = function* () {
  yield takeEvery(GET_PORDERDETAIL, workerGetPorderDetail);
};

function* workerGetPorderDetail({ deliverypastparams }) {
  try {
    const uri =
      apiUrl +
      "reports/order_history?order_status=P&app_id=" +
      appId +
      deliverypastparams;
    const result = yield call(Axios.get, uri);
    var resultArr = [];
    resultArr.push(result.data);
    yield put({ type: SET_PORDERDETAIL, value: resultArr });
  } catch {
    console.log("Get Pastorder Failed");
  }
}
