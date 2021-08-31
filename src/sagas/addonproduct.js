/* eslint-disable */
import { takeEvery, call, put } from 'redux-saga/effects';
import { GET_ADDONPRODUCT, SET_ADDONPRODUCT } from '../actions';
import { appId, apiUrl, apiUrlV2, deliveryId } from "../components/Helpers/Config";
import Axios from 'axios';
import cookie from 'react-cookies';

export const watchGetAddonPro = function* () {
  yield takeEvery(GET_ADDONPRODUCT, workerGetAddonPro);
}

function* workerGetAddonPro({ outletId }) {
  try {
	var availabilityId = (cookie.load("defaultAvilablityId") === undefined || cookie.load("defaultAvilablityId") == '' )?deliveryId:cookie.load("defaultAvilablityId");
    const uri = apiUrlV2+'products/getAllProducts?app_id='+appId+"&apply_addon=Yes&availability="+availabilityId+"&outletId="+outletId;
    const result = yield call(Axios.get, uri);
	var resultArr = [];
	resultArr.push(result.data);
    yield put({ type: SET_ADDONPRODUCT, value: resultArr });
  } 
  catch {
    console.log('Get Addon Product Failed');
  }
} 
