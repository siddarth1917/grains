/* eslint-disable */
import { takeEvery, call, put } from "redux-saga/effects";
import { GET_GLOBAL_SETTINGS, SET_GLOBAL_SETTINGS } from "../actions";
import {
  appId,
  apiUrl,
  deliveryId,
  pickupId,
} from "../components/Helpers/Config";
import cookie from "react-cookies";
import Axios from "axios";

export const watchGetSettings = function* () {
  yield takeEvery(GET_GLOBAL_SETTINGS, workerGetSettings);
};

function* workerGetSettings() {
  try {
    var availabilityId =
      cookie.load("defaultAvilablityId") === undefined ||
      cookie.load("defaultAvilablityId") === ""
        ? ""
        : cookie.load("defaultAvilablityId");
    var orderPostalCode =
      cookie.load("orderPostalCode") === undefined ||
      cookie.load("orderPostalCode") === ""
        ? ""
        : cookie.load("orderPostalCode");
    var posCdParm =
      orderPostalCode !== "" ? "&postal_code=" + orderPostalCode : "";
    var avltyParm =
      availabilityId !== "" ? "&availability=" + availabilityId : "";

    const uri =
      apiUrl +
      "settings/get_common_settings?app_id=" +
      appId +
      avltyParm +
      posCdParm;
    const result = yield call(Axios.get, uri);
    cookie.save("deliveryOption", "No", {
      path: "/",
    });
    cookie.save("pickupOption", "No", {
      path: "/",
    });

    if (result.data.status === "ok") {
      var resultSet = result.data.result_set;
      if (availabilityId === "") {
        availabilityId = !("ninja_pro_default_availability_id" in resultSet)
          ? ""
          : resultSet.ninja_pro_default_availability_id;
      }
      var availability = !("availability" in resultSet)
        ? Array()
        : resultSet.availability;
      if (Object.keys(availability).length > 0) {
        var availabilityLen = availability.length;
        for (var i = 0; i < availabilityLen; i++) {
          if (availability[i].availability_id === deliveryId) {
            cookie.save("deliveryOption", "Yes", {
              path: "/",
            });
          }
          if (availability[i].availability_id === pickupId) {
            cookie.save("pickupOption", "Yes", {
              path: "/",
            });
          }
        }
      }
    }
    availabilityId = availabilityId !== "" ? availabilityId : deliveryId;
    /* cookie.save("defaultAvilablityId", availabilityId, {
      path: "/",
    }); */
    var resultArr = [];
    resultArr.push(result.data);
    yield put({ type: SET_GLOBAL_SETTINGS, value: resultArr });
  } catch {
    console.log("Get Settings Failed");
  }
}
