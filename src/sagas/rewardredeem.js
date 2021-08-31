/* eslint-disable */
import { takeEvery, call, put } from "redux-saga/effects";
import { GET_REWARDREDEEM, SET_REWARDREDEEM } from "../actions";
import { appId, apiUrl, deliveryId } from "../components/Helpers/Config";
import Axios from "axios";
import cookie from "react-cookies";
var base64 = require("base-64");
export const watchGetRewardRedeem = function* () {
  yield takeEvery(GET_REWARDREDEEM, workerGetRewardRedeem);
};

function* workerGetRewardRedeem({ customer_id }) {
  try {
    const uri =
      apiUrl +
      "loyalty/customer_redeemed_rewardpoint_histroy?status=A&app_id=" +
      appId +
      "&customer_id=" +
      base64.encode(customer_id) +
      "&enc=Y";
    const result = yield call(Axios.get, uri);
    var resultArr = [];
    resultArr.push(result.data);
    yield put({ type: SET_REWARDREDEEM, value: resultArr });
  } catch {
    console.log("Get reward redeem Failed");
  }
}
