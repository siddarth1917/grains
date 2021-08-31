/* eslint-disable */
import { takeEvery, call, put } from "redux-saga/effects";
import { GET_REWARDEARNED, SET_REWARDEARNED } from "../actions";
import { appId, apiUrl, deliveryId } from "../components/Helpers/Config";
import Axios from "axios";
import cookie from "react-cookies";
var base64 = require("base-64");
export const watchGetRewardEarned = function* () {
  yield takeEvery(GET_REWARDEARNED, workerGetRewardEarned);
};

function* workerGetRewardEarned({ customer_id }) {
  try {
    const uri =
      apiUrl +
      "loyalty/customer_earned_rewardpoint_histroyv1?status=A&app_id=" +
      appId +
      "&customer_id=" +
      base64.encode(customer_id) +
      "&enc=Y";
    const result = yield call(Axios.get, uri);
    var resultArr = [];
    resultArr.push(result.data);
    yield put({ type: SET_REWARDEARNED, value: resultArr });
  } catch {
    console.log("Get reward earned Failed");
  }
}
