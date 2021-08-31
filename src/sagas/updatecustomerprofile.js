/* eslint-disable */
import { takeEvery, call, put } from 'redux-saga/effects';
import { GET_UPDATECUSTOMERPROFILE, SET_UPDATECUSTOMERPROFILE } from '../actions';
import { appId, apiUrl, deliveryId } from "../components/Helpers/Config";
import Axios from 'axios';
import cookie from 'react-cookies';

export const watchGetUpdateCustomerProfile = function* () {
  yield takeEvery(GET_UPDATECUSTOMERPROFILE, workerGetUpdateCustomerProfile);
}

function* workerGetUpdateCustomerProfile({ formPayload }) {
  try {
   const result = yield call(getUpdateCustomerProfile, formPayload);
	var resultArr = [];
	resultArr.push(result.data);
    yield put({ type: SET_UPDATECUSTOMERPROFILE, value: resultArr });
  } 
  catch {
    console.log('Update failed');
  }
} 


function getUpdateCustomerProfile(formPayload) {
       return Axios.post(apiUrl+'customer/updateprofile', formPayload);
} 
