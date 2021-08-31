/* eslint-disable */
import { takeEvery, call, put } from "redux-saga/effects";
import { GET_GOOGLELOGINDATA, SET_GOOGLELOGINDATA } from "../actions";
import { apiUrl } from "../components/Helpers/Config";
import Axios from "axios";

export const watchGetGoogleLoginData = function* () {
  yield takeEvery(GET_GOOGLELOGINDATA, workerGetGoogleLoginData);
};

function* workerGetGoogleLoginData({ formPayload }) {
  try {
    const result = yield call(getGoogleLoginData, formPayload);
    var resultArr = [];
    resultArr.push(result.data);
    yield put({ type: SET_GOOGLELOGINDATA, value: resultArr });
  } catch {
    console.log("login failed");
  }
}

function getGoogleLoginData(formPayload) {
  return Axios.post(apiUrl + "customer/googleloginapp", formPayload);
}
