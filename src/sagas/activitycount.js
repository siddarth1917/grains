/* eslint-disable */
import { takeEvery, call, put } from "redux-saga/effects";
import { GET_ACTIVITYCOUNT, SET_ACTIVITYCOUNT } from "../actions";
import { appId, apiUrl, deliveryId } from "../components/Helpers/Config";
import Axios from "axios";
import cookie from "react-cookies";
var base64 = require("base-64");
export const watchGetActivityCount = function* () {
  yield takeEvery(GET_ACTIVITYCOUNT, workerGetActivityCount);
};

function* workerGetActivityCount({ getObject }) {
  try {
    var customerParam =
      "&status=A&customer_id=" +
      base64.encode(cookie.load("UserId")) +
      "&enc=Y";
    var actArrParam = "&act_arr=" + getObject;
    const uri =
      apiUrl +
      "reports/activity_counts1?app_id=" +
      appId +
      actArrParam +
      customerParam;
    const result = yield call(Axios.get, uri);
    var resultArr = [];
    resultArr.push(result.data);
    yield put({ type: SET_ACTIVITYCOUNT, value: resultArr });
  } catch {
    console.log("Activitycount failed");
  }
}
