/* eslint-disable */
import { takeEvery, call, put } from "redux-saga/effects";
import { GET_PRINTORDER, SET_PRINTORDER } from "../actions";
import { appId, apiUrl } from "../components/Helpers/Config";
import Axios from "axios";

export const watchGetPrintOrder = function* () {
  yield takeEvery(GET_PRINTORDER, workerGetPrintOrder);
};

function* workerGetPrintOrder({ orderprimaryId }) {
  try {
    var urlTxt = apiUrl + "ordersv1/";
    const uri =
      urlTxt +
      "orderPdfgenerate?app_id=" +
      appId +
      "&order_primary_id=" +
      orderprimaryId;
    const result = yield call(Axios.get, uri);
    var resultArr = [];
    resultArr.push(result.data);
    yield put({ type: SET_PRINTORDER, value: resultArr });
  } catch {
    console.log("Pdf Generation Failed");
  }
}
