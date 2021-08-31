/* eslint-disable */
import { push } from "react-router-redux";
import { takeEvery, call, put } from "redux-saga/effects";
import { GET_PRODUCT_DETAIL, SET_PRODUCT_DETAIL } from "../actions";
import {
  appId,
  apiUrl,
  apiUrlV2,
  deliveryId,
} from "../components/Helpers/Config";
import Axios from "axios";
import cookie from "react-cookies";

export const watchGetProductDetail = function* () {
  yield takeEvery(GET_PRODUCT_DETAIL, workerGetProductDetail);
};

function* workerGetProductDetail({ proSlug, field_name }) {
  try {
    var availabilityId =
      cookie.load("defaultAvilablityId") === undefined ||
      cookie.load("defaultAvilablityId") == ""
        ? ""
        : cookie.load("defaultAvilablityId");
    const uri =
      apiUrl +
      "products/products_list?app_id=" +
      appId +
      "&" +
      field_name +
      "=" +
      proSlug +
      "&availability=" +
      availabilityId;
    const result = yield call(Axios.get, uri);
    var resultArr = [];
    resultArr.push(result.data);
    /*yield all([put({ type: SET_PRODUCT_DETAIL, value: resultArr }), put(push(`/products`))]);*/
    yield put({ type: SET_PRODUCT_DETAIL, value: resultArr });
    /*yield put(push('/products'));*/
  } catch {
    console.log("Get Products Failed");
  }
}
