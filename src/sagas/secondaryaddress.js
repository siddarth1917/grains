/* eslint-disable */
import { takeEvery, call, put } from "redux-saga/effects";
import {
  GET_ALLUSERSECADDRDATA,
  SET_ALLUSERSECADDRDATA,
  ADD_USERSECADDRDATA,
} from "../actions";
import { appId, apiUrl } from "../components/Helpers/Config";
import Axios from "axios";
import cookie from "react-cookies";
var qs = require("qs");
var base64 = require("base-64");
export const watchGetSecAddress = function* () {
  yield takeEvery(GET_ALLUSERSECADDRDATA, workerGetSecAddress);
};

export const watchAddSecAddress = function* () {
  yield takeEvery(ADD_USERSECADDRDATA, workerAddSecAddress);
};

function* workerGetSecAddress() {
  try {
    var addPramTxt =
      "&status=A&refrence=" + base64.encode(cookie.load("UserId")) + "&enc=Y";
    const uri =
      apiUrl +
      "customer/get_all_user_secondary_address?app_id=" +
      appId +
      addPramTxt;
    const result = yield call(Axios.get, uri);
    var resultArr = [];
    resultArr.push(result.data);
    yield put({ type: SET_ALLUSERSECADDRDATA, value: resultArr });
  } catch {
    console.log("user secondary address failed");
  }
}

function* workerAddSecAddress({ addPram }) {
  try {
    var addressObject = {};
    addressObject = {
      app_id: appId,
      customer_first_name: cookie.load("UserFname"),
      customer_last_name: cookie.load("UserLname"),
      customer_phone: cookie.load("UserMobile"),
      customer_email: cookie.load("UserEmail"),
      customer_address_line1: addPram["addressline"],
      customer_postal_code: addPram["postalcode"],
      customer_address_name: addPram["unitnumber1"],
      customer_address_name2: addPram["unitnumber2"],
      refrence: base64.encode(cookie.load("UserId")),
      enc: "Y",
      customer_status: "A",
      customer_order_status: "order",
    };

    const uri = apiUrl + "customer/secondary_address_add";
    const result = yield call(Axios.post, uri, qs.stringify(addressObject));
    yield put({ type: GET_ALLUSERSECADDRDATA });
  } catch {
    console.log("Add secondary address Failed");
  }
}
