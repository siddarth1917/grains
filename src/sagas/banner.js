import { takeEvery, call, put } from "redux-saga/effects";
import { GET_BANNER_LIST, SET_BANNER } from "../actions";
import { appId, apiUrl } from "../components/Helpers/Config";
import Axios from "axios";

export const watchGetBanner = function* () {
  yield takeEvery(GET_BANNER_LIST, workerGetBanner);
};

function* workerGetBanner() {
  try {
    const uri = apiUrl + "cms/banner?app_id=" + appId;
    const result = yield call(
      Axios.get,
      uri /* , {
      headers: {
        "X-Frame-Options": "https://grainsnew.promobuddy.asia/",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
      },
    } */
    );
    /*   */
    var resultArr = [];
    resultArr.push(result.data);
    yield put({ type: SET_BANNER, value: resultArr });
  } catch {
    console.log("Get Banner Failed");
  }
}
