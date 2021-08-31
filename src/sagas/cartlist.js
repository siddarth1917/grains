/* eslint-disable */
import { push } from "react-router-redux";
import { takeEvery, call, put } from "redux-saga/effects";
import {
  GET_CART_DETAIL,
  SET_CART_DETAIL,
  UPDATE_CART_DETAIL,
  DELETE_CART_DETAIL,
  DESTROY_CART_DETAIL,
  SET_UPDATE_CART_DETAIL,
} from "../actions";
import {
  appId,
  apiUrl,
  apiUrlV2,
  deliveryId,
} from "../components/Helpers/Config";
import { getReferenceID } from "../components/Helpers/SettingHelper";
import Axios from "axios";
import cookie from "react-cookies";
var qs = require("qs");
var base64 = require("base-64");
export const watchGetCartDetail = function* () {
  yield takeEvery(GET_CART_DETAIL, workerGetCartDetail);
};

export const watchUpdateCartDetail = function* () {
  yield takeEvery(UPDATE_CART_DETAIL, workerUpdateCartDetail);
};

export const watchDeleteCartDetail = function* () {
  yield takeEvery(DELETE_CART_DETAIL, workerDeleteCartDetail);
};

export const watchDestroyCartDetail = function* () {
  yield takeEvery(DESTROY_CART_DETAIL, workerDestroyCartDetail);
};

function* workerGetCartDetail() {
  try {
    if (typeof cookie.load("UserId") === "undefined") {
      var customerParam = "&reference_id=" + getReferenceID();
    } else {
      var customerParam =
        "&customer_id=" + base64.encode(cookie.load("UserId")) + "&enc=Y";
    }
    customerParam += "&availability_id=" + cookie.load("defaultAvilablityId");

    const uri =
      apiUrl + "cart/contents?status=A&app_id=" + appId + customerParam;
    const result = yield call(Axios.get, uri);
    var resultArr = [];
    resultArr.push(result.data);
    yield put({ type: SET_CART_DETAIL, value: resultArr });
  } catch {
    console.log("Get Cart Detail Failed");
  }
}

function* workerUpdateCartDetail({
  productId,
  cartItemId,
  cartQty,
  orderVoucherId,
}) {
  try {
    var postObject = {};
    postObject = {
      app_id: appId,
      cart_item_id: cartItemId,
      product_id: productId,
      product_qty: cartQty,
      voucher_order_id: orderVoucherId,
      cartAction: "update",
    };

    if (typeof cookie.load("UserId") === "undefined") {
      postObject["reference_id"] = getReferenceID();
    } else {
      postObject["customer_id"] = cookie.load("UserId");
    }

    const uri = apiUrl + "cart/update";
    const result = yield call(Axios.post, uri, qs.stringify(postObject));
    var resultArr = [];
    resultArr.push(result.data);
    yield put({ type: SET_UPDATE_CART_DETAIL, value: resultArr });
    yield put({ type: GET_CART_DETAIL });
  } catch {
    console.log("Get Cart Detail Failed");
  }
}

function* workerDeleteCartDetail({ cartItemId }) {
  try {
    var postObject = {};

    postObject = {
      app_id: appId,
      cart_item_id: cartItemId,
      cartAction: "Delete",
    };

    if (typeof cookie.load("UserId") === "undefined") {
      postObject["reference_id"] = getReferenceID();
    } else {
      postObject["customer_id"] = cookie.load("UserId");
    }

    const uri = apiUrl + "cart/delete";
    const result = yield call(Axios.post, uri, qs.stringify(postObject));
    yield put({ type: GET_CART_DETAIL });
  } catch {
    console.log("Get Cart Detail Failed");
  }
}

function* workerDestroyCartDetail() {
  try {
    var postObject = {};
    postObject = { app_id: appId };

    if (typeof cookie.load("UserId") === "undefined") {
      postObject["reference_id"] = getReferenceID();
    } else {
      postObject["customer_id"] = cookie.load("UserId");
    }

    const uri = apiUrl + "cart/destroy";
    const result = yield call(Axios.post, uri, qs.stringify(postObject));
    yield put({ type: GET_CART_DETAIL });
  } catch {
    console.log("Get Cart Detail Failed");
  }
}
