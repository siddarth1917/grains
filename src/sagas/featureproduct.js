/* eslint-disable */
import { takeEvery, call, put } from 'redux-saga/effects';
import { GET_FEATUREPRO, SET_FEATUREPRO } from '../actions';
import { appId, apiUrl, deliveryId } from "../components/Helpers/Config";
import Axios from 'axios';
import cookie from 'react-cookies';

export const watchGetFeaturePro = function* () {
  yield takeEvery(GET_FEATUREPRO, workerGetFeaturePro);
}

function* workerGetFeaturePro() {
  try {
	var availabilityId = (cookie.load("defaultAvilablityId") === undefined || cookie.load("defaultAvilablityId") == '' )?deliveryId:cookie.load("defaultAvilablityId");  
    const uri = apiUrl+'products/new_products_list?app_id='+appId+"&availability="+availabilityId;
    const result = yield call(Axios.get, uri);
	var resultArr = [];
	resultArr.push(result.data);
    yield put({ type: SET_FEATUREPRO, value: resultArr });
  } 
  catch {
    console.log('Get Feature Product Failed');
  }
} 
