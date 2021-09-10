/* eslint-disable */
import { takeEvery, call, put } from "redux-saga/effects";
import {
  GET_MENU_NAVIGATION,
  SET_MENU_NAVIGATION,
  GET_PRODUCT_LIST,
  SET_PRODUCT,
} from "../actions";
import {
  appId,
  apiUrl,
  apiUrlV2,
  deliveryId,
  cookieDefaultConfig
} from "../components/Helpers/Config";
import Axios from "axios";
import cookie from "react-cookies";

export const watchGetMenuNavigation = function* () {
  yield takeEvery(GET_MENU_NAVIGATION, workerGetMenuNavigation);
};

export const watchGetProducts = function* () {
  yield takeEvery(GET_PRODUCT_LIST, workerGetProducts);
};

function* workerGetMenuNavigation() {
  try {
    var availabilityId =
      cookie.load("defaultAvilablityId") === undefined ||
        cookie.load("defaultAvilablityId") == ""
        ? deliveryId
        : cookie.load("defaultAvilablityId");
    availabilityId = deliveryId;
    var orderOutletId =
      cookie.load("orderOutletId") === undefined ||
        cookie.load("orderOutletId") === "" ||
        cookie.load("orderOutletId") === "0" ||
        cookie.load("orderOutletId") === "null"
        ? ""
        : cookie.load("orderOutletId");
    const uri =
      apiUrlV2 +
      "products/getMenuNavigation?app_id=" +
      appId +
      "&availability=" +
      availabilityId +
      "&outletId=" +
      orderOutletId;
    const result = yield call(Axios.get, uri);
    var resultArr = [];
    resultArr.push(result.data);
    if (result.data.status == "ok") {
      cookie.save("firstNavigation", result.data.result_set[0].pro_cate_slug, cookieDefaultConfig);
    }
    yield put({ type: SET_MENU_NAVIGATION, value: resultArr });
  } catch {
    console.log("Get Products Failed");
  }
}

function* workerGetProducts({ catslug, subcatslug, outletid }) {
  try {
    var availabilityId =
      cookie.load("defaultAvilablityId") === undefined ||
        cookie.load("defaultAvilablityId") == ""
        ? deliveryId
        : cookie.load("defaultAvilablityId");

    var orderOutletId =
      cookie.load("orderOutletId") === undefined ||
        cookie.load("orderOutletId") == ""
        ? ""
        : cookie.load("orderOutletId");

    const uri =
      apiUrlV2 +
      "products/getAllProducts?app_id=" +
      appId +
      "&availability=" +
      availabilityId +
      "&category_slug=" +
      catslug +
      "&subcate_slug=" +
      subcatslug +
      "&outletId=" +
      orderOutletId;
    const result = yield call(Axios.get, uri);
    var resultArr = [];
    resultArr.push(result.data);
    yield put({ type: SET_PRODUCT, value: resultArr });
  } catch {
    console.log("Get Products Failed");
  }
}
